import click
import json
import random
from sqlalchemy import select, delete
from api.models import db, User, Card, UserCard, Deck, DeckCard

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""
def setup_commands(app):
    
    """ 
    Ejemplo para los comandos abajo. En la consola escribe: $ pipenv run flask insert-test-users 5
    Nota 1: despues de pipenv run flask va el nombre del comando (insert-test-users) y luego sus argumentos (5), de este modo creamos 5 usuarios de prueba
    Nota 2: después de crear un comando, hay que reiniciar el servidor para que lo reconozca
    """
    @app.cli.command("insert-test-users") # name of our command
    @click.argument("count") # argument of out command
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            email = "test_user" + str(x) + "@test.com"

            # Evita duplicados si se vuelve a ejecutar
            exists = db.session.execute(
                select(User).where(User.email == email)
            ).scalar_one_or_none()
            if exists:
                print("User:", email, "already exists. Skipping.")
                continue

            user = User()
            user.email = email
            user.password = "123456"
            user.username = "test_user" + str(x)
            db.session.add(user)
            db.session.commit()
            print("User:", user.email, "created.")

        print("All test users processed")

    # @app.cli.command("insert-test-data")
    # def insert_test_data():
    #     pass

    # Cargar/actualizar catálogo desde JSON (idempotente: upsert por id)
    @app.cli.command("load-catalog")
    @click.option("--path", default="src/data/cards_catalog_3sets.json",
                  help="Path to catalog JSON (default: src/data/cards_catalog_3sets.json)")
    def load_catalog(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception as e:
            click.echo(f"Cannot open/parse JSON: {e}")
            return

        cards = data.get("cards", [])
        if not cards:
            click.echo("'cards' list is empty in provided JSON.")
            return

        created, updated = 0, 0
        for item in cards:
            cid = item.get("id")
            if not cid:
                continue

            card = db.session.get(Card, cid)
            if not card:
                # create
                card = Card(
                    id=cid,
                    local_id=item.get("local_id"),
                    name=item.get("name"),
                    image_url=item.get("image_url"),
                    game_rarity=item.get("game_rarity", "common"),
                    points=int(item.get("points", 0)),
                )
                db.session.add(card)
                created += 1
            else:
                # update
                card.local_id = item.get("local_id")
                card.name = item.get("name")
                card.image_url = item.get("image_url")
                card.game_rarity = item.get("game_rarity", "common")
                card.points = int(item.get("points", 0))
                updated += 1

        db.session.commit()
        click.echo(f"Catalog succesfully loaded. Created: {created} | Updated: {updated}")

    # Generar mazos aleatorios SOLO para usuarios test_user*@test.com
    @app.cli.command("make-random-decks")
    def make_random_decks():
        # 1) Comprobar que hay cartas suficientes
        card_ids = db.session.scalars(select(Card.id)).all()
        if len(card_ids) < 20:
            print("Not enough cards in Card (need at least 20). Run load-catalog first.")
            return

        # 2) Seleccionar solo usuarios de pruebas
        test_users = db.session.scalars(
            select(User).where(User.email.like("test_user%@test.com"))
        ).all()
        if not test_users:
            print("No test users found. Run insert-test-users command first.")
            return

        # 3) Para cada test user: resetear su mazo y crear uno de 20 cartas aleatorias distintas
        for u in test_users:
            # obtener o crear mazo
            deck = db.session.execute(select(Deck).where(Deck.user_id == u.id)).scalar_one_or_none()
            if not deck:
                deck = Deck(user_id=u.id, name="My Deck")
                db.session.add(deck)
                db.session.commit()  # para obtener deck.id

            # limpiar cartas del mazo anterior
            db.session.execute(delete(DeckCard).where(DeckCard.deck_id == deck.id))

            # elegir 20 cartas distintas
            chosen = random.sample(card_ids, 20)

            for cid in chosen:
                # asegurar que el usuario "posee" esa carta en la colección con al menos quantity=1
                uc = db.session.execute(
                    select(UserCard).where((UserCard.user_id == u.id) & (UserCard.card_id == cid))
                ).scalar_one_or_none()
                if uc:
                    if (uc.quantity or 0) < 1:
                        uc.quantity = 1
                else:
                    db.session.add(UserCard(user_id=u.id, card_id=cid, quantity=1))

                # añadir al mazo
                db.session.add(DeckCard(deck_id=deck.id, card_id=cid))

            db.session.commit()

        print(f"Random decks created for {len(test_users)} test users.")

    # Todo en uno: seguro ante duplicados y sin ranking
    @app.cli.command("bootstrap-demo")
    @click.argument("users_count", type=int)
    @click.option("--catalog", default="src/data/cards_catalog_3sets.json",
                  help="Path to catalog JSON (default: src/data/cards_catalog_3sets.json)")
    def bootstrap_demo(users_count, catalog):
        # 1) Cargar/actualizar catálogo (upsert)
        try:
            with open(catalog, "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception as e:
            click.echo(f"Cannot open/parse JSON: {e}")
            return

        cards = data.get("cards", [])
        if not cards:
            click.echo("⚠️ 'cards' list is empty in provided JSON.")
            return

        created, updated = 0, 0
        for item in cards:
            cid = item.get("id")
            if not cid:
                continue
            card = db.session.get(Card, cid)
            if not card:
                card = Card(
                    id=cid,
                    local_id=item.get("local_id"),
                    name=item.get("name"),
                    image_url=item.get("image_url"),
                    game_rarity=item.get("game_rarity", "common"),
                    points=int(item.get("points", 0)),
                )
                db.session.add(card)
                created += 1
            else:
                card.local_id = item.get("local_id")
                card.name = item.get("name")
                card.image_url = item.get("image_url")
                card.game_rarity = item.get("game_rarity", "common")
                card.points = int(item.get("points", 0))
                updated += 1
        db.session.commit()
        click.echo(f"▶️  Catalog OK. Created: {created} | Updated: {updated}")

        # 2) Crear usuarios de prueba (evitar duplicados)
        print("Creating test users")
        for x in range(1, int(users_count) + 1):
            email = "test_user" + str(x) + "@test.com"
            exists = db.session.execute(
                select(User).where(User.email == email)
            ).scalar_one_or_none()
            if exists:
                print("User:", email, "already exists. Skipping.")
                continue

            user = User()
            user.email = email
            user.password = "123456"
            user.username = "test_user" + str(x)
            db.session.add(user)
            db.session.commit()
            print("User:", user.email, "created.")
        print("All test users processed")

        # 3) Generar mazos aleatorios SOLO para test users
        card_ids = db.session.scalars(select(Card.id)).all()
        if len(card_ids) < 20:
            print("❌ Not enough cards in Card (need at least 20). Run load-catalog first.")
            return

        test_users = db.session.scalars(
            select(User).where(User.email.like("test_user%@test.com"))
        ).all()
        if not test_users:
            print("⚠️ No test users found. Run: flask insert-test-users <N>")
            return

        for u in test_users:
            deck = db.session.execute(select(Deck).where(Deck.user_id == u.id)).scalar_one_or_none()
            if not deck:
                deck = Deck(user_id=u.id, name="My Deck")
                db.session.add(deck)
                db.session.commit()

            db.session.execute(delete(DeckCard).where(DeckCard.deck_id == deck.id))
            chosen = random.sample(card_ids, 20)

            for cid in chosen:
                uc = db.session.execute(
                    select(UserCard).where((UserCard.user_id == u.id) & (UserCard.card_id == cid))
                ).scalar_one_or_none()
                if uc:
                    if (uc.quantity or 0) < 1:
                        uc.quantity = 1
                else:
                    db.session.add(UserCard(user_id=u.id, card_id=cid, quantity=1))

                db.session.add(DeckCard(deck_id=deck.id, card_id=cid))

            db.session.commit()

        click.echo("✅ Demo environment ready.")

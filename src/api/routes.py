"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Card, UserCard, PackPurchase, PackOpen, Deck, DeckCard
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, create_access_token
from sqlalchemy import select, func
import random
import os

import stripe

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()

        email = data.get('email')
        password = str(data.get('password'))
        username = data.get('username')

        if not email or not password:
            return jsonify({"msg": "Email and password are required"}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({"msg": "User already exists"}), 400
        
        if User.query.filter_by(username=username).first():
            return jsonify({"msg": "Username already exists"}), 400

        new_user = User(
            email=email,
            password=password,
            username=username
        )

        db.session.add(new_user)
        db.session.commit()

        access_token = create_access_token(identity=str(new_user.id))
        return jsonify({
            "access_token": access_token,
            "user": {
                "id": new_user.id,
                "username": new_user.username,
                "email": new_user.email
            }
        }), 201

    except Exception as e:
        return jsonify({"error": "Server error", "details": str(e)}), 500


@api.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = str(data.get('password'))

        if not email or not password:
            return jsonify({"msg": "Email and password are required"}), 400

        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({"msg": "User not found"}), 404

        if user.password != password:
            return jsonify({"msg": "Incorrect password"}), 401

        access_token = create_access_token(identity=str(user.id))
        return jsonify(access_token=access_token), 200

    except Exception as e:
        return jsonify({"error": "Server error", "details": str(e)}), 500


@api.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404
    deck = Deck.query.filter_by(user_id=user.id).first()
    deck_points = 0
    if deck:
        deck_points = sum(
            [card.points for card in [dc.card for dc in deck.cards]])
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "deck_points": deck_points
    }), 200


@api.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        user_id = int(get_jwt_identity())
        body = request.get_json()

        if not body:
            return jsonify({"error": "Faltan datos en la petición"}), 400

        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        # Validar y actualizar username
        if "username" in body:
            new_username = body["username"].strip()

            if not new_username:
                return jsonify({"msg": "El nombre de usuario no puede estar vacío"}), 400

            # Verificar si otro usuario ya usa ese username
            if User.query.filter(User.username == new_username, User.id != user_id).first():
                return jsonify({"msg": "Username already exists"}), 400

            user.username = new_username

        db.session.commit()

        return jsonify({
            "msg": "Perfil actualizado correctamente",
            "username": user.username
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500























































# PEDRO DESDE AQUI ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Configuracion de sobres y cartas
PACK_SIZE = 5  # cantidad de cartas por sobre
P_COMMON = 0.80  # probabilidad de carta común
P_RARE = 0.18  # probabilidad de carta rara
P_LEGENDARY = 0.02  # probabilidad de carta legendaria
# Nota: deben sumar 1.0

# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Funciones auxiliares ---------------------------------------------
# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


def current_user_id_from_jwt():
    # En login se crea el token con: create_access_token(identity=str(user.id))
    # Aquí se recupera el user con get_jwt_identity() y se convierte a int

    ident = get_jwt_identity()  # <-- devuelve exactamente lo que se guardó en identity
    return int(ident) if ident is not None else None


def packs_available(user_id: int) -> int:
    # Funcion para calcular los sobres disponibles = SUM(PackPurchase.quantity) - COUNT(PackOpen.id) //suma la cantidad de sobres comprados y le resta la cantidad (count) de sobres abiertos
    # Nota: func.coalesce(valor, 0) devuelve 0 si el valor es NULL (evita None)

    total_purchased = db.session.scalar(
        select(func.coalesce(func.sum(PackPurchase.quantity), 0)).where(
            PackPurchase.user_id == user_id)
    )
    total_opened = db.session.scalar(
        select(func.coalesce(func.count(PackOpen.id), 0)).where(
            PackOpen.user_id == user_id)
    )
    return int(total_purchased - total_opened)


def pick_rarity() -> str:
    # Con esta función se decide la rareza de UNA carta con las probabilidades fijadas en la configuración de sobres y cartas

    # guarda en r un valor entre 0.0 y 1.0, poara luego compararlo con las probabilidades definidas
    r = random.random()
    if r < P_COMMON:
        return "common"
    elif r < P_COMMON + P_RARE:
        return "rare"
    else:
        return "legendary"


def draw_cards_for_pack(n: int = PACK_SIZE) -> list[str]:
    # Elige N cantidad de cartas:
    # - Para cada carta: se decide su rareza con pick_rarity()
    # - Elige una carta aleatoria dentro de esa rareza N veces, en este caso 5 veces (PACK_SIZE)
    # Devuelve lista de ids de cartas.

    common_ids = db.session.scalars(
        select(Card.id).where(Card.game_rarity == "common")).all()
    rare_ids = db.session.scalars(
        select(Card.id).where(Card.game_rarity == "rare")).all()
    leg_ids = db.session.scalars(select(Card.id).where(
        Card.game_rarity == "legendary")).all()

    if not common_ids:
        raise ValueError(
            "No se encontraron cartas comunes en la base de datos. ¿Recordaste poblar la base de datos con el catálogo de cartas?")

    chosen = []
    for _ in range(n):
        rarity = pick_rarity()
        if rarity == "legendary" and leg_ids:
            chosen.append(random.choice(leg_ids))
        elif rarity == "rare" and rare_ids:
            chosen.append(random.choice(rare_ids))
        else:
            chosen.append(random.choice(common_ids))
    return chosen


def add_to_collection(user_id: int, card_ids: list[str]) -> None:
    # Añade las cartas a la colección:
    # - Si existe UserCard(user_id, card_id): quantity += 1
    # - Si no existe: crea con quantity = 1

    for card_id in card_ids:
        uc = db.session.execute(
            select(UserCard).where((UserCard.user_id == user_id)
                                   & (UserCard.card_id == card_id))
            # si la consulta no devuelve nada, uc es None; si la consulta devuelve algo, uc es ese objeto UserCard; y si la consulta devuelve más de uno, lanza excepción ya que la combinación user_id + card_id debería ser única.
        ).scalar_one_or_none()

        if uc:
            uc.quantity += 1
        else:
            db.session.add(
                UserCard(user_id=user_id, card_id=card_id, quantity=1)) 


# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Endpoints de la API relativos a la compra, disponibilidad y apertura de sobres (en este último se añaden las cartas a la colección del usuario (UserCard)) ----------------------------
# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# POST /buy -> registrar compra de sobres (1, 5 o 10)
@api.route('/buy', methods=['POST'])
@jwt_required()
def buy_packs():

    # Body JSON requerido:
    #   { "quantity": 1 }   # o 5, o 10

    # Devuelve sobres disponibles tras la compra.

    user_id = current_user_id_from_jwt()
    if not user_id:
        return jsonify({"msg": "Unauthorized"}), 401

    if not request.is_json:
        return jsonify({"msg": "Body must be JSON"}), 400

    quantity = request.json.get('quantity')
    if quantity not in (1, 5, 10):
        return jsonify({"msg": "quantity must be 1, 5 or 10"}), 400

    try:
        db.session.add(PackPurchase(user_id=user_id, quantity=quantity))
        db.session.commit()
        return jsonify({
            "message": "Purchase registered",
            "purchased": quantity,
            "packs_available": packs_available(user_id)
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al registrar compra", "details": str(e)}), 500


# GET /packs -> consultar sobres disponibles
@api.route('/packs', methods=['GET'])
@jwt_required()
def get_packs():
    # Sin body.
    # Devuelve: {"packs_available": <int>}

    user_id = current_user_id_from_jwt()
    if not user_id:
        return jsonify({"msg": "Unauthorized"}), 401

    try:
        return jsonify({"packs_available": packs_available(user_id)}), 200
    except Exception as e:
        return jsonify({"msg": "Error fetching packs", "details": str(e)}), 500


# POST /open-pack -> abrir un sobre (consume 1 y añade cartas a la colección)
@api.route('/open-pack', methods=['POST'])
@jwt_required()
def open_pack():
    # No se requiere body.
    # Devuelve las cartas obtenidas y sobres restantes.

    # Flujo del endpoint:
    #   1) Verificar la cantidad de sobres disponibles con packs_available()
    #   2) Elegir 5 cartas por probabilidad mediante la función draw_cards_for_pack()
    #   3) Se registra PackOpen para que el sobre se consuma
    #   4) Añadimos las cartas a la colección del usuario (UserCard) con add_to_collection()
    #   5) Commit y respuesta para el frontend

    user_id = current_user_id_from_jwt()
    if not user_id:
        return jsonify({"msg": "Unauthorized"}), 401

    available = packs_available(user_id)
    if available <= 0:
        return jsonify({"msg": "You don't have any pack to open"}), 400

    try:
        card_ids = draw_cards_for_pack(n=PACK_SIZE)
        db.session.add(PackOpen(user_id=user_id))
        add_to_collection(user_id, card_ids)
        db.session.commit()

        cards = db.session.scalars(
            select(Card).where(Card.id.in_(card_ids))).all()
        opened = [{
            "id": c.id,
            "name": c.name,
            "image_url": c.image_url,
            "game_rarity": c.game_rarity,
            "points": c.points
        } for c in cards]

        return jsonify({
            "message": "Pack opened",
            "cards": opened,
            "packs_remaining": packs_available(user_id)
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error opening the pack", "details": str(e)}), 500


# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Endpoints de la API relativos al MAZO (Deck) y la COLECCIÓN (UserCard)
# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# GET /collection -> listar la colección del usuario
@api.route('/collection', methods=['GET'])
@jwt_required()
def get_collection():

    # No es necesario body, solo el token de autenticación
    user_id = current_user_id_from_jwt()
    if not user_id:
        return jsonify({"msg": "Unauthorized"}), 401

        # Se devuelve la colección del usuario (autenticado) uniendo con join UserCard y Card, de este modo el frontend recibe toda la info relevante para mostrar en la lista de cartas
    try:
        rows = (
            UserCard.query
            .filter_by(user_id=user_id)
            .join(Card, UserCard.card_id == Card.id)
            .all()
        )

        items = []
        for uc in rows:
            c = uc.card
            items.append({
                "card_id": c.id,
                "name": c.name,
                "image_url": c.image_url,
                "game_rarity": c.game_rarity,
                "points": c.points,
                "quantity": uc.quantity
            })

        return jsonify({"User collection": items}), 200

    except Exception as e:
        return jsonify({"msg": "Error fetching collection", "details": str(e)}), 500


# GET /deck -> obtener el mazo actual del usuario (si no existe, se crea vacío con el nombre MyDeck)
@api.route('/deck', methods=['GET'])
@jwt_required()
def get_deck():

    # No es necesario body, solo el token de autenticación
    # Devuelve el mazo del usuario autenticado (cartas que lo componen, el total de puntos y el total de cartas).
    # Si el usuario aún no tiene mazo, se crea automáticamente con name="My Deck".

    user_id = current_user_id_from_jwt()
    if not user_id:
        return jsonify({"msg": "Unauthorized"}), 401

    try:
        deck = Deck.query.filter_by(user_id=user_id).first()
        if not deck:
            deck = Deck(user_id=user_id, name="My Deck")
            db.session.add(deck)
            db.session.commit()

        cards = [dc.card for dc in deck.cards]
        payload = {
            "deck_id": deck.id,
            "name": deck.name,
            "cards": [c.serialize() for c in cards],
            "total_cards": len(cards),
            "total_points": sum(c.points for c in cards)
        }
        return jsonify(payload), 200

    except Exception as e:
        return jsonify({"msg": "Error fetching deck", "details": str(e)}), 500


# PUT /deck/add -> añadir carta al mazo (máx. 20 y sin duplicados)
@api.route('/deck/add', methods=['PUT'])
@jwt_required()
def deck_add():

    # Body JSON requerido: { "card_id": "<id de carta del catálogo>" } además del token de autenticación
    # Reglas de negocio: máx. 20 cartas en el mazo y no se permiten duplicados.

    user_id = current_user_id_from_jwt()
    if not user_id:
        return jsonify({"msg": "Unauthorized"}), 401

    if not request.is_json:
        return jsonify({"error": "Body must be JSON"}), 400

    card_id = (request.json or {}).get("card_id")
    if not card_id:
        return jsonify({"error": "card_id required"}), 400

    try:
        # Se comprueba que la carta existe en el catálogo
        card = Card.query.get(card_id)
        if not card:
            return jsonify({"error": "The card does not exist"}), 404

        deck = Deck.query.filter_by(user_id=user_id).first()
        if not deck:
            deck = Deck(user_id=user_id, name="My Deck")
            db.session.add(deck)
            db.session.commit()

        # Reglas de negocio: máx. 20 cartas en el mazo y no se permiten duplicados.
        if len(deck.cards) >= 20:
            return jsonify({"error": "Your deck has reached the max. amount of 20 cards"}), 400

        if any(dc.card_id == card_id for dc in deck.cards):
            return jsonify({"error": "This card is already in your deck, duplicated cards aren't allowed"}), 409

        # Valida que el usuario posee la carta en su colección:
        uc = UserCard.query.filter_by(user_id=user_id, card_id=card_id).first()
        if not uc or (uc.quantity or 0) < 1:
            return jsonify({"error": "You don't own that card"}), 403

        # Si más adelante decidiésemos que al añadir una carta al mazo, esta se "descontase" de la colección
        # (por ejemplo si quisiésemos convertir cartas sobrantes en gemas, o si permitiésemos tener varios mazos y que las cartas fuesen "únicas" como en la vida real, es decir,
        # si una carta ya está en un mazo, no puede estar al mismo tiempo en otro mazo a no ser que tengas un duplicado de dicha carta),
        # aquí podríamos decrementar ----> uc.quantity -= 1

        db.session.add(DeckCard(deck_id=deck.id, card_id=card_id))
        db.session.commit()

        # Respuesta con el mazo actualizado con la nueva carta añadida
        cards = [dc.card for dc in deck.cards]
        return jsonify({
            "deck_id": deck.id,
            "name": deck.name,
            "cards": [c.serialize() for c in cards],
            "total_cards": len(cards),
            "total_points": sum(c.points for c in cards)
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error adding card to deck", "details": str(e)}), 500


# PUT /deck/remove -> quitar carta del mazo (devuelve el estado actualizado)
@api.route('/deck/remove', methods=['PUT'])
@jwt_required()
def deck_remove():
    # Body JSON requerido: { "card_id": "<id de carta del catálogo>" } además del token de autenticación
    # Si la carta está en el mazo, se elimina una ocurrencia (en tu caso no permites duplicados).

    user_id = current_user_id_from_jwt()
    if not user_id:
        return jsonify({"msg": "Unauthorized"}), 401

    if not request.is_json:
        return jsonify({"error": "Body must be JSON"}), 400

    card_id = (request.json or {}).get("card_id")
    if not card_id:
        return jsonify({"error": "card_id required"}), 400

    try:
        deck = Deck.query.filter_by(user_id=user_id).first()
        if not deck:
            return jsonify({"error": "You don't have a deck yet"}), 400

        # Comprobar que la carta está en el mazo, si es asi la guardamos en dc para luego eliminarla con db.session.delete(dc).
        # Si la carta no está en el mazo, dc es None y devolvemos error 404.
        dc = next((dc for dc in deck.cards if dc.card_id == card_id), None)
        if not dc:
            return jsonify({"error": "This card is not in your deck"}), 404

        db.session.delete(dc)

        # De igual modo que el comentario en el /add aquí podríamos incrementar la cantidad en la colección del usuario si nos resulta útil en el futuro.
        # Para ello habría que incrementar uc.quantity += 1

        db.session.commit()

        # Respuesta con el mazo actualizado sin la carta eliminada
        cards = [dc.card for dc in deck.cards]
        return jsonify({
            "deck_id": deck.id,
            "name": deck.name,
            "cards": [c.serialize() for c in cards],
            "total_cards": len(cards),
            "total_points": sum(c.points for c in cards)
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error removing card from deck", "details": str(e)}), 500


# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Endpoints y configuracion para la pasarela de pago Stripe ----------------------------
# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# El env contiene la variable con la clave secreta de Stripe
# You can also find your test secret API key at https://dashboard.stripe.com/test/apikeys.
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

# Registro los precios a través de variables de entorno
    # (estos precios se crean en el dashboard de Stripe, en Products -> Prices)
PRICE_MAP = {
    1: os.getenv("STRIPE_PRICE_PACK_1"),
    5: os.getenv("STRIPE_PRICE_PACK_5"),
    10: os.getenv("STRIPE_PRICE_PACK_10"),
}

# Endpoint para crear la sesión de checkout en Stripe -----------------------------------------------------------------------------------
    # El frontend llama a este endpoint y redirige al usuario a la URL que devuelve
    # El success_url y cancel_url son URLs del frontend a las que redirigir tras el pago o cancelación

@api.route('/create-checkout-session', methods=['POST'])
@jwt_required()  # Token obligatorio: solo los usuarios logueados pueden iniciar una compra
def create_checkout_session():
    # Leo el pack del body (espero 1, 5 o 10)
    data = request.get_json()
    pack = int(data.get("pack", 0))

    # Valido el pack y obtengo el price_id de PRICE_MAP
    price_id = PRICE_MAP.get(pack)
    if not price_id:
        return jsonify({"msg": "Invalid pack. Use 1, 5 or 10."}), 400

    # Obtengo el user_id del token JWT
    user_id = get_jwt_identity()

    # Se crea la sesión de pago en Stripe con los parametros necesarios
    try:
        
        print("DEBUG price_id:", price_id)
        
        session = stripe.checkout.Session.create(
            mode="payment",
            line_items=[{"price": price_id, "quantity": 1}],
            success_url=os.getenv("FRONTEND_URL") + "/checkout/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url=os.getenv("FRONTEND_URL") + "?canceled=true",
            metadata={"user_id": str(user_id), "pack_selected": str(pack)},
        )
        # Se devuelve el id para que el frontend haga redirect con stripe.redirectToCheckout
        return jsonify({"id": session.id}), 200
    except Exception as e:
        return jsonify({"msg": "Failed to create checkout session.", "error": str(e)}), 500


# Endpoint para confirmar el pago y conceder los sobres al usuario -----------------------------------------------------------------------
    # El frontend llama a este endpoint tras la redirección desde Stripe al success_url
@api.route('/checkout/confirm', methods=['POST'])
@jwt_required()  # solo usuarios logueados
def checkout_confirm():
    # Leo el session_id que llega desde el frontend 
    data = request.get_json()
    session_id = data.get("session_id") or request.args.get("session_id")
    if not session_id:
        return jsonify({"msg": "Missing session_id."}), 400

    try:
        # Obtengo mi user_id del JWT para cruzarlo con la sesión de Stripe
        user_id = int(get_jwt_identity())

        # Pido a Stripe los datos de la sesión para verificar que el pago está realizado
        session = stripe.checkout.Session.retrieve(session_id)

        # Se comrprueba que la sesión está pagada (en test debe ser 'paid' tras completar el Checkout)
        if session.get("payment_status") != "paid":
            return jsonify({"msg": "Session not paid yet."}), 402

        # Aquí debajo verifico que la sesión de Stripe pertenece al usuario autenticado y leo la cantidad de sobres comprados
        meta = session.get("metadata") or {}
        session_user = meta.get("user_id")
        pack_selected = meta.get("pack_selected")
        if not session_user or not pack_selected:
            return jsonify({"msg": "Missing metadata in the Stripe session."}), 400
        if int(session_user) != user_id:
            return jsonify({"msg": "Session does not belong to this user."}), 403

        # Se añaden los sobres a la cuenta del usuario
        db.session.add(PackPurchase(user_id=user_id, quantity=int(pack_selected)))
        db.session.commit()

        # Mandos respuesta de éxito al frontend
        return jsonify({"msg": "Packs granted successfully."}), 200

    except stripe.error.InvalidRequestError as e:
        # Por ejemplo: session_id inexistente o mal referenciada
        return jsonify({"msg": "Stripe session retrieval failed.", "error": str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Unexpected server error.", "error": str(e)}), 500


# PEDRO HASTA AQUI ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
























































# HECTOR DESDE AQUI ----------------------------------------------------------------------------------------------------------------------------------------------------------------------

@api.route('/cards', methods=['GET'])
def get_cards():
    cards = db.session.scalars(select(Card)).all()
    return jsonify([card.serialize() for card in cards]), 200


@api.route('/users', methods=['GET'])
def get_users_ranking():
    try:
        # Obtiene todos los usuarios
        users = User.query.all()
        result = []
        for user in users:
            # Busca el deck del usuario
            deck = Deck.query.filter_by(user_id=user.id).first()
            deck_points = 0
            if deck:
                deck_points = sum(
                    [card.points for card in [dc.card for dc in deck.cards]])
            result.append({
                "id": user.id,
                "username": user.username,
                "deck_points": deck_points
            })
        return jsonify({"users": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/users/<int:user_id>', methods=['GET'])
def get_user_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404
    deck = Deck.query.filter_by(user_id=user.id).first()
    deck_points = 0
    if deck:
        deck_points = sum([card.points for card in [dc.card for dc in deck.cards]])
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "deck_points": deck_points
    }), 200


@api.route('/users/<int:user_id>/deck', methods=['GET'])
def get_user_deck(user_id):
    deck = Deck.query.filter_by(user_id=user_id).first()
    if not deck:
        return jsonify({"cards": []}), 200

    deck_cards = (
        db.session.query(Card)
        .join(DeckCard, DeckCard.card_id == Card.id)
        .filter(DeckCard.deck_id == deck.id)
        .all()
    )

    cards_list = [card.serialize() for card in deck_cards]
    return jsonify({"cards": cards_list}), 200

@api.route('/profile/ranking', methods=['GET'])
@jwt_required()
def get_my_ranking():
    user_id = current_user_id_from_jwt()
    users = User.query.all()
    # Ordena por puntos de deck descendente
    def get_deck_points(u):
        deck = Deck.query.filter_by(user_id=u.id).first()
        if deck:
            return sum([card.points for card in [dc.card for dc in deck.cards]])
        return 0

    sorted_users = sorted(users, key=get_deck_points, reverse=True)
    idx = next((i for i, u in enumerate(sorted_users) if u.id == user_id), None)
    deck = Deck.query.filter_by(user_id=user_id).first()
    deck_points = 0
    if deck:
        deck_points = sum([card.points for card in [dc.card for dc in deck.cards]])
    return jsonify({
        "position": idx + 1 if idx is not None else None,
        "points": deck_points
    }), 200

@api.route('/users/<int:user_id>/collection', methods=['GET'])
def get_user_collection(user_id):
    rows = (
        UserCard.query
        .filter_by(user_id=user_id)
        .join(Card, UserCard.card_id == Card.id)
        .all()
    )
    items = []
    for uc in rows:
        c = uc.card
        items.append({
            "card_id": c.id,
            "name": c.name,
            "image_url": c.image_url,
            "game_rarity": c.game_rarity,
            "points": c.points,
            "quantity": uc.quantity
        })
    return jsonify({"collection": items}), 200


@api.route('/recycle', methods=['POST'])
@jwt_required()
def recycle_cards():
    """
    Recicla cartas repetidas y guarda una copia por tipo.
    Body JSON:
    {
        "rarity": "common" | "rare" | "legendary",
        "cards": [
            {"card_id": <int>, "quantity": <int>}, ...
        ]
    }
    Si hay suficientes cartas repetidas, las elimina y añade 1 sobre al inventario del usuario.
    """
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({"msg": "Unauthorized"}), 401

    if not request.is_json:
        return jsonify({"error": "Body must be JSON"}), 400

    data = request.get_json()
    rarity = data.get("rarity")
    cards_to_recycle = data.get("cards", [])

    required = {"common": 20, "rare": 10, "legendary": 1}
    if rarity not in required:
        return jsonify({"error": "Rareza no válida"}), 400

    total_to_recycle = sum(item.get("quantity", 0) for item in cards_to_recycle)
    if total_to_recycle < required[rarity]:
        return jsonify({"error": "No tienes suficientes cartas repetidas para reciclar"}), 400

    # Validar que no se elimina la última copia de ninguna carta
    for item in cards_to_recycle:
        card_id = item.get("card_id")
        qty = item.get("quantity", 0)
        uc = UserCard.query.filter_by(user_id=user_id, card_id=card_id).first()
        if not uc or uc.quantity - qty < 1:
            return jsonify({"error": f"No puedes reciclar todas las copias de la carta {card_id}"}), 400

    try:
        for item in cards_to_recycle:
            card_id = item.get("card_id")
            qty = item.get("quantity", 0)
            uc = UserCard.query.filter_by(user_id=user_id, card_id=card_id).first()
            if uc and qty > 0:
                uc.quantity -= qty
        db.session.add(PackPurchase(user_id=user_id, quantity=1))
        db.session.commit()
        return jsonify({"msg": "Reciclaje realizado. Has recibido 1 sobre."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al reciclar cartas", "details": str(e)}), 500
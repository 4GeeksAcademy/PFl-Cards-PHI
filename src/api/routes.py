"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Card, UserCard, PackPurchase, PackOpen
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, create_access_token
from sqlalchemy import select, func
import random


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
        password = data.get('password')
        username = data.get('username')

        if not email or not password:
            return jsonify({"msg": "Email and password are required"}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({"msg": "User already exists"}), 400

        new_user = User(
            email=email,
            password=password,
            username=username
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"msg": "User created successfully"}), 201

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


# PEDRO DESDE AQUI ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Configuracion de sobres y cartas
PACK_SIZE = 5  # cantidad de cartas por sobre
P_COMMON = 0.80  # probabilidad de carta común
P_RARE = 0.18  # probabilidad de carta rara
P_LEGENDARY = 0.02  # probabilidad de carta legendaria
# Nota: deben sumar 1.0

#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Funciones auxiliares ---------------------------------------------
#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
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
        ).scalar_one_or_none()   # si la consulta no devuelve nada, uc es None; si la consulta devuelve algo, uc es ese objeto UserCard; y si la consulta devuelve más de uno, lanza excepción ya que la combinación user_id + card_id debería ser única.

        if uc:
            uc.quantity += 1
        else:
            db.session.add(
                UserCard(user_id=user_id, card_id=card_id, quantity=1))


#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Endpoints de la API relativos a la compra, disponibilidad y apertura de sobres (en este último se añaden las cartas a la colección del usuario (UserCard)) ----------------------------
#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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


# PEDRO HASTA AQUI ----------------------------------------------------------------------------------------------------------------------------------------------------------------------

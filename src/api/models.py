from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List

db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)

    # Relaciones
    collection: Mapped[List["UserCard"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    decks: Mapped[List["Deck"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    purchases: Mapped[List["PackPurchase"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    opens: Mapped[List["PackOpen"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email
        }


class Card(db.Model):
    
    # Catálogo de cartas disponibles. Se carga desde la API externa.
    # A la URL de la API se le debe añadir '/high.webp' antes de guardarla.
    # Si se quiere menor resoliución, se puede usar '/low.webp', o incluso cambiar la extensión a '.png' o '.jpg'
   
    id: Mapped[str] = mapped_column(
        String(50), primary_key=True)  # id externo (ej: "base1-1")
    local_id: Mapped[str] = mapped_column(String(20), nullable=True, unique=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    image_url: Mapped[str] = mapped_column(String(255), nullable=False)

    # Rareza y puntos definidos por nosotros de manera manual en el diccionario
    # game_rarity puede ser "common", "rare" y "legendary"
    # points es la cantidad de puntos que da la carta cuando es añadida a un mazo
    game_rarity: Mapped[str] = mapped_column(
        String(20), nullable=False, default="common")
    points: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    def serialize(self):
        return {
            "id": self.id,
            "local_id": self.local_id,
            "name": self.name,
            "image_url": self.image_url,
            "game_rarity": self.game_rarity,
            "points": self.points
        }


class UserCard(db.Model):
   
    # Cartas que tiene un usuario en su colección 
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    card_id: Mapped[str] = mapped_column(ForeignKey("card.id"))
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    user: Mapped["User"] = relationship(back_populates="collection")
    card: Mapped["Card"] = relationship()

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "card_id": self.card_id,
            "quantity": self.quantity
        }


class Deck(db.Model):
    
    # Mazo de cartas del usuario, que puede contener varias cartas
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    name: Mapped[str] = mapped_column(
        String(120), nullable=False, default="My Deck")

    user: Mapped["User"] = relationship(back_populates="decks")
    cards: Mapped[List["DeckCard"]] = relationship(
        back_populates="deck", cascade="all, delete-orphan"
    )

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "cards": [deck_card.serialize() for deck_card in self.cards]
        }


class DeckCard(db.Model):
    
    # Relacion entre Deck y Card, para definir qué cartas tiene un mazo
    
    id: Mapped[int] = mapped_column(primary_key=True)
    deck_id: Mapped[int] = mapped_column(ForeignKey("deck.id"))
    card_id: Mapped[str] = mapped_column(ForeignKey("card.id"))

    deck: Mapped["Deck"] = relationship(back_populates="cards")
    card: Mapped["Card"] = relationship()

    def serialize(self):
        return {
            "id": self.id,
            "deck_id": self.deck_id,
            "card_id": self.card_id
        }


class PackPurchase(db.Model):
    
    # Todos los sobres comprados por los usuarios
   
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    user: Mapped["User"] = relationship(back_populates="purchases")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "quantity": self.quantity
        }


class PackOpen(db.Model):

    # Todos los sobres abiertos por los usuarios

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))

    user: Mapped["User"] = relationship(back_populates="opens")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id
        }

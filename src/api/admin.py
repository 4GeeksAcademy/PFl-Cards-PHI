  
import os
from flask_admin import Admin
from .models import db, User, Card, UserCard, Deck, DeckCard, PackPurchase, PackOpen
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    class UserView(ModelView):
        column_list = ('id', 'username', 'email')
        form_columns = ('username', 'email', 'password')

    class CardView(ModelView):
        column_list = ('id', 'local_id', 'name', 'image_url', 'game_rarity', 'points')
        form_columns = ('id', 'local_id', 'name', 'image_url', 'game_rarity', 'points')
        
    class UserCardView(ModelView):
        column_list = ('id', 'user_id', 'card_id', 'quantity')
        form_columns = ('user_id', 'card_id', 'quantity')
        
    class DeckView(ModelView):
        column_list = ('id', 'user_id', 'name')
        form_columns = ('user_id', 'name')
    
    class DeckCardView(ModelView):
        column_list = ('id', 'deck_id', 'card_id')
        form_columns = ('deck_id', 'card_id')
        
    class PackPurchaseView(ModelView):
        column_list = ('id', 'user_id', 'quantity')
        form_columns = ('user_id', 'quantity')
        
    class PackOpenView(ModelView):
        column_list = ('id', 'user_id')
        form_columns = ('user_id',)
    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(UserView(User, db.session))
    admin.add_view(CardView(Card, db.session))
    admin.add_view(UserCardView(UserCard, db.session))
    admin.add_view(DeckView(Deck, db.session))
    admin.add_view(DeckCardView(DeckCard, db.session))
    admin.add_view(PackPurchaseView(PackPurchase, db.session))
    admin.add_view(PackOpenView(PackOpen, db.session))

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))
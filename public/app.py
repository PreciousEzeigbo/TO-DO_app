from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_login import LoginManager

db = SQLAlchemy()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__, template_folder= 'templates', static_folder='static')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = "my secret key you should not know"
    app.config['LOGIN_VIEW'] = 'login'


    db.init_app(app)
    bcrypt = Bcrypt()
    bcrypt.init_app(app)

    # Initialize login_manager and set the login view
    login_manager.init_app(app)

    # Configure login manager
    login_manager.login_view = 'public.login'  # Specify the login route
    login_manager.login_message_category = 'info'


    # Setup Migrate for database migrations
    migrate = Migrate()
    migrate.init_app(app, db)

    # Import models so they can be registered with SQLAlchemy
    from public.models import User

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Register routes
    from public.routes import register_routes
    register_routes(app, db, bcrypt)


    return app

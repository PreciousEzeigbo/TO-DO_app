from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_login import LoginManager

db = SQLAlchemy()
login_manager = LoginManager()

def create_app():
    print("create_app() function is being called")
    app = Flask(__name__, template_folder= 'templates', static_folder='static')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'
    app.config['SECRET_KEY'] = "my secret key you should not know"
    app.config['LOGIN_VIEW'] = 'login'
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Maximum file size: 16MB


    db.init_app(app)
    bcrypt = Bcrypt()
    bcrypt.init_app(app)

    # Initialize login_manager and set the login view
    login_manager.init_app(app)

    # Setup Migrate for database migrations
    migrate = Migrate()
    migrate.init_app(app, db)

    # Import models so they can be registered with SQLAlchemy
    from public.models import User
    

    # Register routes
    from public.routes import register_routes
    register_routes(app, db, bcrypt)


    return app
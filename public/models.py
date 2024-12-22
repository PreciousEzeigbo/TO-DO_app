from flask_login import UserMixin
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from public.app import db, login_manager

@login_manager.user_loader
def load_user(user_id):
    """Load a user from the database based on user ID."""
    return User.query.get(int(user_id))

class User(db.Model, UserMixin):
    """User model for authentication."""
    __tablename__ = 'users'

    uid = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)  # Store hashed passwords
    date_added = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<User: {self.username}>'

    def get_id(self):
        """Override Flask-Login's get_id to use 'uid'."""
        return self.uid

    def set_password(self, password):
        """Hash and set the user's password."""
        self.password = generate_password_hash(password)

    def check_password(self, password):
        """Check if the given password matches the hashed password."""
        return check_password_hash(self.password, password)

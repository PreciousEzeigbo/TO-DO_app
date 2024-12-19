from flask import Blueprint, Flask, render_template, request, redirect, url_for, flash, session
from flask_login import login_user, logout_user, current_user, login_required, LoginManager
from werkzeug.security import check_password_hash  # Import for checking hashed passwords

from public.models import User, db


def register_routes(app, db, bcrypt):
    public_bp = Blueprint('public', __name__, template_folder='templates', static_folder='static')

    @public_bp.route('/')
    def index():
        return render_template("register.html")
    
    @public_bp.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'GET':
            return render_template("login.html")
        if request.method == 'POST':
            username = request.form.get('username')
            password = request.form.get('password')

            # Retrieve user from database
            user = User.query.filter_by(username=username).first()

            if user and user.check_password(password):
                # User exists and password is correct
                login_user(user)
                return redirect(url_for('public.profile'))  # Redirect to a protected route or home page
            else:
                # Invalid credentials
                flash('Invalid username or password', 'danger')  # Flash message for login error
                return redirect(url_for('login'))  # Redirect back to login page

    @app.route('/forgotten', methods=['GET', 'POST'])
    def forgotten():
        if request.method == 'GET':
            return render_template('forgotten.html')
        elif request.method == 'POST':
            pass

    # Custom error pages

    # Invalid pages
    @app.errorhandler(404)
    def page_not_found(e):
        return render_template("404.html"), 404

    # Internal server error pages
    @app.errorhandler(500)
    def server_error(e):
        return render_template("500.html"), 500

    # Register Blueprint with the app
    app.register_blueprint(public_bp)

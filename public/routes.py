from flask import Blueprint, Flask, render_template, request, redirect, url_for, flash, session
from flask_login import login_user, logout_user, current_user, login_required, LoginManager
from werkzeug.security import check_password_hash  # Import for checking hashed passwords

from public.models import User, db


def register_routes(app, db, bcrypt):
    public_bp = Blueprint('public', __name__, template_folder='templates', static_folder='static')

    @public_bp.route('/')
    def index():
        return render_template("index.html")
    
    @public_bp.route('/register', methods=['GET', 'POST'])
    def register():
        if request.method == 'GET':
            return render_template('register.html')

        elif request.method == 'POST':
            username = request.form.get('username')
            email = request.form.get('email')
            password = request.form.get('password')
            confirmPassword = request.form.get('confirmPassword')

            print(f"Received data: username={username}, email={email}, password={password}, confirmPassword={confirmPassword}")

            # Validate required fields
            if not username or not email or not password or not confirmPassword:
                flash("All fields are required", 'danger')
                print("Validation failed: missing fields")
                return redirect(url_for('public.register'))

            # Check if the passwords match
            if password != confirmPassword:
                flash("Passwords do not match", 'danger')
                print("Validation failed: passwords don't match")
                return redirect(url_for('public.register'))

           # Check if the username or email already exists
            if User.query.filter_by(username=username).first():
                flash("User already exists", 'danger')
                print("Validation failed: username already exists")
                return redirect(url_for('public.register'))

            if User.query.filter_by(email=email).first():
                flash("Email already in use", 'danger')
                print("Validation failed: email already in use")
                return redirect(url_for('public.register'))


            # Create and save the new user
            new_user = User(username=username, email=email)


            # Hash the password
            try:
                new_user.set_password(password)
                print(f"Hashed password: {new_user.password}")

                db.session.add(new_user)
                db.session.commit()
                flash("Registration successful!", 'success')
                print(f"User {username} registered successfully!")
                return redirect(url_for('public.login'))
            except Exception as e:
                db.session.rollback()
                flash(f"An error occurred: {str(e)}", 'danger')
                print(f"Error during registration: {str(e)}")
                return redirect(url_for('public.register'))

    
    @public_bp.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'GET':
            return render_template("login.html")
        elif request.method == 'POST':
            userIdentifier = request.form.get('userIdentifier')
            password = request.form.get('password')

            print(f"User Identifier: {userIdentifier}")
            print(f"Password: {password}")

            # Retrieve user from database
            user = User.query.filter((User.email == userIdentifier) | (User.username == userIdentifier)).first()
            print(f"User found: {user}")

            if user and user.check_password(password):
                print("User and Password is correct!")
                # User exists and password is correct
                login_user(user)

                return redirect(url_for('public.profile'))
            else:
                print("No user found with the provided identifier!")
                # Invalid credentials
                flash('Invalid userIdentifier or password', 'danger')  # Flash message for login error
                return redirect(url_for('public.login'))  # Redirect back to login page

    @public_bp.route('/forgotten', methods=['GET', 'POST'])
    def forgotten():
        if request.method == 'GET':
            return render_template('forgotten.html')
        elif request.method == 'POST':
            pass
    
    @public_bp.route('/logout')
    def logout():
        logout_user()
        flash('You have been logged out.', 'info')
        return redirect(url_for('public.login'))

    @public_bp.route('/profile')
    @login_required
    def profile():
        """Render the profile page for logged-in users."""
        return render_template("profile.html", user=current_user)
    
    @public_bp.route('/home')
    def home():
        """Home page route (or dashboard page)"""
        return render_template("home.html")
    
    @public_bp.route('/settings')
    @login_required
    def settings():
        """Render the settings page for the logged-in user."""
        return render_template('settings.html')  # Create the settings.html page


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

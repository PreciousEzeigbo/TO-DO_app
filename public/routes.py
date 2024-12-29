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
            confirm_password = request.form.get('confirm_password')

            # Validate required fields
            if not username or not email or not password or not confirm_password:
                flash("All fields are required", 'danger')
                return redirect(url_for('public.register'))

            # Check if the passwords match
            if password != confirm_password:
                flash("Passwords do not match", 'danger')
                return redirect(url_for('public.register'))

           # Check if the username or email already exists
            if User.query.filter_by(username=username).first():
                flash("User already exists", 'danger')
                return redirect(url_for('public.register'))

            if User.query.filter_by(email=email).first():
                flash("Email already in use", 'danger')
                return redirect(url_for('public.register'))


            # Create and save the new user
            new_user = User(username=username, email=email)


            # Hash the password
            try:
                new_user.set_password(password)
                db.session.add(new_user)
                db.session.commit()
                flash("Registration successful!", 'success')
                return redirect(url_for('public.login'))
            except Exception as e:
                db.session.rollback()
                flash(f"An error occurred: {str(e)}", 'danger')
                return redirect(url_for('public.register'))

    
    @public_bp.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'GET':
            return render_template("login.html")
        elif request.method == 'POST':
            username = request.form.get('username')
            password = request.form.get('password')

            # Retrieve user from database
            user = User.query.filter_by(username=username).first()

            if user and user.check_password(password):
                # User exists and password is correct
                print(f"User {user.username} logged in successfully")
                login_user(user)
                return redirect(url_for('public.home'))  # Redirect to a protected route or home page
            else:
                # Invalid credentials
                print("Invalid credentials")
                flash('Invalid username or password', 'danger')  # Flash message for login error
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
        return render_template('profile.html')
    

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

from flask import Blueprint, Flask, render_template, request, redirect, url_for, flash, session
from flask_login import login_user, logout_user, current_user, login_required, LoginManager
from werkzeug.security import check_password_hash  # Import for checking hashed passwords

from public.models import User, db

import random


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

            if user:
                if user.check_password(password):
                    print("User and Password is correct!")
                    # User exists and password is correct
                    login_user(user)
                    return redirect(url_for('public.home'))
                else:
                    print("Incorrect password!")
                    flash('Invalid password, please try again.', 'danger')
                    return redirect(url_for('public.login'))
            else:
                print("No user found with the provided identifier!")
                # Invalid credentials
                flash('Invalid userIdentifier or password', 'danger')  # Flash message for login error
                return redirect(url_for('public.login'))  # Redirect back to login page
            
            
    @public_bp.route('/profile')
    @login_required
    def profile():
        """Render the profile page for logged-in users."""
        if request.method == 'POST':
            # Get form data
            full_name = request.form.get('fullName')
            birthday = request.form.get('birthday')

            # Update the current user's profile
            current_user.full_name = full_name
            current_user.birthday = birthday

            # Save changes to the database
            try:
                db.session.commit()
                flash("Profile updated successfully!", 'success')
            except Exception as e:
                db.session.rollback()
                flash(f"Error updating profile: {str(e)}", 'danger')
            
            return redirect(url_for('public.profile'))
        return render_template("profile.html", user=current_user)
    

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
    
    @public_bp.route('/home')
    @login_required
    def home():
        """Home page route (or dashboard page)"""
        return render_template("home.html")
    
    @public_bp.route('/settings')
    @login_required
    def settings():
        """Render the settings page for the logged-in user."""
        return render_template('settings.html')
    
    @public_bp.route('/alphabets')
    @login_required
    def alphabets():
        """Learnig page route to learn alphabets"""
        return render_template("alphabets.html")
    
    @public_bp.route('/alphas')
    @login_required
    def alphas():
        """Randomize and display uppercase and lowercase letters"""
        # Define the list of uppercase and lowercase letters
        uppercase_alphabet = [chr(i) for i in range(65, 91)]  # A-Z
        lowercase_alphabet = [chr(i) for i in range(97, 123)]  # a-z

        # Pair uppercase and lowercase letters together
        letter_pairs = list(zip(uppercase_alphabet, lowercase_alphabet))

        # Shuffle the letter pairs randomly
        random.shuffle(letter_pairs)

        # Get the first 8 pairs to display
        selected_pairs = letter_pairs[:8]

        # Separate the pairs back into two lists
        uppercase_alphabet_shuffled = [pair[0] for pair in selected_pairs]
        lowercase_alphabet_shuffled = [pair[1] for pair in selected_pairs]

        # Define the list of alphabets displayed for puzzle 2
        alphabet_displayed = [chr(i) for i in range(97, 123)]  # a-z

        # For Puzzle 2: Shuffle lowercase alphabet to be arranged
        alphabet_displayed_randomized = random.sample(alphabet_displayed, 8)

        # Define the list of alphabets displayed for puzzle 2
        alpha_displayed = [chr(i) for i in range(65, 91)]  # a-z

        # For Puzzle 2: Shuffle lowercase alphabet to be arranged
        alpha_displayed_randomized = random.sample(alpha_displayed, 26)
        
        return render_template("alphas.html", 
                               uppercase_alphabet=uppercase_alphabet_shuffled, 
                               lowercase_alphabet=lowercase_alphabet_shuffled,
                               alphabet_displayed=alphabet_displayed_randomized,
                               alpha_displayed=alpha_displayed_randomized)
    
    @public_bp.route('/numbers')
    @login_required
    def numbers():
        """Home page route (or dashboard page)"""
        # Generate numbers ranging from 1 to 100
        numbers = list(range(1, 101))

        # Join numbers into a string using one of the methods mentioned
        numbers_sequence = ', '.join(str(number) for number in numbers)

        # Pass the numbers to the template
        return render_template("numbers.html", display_numbers=numbers_sequence)


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

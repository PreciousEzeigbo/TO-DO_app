from flask import Blueprint, render_template

def register_routes(app, db, bcrypt):
    public_bp = Blueprint('public', __name__, template_folder='templates', static_folder='static')

    @public_bp.route('/')
    def index():
        return render_template("register.html")
    
    @public_bp.route('/login')
    def login():
        return render_template("login.html")

    # Register Blueprint with the app
    app.register_blueprint(public_bp)

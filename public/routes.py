from flask import Blueprint, render_template

def register_routes(app, db, bcrypt):
    public_bp = Blueprint('public', __name__, template_folder='templates', static_folder='static')

    @public_bp.route("/")
    def home():
        return render_template("home.html")

    # Register Blueprint with the app
    app.register_blueprint(public_bp)

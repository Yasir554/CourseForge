from flask import Flask, jsonify, request, make_response
from flask_migrate import Migrate
from flask_cors import CORS

# Import the SQLAlchemy instance (db) and our database initialization function (init_db)
from lib.db.courseforge import db, init_db

# Create the Flask application instance
app = Flask(__name__)

# Configure the app with necessary settings
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///courseforge.db"  
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False  

# This Initialize the database by binding it to our app.
init_db(app)

# This Handles the Flask-Migrate for database migrations.
migrate = Migrate(app, db)

# This Set up Cross-Origin Resource Sharing so our React frontend can communicate with the backend.
CORS(app)

# Routes
# Home Route
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to CourseForge API"}), 200

if __name__ == "__main__":
    app.run(port=5555, debug=True)

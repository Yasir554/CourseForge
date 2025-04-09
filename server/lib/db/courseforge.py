from flask_sqlalchemy import SQLAlchemy

# This Create an instance of SQLAlchemy which will be used for model definitions
db = SQLAlchemy()

def init_db(app):
    # This Bind the SQLAlchemy instance (db) to the provided Flask application.
    db.init_app(app)

from flask_sqlalchemy import SQLAlchemy

# Create an instance of SQLAlchemy for model definitions
db = SQLAlchemy()

def init_db(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()
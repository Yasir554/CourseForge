from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from CourseForge import db

class User(db.Model):
    __table__ = 'users'

    id = db.Column(db.integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(50), nullable=False) 
    password_hash = db.Column(db.String(128), nullable=False)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    profile_picture = db.Column(db.String(255))


courses = db.relationship('Course', back_populates = 'instructor', lazy='True')
enrollment = db.relationship('Enrollment', back_populates = 'student', lazy='True')

def set_password_hash(self, password):
    self.password_hash = generate_password_hash(password)

def check_password_hash(self, password):
    return check_password_hash(self.password_hash, password)


def to_dict(self):
        """Converts the User object to a dictionary."""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'profile_picture': self.profile_picture,
        }


def __repr__(self):
        return f"<User {self.username} ({self.role})>"
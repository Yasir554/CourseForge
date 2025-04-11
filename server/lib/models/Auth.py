from werkzeug.security import generate_password_hash, check_password_hash
from lib.db.courseforge import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(50))  # 'Instructor' or 'Student'
    type = db.Column(db.String(50))  # for polymorphic identity

    __mapper_args__ = {
        'polymorphic_identity': 'user',
        'polymorphic_on': type
    }

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'type': self.type
        }

class Instructor(User):
    __mapper_args__ = {
        'polymorphic_identity': 'instructor',
    }

    def to_dict(self):
        data = super().to_dict()
        # Add instructor-specific fields here if needed
        return data

class Student(User):
    __mapper_args__ = {
        'polymorphic_identity': 'student',
    }

    def to_dict(self):
        data = super().to_dict()
        # Add student-specific fields here if needed
        return data

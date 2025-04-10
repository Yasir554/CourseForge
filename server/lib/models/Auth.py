from lib.db.courseforge import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    
    # Common methods for both Instructor and Student
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
        }

# Extend User for Instructor
class Instructor(User):
    __tablename__ = "instructors"

    id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    
    # Relationship: list of courses created by the instructor
    courses = db.relationship("Course", backref="instructor", lazy=True)

    def to_dict(self):
        data = super().to_dict()
        data["role"] = "Instructor"
        return data

# Extend User for Student
class Student(User):
    __tablename__ = "students"

    id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)

    # Relationship: list of enrollments for this student
    enrollments = db.relationship("Enrollment", backref="student", lazy=True)

    def to_dict(self):
        data = super().to_dict()
        data["role"] = "Student"
        return data


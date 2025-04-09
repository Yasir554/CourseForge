<<<<<<< HEAD
# will be done by Caleb
=======
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin 
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.orm import validates
from lib.db.courseforge import db

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(50), nullable=False)  
    
    # One-to-one relationships for role-specific profiles
    instructor_profile = db.relationship('InstructorProfile', uselist=False, back_populates='user')
    student_profile = db.relationship('StudentProfile', uselist=False, back_populates='user')
    
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
        }
    
    def __repr__(self):
        return f"<User {self.username} ({self.role})>"

class InstructorProfile(db.Model):
    __tablename__ = 'instructor_profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    profile_picture = db.Column(db.String(255))
    
    user = db.relationship('User', back_populates='instructor_profile')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'profile_picture': self.profile_picture,
            'bio': self.bio,
        }
    
    def __repr__(self):
        return f"<InstructorProfile {self.first_name} {self.last_name}>"

class StudentProfile(db.Model):
    __tablename__ = 'student_profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    profile_picture = db.Column(db.String(255))
    
    user = db.relationship('User', back_populates='student_profile')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'profile_picture': self.profile_picture,
        }
    
    def __repr__(self):
        return f"<StudentProfile {self.first_name} {self.last_name}>"
>>>>>>> 8bba38d339d02e48a0f2bab59a557d6d717d2913

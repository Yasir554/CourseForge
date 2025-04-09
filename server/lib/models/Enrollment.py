<<<<<<< HEAD
# Done by Jonas
=======
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin 
from sqlalchemy.orm import validates
from lib.models.courses import Course
from lib.db.courseforge import db
from datetime import datetime , timezone


# Enrollment model

class Enrollment(db.Model, SerializerMixin):
    __tablename__ = 'enrollments'

    # Serialization
    serialize_rules = ('-user.enrollments', '-course.enrollments',)  


    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    timestamp = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)


    # Relationships
    user = db.relationship('User', back_populates='enrollments')
    course = db.relationship('Course', back_populates='enrollments')

    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'course_id': self.course_id,
            'timestamp': self.timestamp.isoformat()
        }
    
    def __repr__(self):
        return f"<Enrollment id={self.id} user_id={self.user_id} course_id={self.course_id}>"
    

>>>>>>> 8bba38d339d02e48a0f2bab59a557d6d717d2913

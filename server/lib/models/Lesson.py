<<<<<<< HEAD
# will be done by Michael
=======
# will be done by Michael
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin 
from sqlalchemy.orm import validates
# from flask_migrate import Migrate
from lib.models.courses import Course
from lib.db.courseforge import db


# Lesson model
class Lesson(db.Model,SerializerMixin ):
    __tablename__ = 'lessons'

    # Avoid serializing the course’s lessons (which would include this lesson again)
    serialize_rules = ('-course.lessons',)

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    content = db.Column(db.Text, nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)

    # Relationships
    course = db.relationship('Course', back_populates='lessons')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'course_id': self.course_id
        }

    # Validations
    @validates('title')
    def validate_title(self, key, value):
        if not value or not value.strip():
            raise ValueError("Title cannot be empty")
        return value

    @validates('content')
    def validate_content(self, key, value):
        if not value or not value.strip():
            raise ValueError("Content cannot be empty")
        return value

    @validates('course_id')
    def validate_course_id(self, key, value):
        if not value:
            raise ValueError("course_id is required")
        return value
>>>>>>> 8bba38d339d02e48a0f2bab59a557d6d717d2913

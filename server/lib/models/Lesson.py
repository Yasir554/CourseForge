# server/lib/models/Lesson.py
from lib.db.courseforge import db
from sqlalchemy_serializer import SerializerMixin


class Lesson(db.Model, SerializerMixin):
    __tablename__ = 'lessons'

    serialize_rules = ('-course.lessons', '-instructor.lessons',)
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(256), nullable=False)
    content = db.Column(db.Text)
    duration = db.Column(db.Integer)  # in minutes
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    instructor_id = db.Column(db.Integer, db.ForeignKey('instructors.id'), nullable=False)

    # Relationships
    course = db.relationship('Course', back_populates='lessons')
    instructor = db.relationship('Instructor', back_populates='lessons')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'duration': self.duration,
            'course_id': self.course_id,
            'instructor_id': self.instructor_id
        }

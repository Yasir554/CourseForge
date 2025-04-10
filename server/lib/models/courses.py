# server/lib/models/Course.py
from lib.db.courseforge import db

class Course(db.Model):
    __tablename__ = 'courses'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(256), nullable=False)
    description = db.Column(db.Text)
    
    instructor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Relationships
    lessons = db.relationship("Lesson", backref="course", lazy=True)
    enrollments = db.relationship("Enrollment", backref="course", lazy=True)
    
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "instructor_id": self.instructor_id
        }

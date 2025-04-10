# server/lib/models/Lesson.py
from lib.db.courseforge import db

class Lesson(db.Model):
    __tablename__ = 'lessons'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(256), nullable=False)
    content = db.Column(db.Text)
    duration = db.Column(db.Integer)  # in minutes
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "duration": self.duration,
            "course_id": self.course_id
        }

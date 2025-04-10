# server/lib/models/Enrollment.py
from lib.db.courseforge import db

class Enrollment(db.Model):
    __tablename__ = 'enrollments'
    
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    progress = db.Column(db.Integer, default=0)  # progress percentage
    enrolled_on = db.Column(db.DateTime, server_default=db.func.now())
    
    def to_dict(self):
        return {
            "id": self.id,
            "course_id": self.course_id,
            "student_id": self.student_id,
            "progress": self.progress,
            "enrolled_on": self.enrolled_on.isoformat() if self.enrolled_on else None
        }

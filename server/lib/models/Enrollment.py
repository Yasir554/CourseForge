from datetime import datetime
from lib.db.courseforge import db
from sqlalchemy_serializer import SerializerMixin

class Enrollment(db.Model, SerializerMixin):
    __tablename__ = 'enrollments'

    serialize_rules = ('-course.enrollments', '-student.enrollments', '-instructor.enrollments',)

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    instructor_id = db.Column(db.Integer, db.ForeignKey('instructors.id'), nullable=False)
    enrolled_on = db.Column(db.DateTime, default=datetime.utcnow, nullable=True)

    # Relationships
    course = db.relationship('Course', back_populates='enrollments')
    student = db.relationship('Student', back_populates='enrollments')
    instructor = db.relationship('Instructor', back_populates='enrollments')
    
    def to_dict(self):
        return {
            'id': self.id,
            'course_id': self.course_id,
            'student_id': self.student_id,
            'instructor_id': self.instructor_id,
            'enrolled_on': self.enrolled_on.isoformat() if self.enrolled_on else None
        }
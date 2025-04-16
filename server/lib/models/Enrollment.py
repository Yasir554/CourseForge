from datetime import datetime
from lib.db.courseforge import db
from sqlalchemy_serializer import SerializerMixin


class Enrollment(db.Model, SerializerMixin):
    __tablename__ = 'enrollments'

    serialize_rules = (
        '-course.enrollments',
        '-student.enrollments',
        '-instructor.enrollments',
    )

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    instructor_id = db.Column(db.Integer, db.ForeignKey('instructors.id'), nullable=False)
    enrolled_on = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Define relationships
    course = db.relationship('Course', back_populates='enrollments', lazy=True)
    student = db.relationship('Student', back_populates='enrollments', lazy=True)
    instructor = db.relationship('Instructor', back_populates='enrollments', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'course_id': self.course_id,
            'student_id': self.student_id,
            'instructor_id': self.instructor_id,
            'enrolled_on': self.enrolled_on.isoformat() if self.enrolled_on else None
        }

    def __repr__(self):
        return f"<Enrollment student_id={self.student_id} course_id={self.course_id} instructor_id={self.instructor_id}>"

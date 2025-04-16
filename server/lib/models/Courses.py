from lib.db.courseforge import db
from lib.models.Course_Instructor import courseInstructors
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

class Course(db.Model, SerializerMixin):
    __tablename__ = 'courses'

    serialize_rules = ('-instructor.courses', '-lessons.course', '-enrollments.course', '-students',)

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    instructor_id = db.Column(db.Integer, db.ForeignKey('instructors.id'), nullable=False)

    instructor = db.relationship('Instructor', back_populates='courses', foreign_keys=[instructor_id], lazy=True)
    instructors = db.relationship('Instructor', secondary=courseInstructors, back_populates='assigned_courses', lazy=True)

    lessons = db.relationship('Lesson', back_populates='course', lazy=True, cascade='all, delete-orphan')
    enrollments = db.relationship('Enrollment', back_populates='course', lazy=True, cascade='all, delete-orphan')

    # Association proxy to access students directly
    students = association_proxy('enrollments', 'student')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'instructor_id': self.instructor_id,
            'lessons': [lesson.to_dict() for lesson in self.lessons],
            'enrollments': [enroll.to_dict() for enroll in self.enrollments]
        }

    def __repr__(self):
        return f"<Course {self.title} by Instructor {self.instructor_id}>"

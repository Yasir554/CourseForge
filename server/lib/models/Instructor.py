from werkzeug.security import generate_password_hash, check_password_hash
from lib.db.courseforge import db
from lib.models.Student_Instructor import student_instructor
from lib.models.Course_Instructor import courseInstructors
from sqlalchemy_serializer import SerializerMixin


class Instructor(db.Model, SerializerMixin):
    __tablename__ = 'instructors'

    serialize_rules = ('-students.instructors', '-enrollments.instructor', '-courses.instructor', '-lessons.instructor',)

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(50), default='Instructor')

    enrollments = db.relationship('Enrollment', back_populates='instructor', lazy=True)
    students = db.relationship('Student', secondary=student_instructor, back_populates='instructors', lazy=True)
    courses = db.relationship('Course', back_populates='instructor')
    lessons = db.relationship('Lesson', back_populates='instructor', lazy=True)
    assigned_courses = db.relationship('Course', secondary=courseInstructors, back_populates='instructors')

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
            'students': [
                {
                    'id': s.id,
                    'username': s.username,
                    'email': s.email,
                    'enrolled_on': assoc.enrolled_on.isoformat() if assoc.enrolled_on else None
                }
                for s, assoc in self._student_assocs()
            ],
            'courses': [course.to_dict() for course in self.courses],
            'lessons': [lesson.to_dict() for lesson in self.lessons],
            'enrollments': [enroll.to_dict() for enroll in self.enrollments]
        }

    def _student_assocs(self):
        for s in self.students:
            for enroll in s.enrollments:
                if enroll.instructor_id == self.id:
                    yield s, enroll
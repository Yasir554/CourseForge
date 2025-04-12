# server/lib/models/Student.py
from werkzeug.security import generate_password_hash, check_password_hash
from lib.db.courseforge import db
from lib.models.Student_Instructor import student_instructor

class Student(db.Model):
    __tablename__ = 'students'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(50), default='Student')

    # Relationships
    enrollments = db.relationship('Enrollment', back_populates='student', lazy=True)
    instructors = db.relationship('Instructor', secondary=student_instructor, back_populates='students', lazy=True)
    courses = db.relationship('Course', secondary='enrollments', back_populates='students', lazy=True)

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
            'courses': [course.to_dict() for course in self.courses],
            'enrollments': [enroll.to_dict() for enroll in self.enrollments],
            'instructors': [
                {
                    'id': instr.id,
                    'username': instr.username,
                    'email': instr.email,
                    'enrolled_on': assoc.enrolled_on.isoformat() if assoc.enrolled_on else None
                }
                for instr, assoc in self._instructor_assocs()
            ]
        }

    def _instructor_assocs(self):
        for instr in self.instructors:
            for enroll in instr.enrollments:
                if enroll.student_id == self.id:
                    yield instr, enroll

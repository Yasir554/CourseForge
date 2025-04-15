from lib.db.courseforge import db

student_instructor = db.Table(
    'student_instructor',
    db.Column('student_id', db.Integer, db.ForeignKey('students.id'), primary_key=True),
    db.Column('instructor_id', db.Integer, db.ForeignKey('instructors.id'), primary_key=True),
    db.Column('enrolled_on', db.DateTime, default=db.func.now(), nullable=False)
)
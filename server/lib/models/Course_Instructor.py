from lib.db.courseforge import db

courseInstructors = db.Table('course_instructors',
    db.Column('course_id', db.Integer, db.ForeignKey('courses.id'), primary_key=True),
    db.Column('instructor_id', db.Integer, db.ForeignKey('instructors.id'), primary_key=True)
)

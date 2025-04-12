# server/seed.py
from flask import Flask
from lib.db.courseforge import db, init_db
from lib.models.Instructor import Instructor
from lib.models.Student import Student
from lib.models.Courses import Course
from lib.models.Lesson import Lesson
from lib.models.Enrollment import Enrollment


def make_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///courseforge.db'  # adjust to your URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    init_db(app)
    return app


def seed():
    app = make_app()
    with app.app_context():
        db.drop_all()
        db.create_all()

        # Instructors
        alice = Instructor(username='alice', email='alice@example.com')
        alice.set_password('password123')
        bob   = Instructor(username='bob',   email='bob@example.com')
        bob.set_password('hunter2')

        # Students
        charlie = Student(username='charlie', email='charlie@example.com')
        charlie.set_password('qwerty')
        dana    = Student(username='dana',    email='dana@example.com')
        dana.set_password('asdfgh')

        # Courses & Lessons
        python_course = Course(title='Intro to Python', description='Learn Python basics.', instructor=alice)
        flask_lesson  = Lesson(title='Flask 101', content='Building APIs', duration=60, course=python_course, instructor=alice)
        js_course     = Course(title='JavaScript Deep Dive', description='ES6 and beyond.', instructor=bob)
        react_lesson  = Lesson(title='React Hooks', content='useState & useEffect', duration=45, course=js_course, instructor=bob)

        # Enrollments
        enroll1 = Enrollment(course=python_course, student=charlie, instructor=alice)
        enroll2 = Enrollment(course=python_course, student=dana,    instructor=alice)
        enroll3 = Enrollment(course=js_course,     student=charlie, instructor=bob)

        # M2M Student<->Instructor
        alice.students.append(charlie)
        alice.students.append(dana)
        bob.students.append(charlie)

        db.session.add_all([alice, bob, charlie, dana,
                            python_course, flask_lesson, js_course, react_lesson,
                            enroll1, enroll2, enroll3])
        db.session.commit()
        print("✅ Seed data inserted.")

if __name__ == '__main__':
    seed()

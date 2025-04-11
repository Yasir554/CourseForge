from lib.db.courseforge import db
from lib.models.Auth import User  # We're only using the base User model now
from lib.models.courses import Course
from lib.models.Lesson import Lesson
from lib.models.Enrollment import Enrollment
from flask import Flask

# Create a new Flask app instance and configure the database connection.
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///courseforge.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize the database extension with the app
db.init_app(app)

with app.app_context():
    # For development or testing, drop existing tables and recreate them.
    db.drop_all()
    db.create_all()

    # ---- Instructors ----
    instructor1 = User(username="Alice", email="alice@example.com", role="Instructor")
    instructor1.set_password("password123")

    instructor2 = User(username="Bob", email="bob@example.com", role="Instructor")
    instructor2.set_password("secure456")

    db.session.add_all([instructor1, instructor2])
    db.session.commit()

    # ---- Students ----
    student1 = User(username="Charlie", email="charlie@example.com", role="Student")
    student1.set_password("charliepass")

    student2 = User(username="Diana", email="diana@example.com", role="Student")
    student2.set_password("dianapass")

    db.session.add_all([student1, student2])
    db.session.commit()

    # ---- Courses ----
    course1 = Course(title="Python 101", description="Introduction to Python fundamentals", instructor_id=instructor1.id)
    course2 = Course(title="Flask for Beginners", description="Learn how to build web applications using Flask", instructor_id=instructor2.id)

    db.session.add_all([course1, course2])
    db.session.commit()

    # ---- Lessons ----
    lesson1 = Lesson(title="Variables and Data Types", content="Learn about variables, types, and operators in Python.", duration=30, course_id=course1.id)
    lesson2 = Lesson(title="Control Structures", content="Introduction to if statements, loops and more.", duration=45, course_id=course1.id)
    lesson3 = Lesson(title="Setting up Flask", content="Installation and basic configuration of Flask.", duration=40, course_id=course2.id)
    lesson4 = Lesson(title="Building Routes", content="Learn to create routes and build REST endpoints with Flask.", duration=35, course_id=course2.id)

    db.session.add_all([lesson1, lesson2, lesson3, lesson4])
    db.session.commit()

    # ---- Enrollments ----
    enrollment1 = Enrollment(course_id=course1.id, student_id=student1.id, progress=0)
    enrollment2 = Enrollment(course_id=course2.id, student_id=student2.id, progress=0)

    db.session.add_all([enrollment1, enrollment2])
    db.session.commit()

    print(" Seed data has been successfully inserted.")

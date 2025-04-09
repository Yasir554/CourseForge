from flask import Flask, jsonify, request, make_response
from flask_migrate import Migrate
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

from lib.db.courseforge import db

from lib.models.Auth import User, InstructorProfile, StudentProfile
from lib.models.courses import Course
from lib.models.Enrollment import Enrollment
from lib.models.Lesson import Lesson

# Create the Flask application instance
app = Flask(__name__)

# Configure the app with necessary settings
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///courseforge.db"  
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False  

# This Initialize the database by binding it to our app.
db.init_app(app)

# This Handles the Flask-Migrate for database migrations.
migrate = Migrate(app, db)

# This Set up Cross-Origin Resource Sharing so our React frontend can communicate with the backend.
CORS(app)

# Routes
# Home Route
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to CourseForge API"}), 200

# Course Route 
@app.route("/courses", methods=["GET"])
def get_courses():
    # Return a list of all courses.
    courses = Course.query.all()
    return jsonify([course.to_dict() for course in courses]), 200

@app.route("/courses/<int:course_id>", methods=["GET"])
def get_course(course_id):
    # Return a specific course by ID.
    course = Course.query.get_or_404(course_id)
    return jsonify(course.to_dict()), 200

@app.route("/courses", methods=["POST"])
def create_course():
    # Create a new course.
    data = request.get_json()
    new_course = Course(**data)
    db.session.add(new_course)
    db.session.commit()
    return jsonify(new_course.to_dict()), 200

@app.route("/courses/<int:course_id>", methods=["PUT"])
def update_course(course_id):
    # Update an existing course.
    data = request.get_json()
    course = Course.query.get_or_404(course_id)
    for key, value in data.items():
        setattr(course, key, value)
    db.session.commit()
    return jsonify(course.to_dict()), 200

@app.route("/courses/<int:course_id>", methods=["DELETE"])
def delete_course(course_id):
    # Delete a course.
    course = Course.query.get_or_404(course_id)
    db.session.delete(course)
    db.session.commit()
    return jsonify({"message": "Course deleted"}), 200

@app.route("/courses/<int:course_id>/", methods=["Patch"])
def patch_course(course_id):
    # Patch a course.
    data = request.get_json()
    course = Course(**data)
    db.session.add(course)
    db.session.commit()
    return jsonify(course.to_dict()), 200

@app.route("/courses/<int:course_id>/enrollments", methods=["Patch"])
def enroll_student(course_id):
    # """Enroll a student in a course."""
    data = request.get_json()
    enrollment = Enrollment(**data)
    db.session.add(enrollment)
    db.session.commit()
    return jsonify(enrollment.to_dict()), 200

@app.route("/courses/<int:course_id>/enrollments", methods=["DELETE"])
def unenroll_student(course_id):
    # """Unenroll a student from a course."""
    data = request.get_json()
    enrollment = Enrollment(**data)
    db.session.delete(enrollment)
    db.session.commit()
    return jsonify({"message": "Student unenrolled"}), 200

@app.route("/courses/<int:course_id>/lessons", methods=["GET"])
def get_lessons(course_id):
    # Return all lessons for a specific course.
    lessons = Lesson.query.filter_by(course_id=course_id).all()
    return jsonify([lesson.to_dict() for lesson in lessons]), 200



if __name__ == "__main__":
    app.run(port=5555, debug=True)


# Patch, Delete, Get, Post and put 
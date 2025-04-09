from flask import Flask, jsonify, request, make_response, session
from flask_migrate import Migrate
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from functools import wraps

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

# Initialize the database by binding it to our app.
db.init_app(app)

# Handle Flask-Migrate for database migrations.
migrate = Migrate(app, db)

# Set up Cross-Origin Resource Sharing (CORS)
CORS(app)

# Login required decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated_function

# Routes
# Home Route
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to CourseForge API"}), 200

# Auth Routes
@app.route("/auth/register", methods=["POST"])
def register_user():
    data = request.get_json()

    # Basic validation
    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password are required"}), 400

    # Ensure email is unique
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already exists"}), 400

    # Create new user
    new_user = User(**data)
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.to_dict()), 201

@app.route("/auth/login", methods=["POST"])
def login_user():
    data = request.get_json()
    user = User.query.filter_by(email=data.get("email")).first()
    if user and user.check_password(data.get("password")):
        session["user_id"] = user.id
        return jsonify({"message": "Login successful", "user": user.to_dict()}), 200
    return jsonify({"message": "Invalid email or password"}), 401

@app.route("/auth/logout", methods=["DELETE"])
def logout_user():
    session.pop("user_id", None)
    return jsonify({"message": "Logout successful"}), 200

@app.route("/auth/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict()), 200

@app.route("/auth/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.get_json()
    user = User.query.get_or_404(user_id)
    for key, value in data.items():
        setattr(user, key, value)
    db.session.commit()
    return jsonify(user.to_dict()), 200

@app.route("/auth/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}), 200

@app.route("/auth/instructors", methods=["POST"])
def create_instructor_profile():
    data = request.get_json()
    new_profile = InstructorProfile(**data)
    db.session.add(new_profile)
    db.session.commit()
    return jsonify(new_profile.to_dict()), 201

@app.route("/auth/instructors/<int:user_id>", methods=["GET"])
def get_instructor_profile(user_id):
    profile = InstructorProfile.query.filter_by(user_id=user_id).first()
    if profile:
        return jsonify(profile.to_dict()), 200
    return jsonify({"message": "Instructor profile not found"}), 404

@app.route("/auth/students", methods=["POST"])
def create_student_profile():
    data = request.get_json()
    new_profile = StudentProfile(**data)
    db.session.add(new_profile)
    db.session.commit()
    return jsonify(new_profile.to_dict()), 201

@app.route("/auth/students/<int:user_id>", methods=["GET"])
def get_student_profile(user_id):
    profile = StudentProfile.query.filter_by(user_id=user_id).first()
    if profile:
        return jsonify(profile.to_dict()), 200
    return jsonify({"message": "Student profile not found"}), 404

# Instructor Dashboard Route
@app.route("/instructors/<int:user_id>/dashboard", methods=["GET"])
@login_required
def instructor_dashboard(user_id):
    courses = Course.query.filter_by(instructor_id=user_id).all()
    return jsonify([course.to_dict() for course in courses]), 200

# Student Dashboard Route
@app.route("/students/<int:user_id>/dashboard", methods=["GET"])
@login_required
def student_dashboard(user_id):
    enrollments = Enrollment.query.filter_by(student_id=user_id).all()
    courses = [enrollment.course.to_dict() for enrollment in enrollments]
    return jsonify(courses), 200

# Course Routes
@app.route("/courses", methods=["GET"])
def get_courses():
    courses = Course.query.all()
    return jsonify([course.to_dict() for course in courses]), 200

@app.route("/courses/<int:course_id>", methods=["GET"])
def get_course(course_id):
    course = Course.query.get_or_404(course_id)
    return jsonify(course.to_dict()), 200

@app.route("/courses", methods=["POST"])
@login_required
def create_course():
    data = request.get_json()

    # Basic validation
    if not data.get("title") or not data.get("description"):
        return jsonify({"error": "Title and description are required"}), 400

    new_course = Course(**data)
    db.session.add(new_course)
    db.session.commit()
    return jsonify(new_course.to_dict()), 201

@app.route("/courses/<int:course_id>", methods=["PUT"])
@login_required
def update_course(course_id):
    data = request.get_json()
    course = Course.query.get_or_404(course_id)
    for key, value in data.items():
        setattr(course, key, value)
    db.session.commit()
    return jsonify(course.to_dict()), 200

@app.route("/courses/<int:course_id>", methods=["DELETE"])
@login_required
def delete_course(course_id):
    course = Course.query.get_or_404(course_id)
    db.session.delete(course)
    db.session.commit()
    return jsonify({"message": "Course deleted"}), 200

@app.route("/courses/<int:course_id>/enrollments", methods=["POST"])
def enroll_student(course_id):
    data = request.get_json()
    enrollment = Enrollment(course_id=course_id, **data)
    db.session.add(enrollment)
    db.session.commit()
    return jsonify(enrollment.to_dict()), 201

@app.route("/courses/<int:course_id>/enrollments/<int:enrollment_id>", methods=["DELETE"])
def unenroll_student(course_id, enrollment_id):
    enrollment = Enrollment.query.get_or_404(enrollment_id)
    db.session.delete(enrollment)
    db.session.commit()
    return jsonify({"message": "Student unenrolled"}), 200

# Lesson Routes
@app.route("/courses/<int:course_id>/lessons", methods=["GET"])
def get_lessons(course_id):
    lessons = Lesson.query.filter_by(course_id=course_id).all()
    return jsonify([lesson.to_dict() for lesson in lessons]), 200

@app.route("/courses/<int:course_id>/lessons", methods=["POST"])
@login_required
def create_lesson(course_id):
    data = request.get_json()
    new_lesson = Lesson(course_id=course_id, **data)
    db.session.add(new_lesson)
    db.session.commit()
    return jsonify(new_lesson.to_dict()), 201

@app.route("/courses/<int:course_id>/lessons/<int:lesson_id>", methods=["PUT"])
@login_required
def update_lesson(course_id, lesson_id):
    data = request.get_json()
    lesson = Lesson.query.get_or_404(lesson_id)
    for key, value in data.items():
        setattr(lesson, key, value)
    db.session.commit()
    return jsonify(lesson.to_dict()), 200

@app.route("/courses/<int:course_id>/lessons/<int:lesson_id>", methods=["DELETE"])
@login_required
def delete_lesson(course_id, lesson_id):
    lesson = Lesson.query.get_or_404(lesson_id)
    db.session.delete(lesson)
    db.session.commit()
    return jsonify({"message": "Lesson deleted"}), 200

# Add Student by Email to Course
@app.route("/courses/<int:course_id>/add_student", methods=["POST"])
@login_required
def add_student_by_email(course_id):
    data = request.get_json()
    student = User.query.filter_by(email=data["email"]).first()
    if student:
        enrollment = Enrollment(course_id=course_id, student_id=student.id)
        db.session.add(enrollment)
        db.session.commit()
        return jsonify({"message": "Student added successfully"}), 201
    return jsonify({"message": "Student not found"}), 404

if __name__ == "__main__":
    app.run(port=5555, debug=True)
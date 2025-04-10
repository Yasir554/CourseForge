import os
from flask import Flask, jsonify, request, session, redirect, url_for
from flask_migrate import Migrate
from lib.db.courseforge import db
from lib.models.Auth import Instructor, Student
from lib.models.courses import Course
from lib.models.Lesson import Lesson
from lib.models.Enrollment import Enrollment

def create_app():
    app = Flask(__name__)
    
    # --- Configuration ---
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URI", "sqlite:///courseforge.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "super-secret-key")  # For session management
    
    # --- Initialize Extensions ---
    db.init_app(app)
    Migrate(app, db)
    
    @app.route("/")
    def index():
        return jsonify({"message": "Welcome to CourseForge API!"}), 200

    # --- Auth Routes ---
    @app.route("/register", methods=["POST"])
    def register():
        data = request.get_json()
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        role = data.get("role", "Student")

        if role == "Instructor":
            if Instructor.query.filter_by(email=email).first():
                return jsonify({"msg": "Instructor already exists"}), 400
            user = Instructor(username=username, email=email)
        else:
            if Student.query.filter_by(email=email).first():
                return jsonify({"msg": "Student already exists"}), 400
            user = Student(username=username, email=email)

        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        return jsonify({"msg": f"{role} registered successfully"}), 201

    @app.route("/login", methods=["POST"])
    def login():
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        role = data.get("role", "Student")

        if role == "Instructor":
            user = Instructor.query.filter_by(email=email).first()
        else:
            user = Student.query.filter_by(email=email).first()

        if not user or not user.check_password(password):
            return jsonify({"msg": "Invalid email or password"}), 401

        # Store user data in session
        session["user_id"] = user.id
        session["role"] = role

        return jsonify({"msg": f"Logged in as {role}"}), 200

    @app.route("/logout", methods=["POST"])
    def logout():
        session.clear()  # Clear the session data on logout
        return jsonify({"msg": "Logged out successfully"}), 200

    @app.route("/profile", methods=["GET"])
    def profile():
        # Check if user is logged in
        if "user_id" not in session:
            return jsonify({"msg": "Unauthorized"}), 401

        user_id = session["user_id"]
        role = session["role"]

        user = Instructor.query.get(user_id) if role == "Instructor" else Student.query.get(user_id)
        if not user:
            return jsonify({"msg": "User not found"}), 404

        return jsonify(user.to_dict()), 200

    # --- Course Routes ---
    @app.route("/courses", methods=["GET"])
    def get_courses():
        # Check if user is logged in
        if "user_id" not in session:
            return jsonify({"msg": "Unauthorized"}), 401

        courses = Course.query.all()
        return jsonify([course.to_dict() for course in courses]), 200

    @app.route("/courses", methods=["POST"])
    def create_course():
        # Check if user is logged in and is an instructor
        if "user_id" not in session or session["role"] != "Instructor":
            return jsonify({"msg": "Only instructors can create courses"}), 403

        data = request.get_json()
        title = data.get("title")
        description = data.get("description")
        instructor_id = session["user_id"]

        course = Course(title=title, description=description, instructor_id=instructor_id)
        db.session.add(course)
        db.session.commit()
        return jsonify(course.to_dict()), 201

    @app.route("/courses/<int:course_id>", methods=["GET"])
    def get_course(course_id):
        # Check if user is logged in
        if "user_id" not in session:
            return jsonify({"msg": "Unauthorized"}), 401

        course = Course.query.get(course_id)
        if not course:
            return jsonify({"msg": "Course not found"}), 404
        return jsonify(course.to_dict()), 200

    # --- Lesson Routes ---
    @app.route("/courses/<int:course_id>/lessons", methods=["GET"])
    def get_lessons(course_id):
        # Check if user is logged in
        if "user_id" not in session:
            return jsonify({"msg": "Unauthorized"}), 401

        lessons = Lesson.query.filter_by(course_id=course_id).all()
        return jsonify([lesson.to_dict() for lesson in lessons]), 200

    @app.route("/courses/<int:course_id>/lessons", methods=["POST"])
    def create_lesson(course_id):
        # Check if user is logged in and is an instructor
        if "user_id" not in session or session["role"] != "Instructor":
            return jsonify({"msg": "Only instructors can add lessons"}), 403

        data = request.get_json()
        title = data.get("title")
        content = data.get("content")
        duration = data.get("duration")

        lesson = Lesson(title=title, content=content, duration=duration, course_id=course_id)
        db.session.add(lesson)
        db.session.commit()
        return jsonify(lesson.to_dict()), 201

    # --- Enrollment Route ---
    @app.route("/enroll", methods=["POST"])
    def enroll_course():
        # Check if user is logged in and is a student
        if "user_id" not in session or session["role"] != "Student":
            return jsonify({"msg": "Only students can enroll"}), 403

        data = request.get_json()
        student_id = session["user_id"]
        course_id = data.get("course_id")
        progress = data.get("progress", 0)

        if Enrollment.query.filter_by(course_id=course_id, student_id=student_id).first():
            return jsonify({"msg": "Already enrolled"}), 400

        enrollment = Enrollment(course_id=course_id, student_id=student_id, progress=progress)
        db.session.add(enrollment)
        db.session.commit()
        return jsonify(enrollment.to_dict()), 201

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)

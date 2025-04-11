from flask import Flask, request, jsonify, session
from flask_migrate import Migrate
from flask_cors import CORS
from lib.db.courseforge import db
from lib.models.Auth import User, Instructor, Student
from lib.models.courses import Course
from lib.models.Enrollment import Enrollment
from lib.models.Lesson import Lesson

app = Flask(__name__)

# Configure session cookie settings for cross-site use in local development.
app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = False  # Use False for HTTP (local) and True for HTTPS
app.secret_key = "super_secret_key_for_sessions"

# Database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///courseforge.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)
Migrate(app, db)

# Configure CORS to allow requests from your React frontend.
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

# -------------------------
# User Routes
# -------------------------

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to CourseForge API!"}), 200

@app.route("/register", methods=["POST"])
def register_user():
    data = request.get_json()
    role = data.get("role")
    
    if role == "Instructor":
        user = Instructor(username=data["username"], email=data["email"])
    elif role == "Student":
        user = Student(username=data["username"], email=data["email"])
    else:
        return jsonify({"error": "Invalid role"}), 400

    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data["email"]).first()

    if user and user.check_password(data["password"]):
        session["user_id"] = user.id
        # Store role for potential role-based handling.
        session["role"] = "Instructor" if isinstance(user, Instructor) else "Student"
        return jsonify(user.to_dict()), 200

    return jsonify({"error": "Invalid credentials"}), 401

@app.route("/check-auth", methods=["GET"])
def check_auth():
    user_id = session.get("user_id")
    if user_id:
        user = User.query.get(user_id)
        if user:
            return jsonify(user.to_dict()), 200
    return jsonify({"error": "Not authenticated"}), 401

@app.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out"}), 200

@app.route("/me", methods=["GET"])
def get_current_user():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not logged in"}), 401

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user.to_dict()), 200


# -------------------------
# Course Routes
# -------------------------

@app.route("/courses", methods=["GET"])
def get_courses():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    courses = Course.query.all()
    return jsonify([c.to_dict() for c in courses])

@app.route("/courses", methods=["POST"])
def create_course():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    if session.get("role") != "Instructor":
        return jsonify({"error": "Only instructors can create courses"}), 403

    course = Course(
        title=data["title"],
        description=data.get("description"),
        instructor_id=session["user_id"]
    )
    db.session.add(course)
    db.session.commit()
    return jsonify(course.to_dict()), 201

@app.route("/courses/<int:id>", methods=["GET"])
def get_course(id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    course = Course.query.get_or_404(id)
    return jsonify(course.to_dict())

@app.route("/courses/<int:id>", methods=["PUT"])
def update_course(id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    course = Course.query.get_or_404(id)
    course.title = data.get("title", course.title)
    course.description = data.get("description", course.description)
    db.session.commit()
    return jsonify(course.to_dict())

@app.route("/courses/<int:id>", methods=["DELETE"])
def delete_course(id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    course = Course.query.get_or_404(id)
    db.session.delete(course)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 204

# -------------------------
# Enrollment Routes
# -------------------------

@app.route("/enrollments", methods=["POST"])
def enroll_student():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    enrollment = Enrollment(
        course_id=data["course_id"],
        student_id=data["student_id"]
    )
    db.session.add(enrollment)
    db.session.commit()
    return jsonify(enrollment.to_dict()), 201

@app.route("/enrollments/<int:student_id>", methods=["GET"])
def get_enrollments(student_id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    enrollments = Enrollment.query.filter_by(student_id=student_id).all()
    return jsonify([e.to_dict() for e in enrollments])

# -------------------------
# Lesson Routes
# -------------------------

@app.route("/lessons", methods=["POST"])
def create_lesson():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    lesson = Lesson(
        title=data["title"],
        content=data.get("content"),
        duration=data.get("duration"),
        course_id=data["course_id"]
    )
    db.session.add(lesson)
    db.session.commit()
    return jsonify(lesson.to_dict()), 201

@app.route("/lessons/<int:course_id>", methods=["GET"])
def get_lessons(course_id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    lessons = Lesson.query.filter_by(course_id=course_id).all()
    return jsonify([l.to_dict() for l in lessons])

@app.route("/lessons/<int:id>", methods=["PUT"])
def update_lesson(id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    lesson = Lesson.query.get_or_404(id)
    lesson.title = data.get("title", lesson.title)
    lesson.content = data.get("content", lesson.content)
    lesson.duration = data.get("duration", lesson.duration)
    db.session.commit()
    return jsonify(lesson.to_dict())

@app.route("/lessons/<int:id>", methods=["DELETE"])
def delete_lesson(id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    lesson = Lesson.query.get_or_404(id)
    db.session.delete(lesson)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 204

# -------------------------
# Run Server
# -------------------------

if __name__ == "__main__":
    app.run(debug=True)

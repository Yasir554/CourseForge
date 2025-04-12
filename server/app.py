from flask import Flask, request, jsonify, session
from flask_migrate import Migrate
from flask_cors import CORS

from lib.db.courseforge import db
from lib.models.Student import Student
from lib.models.Instructor import Instructor
from lib.models.Courses import Course
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
# Helper Functions
# -------------------------


@app.route("/get_all_students", methods=["GET"])
def get_all_student():
    students = Student.query.all()
    print(students)
    return jsonify([student.to_dict() for student in students]), 200

@app.route("/get_all_instructors", methods=["GET"])
def get_all_instructors():
    instructors = Instructor.query.all()
    print(instructors)
    return jsonify([instructor.to_dict() for instructor in instructors]), 200



def get_current_user():
    user_id = session.get("user_id")
    role = session.get("role")
    if not user_id or not role:
        return None
    if role == "Instructor":
        return Instructor.query.get(user_id)
    elif role == "Student":
        return Student.query.get(user_id)
    return None

# -------------------------
# Home Route
# -------------------------

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to CourseForge API!"}), 200

# -------------------------
# Authentication & Profile Routes
# -------------------------

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
    # Try to find an instructor
    instructor = Instructor.query.filter_by(email=data["email"]).first()
    if instructor and instructor.check_password(data["password"]):
        session["user_id"] = instructor.id
        session["role"] = "Instructor"
        return jsonify(instructor.to_dict()), 200

    # Then try to find a student
    student = Student.query.filter_by(email=data["email"]).first()
    if student and student.check_password(data["password"]):
        session["user_id"] = student.id
        session["role"] = "Student"
        return jsonify(student.to_dict()), 200

    return jsonify({"error": "Invalid credentials"}), 401

@app.route("/check-auth", methods=["GET"])
def check_auth():
    user = get_current_user()
    if user:
        return jsonify(user.to_dict()), 200
    return jsonify({"error": "Not authenticated"}), 401

@app.route("/me", methods=["GET"])
def get_current_user_route():
    user = get_current_user()
    if user:
        return jsonify(user.to_dict()), 200
    return jsonify({"error": "User not found"}), 404

@app.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out"}), 200

@app.route("/profile", methods=["PUT"])
def update_profile():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Not logged in"}), 401

    data = request.get_json()
    user.username = data.get("username", user.username)
    user.email = data.get("email", user.email)
    if "password" in data:
        user.set_password(data["password"])
    db.session.commit()
    return jsonify(user.to_dict()), 200

# -------------------------
# Course Routes
# -------------------------

@app.route("/courses", methods=["GET"])
def get_courses():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    courses = Course.query.all()
    return jsonify([c.to_dict() for c in courses]), 200

@app.route("/courses", methods=["POST"])
def create_course():
    # Only instructors are allowed to create courses.
    if "user_id" not in session or session.get("role") != "Instructor":
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    course = Course(
        title=data["title"],
        description=data.get("description", ""),
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
    return jsonify(course.to_dict()), 200

@app.route("/courses/<int:id>", methods=["PUT"])
def update_course(id):
    if "user_id" not in session or session.get("role") != "Instructor":
        return jsonify({"error": "Unauthorized"}), 401

    course = Course.query.get_or_404(id)
    if course.instructor_id != session["user_id"]:
        return jsonify({"error": "Forbidden: You can only update your own courses"}), 403

    data = request.get_json()
    course.title = data.get("title", course.title)
    course.description = data.get("description", course.description)
    db.session.commit()
    return jsonify(course.to_dict()), 200

@app.route("/courses/<int:id>", methods=["DELETE"])
def delete_course(id):
    if "user_id" not in session or session.get("role") != "Instructor":
        return jsonify({"error": "Unauthorized"}), 401

    course = Course.query.get_or_404(id)
    if course.instructor_id != session["user_id"]:
        return jsonify({"error": "Forbidden: You can only delete your own courses"}), 403

    db.session.delete(course)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 204

# New endpoint: Get all courses for the logged-in instructor.
@app.route("/instructors/me/courses", methods=["GET"])
def get_instructor_courses():
    if "user_id" not in session or session.get("role") != "Instructor":
        return jsonify({"error": "Unauthorized"}), 401
    courses = Course.query.filter_by(instructor_id=session["user_id"]).all()
    return jsonify([course.to_dict() for course in courses]), 200

# New endpoint: Get all courses enrolled by the logged-in student.
@app.route("/students/me/courses", methods=["GET"])
def get_student_courses():
    if "user_id" not in session or session.get("role") != "Student":
        return jsonify({"error": "Unauthorized"}), 401
    student = Student.query.get(session["user_id"])
    courses = student.courses
    return jsonify([course.to_dict() for course in courses]), 200

# New endpoint: For an instructor, get students enrolled in one of their courses.
@app.route("/courses/<int:course_id>/students", methods=["GET"])
def get_course_students(course_id):
    if "user_id" not in session or session.get("role") != "Instructor":
        return jsonify({"error": "Unauthorized"}), 401
    
    course = Course.query.get_or_404(course_id)
    if course.instructor_id != session["user_id"]:
        return jsonify({"error": "Forbidden: You can only view enrollments for your own courses"}), 403
    
    students = course.students
    return jsonify([{'id': s.id, 'username': s.username, 'email': s.email} for s in students]), 200

# -------------------------
# Enrollment Routes
# -------------------------

@app.route("/enrollments", methods=["POST"])
def enroll_student():
    # Only students can enroll themselves
    if "user_id" not in session or session.get("role") != "Student":
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    # Ensure that the enrolling student's ID matches the current session.
    if data.get("student_id") != session["user_id"]:
        return jsonify({"error": "You can only enroll yourself"}), 403

    course = Course.query.get_or_404(data.get("course_id"))
    enrollment = Enrollment(
        course_id=course.id,
        student_id=session["user_id"],
        instructor_id=course.instructor_id  # Automatically assign the course instructor
    )
    db.session.add(enrollment)
    db.session.commit()
    return jsonify(enrollment.to_dict()), 201

@app.route("/enrollments/<int:student_id>", methods=["GET"])
def get_enrollments(student_id):
    # Ensure that students can only fetch their own enrollments.
    if "user_id" not in session or session.get("role") != "Student" or session["user_id"] != student_id:
        return jsonify({"error": "Unauthorized"}), 401

    enrollments = Enrollment.query.filter_by(student_id=student_id).all()
    return jsonify([e.to_dict() for e in enrollments]), 200

# -------------------------
# Lesson Routes
# -------------------------

@app.route("/lessons", methods=["POST"])
def create_lesson():
    # Only instructors can create lessons.
    if "user_id" not in session or session.get("role") != "Instructor":
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    lesson = Lesson(
        title=data["title"],
        content=data.get("content"),
        duration=data.get("duration"),
        course_id=data["course_id"],
        instructor_id=session["user_id"]  # Automatically assign the instructor who is logged in
    )
    db.session.add(lesson)
    db.session.commit()
    return jsonify(lesson.to_dict()), 201

@app.route("/lessons/<int:course_id>", methods=["GET"])
def get_lessons(course_id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    lessons = Lesson.query.filter_by(course_id=course_id).all()
    return jsonify([l.to_dict() for l in lessons]), 200

@app.route("/lessons/<int:id>", methods=["PUT"])
def update_lesson(id):
    # Only instructors can update lessons and only their own lessons.
    if "user_id" not in session or session.get("role") != "Instructor":
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    lesson = Lesson.query.get_or_404(id)
    if lesson.instructor_id != session["user_id"]:
        return jsonify({"error": "Forbidden: You can only update your own lessons"}), 403

    lesson.title = data.get("title", lesson.title)
    lesson.content = data.get("content", lesson.content)
    lesson.duration = data.get("duration", lesson.duration)
    db.session.commit()
    return jsonify(lesson.to_dict()), 200

@app.route("/lessons/<int:id>", methods=["DELETE"])
def delete_lesson(id):
    # Only instructors can delete lessons and only their own lessons.
    if "user_id" not in session or session.get("role") != "Instructor":
        return jsonify({"error": "Unauthorized"}), 401

    lesson = Lesson.query.get_or_404(id)
    if lesson.instructor_id != session["user_id"]:
        return jsonify({"error": "Forbidden: You can only delete your own lessons"}), 403

    db.session.delete(lesson)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 204

# -------------------------
# Run Server
# -------------------------

if __name__ == "__main__":
    app.run(port=5555, debug=True)

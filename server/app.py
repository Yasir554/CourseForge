from flask import Flask, request, jsonify,send_from_directory
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token,
    jwt_required, get_jwt_identity
)

from lib.db.courseforge import db
from lib.models.Student import Student
from lib.models.Instructor import Instructor
from lib.models.Courses import Course
from lib.models.Enrollment import Enrollment
from lib.models.Lesson import Lesson

import traceback

app = Flask(__name__, static_folder="static", static_url_path="")
# Enable CORS for all domains (JWT auth uses headers)
CORS(app,
     supports_credentials=True,
     resources={r"/*": {"origins": "http://localhost:5173"}},
     expose_headers=["Content-Type", "X-CSRFToken", "Authorization"],
     allow_headers=["Content-Type", "X-CSRFToken", "Authorization"])

# JWT configuration
app.config["JWT_SECRET_KEY"] = "super_secret_key_for_jwt"
jwt = JWTManager(app)

# Database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///courseforge.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)
Migrate(app, db)

# -------------------------
# Helper: current identity
# -------------------------

def get_current_identity():
    identity = get_jwt_identity()
    return identity or {}

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
    # Instructor login
    instr = Instructor.query.filter_by(email=data.get("email")).first()
    if instr and instr.check_password(data.get("password")):
        token = create_access_token(identity={"id": instr.id, "role": "Instructor"})
        return jsonify(user=instr.to_dict(), access_token=token), 200
    # Student login
    stud = Student.query.filter_by(email=data.get("email")).first()
    if stud and stud.check_password(data.get("password")):
        token = create_access_token(identity={"id": stud.id, "role": "Student"})
        return jsonify(user=stud.to_dict(), access_token=token), 200
    return jsonify({"error": "Invalid credentials"}), 401

@app.route("/me", methods=["GET"])
@jwt_required()
def get_current_user_route():
    identity = get_jwt_identity()
    user_id, role = identity.get("id"), identity.get("role")
    if role == "Instructor":
        user = Instructor.query.get(user_id)
    else:
        user = Student.query.get(user_id)
    if user:
        return jsonify(user.to_dict()), 200
    return jsonify({"error": "User not found"}), 404

# -------------------------
# Public Data Routes
# -------------------------
@app.route("/get_all_students", methods=["GET"])
@jwt_required()
def get_all_students():
    # any authenticated user
    students = Student.query.all()
    return jsonify([s.to_dict() for s in students]), 200

@app.route("/get_all_instructors", methods=["GET"])
@jwt_required()
def get_all_instructors():
    instructors = Instructor.query.all()
    return jsonify([i.to_dict() for i in instructors]), 200

# -------------------------
# Course Routes
# -------------------------
@app.route('/courses', methods=['GET'])
@jwt_required()
def get_courses():
    courses = Course.query.all()
    return jsonify([c.to_dict() for c in courses]), 200

@app.route('/courses/<int:id>', methods=['GET'])
@jwt_required()
def get_course(id):
    course = Course.query.get_or_404(id)
    return jsonify(course.to_dict()), 200

@app.route("/courses", methods=["POST"])
@jwt_required()
def create_course():
    try:
        data = request.get_json()
        title = data.get("title")
        description = data.get("description")
        student_emails = data.get("students", [])

        if not title or not description:
            return jsonify({"error": "Missing required fields"}), 400

        current_user = get_jwt_identity()
        instructor = Instructor.query.get(current_user.get("id"))

        if not instructor:
            return jsonify({"error": "User not found"}), 404

        course = Course(title=title, description=description, instructor_id=instructor.id)
        db.session.add(course)
        db.session.flush()  # Get course.id before enrollments

        for email in student_emails:
            student = Student.query.filter_by(email=email).first()
            if student:
                enrollment = Enrollment(course_id=course.id, student_id=student.id, instructor_id=instructor.id)
                db.session.add(enrollment)

        db.session.commit()

        return jsonify({
            "id": course.id,
            "title": course.title,
            "description": course.description,
        }), 201

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "An error occurred while creating the course"}), 500


@app.route('/courses/<int:id>', methods=['PUT'])
@jwt_required()
def update_course(id):
    identity = get_jwt_identity()
    if identity.get("role") != "Instructor":
        return jsonify({"error": "Unauthorized"}), 401
    course = Course.query.get_or_404(id)
    if course.instructor_id != identity.get("id"):
        return jsonify({"error": "Forbidden: You can only update your own courses"}), 403
    data = request.get_json()
    course.title = data.get("title", course.title)
    course.description = data.get("description", course.description)
    db.session.commit()
    return jsonify(course.to_dict()), 200

@app.route('/courses/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_course(id):
    identity = get_jwt_identity()
    if identity.get("role") != "Instructor":
        return jsonify({"error": "Unauthorized"}), 401
    course = Course.query.get_or_404(id)
    if course.instructor_id != identity.get("id"):
        return jsonify({"error": "Forbidden: You can only delete your own courses"}), 403
    db.session.delete(course)
    db.session.commit()
    return '', 204

@app.route('/instructors/me/courses', methods=['GET'])
@jwt_required()
def get_instructor_courses():
    identity = get_jwt_identity()
    if identity.get("role") != "Instructor":
        return jsonify({"error": "Unauthorized"}), 401
    courses = Course.query.filter_by(instructor_id=identity.get("id")).all()
    return jsonify([c.to_dict() for c in courses]), 200

@app.route('/students/me/courses', methods=['GET'])
@jwt_required()
def get_student_courses():
    identity = get_jwt_identity()
    if identity.get("role") != "Student":
        return jsonify({"error": "Unauthorized"}), 401
    student = Student.query.get(identity.get("id"))
    courses = student.courses
    return jsonify([c.to_dict() for c in courses]), 200

@app.route('/courses/<int:course_id>/students', methods=['GET'])
@jwt_required()
def get_course_students(course_id):
    identity = get_jwt_identity()
    if identity.get("role") != "Instructor":
        return jsonify({"error": "Unauthorized"}), 401
    course = Course.query.get_or_404(course_id)
    if course.instructor_id != identity.get("id"):
        return jsonify({"error": "Forbidden: You can only view enrollments for your own courses"}), 403
    students = course.students
    return jsonify([{'id': s.id, 'username': s.username, 'email': s.email} for s in students]), 200

# -------------------------
# Enrollment Routes
# -------------------------
@app.route('/enrollments', methods=['POST'])
@jwt_required()
def enroll_student():
    identity = get_jwt_identity()
    if identity.get("role") != "Student":
        return jsonify({"error": "Unauthorized"}), 401
    data = request.get_json()
    if data.get("student_id") != identity.get("id"):
        return jsonify({"error": "You can only enroll yourself"}), 403
    course = Course.query.get_or_404(data.get("course_id"))
    enrollment = Enrollment(course_id=course.id, student_id=identity.get("id"), instructor_id=course.instructor_id)
    db.session.add(enrollment)
    db.session.commit()
    return jsonify(enrollment.to_dict()), 201

@app.route('/enrollments/<int:student_id>', methods=['GET'])
@jwt_required()
def get_enrollments(student_id):
    identity = get_jwt_identity()
    if identity.get("role") != "Student" or identity.get("id") != student_id:
        return jsonify({"error": "Unauthorized"}), 401
    enrollments = Enrollment.query.filter_by(student_id=student_id).all()
    return jsonify([e.to_dict() for e in enrollments]), 200

# -------------------------
# Lesson Routes
# -------------------------
@app.route('/lessons/<int:lesson_id>', methods=['GET'])
@jwt_required()
def get_lesson(lesson_id):
    lesson = Lesson.query.get_or_404(lesson_id)
    return jsonify(lesson.to_dict()), 200

@app.route('/courses/<int:course_id>/lessons', methods=['GET'])
@jwt_required()
def get_lessons(course_id):
    lessons = Lesson.query.filter_by(course_id=course_id).all()
    return jsonify([l.to_dict() for l in lessons]), 200

@app.route('/lessons', methods=['POST'])
@jwt_required()
def create_lesson():
    identity = get_jwt_identity()
    if identity.get("role") != "Instructor":
        return jsonify({"error": "Unauthorized"}), 401
    data = request.get_json()
    lesson = Lesson(
        title=data["title"],
        content=data.get("content"),
        duration=data.get("duration"),
        course_id=data["course_id"],
        instructor_id=identity.get("id")
    )
    db.session.add(lesson)
    db.session.commit()
    return jsonify(lesson.to_dict()), 201

@app.route('/lessons/<int:id>', methods=['PUT'])
@jwt_required()
def update_lesson(id):
    identity = get_jwt_identity()
    if identity.get("role") != "Instructor":
        return jsonify({"error": "Unauthorized"}), 401
    lesson = Lesson.query.get_or_404(id)
    if lesson.instructor_id != identity.get("id"):
        return jsonify({"error": "Forbidden: You can only update your own lessons"}), 403
    data = request.get_json()
    lesson.title = data.get("title", lesson.title)
    lesson.content = data.get("content", lesson.content)
    lesson.duration = data.get("duration", lesson.duration)
    db.session.commit()
    return jsonify(lesson.to_dict()), 200

@app.route('/lessons/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_lesson(id):
    identity = get_jwt_identity()
    if identity.get("role") != "Instructor":
        return jsonify({"error": "Unauthorized"}), 401
    lesson = Lesson.query.get_or_404(id)
    if lesson.instructor_id != identity.get("id"):
        return jsonify({"error": "Forbidden: You can only delete your own lessons"}), 403
    db.session.delete(lesson)
    db.session.commit()
    return '', 204


@app.errorhandler(404)
def not_found(e):
    return send_from_directory("static", "index.html")

# -------------------------
# Run Server
# -------------------------
if __name__ == "__main__":
    app.run(port=5000, debug=True)

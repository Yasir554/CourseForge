from app import app
from lib.db.courseforge import db
from lib.models.Instructor import Instructor
from lib.models.Student import Student
from lib.models.Courses import Course
from lib.models.Lesson import Lesson
from lib.models.Enrollment import Enrollment
from datetime import datetime, timedelta
import random

# Reset DB
with app.app_context():
    print("🧹 Clearing db...")
    db.session.query(Enrollment).delete()
    db.session.query(Lesson).delete()
    db.session.query(Course).delete()
    db.session.query(Student).delete()
    db.session.query(Instructor).delete()
    db.session.commit()

    print("👨‍🏫 Seeding instructors...")
    instructors = []
    for i in range(1, 6):
        instructor = Instructor(
            username=f"instructor{i}",
            email=f"instructor{i}@example.com",
        )
        instructor.set_password("password123")
        instructors.append(instructor)
        db.session.add(instructor)
    db.session.commit()

    print("🎓 Seeding students...")
    students = []
    for i in range(1, 21):
        student = Student(
            username=f"student{i}",
            email=f"student{i}@example.com",
        )
        student.set_password("password123")
        students.append(student)
        db.session.add(student)
    db.session.commit()

    print("📚 Seeding courses...")
    courses = []
    for i in range(1, 6):
        course = Course(
            title=f"Course {i}",
            description=f"This is the description for Course {i}",
            instructor_id=random.choice(instructors).id
        )
        courses.append(course)
        db.session.add(course)
    db.session.commit()

    print("📖 Seeding lessons...")
    for course in courses:
        db.session.flush()  # Make sure course.instructor_id is updated in the DB
        for j in range(random.randint(3, 6)):
            lesson = Lesson(
                title=f"Lesson {j+1} for {course.title}",
                content=f"Content for Lesson {j+1} in {course.title}",
                course_id=course.id,
                instructor_id=course.instructor_id  # Now this won't be None
            )
            db.session.add(lesson)
    db.session.commit()

    print("📝 Seeding enrollments...")
    for student in students:
        # Enroll each student in 1 to 3 random courses
        selected_courses = random.sample(courses, k=random.randint(1, 3))
        for course in selected_courses:
            enrollment = Enrollment(
                course_id=course.id,
                student_id=student.id,
                instructor_id=course.instructor_id,  # ✅ Assign the course's instructor
                enrolled_on=datetime.now()
            )       

            db.session.add(enrollment)
    db.session.commit()

    print("✅ Done seeding everything!")

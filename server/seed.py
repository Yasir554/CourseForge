from app import db, app
from models import User, Course, Enrollment, Review
from datetime import datetime

def seed_data():
    # Clear existing data
    db.drop_all()
    db.create_all()
    
    # Create sample users
    student1 = User(username="student1", email="student1@example.com", password="password123", role="student")
    student2 = User(username="student2", email="student2@example.com", password="password123", role="student")
    instructor1 = User(username="instructor1", email="instructor1@example.com", password="password123", role="instructor")
    
    # Create sample courses
    course1 = Course(
        title="Python Programming",
        description="Learn Python from scratch",
        instructor_id=3,  # instructor1
        price=99.99,
        duration="8 weeks"
    )
    
    course2 = Course(
        title="Web Development",
        description="Full stack web development course",
        instructor_id=3,  # instructor1
        price=149.99,
        duration="12 weeks"
    )
    
    # Create enrollments
    enrollment1 = Enrollment(
        student_id=1,  # student1
        course_id=1,   # Python course
        enrollment_date=datetime.now()
    )
    
    enrollment2 = Enrollment(
        student_id=2,  # student2
        course_id=1,   # Python course
        enrollment_date=datetime.now()
    )
    
    # Create reviews
    review1 = Review(
        student_id=1,  # student1
        course_id=1,   # Python course
        rating=5,
        comment="Great course!",
        review_date=datetime.now()
    )
    
    review2 = Review(
        student_id=2,  # student2
        course_id=1,   # Python course
        rating=4,
        comment="Very informative",
        review_date=datetime.now()
    )
    
    # Add all objects to database session
    db.session.add_all([
        student1, student2, instructor1,
        course1, course2,
        enrollment1, enrollment2,
        review1, review2
    ])
    
    # Commit changes
    try:
        db.session.commit()
        print("Database seeded successfully!")
    except Exception as e:
        db.session.rollback()
        print(f"Error seeding database: {e}")

if __name__ == "__main__":
    with app.app_context():
        seed_data()
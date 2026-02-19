import React from 'react'
import CourseCard from "../components/CourseCard"

export const coursesJson = [
  {
    "id": "C001",
    "title": "Full Stack Web Development",
    "description": "Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB to build real-world full stack applications from scratch.",
    "image": "https://example.com/images/fullstack.jpg"
  },
  {
    "id": "C002",
    "title": "Data Science & Machine Learning",
    "description": "Master Python, NumPy, Pandas, Matplotlib, and Machine Learning algorithms to analyze data and build predictive models.",
    "image": "https://example.com/images/datascience.jpg"
  },
  {
    "id": "C003",
    "title": "DevOps Bootcamp",
    "description": "Understand CI/CD pipelines, Docker, Kubernetes, AWS, and automation tools to deploy scalable applications.",
    "image": "https://example.com/images/devops.jpg"
  },
  {
    "id": "C004",
    "title": "UI/UX Design Fundamentals",
    "description": "Learn Figma, design principles, wireframing, prototyping, and user research to create modern user experiences.",
    "image": "https://example.com/images/uiux.jpg"
  },
  {
    "id": "C005",
    "title": "Hotel Management System Development",
    "description": "Build a complete hotel management project including booking system, payment integration, and admin dashboard.",
    "image": "https://example.com/images/hotel.jpg"
  },
  {
    "id": "C006",
    "title": "Placement Preparation Aptitude",
    "description": "Prepare for campus placements with quantitative aptitude, reasoning, verbal ability, and coding practice questions.",
    "image": "https://example.com/images/aptitude.jpg"
  }
]

const Courses = () => {
  return (
    <div className="bg-gray-100 pt-14">
      <div className='min-h-screen max-w-7xl mx-auto py-10'>
        <div className='px-4'>
          <h1 className='text-4xl font-bold text-center text-gray-800 mb-4'>Our Courses</h1>
          <p className='text-center text-gray-600 mb-12'>Explore our curated courses to boost your skills.</p>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {
              coursesJson.map((course) => (
                <CourseCard key={course.id} course={course}/>
              )) 
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Courses;
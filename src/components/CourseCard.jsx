import React from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button' 

const CourseCard = ({ course }) => {
  return (
    <Card className="bg-white shadow-lg overflow-hidden">
      <img src={course.image} alt={course.title} className='w-full h-48 object-cover'/>
      <div className='p-6'>
        <h2 className='text-xl font-semibold text-gray-800 mb-3'>{course.title}</h2>
        <p className='text-gray-600 mb-4 line-clamp-2'>{course.description}</p>
        <Button className="w-full">Learn More</Button>
      </div>
    </Card>
  )
}

export default CourseCard
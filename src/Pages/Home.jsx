// Home.jsx

import React from "react";
import { Button } from "@/components/ui/button"; 
import { coursesJson } from "../Pages/Courses"; 
import Hero from '@/components/Hero'
import CourseCard from "../components/CourseCard" 

const Home = () => {
  return (
    <div>
      <Hero />
      <div className="py-10">
        <h1 className='text-4xl font-bold text-center text-gray-800 mb-4'>Our Courses</h1>
        <p className='text-center text-gray-600 mb-12'>
          Explore our curated courses to boost your skills.
        </p>
        
        <div className='max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {
            coursesJson?.slice(0, 6).map((course) => { 
              return <CourseCard key={course.id} course={course} />
            })
          }
        </div>
      </div>
      {/* Removed the extra </div> that was here */}
    </div>
  );
};

export default Home;
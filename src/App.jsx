import { Button } from "./components/ui/button"; 
import React from 'react';
import Navbar from "./components/ui/Navbar";     
import Hero from "./components/Hero";             
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from "./Pages/Home";
import Courses from "./Pages/Courses";
import Login from "./Pages/auth/Login";
import Signup from "./Pages/auth/Signup";
import Footer from "./components/Footer";
import Profile from "./Pages/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Hero /> 
        <Home />
      </>
    ),
  },
  {
    path: "/courses",
    element: <><Navbar /><Courses /></>
  },
  {
    path: "/login",
    element: <><Navbar /><Login /></>
  },
  {
    path: "/signup",
    element: <><Navbar /><Signup /></>
  },
  {
    path: "/profile",
    element: <><Navbar /><Profile /></>
  },
]);

const App = () => {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <RouterProvider router={router} />
      </div>
      <Footer />
    </main>
  );
};

export default App;
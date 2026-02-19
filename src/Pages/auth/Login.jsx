import React, { useState } from 'react';
import Label from "/src/components/ui/Label"; 
import { Input } from "/src/components/ui/input";
import { Button } from "/src/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner'; 
import { useDispatch } from 'react-redux';
import { setUser } from "../../redux/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "" 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(Input)
    if(!input.role) return toast.error("Please select a role");

    setLoading(true);
    try {
      // Change this line:
const response = await axios.post('http://localhost:3000/api/v1/user/login', input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });

      if (response.data.success) {
        toast.success(response.data.message || "Login successful!");
        dispatch(setUser(response.data.user));
        navigate('/');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Invalid credentials";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='bg-white shadow-lg rounded-lg p-8 max-w-md w-full'>
        <h1 className='text-2xl font-bold text-center mb-4'>Welcome Back</h1>
        
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className='mb-4 space-y-1'>
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="sagar@gmail.com" 
              value={input.email} 
              onChange={handleChange} 
              required 
            />
          </div>

          {/* Password Field */}
          <div className='mb-4 space-y-1'>
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              value={input.password} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          {/* Role Selection */}
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center space-x-2'>
                <input 
                  type="radio" 
                  name="role" 
                  value="student" 
                  checked={input.role === 'student'} 
                  onChange={handleChange} 
                  className='cursor-pointer'
                />
                <Label>Student</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <input 
                type="radio" 
                name="role" 
                value="instructor" // Change this from 'recruiter' to 'instructor'
                checked={input.role === 'instructor'} 
                onChange={handleChange} 
              />
              <Label>Instructor</Label>
          </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className="text-center mt-4 text-sm">
          Don't have an account? <Link to="/signup" className='text-blue-500 hover:underline'>Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
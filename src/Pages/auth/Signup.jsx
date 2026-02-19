import React, { useState } from 'react';
import Label from "/src/components/ui/label";
import { Input } from "/src/components/ui/input";
import { Button } from "/src/components/ui/button";
import { RadioGroup, RadioGroupItem } from "/src/components/ui/radio-group";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // State must match the backend controller keys exactly
  const [user, setUser] = useState({
    name: "",      
    email: "",
    password: "",
    role: "student" // Default value
  });

  // Handler for text inputs (name, email, password)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // THE MISSING FUNCTION: Handler for the RadioGroup value change
  const handleRoleChange = (value) => {
    setUser((prev) => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
const response = await axios.post('http://localhost:3000/api/v1/user/register', user, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/login');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration failed";
      toast.error(errorMsg);
      console.log("Backend Error Details:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='bg-white shadow-lg rounded-lg p-8 max-w-md w-full'>
        <h1 className='text-2xl font-bold text-center mb-4'>Create Account</h1>
        
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className='mb-4 space-y-2'>
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="Sagar Solanki" 
              value={user.name} 
              onChange={handleChange} 
              required 
            />
          </div>

          {/* Email */}
          <div className='mb-4 space-y-2'>
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="sagar@gmail.com" 
              value={user.email} 
              onChange={handleChange} 
              required 
            />
          </div>

          {/* Password */}
          <div className='mb-4 space-y-2'>
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              value={user.password} 
              onChange={handleChange} 
              required 
            />
          </div>

          {/* Role Selection - This uses handleRoleChange */}
          <div className='mb-6'>
            <Label className="mb-2 block">Role:</Label>
            <RadioGroup 
              defaultValue={user.role} 
              onValueChange={handleRoleChange} 
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="student" id="r1" />
                <Label htmlFor="r1" className="cursor-pointer">Student</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="instructor" id="r2" />
                <Label htmlFor="r2" className="cursor-pointer">Instructor</Label>
              </div>
            </RadioGroup>
          </div>

          <Button disabled={loading} type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
            {loading ? "Registering..." : "Signup"}
          </Button>
        </form>
        
        <p className="text-center mt-4 text-sm">
          Already have an account? <Link to="/login" className='text-blue-500 hover:underline'>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
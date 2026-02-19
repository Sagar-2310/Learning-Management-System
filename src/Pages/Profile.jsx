import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner'; 
import UserLogo from '../assets/user.png'; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label"; 
import { Loader2 } from 'lucide-react'; 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

// IMPORTANT: Ensure this path matches your actual Redux slice location
import { setUser } from '@/redux/authSlice'; 

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Get user from Redux store
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  // Local state for the form
  const [input, setInput] = useState({
    name: user?.name || "",
    description: user?.description || "",
    file: user?.profilePhoto || ""
  });

  // Handle text input changes
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Handle file input changes
  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  // Submit form data to backend
  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/v1/user/profile/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      if (res.data.success) {
        // SUCCESS: Update Redux Store so the UI updates globally
        dispatch(setUser(res.data.user)); 
        toast.success(res.data.message);
        setOpen(false); 
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mt-14 bg-gray-100 py-12 px-4 lg:px-0'>
      <div className='max-w-6xl mx-auto p-8 bg-white shadow-xl rounded-2xl'>
        <div className='flex flex-col items-center md:flex-row md:items-start space-y-8 md:space-y-0 md:space-x-12'>
          
          {/* Avatar Section */}
          <div className='w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg'>
            <img 
              src={user?.profilePhoto || UserLogo} 
              alt="User Profile" 
              className='w-full h-full object-cover' 
            />
          </div>

          {/* User Info Section */}
          <div className='text-center md:text-left flex-1'>
            <h1 className='text-4xl font-bold text-blue-500'>
              Welcome, {user?.name ? user.name.split(" ")[0] : "User"}
            </h1>
            
            <div className='mt-4 space-y-2'>
                <p className='text-lg text-gray-600'><span className='font-bold'>Email :</span> {user?.email || "N/A"}</p>
                <p className='text-gray-600 capitalize'><span className='font-bold'>Role :</span> {user?.role || "User"}</p>
                <p className='text-gray-700 text-base leading-relaxed'>
                  <span className='font-bold'>Bio: </span>
                  {user?.description || "Add Your Bio"}
                </p>
            </div>
            
            {/* Edit Profile Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className='bg-blue-500 mt-6 hover:bg-blue-600'>Edit Profile</Button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
                <form onSubmit={submitHandler}>
                    <DialogHeader>
                      <DialogTitle className="text-center">Edit Profile</DialogTitle>
                      <DialogDescription className="text-center">
                        Update your information and profile picture.
                      </DialogDescription>
                    </DialogHeader>

                    <div className='grid gap-4 py-4'>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input 
                          id="name" 
                          name="name"
                          value={input.name}
                          onChange={changeEventHandler}
                          className="col-span-3" 
                        />
                      </div>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor="description" className="text-right">Bio</Label>
                        <Input 
                          id="description" 
                          name="description" 
                          value={input.description}
                          onChange={changeEventHandler}
                          className="col-span-3" 
                        />
                      </div>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor="file" className="text-right">Picture</Label>
                        <Input 
                          id="file" 
                          type="file" 
                          accept="image/*" 
                          onChange={fileChangeHandler}
                          className="col-span-3" 
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      {loading ? (
                        <Button className="w-full bg-blue-500">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                        </Button>
                      ) : (
                        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                          Save Changes
                        </Button>
                      )}
                    </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
import React from 'react';
import { GraduationCap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; 
import axios from 'axios'; 
import { setUser } from '@/redux/authSlice'; 
import { toast } from 'sonner';

const Navbar = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    
    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/v1/user/logout', { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Logout failed");
        } 
    };

    return (
        <div className='bg-gray-900 z-50 w-full py-3 fixed top-0 border-b border-gray-800'>
            <div className='max-w-7xl mx-auto px-4 flex justify-between items-center'>
                <Link to='/'>
                    <div className='flex items-center gap-2 cursor-pointer'>
                        <GraduationCap className='text-blue-500 w-10 h-10'/>
                        <h1 className="text-gray-100 text-3xl font-bold tracking-tight">Logo</h1>
                    </div>
                </Link>

                <nav>
                    <ul className='flex gap-8 text-lg items-center font-medium text-gray-300'>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/courses">Courses</Link></li>

                        {!user ? (
                            <div className='flex gap-3 ml-4'>
                                <Link to="/login"><Button className="bg-blue-500 hover:bg-blue-600">Login</Button></Link>
                                <Link to="/signup"><Button className="bg-gray-600 hover:bg-gray-700">Signup</Button></Link>
                            </div>
                        ) : (
                            <div className='flex items-center gap-4 ml-4'>
                                <Link to="/profile">
                                    <Avatar className="h-9 w-9 border border-gray-700">
                                        <AvatarImage src={user?.profilePhoto || "https://github.com/maxleiter.png"} alt="User" />
                                        <AvatarFallback>{user?.fullname?.charAt(0) || "U"}</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <Button onClick={logoutHandler} variant="destructive" size="sm" className="h-9">Logout</Button>
                            </div>
                        )}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Navbar;
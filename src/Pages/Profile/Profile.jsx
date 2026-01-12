import React from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../Hooks/useAuth';
import { Mail, Phone, Calendar, ShoppingBag, CheckCircle, XCircle, Clock, CalendarDays } from 'lucide-react';
import { Link } from 'react-router';

const Profile = () => {
    const { user,loading} = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: profileData={}  } = useQuery({
        queryKey: ['profileData', user?.email],
        enabled: !!user?.email ,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user?.email}`);
            return res.data;
        }
    });
    console.log(profileData);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <span className="loading loading-spinner loading-lg text-pink-500"></span>
            </div>
        );
    }

    const {
        phone,
        createdAt,
        bookings = [] 
    } = profileData;

    const totalBookings = bookings.length;
    const activeBookings = bookings.filter(b => b.status === 'active' || b.status === 'pending').length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const canceledBookings = bookings.filter(b => b.status === 'canceled').length;

    const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString('en-US') : new Date().toLocaleDateString('en-US');

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            
            {/*  Cover Image Section */}
            <div className="h-60 w-full overflow-hidden relative">
                <img 
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                    alt="Cover" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30"></div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
                
                {/*Profile Info Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                    {/* Avatar */}
                    <div className="relative">
                        <img 
                            src={user?.photoURL || "https://i.ibb.co/T0x00q2/user-placeholder.png"} 
                            alt="Profile" 
                            className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md object-cover"
                        />
                    </div>

                    {/* User Details */}
                    <div className="flex-1 text-center md:text-left mt-2">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{user?.displayName?.toUpperCase()}</h2>
                        <p className="text-gray-500 font-medium mb-4">Member since {formattedDate}</p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-pink-500" />
                                <span>{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-pink-500" />
                                <span>{phone || "+880 1XXX-XXXXXX"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4 text-pink-500" />
                                <span>{totalBookings} Total Bookings</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/*Stats Grid*/}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard 
                        title="Total Booking" 
                        count={totalBookings} 
                        icon={<CalendarDays className="text-pink-500" />} 
                        border="border-pink-100"
                    />
                    <StatCard 
                        title="Active" 
                        count={activeBookings} 
                        icon={<Clock className="text-green-500" />} 
                        border="border-green-100"
                    />
                    <StatCard 
                        title="Completed" 
                        count={completedBookings} 
                        icon={<CheckCircle className="text-blue-500" />} 
                        border="border-blue-100"
                    />
                    <StatCard 
                        title="Canceled" 
                        count={canceledBookings} 
                        icon={<XCircle className="text-red-500" />} 
                        border="border-red-100"
                    />
                </div>

                {/* Bookings Content Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 min-h-[300px] flex flex-col items-center justify-center text-center">
                    
                    {bookings.length > 0 ? (
                        <div className="w-full text-left">
                           <h3 className="text-xl font-bold mb-4">Your Recent Bookings</h3>
                           
                           <p className="text-gray-500">List of bookings will appear here...</p>
                        </div>
                    ) : (
                        // Empty State (Exactly like the image)
                        <>
                            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                                <Calendar className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Bookings Yet</h3>
                            <p className="text-gray-500 mb-6 max-w-sm">
                                Start exploring restaurants and make your first reservation!
                            </p>
                            <Link to="/our-menu">
                                <button className="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg">
                                    Browse Restaurants
                                </button>
                            </Link>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};


const StatCard = ({ title, count, icon, border }) => {
    return (
        <div className={`bg-white p-5 rounded-xl border ${border} shadow-sm flex items-center justify-between`}>
            <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">{title}</p>
                <h4 className="text-2xl font-bold text-gray-800">{count}</h4>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
                {icon}
            </div>
        </div>
    );
};

export default Profile;
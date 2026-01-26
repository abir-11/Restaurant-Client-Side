import React from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../Hooks/useAuth';
import { 
  Mail, Phone, Calendar, ShoppingBag, CheckCircle, 
  XCircle, Clock, CalendarDays, MapPin, Users, 
  DollarSign, ChevronRight, Check, X, Clock3
} from 'lucide-react';
import { Link } from 'react-router';
import Swal from 'sweetalert2';
import { format } from 'date-fns';

const Profile = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();

    // 1. Fetch user profile data
    const { data: profileData = {} } = useQuery({
        queryKey: ['profileData', user?.email],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user?.email}`);
            return res.data;
        }
    });

    // 2. Fetch user's bookings using customerEmail
    const { data: bookings = [], isLoading: bookingsLoading, refetch } = useQuery({
        queryKey: ['userBookings', user?.email],
        // loading false হলে এবং user.email থাকলেই কেবল কল হবে
        enabled: !loading && !!user?.email, 
        queryFn: async () => {
            const res = await axiosSecure.get(`/bookTable?customerEmail=${user?.email}`);
            return res.data;
        }
    });
    console.log(bookings);

    // 3. Cancel booking function
    const handleCancelBooking = async (bookingId) => {
        Swal.fire({
            title: 'Cancel Booking?',
            text: "Are you sure you want to cancel this booking?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'No, keep it'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.delete(`/bookTable/${bookingId}`);
                    if (res.data.deletedCount > 0) {
                        refetch();
                        Swal.fire(
                            'Cancelled!',
                            'Your booking has been cancelled.',
                            'success'
                        );
                    }
                } catch (error) {
                    Swal.fire('Error!', 'Failed to cancel booking.', 'error');
                }
            }
        });
    };

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return format(new Date(dateString), 'dd MMM yyyy');
    };

    // Format time helper
    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        try {
            const [hours, minutes] = timeString.split(':');
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 || 12;
            return `${displayHour}:${minutes} ${ampm}`;
        } catch {
            return timeString;
        }
    };

    // Calculate stats safely
    const totalBookings = bookings?.length || 0;
    const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0;
    const confirmedBookings = bookings?.filter(b => b.status === 'confirmed' || b.status === 'active').length || 0;
    const cancelledBookings = bookings?.filter(b => b.status === 'cancelled' || b.status === 'rejected').length || 0;

    // Get recent bookings (last 5)
    const recentBookings = bookings ? bookings.slice(0, 5) : [];

    if (loading || bookingsLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <span className="loading loading-spinner loading-lg text-pink-500"></span>
            </div>
        );
    }

    const { phone, createdAt } = profileData;
    const formattedJoinDate = createdAt ? formatDate(createdAt) : formatDate(new Date());

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans pb-20">
            
            {/* Cover Section */}
            <div className="relative h-72 w-full overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
                    alt="Cover" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                <div className="absolute bottom-10 left-0 right-0 text-center text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">My Profile</h1>
                    <p className="text-lg opacity-90">Manage your bookings and profile</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
                
                {/* Profile Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-10 border border-gray-200">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-40 h-40 rounded-full border-8 border-white shadow-2xl overflow-hidden">
                            <img 
                                src={user?.photoURL || "https://i.ibb.co/T0x00q2/user-placeholder.png"} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-3 rounded-full shadow-lg">
                            <Check size={20} />
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 text-center lg:text-left">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                    {user?.displayName || 'User'}
                                </h2>
                                <div className="flex items-center justify-center lg:justify-start gap-3 text-gray-600 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={16} />
                                        <span>Joined {formattedJoinDate}</span>
                                    </div>
                                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                    <div className="flex items-center gap-1">
                                        <ShoppingBag size={16} />
                                        <span>{totalBookings} Bookings</span>
                                    </div>
                                </div>
                            </div>
                            
                            <Link to="/book-table">
                                <button className="px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                                    <Calendar size={20} />
                                    Book New Table
                                </button>
                            </Link>
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-pink-100 rounded-lg">
                                        <Mail size={20} className="text-pink-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-semibold truncate max-w-[150px]" title={user?.email}>{user?.email}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Phone size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="font-semibold">{phone || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <ShoppingBag size={20} className="text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Spend</p>
                                        <p className="font-semibold">
                                            ${bookings.reduce((sum, b) => sum + (parseFloat(b.totalEstimatedPrice) || 0), 0).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard 
                        title="Total Bookings" 
                        count={totalBookings} 
                        icon={<CalendarDays className="text-pink-600" size={24} />} 
                        color="pink"
                    />
                    <StatCard 
                        title="Pending" 
                        count={pendingBookings} 
                        icon={<Clock3 className="text-yellow-600" size={24} />} 
                        color="yellow"
                    />
                    <StatCard 
                        title="Confirmed" 
                        count={confirmedBookings} 
                        icon={<CheckCircle className="text-green-600" size={24} />} 
                        color="green"
                    />
                    <StatCard 
                        title="Cancelled" 
                        count={cancelledBookings} 
                        icon={<XCircle className="text-red-600" size={24} />} 
                        color="red"
                    />
                </div>

                {/* Bookings Section */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="p-8 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-bold text-gray-900">My Bookings</h3>
                            <span className="text-gray-500">
                                {totalBookings} booking{totalBookings !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>

                    <div className="p-6">
                        {bookings.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Calendar className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Bookings Yet</h3>
                                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                    You haven't made any reservations yet. Explore our restaurants and book your first table!
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link to="/restaurants">
                                        <button className="px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl">
                                            Browse Restaurants
                                        </button>
                                    </Link>
                                    <Link to="/book-table">
                                        <button className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition-all border border-gray-300">
                                            Book a Table
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {recentBookings.map((booking) => (
                                    <div 
                                        key={booking._id} 
                                        className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow bg-white"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h4 className="text-xl font-bold text-gray-900">
                                                        {booking.restaurantName || "Restaurant Name"}
                                                    </h4>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                                                        booking.status === 'confirmed' || booking.status === 'active' 
                                                            ? 'bg-green-100 text-green-800'
                                                            : booking.status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : booking.status === 'cancelled'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={16} />
                                                        <span>{formatDate(booking.date)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={16} />
                                                        <span>{formatTime(booking.time)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Users size={16} />
                                                        <span>{booking.partySize} guests</span>
                                                    </div>
                                                    {booking.location && (
                                                        <div className="flex items-center gap-2">
                                                            <MapPin size={16} />
                                                            <span>{booking.location}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-500">Total Amount</p>
                                                    <p className="text-2xl font-bold text-gray-900 flex items-center gap-1">
                                                        <DollarSign size={20} className="text-green-600" />
                                                        {parseFloat(booking.totalEstimatedPrice || 0).toFixed(2)}
                                                    </p>
                                                </div>
                                                
                                                <div className="flex gap-2">
                                                    {/* Details Button - Optional if you have details page */}
                                                    {/* <Link 
                                                        to={`/booking-details/${booking._id}`}
                                                        className="p-2 text-gray-500 hover:text-pink-600 transition-colors"
                                                    >
                                                        <ChevronRight size={20} />
                                                    </Link> */}
                                                    
                                                    {booking.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleCancelBooking(booking._id)}
                                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-gray-50 rounded-full hover:bg-red-50"
                                                            title="Cancel Booking"
                                                        >
                                                            <X size={20} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Pre-order Items */}
                                        {booking.preOrderMenu && booking.preOrderMenu.length > 0 && (
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <p className="text-sm font-semibold text-gray-700 mb-2">Pre-ordered Items:</p>
                                                <div className="flex flex-wrap gap-3">
                                                    {booking.preOrderMenu.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                                                            {item.image && (
                                                                <img 
                                                                    src={item.image} 
                                                                    alt={item.title} 
                                                                    className="w-8 h-8 rounded object-cover"
                                                                />
                                                            )}
                                                            <span className="text-sm font-medium">{item.title}</span>
                                                            <span className="text-xs text-gray-500">${item.price}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                            <div className="text-sm text-gray-500">
                                                Booking ID: <span className="font-mono text-gray-400">{booking._id?.substring(0, 8)}...</span>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Table Type: <span className="font-semibold text-gray-700">{booking.tableType || "Standard"}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                                {bookings.length > 5 && (
                                    <div className="text-center pt-4">
                                        <Link 
                                            to="/my-bookings" 
                                            className="text-pink-600 hover:text-pink-700 font-semibold flex items-center justify-center gap-2"
                                        >
                                            View All Bookings ({bookings.length})
                                            <ChevronRight size={20} />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, count, icon, color }) => {
    const colorClasses = {
        pink: 'bg-pink-50 border-pink-100',
        yellow: 'bg-yellow-50 border-yellow-100',
        green: 'bg-green-50 border-green-100',
        red: 'bg-red-50 border-red-100',
        blue: 'bg-blue-50 border-blue-100'
    };

    return (
        <div className={`${colorClasses[color] || colorClasses.blue} p-6 rounded-2xl border shadow-sm transition-transform hover:-translate-y-1`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">{title}</p>
                    <h4 className="text-3xl font-bold text-gray-900">{count}</h4>
                </div>
                <div className="p-3 rounded-xl bg-white shadow-sm">
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default Profile;
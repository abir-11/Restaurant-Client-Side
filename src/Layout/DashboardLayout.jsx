import React from 'react';
import { NavLink, Outlet, useNavigate } from "react-router"; // FIXED: Use react-router-dom
import { useQuery } from '@tanstack/react-query';
import {
    FaUsers,
    FaHome,
    FaUtensils,
    FaSignOutAlt,
    FaBars
} from 'react-icons/fa';
import { PiBowlFoodFill } from 'react-icons/pi';
import { IoFastFoodSharp } from 'react-icons/io5';
import { BiSolidDashboard } from "react-icons/bi";
import { RiDashboardHorizontalLine } from "react-icons/ri";

import Swal from 'sweetalert2';

import useAxiosSecure from '../Hooks/useAxiosSecure';
import useAuth from '../Hooks/useAuth';
import { MdCardMembership, MdOutlineFastfood } from 'react-icons/md';
import { GrUpdate } from 'react-icons/gr';

const DashboardLayout = () => {
    const { user, logOut } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    // 1. Fetch User Data
    const { data: dbUser = {}, isLoading } = useQuery({
        queryKey: ['user', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user?.email}`);
            return res.data;
        }
    });

    const handleLogout = () => {
        logOut().then(() => {
            navigate('/');
            Swal.fire({
                icon: 'success',
                title: 'Logged Out',
                showConfirmButton: false,
                timer: 1500
            });
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-pink-500"></span>
            </div>
        );
    }

    const navLinkClasses = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${isActive
            ? 'bg-pink-500 text-white shadow-md'
            : 'text-gray-700 hover:bg-pink-100 hover:text-pink-600'
        }`;

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

            {/* --- Main Content Area --- */}
            <div className="drawer-content flex flex-col bg-gray-50 min-h-screen">

                {/* Mobile Navbar (Only shows on small screens) */}
                <div className="w-full navbar bg-white shadow-sm lg:hidden sticky top-0 z-50">
                    <div className="flex-none">
                        <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost text-pink-500">
                            <FaBars className="w-6 h-6" />
                        </label>
                    </div>
                    <div className="flex-1 px-2 mx-2 font-bold text-lg text-gray-800">
                        BookerIt Dashboard
                    </div>
                </div>

                {/* Dashboard Content (Outlet) */}
                <div className="p-8">
                    <Outlet />
                </div>
            </div>

            {/* --- Sidebar Area (Navigation) --- */}
            <div className="drawer-side z-50">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>

                <div className="menu p-4 w-72 min-h-full bg-white text-base-content border-r border-gray-200 flex flex-col justify-between">

                    <div>
                        {/* Sidebar Header */}
                        <div className="mb-8 px-2 flex items-center gap-2 text-2xl font-bold text-gray-800">
                            <BiSolidDashboard className="text-pink-500" />
                            <span>Dashboard</span>
                        </div>



                        {/* User Profile */}
                        <div className="mb-8 p-4 bg-pink-50 rounded-2xl flex items-center gap-3">
                            <div className="avatar">
                                <div className="w-10 rounded-full ring ring-pink-500 ring-offset-base-100 ring-offset-2">
                                    <img src={user?.photoURL || "https://i.ibb.co/T0x4D7z/user.png"} alt="user" />
                                </div>
                            </div>
                            <div className="overflow-hidden">
                                <h3 className="font-bold text-sm truncate">{dbUser?.name || user?.displayName || 'User'}</h3>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">{dbUser?.role || 'Guest'}</p>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <ul className="space-y-2">

                            {/* SHARED LINKS */}
                            <li>
                                <NavLink to='/' className={navLinkClasses}>
                                    <FaHome className="w-5 h-5" />
                                    Home Page
                                </NavLink>
                            </li>

                            {/* ADMIN LINKS */}
                            {dbUser?.role === 'admin' && (
                                <>
                                    <li>
                                        <NavLink to='/dashboard/admin-dashboard' className={navLinkClasses}>
                                            <RiDashboardHorizontalLine className="w-5 h-5" />
                                            Admin Dashboard
                                        </NavLink>
                                    </li>

                                    <li>
                                        <NavLink to='/dashboard/mange-user' className={navLinkClasses}>
                                            <FaUsers className="w-5 h-5" />
                                            Manage Users
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to='/dashboard/all-food' className={navLinkClasses}>
                                            <IoFastFoodSharp className="w-5 h-5" />
                                            All Food Items
                                        </NavLink>
                                    </li>
                                     <li>
                                        <NavLink to='/dashboard/resquest-owner-ship' className={navLinkClasses}>
                                            <MdCardMembership />
                                           Restaurant Owner Request
                                        </NavLink>
                                    </li>
                                </>
                            )}

                            {/* RESTAURANT OWNER LINKS */}
                            {dbUser?.role === 'restaurant-owner' && (
                                <>
                                    <li>
                                        <NavLink to='/dashboard/restaurantDashboard' className={navLinkClasses}>
                                            <RiDashboardHorizontalLine className="w-5 h-5" />
                                            Restaurant Dashboard
                                        </NavLink>
                                    </li>

                                    <li>
                                        <NavLink to='/dashboard/food-dish-add' className={navLinkClasses}>
                                            <PiBowlFoodFill className="w-5 h-5" />
                                            Add Food Dish
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to='/dashboard/my-items' className={navLinkClasses}>
                                            <FaUtensils className="w-5 h-5" />
                                            My Menu Items
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to='/dashboard/oder-request' className={navLinkClasses}>
                                            <MdOutlineFastfood className="w-5 h-5"/>
                                            Order Request
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to='/dashboard/update-info' className={navLinkClasses}>
                                            <GrUpdate  className="w-5 h-5" />
                                            Update Information 
                                        </NavLink>
                                    </li>
                                </>
                            )}

                            <div className="divider my-4"></div>


                        </ul>
                    </div>

                    {/* Logout Button */}
                    <div className="mt-4">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all font-medium"
                        >
                            <FaSignOutAlt className="w-5 h-5" />
                            Logout
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
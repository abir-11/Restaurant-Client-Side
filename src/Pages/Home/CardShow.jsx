import React from 'react';
import { Link } from "react-router";
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { FaStar, FaFire, FaLeaf, FaClock, FaUtensils } from 'react-icons/fa';
import { FaChartLine } from "react-icons/fa6";
import { FaMedal } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { MdChevronRight } from "react-icons/md";
const CardShow = () => {
    const axiosSecure = useAxiosSecure();

    const { data: cardShow = [] } = useQuery({
        queryKey: ['foodDishes'],
        queryFn: async () => {
            const res = await axiosSecure.get('/foodDishes');
            return res.data;
        }
    });

    return (
        <section className="max-w-11/12 mx-auto py-16 ">
            <div className="container mx-auto px-4">
                  {/* --- SMART SUGGESTIONS SECTION (New) --- */}
                <div className="mb-12">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-extrabold text-black mb-2">
                            Curated Culinary Excellence
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Discover masterpiece dishes designed to define perfection.
                        </p>
                    </div>

                    {/* Filter Buttons & Search Field Row */}
                    <div className="flex flex-wrap justify-center items-center gap-4">
                        
                        {/* 1. Trending Now (Active Style) */}
                        <button className="flex items-center gap-2   px-6 py-3 rounded-lg font-bold shadow-md bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700  text-white  transition-colors">
                            <FaChartLine /> Trending Now
                        </button>

                        {/* 3. Quick Booking */}
                        <Link to="/booking" className="flex items-center gap-2 bg-white text-black border border-gray-300 px-6 py-3 rounded-lg font-medium bg-gradient-to-r hover:from-pink-600 hover:to-rose-700 hover:text-white  transition-colors">
                            <FaClock className="text-lg" /> Quick Booking
                        </Link>

                        {/* 4. Search Field (Added at the end) */}
                        <div className="relative group w-full md:w-auto">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400 group-focus-within:text-pink-500" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search food..." 
                                className="w-full md:w-64 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-white"
                            />
                        </div>

                    </div>
                </div>
              

                {/* Professional Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {cardShow.map((item) => (
                        <div 
                            key={item._id} 
                            className="group relative w-full h-[450px] bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                        >
                            {/* 1. Background Image with Zoom Effect */}
                            <div className="absolute inset-0 w-full h-full">
                                <img 
                                    src={item?.image} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Gradient Overlay for text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                            </div>

                            {/* 2. Top Badges (Always Visible) */}
                            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                                <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                    {item.category}
                                </span>
                                <div className="flex items-center gap-1 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                                    <FaStar /> {item.rating}
                                </div>
                            </div>

                            {/* 3. Content Content - Sliding Up Animation */}
                            <div className="absolute bottom-0 left-0 w-full p-6 text-white transform translate-y-[140px] group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-20">
                                
                                {/* Visible Part (Before Hover) */}
                                <div className="mb-2">
                                    <div className="flex justify-between items-end mb-1">
                                        <h3 className="text-2xl font-bold leading-tight group-hover:text-pink-400 transition-colors">
                                            {item.title}
                                        </h3>
                                        <span className="text-xl font-bold text-rose-400 bg-white/10 px-2 rounded">
                                            ${item.price}
                                        </span>
                                    </div>
                                    
                                    {/* Veg/Non-Veg Badge (Visible initially) */}
                                    <div className="flex justify-between items-center mt-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <span className={`flex items-center gap-1 ${item?.vegType === 'Veg' ? 'text-green-400' : 'text-red-400'}`}>
                                            <FaLeaf size={12}/> {item?.vegType}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1 text-orange-400">
                                            <FaFire size={12}/> {item.calories} cal
                                        </span>
                                    </div>
                                    <div> 
                                        <Link to={`/foodDetails/${item._id}`} className="text-xl font-bold bg-gradient-to-r   hover:from-pink-600 hover:to-rose-700 text-rose-300 hover:text-white  bg-white/10 px-2 py-1 rounded">Details</Link>
                                    </div>
                                    </div>
                                </div>

                                {/* Hidden Part (Revealed On Hover) */}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    <div className="h-[1px] w-full bg-gray-600/50 my-3"></div>
                                    
                                    <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                                        {item.description}
                                    </p>

                                    <div className="flex items-center justify-between gap-3">
                                        {/* Spice Level */}
                                        <div className="hidden xs:flex flex-col">
                                            <span className="text-xs text-gray-400 uppercase">Spice Level</span>
                                            <span className="text-sm font-semibold text-white">{item.spiceLevel}</span>
                                        </div>

                                        {/* YOUR REQUESTED BUTTON */}
                                        <button
                                            type="submit"
                                            disabled={!item.availability}
                                            className={`flex-1 py-3 px-6 rounded-lg text-white font-bold text-sm uppercase tracking-wide shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl
                                                ${!item.availability 
                                                    ? 'bg-gray-500 cursor-not-allowed opacity-70' 
                                                    : 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700'
                                                }`}
                                        >
                                            {item.availability ? 'Book Now' : 'Sold Out'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mt-12">
                    <Link to="/menu" className="flex items-center  py-3 px-6 rounded-lg text-white font-bold text-sm uppercase tracking-wide shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 cursor-pointer">See More <MdChevronRight className="text-lg" /></Link>
                </div>
            </div>
        </section>
    );
};

export default CardShow;
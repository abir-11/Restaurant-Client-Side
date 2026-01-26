import React, { useState } from 'react'; // 1. useState import করা হয়েছে
import { Link } from "react-router"; // অথবা "react-router-dom"
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { FaStar, FaFire, FaLeaf, FaClock, FaSearch } from 'react-icons/fa';
import { FaChartLine } from "react-icons/fa6";
import { MdChevronRight } from "react-icons/md";
import { IoRestaurantSharp } from 'react-icons/io5';

const FoodCardShow = () => {
    const axiosSecure = useAxiosSecure();
    const [searchTerm, setSearchTerm] = useState(''); // 2. Search state তৈরি করা হয়েছে

    const { data: cardShow = [] } = useQuery({
        queryKey: ['foodDishes'],
        queryFn: async () => {
            const res = await axiosSecure.get('/latestFoodDishes');
            return res.data;
        }
    });

    // 3. Filtering Logic (Title এবং Restaurant Name দিয়ে সার্চ হবে)
    const filteredFoods = cardShow.filter((item) => {
        const lowerSearch = searchTerm.toLowerCase();
        const titleMatch = item.title.toLowerCase().includes(lowerSearch);
        const restaurantMatch = item.restaurant_name?.toLowerCase().includes(lowerSearch);
        
        return titleMatch || restaurantMatch;
    });

    return (
        <section className="max-w-11/12 mx-auto pt-16 ">
            <div className="container mx-auto px-4">
                {/* SMART SUGGESTIONS SECTION */}
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
                        <button className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold shadow-md bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white transition-colors">
                            <FaChartLine /> Trending Now
                        </button>

                        <Link to="/book-table" className="flex items-center gap-2 bg-white text-black border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gradient-to-r hover:from-pink-600 hover:to-rose-700 hover:text-white transition-colors">
                            <FaClock className="text-lg" /> Quick Booking
                        </Link>

                        <div className="relative group w-full md:w-auto">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400 group-focus-within:text-pink-500" />
                            </div>
                            
                            {/* 4. Input Field এ onChange এবং value যোগ করা হয়েছে */}
                            <input
                                type="text"
                                placeholder="Search food or restaurant..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-64 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-white"
                            />
                        </div>
                    </div>
                </div>


                {/* Grid Layout */}
                {/* 5. যদি সার্চ রেজাল্ট না পাওয়া যায়, তবে মেসেজ দেখানো হবে */}
                {filteredFoods.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-xl text-gray-500 font-semibold">No food or restaurant found matching "{searchTerm}"</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {/* 6. cardShow এর বদলে filteredFoods ম্যাপ করা হয়েছে */}
                        {filteredFoods.map((item) => (
                            <div
                                key={item._id}
                                className="group relative w-full h-[450px] bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                            >
                                {/* Background Image with Zoom Effect */}
                                <div className="absolute inset-0 w-full h-full">
                                    <img
                                        src={item?.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 transition-opacity duration-300"></div>
                                </div>

                                {/* Top Badges */}
                                <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                                    <span className="bg-white/20 flex flex-col backdrop-blur-md border border-white/30 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                        <span className='flex items-center gap-1 text-pink-600 font-bold'><IoRestaurantSharp />{item.restaurant_name}</span><span>{item.category}</span>

                                    </span>
                                    <div className="flex items-center gap-1 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                                        <FaStar /> {item.rating}
                                    </div>
                                </div>

                                {/* Content - Sliding Up Animation */}
                                <div className="absolute bottom-0 left-0 w-full p-5 text-white transform translate-y-[130px] group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-20">

                                    {/* Visible Part (Before Hover) */}
                                    <div className="flex flex-col gap-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xl font-bold leading-tight group-hover:text-pink-400 transition-colors line-clamp-1 w-[70%]">
                                                {item.title}
                                            </h3>
                                            <span className="text-lg font-bold text-rose-400 bg-white/10 px-2 rounded">
                                                ${item.price}
                                            </span>
                                        </div>

                                        {/* Veg/Calorie/Details Row */}
                                        <div className="flex justify-between items-center mt-1">
                                            <div className="flex items-center gap-3 text-xs text-gray-300">
                                                <span className={`flex items-center gap-1 ${item?.vegType === 'Veg' ? 'text-green-400' : 'text-red-400'}`}>
                                                    <FaLeaf size={10} /> {item?.vegType}
                                                </span>
                                                <span className="flex items-center gap-1 text-orange-400">
                                                    <FaFire size={10} /> {item.calories} cal
                                                </span>
                                            </div>

                                            <Link to={`/details/${item._id}`} className="text-sm font-semibold hover:text-pink-400 underline decoration-pink-500/50">
                                                Details
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Hidden Part (Revealed On Hover) */}
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        <div className="h-[1px] w-full bg-gray-600/50 my-3"></div>

                                        <p className="text-gray-300 text-sm line-clamp-2 mb-4 h-[40px]">
                                            {item.description}
                                        </p>

                                        <div className="flex items-center justify-between gap-3">
                                            {/* Spice Level */}
                                            <div className="hidden xs:flex flex-col">
                                                <span className="text-[10px] text-gray-400 uppercase tracking-wide">Spice Level</span>
                                                <span className="text-sm font-semibold text-white">{item.spiceLevel}</span>
                                            </div>

                                            {/* Book Now Button */}
                                            <Link
                                                to={item.availability ? `/details/${item._id}` : '#'}
                                                disabled={!item.availability}
                                                className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center text-white font-bold text-sm uppercase tracking-wide shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl
                                                                            ${!item.availability
                                                        ? 'bg-gray-500 cursor-not-allowed opacity-70'
                                                        : 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700'
                                                    }`}
                                            >
                                                {item.availability ? 'Book Now' : 'Sold Out'}
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                )}


                <div className="flex justify-center mt-12">
                    <Link to="/our-menu" className="flex items-center py-3 px-6 rounded-lg text-white font-bold text-sm uppercase tracking-wide shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 cursor-pointer">See More <MdChevronRight className="text-lg" /></Link>
                </div>
            </div>
        </section>
    );
};

export default FoodCardShow;
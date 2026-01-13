import React from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart, Star, Flame, Plus, Loader2 } from 'lucide-react';
import { FaStar, FaFire, FaLeaf, FaClock, FaSearch } from 'react-icons/fa';
import { FaChartLine } from "react-icons/fa6";
import { MdChevronRight } from "react-icons/md";
import { Link } from 'react-router';


const OurMenu = () => {
    const axiosSecure = useAxiosSecure();

    const { data: menuItems = [], isLoading } = useQuery({
        queryKey: ['menu-items'],
        queryFn: async () => {
            const res = await axiosSecure.get('/foodDishes');
            return res.data;
        }
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
            </div>
        );
    }

    return (
        <section className="max-w-11/12 mx-auto pt-16 min-h-screen mt-10 mb-20 ">
            <div className="container mx-auto px-4">
                {/*  SMART SUGGESTIONS SECTION */}
                <div className="mb-12">
                    {/* Section Header */}
                    <div className="text-center mb-5">
                        <h3 className="text-pink-500 font-bold uppercase tracking-wider mb-2">Tasty & Crunchy</h3>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                            Our Special <span className="text-pink-500">Menu</span>
                        </h2>
                        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                            Explore our curated dishes, prepared with the finest ingredients and passion.
                        </p>
                    </div>

                    {/* Filter Buttons & Search Field Row */}
                    <div className="flex flex-wrap justify-center items-center gap-4">


                        <Link to="/book-table" className="flex items-center gap-2 bg-white text-black border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gradient-to-r hover:from-pink-600 hover:to-rose-700 hover:text-white transition-colors">
                            <FaClock className="text-lg" /> Quick Booking
                        </Link>

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


                {/*  Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {menuItems.map((item) => (
                        <div
                            key={item._id}
                            className="group relative w-full h-[450px] bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                        >
                            {/*  Background Image with Zoom Effect */}
                            <div className="absolute inset-0 w-full h-full">
                                <img
                                    src={item?.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 transition-opacity duration-300"></div>
                            </div>

                            {/*  Top Badges */}
                            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                                <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                    {item.category}
                                </span>
                                <div className="flex items-center gap-1 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                                    <FaStar /> {item.rating}
                                </div>
                            </div>

                            {/* Content - Sliding Up Animation */}
                            {/*  Adjusted translate-y and padding */}
                            <div className="absolute bottom-0 left-0 w-full p-5 text-white transform translate-y-[130px] group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-20">

                                {/* Visible Part (Before Hover) */}
                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-between items-start">
                                        {/* Added truncate/line-clamp-1 to Title to prevent layout shift */}
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

                                        {/* Details Button - Compact */}
                                        <Link to={`/foodDetails/${item._id}`} className="text-sm font-semibold hover:text-pink-400 underline decoration-pink-500/50">
                                            Details
                                        </Link>
                                    </div>
                                </div>

                                {/* Hidden Part (Revealed On Hover) */}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    <div className="h-[1px] w-full bg-gray-600/50 my-3"></div>

                                    {/* CHANGE: Strict line-clamp-2 for description */}
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
                                            to={item.availability ? `/book-food/${item._id}` : '#'}
                                            disabled={!item.availability}
                                            className={`flex-1 py-2.5 px-4 rounded-lg text-white font-bold text-sm uppercase tracking-wide shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl
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


            </div>
        </section>
    );
};

// Sub-component for individual Food Card
const MenuCard = ({ item }) => {
    // Destructuring with fallbacks in case API data is missing fields
    const {
        name,
        image,
        price,
        description,
        category = "Special",
        rating = 4.5
    } = item;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">

            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />

                {/* Category Badge */}
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-pink-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                    {category}
                </span>

                {/* Price Badge */}
                <span className="absolute bottom-3 right-3 bg-pink-500 text-white font-bold px-3 py-1 rounded-lg shadow-md">
                    ${price}
                </span>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-800 line-clamp-1 group-hover:text-pink-500 transition-colors">
                        {name}
                    </h3>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{rating}</span>
                    </div>
                </div>

                <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
                    {description || "A delicious delicacy prepared with fresh ingredients and special spices."}
                </p>

                {/* Action Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <div className="flex items-center gap-1 text-orange-500 text-xs font-semibold">
                        <Flame className="w-4 h-4" />
                        <span>Hot & Fresh</span>
                    </div>

                    <button
                        className="flex items-center gap-2 bg-gray-50 hover:bg-pink-500 text-gray-700 hover:text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 group/btn"
                        onClick={() => console.log('Add to cart:', item._id)}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OurMenu;
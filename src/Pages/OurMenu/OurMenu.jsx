import React, { useState, useMemo } from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { FaStar, FaFire, FaLeaf, FaClock, FaSearch, FaFilter } from 'react-icons/fa';
import { BsSortDown, BsSortUpAlt } from "react-icons/bs";
import { Link } from 'react-router';
import { IoRestaurantSharp } from 'react-icons/io5';

const OurMenu = () => {
    const axiosSecure = useAxiosSecure();

    // States for Search, Filter, and Sort
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRestaurant, setSelectedRestaurant] = useState('All');
    const [sortOrder, setSortOrder] = useState('default'); // default, low-high, high-low

    const { data: menuItems = [], isLoading } = useQuery({
        queryKey: ['menu-items'],
        queryFn: async () => {
            const res = await axiosSecure.get('/foodDishes');
            return res.data;
        }
    });

    // 1. Get Unique Restaurant Names for the Dropdown
    const uniqueRestaurants = useMemo(() => {
        const restaurants = menuItems.map(item => item.restaurant_name);
        // Remove duplicates and filter out undefined/null
        return ['All', ...new Set(restaurants.filter(Boolean))];
    }, [menuItems]);

    // 2. Main Logic: Filter and Sort items
    const processedItems = useMemo(() => {
        let items = [...menuItems];

        // A. Search Filter (Food Name OR Restaurant Name)
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            items = items.filter(item => 
                item.title?.toLowerCase().includes(query) || 
                item.restaurant_name?.toLowerCase().includes(query)
            );
        }

        // B. Restaurant Category Filter
        if (selectedRestaurant !== 'All') {
            items = items.filter(item => item.restaurant_name === selectedRestaurant);
        }

        // C. Price Sorting
        if (sortOrder === 'low-high') {
            items.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (sortOrder === 'high-low') {
            items.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        }

        return items;
    }, [menuItems, searchQuery, selectedRestaurant, sortOrder]);


    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
            </div>
        );
    }

    return (
        <section className="max-w-11/12 mx-auto pt-16  min-h-screen mt-10 mb-20">
            <div className="container mx-auto px-4">
                
                {/* HEADER SECTION */}
                <div className="mb-12">
                    <div className="text-center mb-8">
                        <h3 className="text-pink-500 font-bold uppercase tracking-wider mb-2">Tasty & Crunchy</h3>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                            Our Special <span className="text-pink-500">Menu</span>
                        </h2>
                        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                            Explore our curated dishes, prepared with the finest ingredients and passion.
                        </p>
                    </div>

                    {/* SEARCH & FILTER CONTROLS */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row flex-wrap justify-between items-center gap-4">
                        
                        {/* Search Input */}
                        <div className="relative w-full md:w-1/3">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by Food or Restaurant..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all bg-gray-50"
                            />
                        </div>

                        {/* Filters Container */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            
                            {/* Restaurant Filter Dropdown */}
                            <div className="relative w-full sm:w-48">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <IoRestaurantSharp className="text-gray-500" />
                                </div>
                                <select 
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 appearance-none cursor-pointer"
                                    value={selectedRestaurant}
                                    onChange={(e) => setSelectedRestaurant(e.target.value)}
                                >
                                    {uniqueRestaurants.map((restaurant, index) => (
                                        <option key={index} value={restaurant}>
                                            {restaurant === 'All' ? 'All Restaurants' : restaurant}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                    <FaFilter className="text-xs text-gray-400" />
                                </div>
                            </div>

                            {/* Price Sort Dropdown */}
                            <div className="relative w-full sm:w-48">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    {sortOrder === 'high-low' ? <BsSortDown className="text-gray-500"/> : <BsSortUpAlt className="text-gray-500"/>}
                                </div>
                                <select 
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 appearance-none cursor-pointer"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                >
                                    <option value="default">Sort by Price</option>
                                    <option value="low-high">Price: Low to High</option>
                                    <option value="high-low">Price: High to Low</option>
                                </select>
                            </div>

                            {/* Booking Button */}
                            <Link to="/book-table" className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all">
                                <FaClock /> Book Table
                            </Link>
                        </div>
                    </div>
                </div>

                {/* GRID LAYOUT */}
                {processedItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {processedItems.map((item) => (
                            <div
                                key={item._id}
                                className="group relative w-full h-[450px] bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0 w-full h-full">
                                    <img
                                        src={item?.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 transition-opacity duration-300"></div>
                                </div>

                                {/* Top Badges */}
                                <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                                    <span className="bg-white/20 flex flex-col backdrop-blur-md border border-white/30 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                        <span className='flex items-center gap-1 text-pink-600 font-bold'>
                                            <IoRestaurantSharp />{item.restaurant_name}
                                        </span>
                                        <span>{item.category}</span>
                                    </span>
                                    <div className="flex items-center gap-1 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                                        <FaStar /> {item.rating}
                                    </div>
                                </div>

                                {/* Content - Sliding Up Animation */}
                                <div className="absolute bottom-0 left-0 w-full p-5 text-white transform translate-y-[130px] group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-20">
                                    {/* Visible Part */}
                                    <div className="flex flex-col gap-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xl font-bold leading-tight group-hover:text-pink-400 transition-colors line-clamp-1 w-[70%]">
                                                {item.title}
                                            </h3>
                                            <span className="text-lg font-bold text-rose-400 bg-white/10 px-2 rounded">
                                                ${item.price}
                                            </span>
                                        </div>

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
                                            <div className="hidden xs:flex flex-col">
                                                <span className="text-[10px] text-gray-400 uppercase tracking-wide">Spice Level</span>
                                                <span className="text-sm font-semibold text-white">{item.spiceLevel}</span>
                                            </div>

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
                ) : (
                    // No Items Found State
                    <div className="text-center py-20 bg-gray-50 rounded-2xl">
                        <FaSearch className="mx-auto text-4xl text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-600">No items found</h3>
                        <p className="text-gray-400">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default OurMenu;
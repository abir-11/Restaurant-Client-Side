import React from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { FaUtensils, FaLayerGroup, FaDollarSign, FaStar } from 'react-icons/fa';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import useAuth from '../../../Hooks/useAuth';

// Professional color palette
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];

const AdminDashboard = () => {
    const {user}=useAuth();
    const axiosSecure = useAxiosSecure();

    // 1. Fetch the Raw Data (List of all items)
    const { data: foodItems = [], isLoading } = useQuery({
        queryKey: ['foodDishes'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/foodDishes`);
            return res.data;
        }
    });

    // --- 2. Process Data on Frontend ---
    
    // A. Basic Stats
    const totalItems = foodItems.length;
    
    // Calculate distinct categories
    const categoriesSet = new Set(foodItems.map(item => item.category));
    const totalCategories = categoriesSet.size;

    // Calculate Total Inventory Value (Sum of price)
    const totalValue = foodItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);

    // B. Prepare Data for Charts (Group by Category)
    // We create an object first: { "Dessert": 5, "Pizza": 2 }
    const categoryCounts = foodItems.reduce((acc, item) => {
        const cat = item.category || "Uncategorized";
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});

    // Convert that object into an array for Recharts: [{category: "Dessert", count: 5}, ...]
    const chartData = Object.keys(categoryCounts).map(cat => ({
        category: cat,
        count: categoryCounts[cat]
    }));

    // C. Find Top Category
    let topCategory = { category: 'N/A', count: 0 };
    if (chartData.length > 0) {
        topCategory = chartData.reduce((prev, current) => (prev.count > current.count) ? prev : current);
    }


    // --- Custom Chart Components ---
    const getPath = (x, y, width, height) => {
        return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
        ${x + width / 2}, ${y}
        C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
        Z`;
    };

    const TriangleBar = (props) => {
        const { fill, x, y, width, height } = props;
        return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
    };

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    if (isLoading) return <div className="text-center mt-20">Loading Dashboard...</div>;

    return (
        <div className="w-full px-4 mb-10">
            <h2 className="text-3xl font-bold my-8 text-gray-800">Menu Overview</h2>

            {/* --- STATS CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                
                {/* Total Dishes */}
                <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl p-6 shadow-xl text-white flex items-center gap-4">
                    <div className="p-4 bg-white/20 rounded-full">
                        <FaUtensils className="text-3xl" />
                    </div>
                    <div>
                        <p className="text-violet-100 font-medium">Total Dishes</p>
                        <h3 className="text-3xl font-bold">{totalItems}</h3>
                    </div>
                </div>

                {/* Categories */}
                <div className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl p-6 shadow-xl text-white flex items-center gap-4">
                    <div className="p-4 bg-white/20 rounded-full">
                        <FaLayerGroup className="text-3xl" />
                    </div>
                    <div>
                        <p className="text-blue-100 font-medium">Categories</p>
                        <h3 className="text-3xl font-bold">{totalCategories}</h3>
                    </div>
                </div>

                {/* Total Inventory Value */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 rounded-2xl p-6 shadow-xl text-white flex items-center gap-4">
                    <div className="p-4 bg-white/20 rounded-full">
                        <FaDollarSign className="text-3xl" />
                    </div>
                    <div>
                        <p className="text-emerald-100 font-medium">Menu Value</p>
                        <h3 className="text-3xl font-bold">${totalValue}</h3>
                    </div>
                </div>

                {/* Top Category */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-400 rounded-2xl p-6 shadow-xl text-white flex items-center gap-4">
                    <div className="p-4 bg-white/20 rounded-full">
                        <FaStar className="text-3xl" />
                    </div>
                    <div>
                        <p className="text-orange-100 font-medium">Top Category</p>
                        <h3 className="text-2xl font-bold truncate w-24">{topCategory.category}</h3>
                        <p className="text-xs text-orange-100">{topCategory.count} Items</p>
                    </div>
                </div>
            </div>

            {/* --- GRAPHS SECTION --- */}
            <div className="flex flex-col lg:flex-row gap-8">
                
                {/* Chart 1: Items Quantity by Category */}
                <div className="w-full lg:w-1/2 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="text-xl font-bold mb-6 text-gray-700 border-b pb-4">Dishes per Category</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="category" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                                <Bar dataKey="count" fill="#8884d8" shape={<TriangleBar />} label={{ position: 'top' }}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 2: Category Distribution Pie Chart */}
                <div className="w-full lg:w-1/2 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="text-xl font-bold mb-6 text-gray-700 border-b pb-4">Menu Distribution</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="count"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
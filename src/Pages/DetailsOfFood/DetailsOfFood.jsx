import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../Hooks/useAuth';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { parse, addMinutes, isBefore, isAfter } from 'date-fns';
import { Loader2, MapPin, User, Clock, Utensils, X, Calendar, CheckCircle, Info, Flame, ShieldCheck, ChefHat, Heart } from 'lucide-react';
import { FaStar } from 'react-icons/fa';

const DetailsOfFood = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Smart Booking States
    const [selectedLayout, setSelectedLayout] = useState(null);
    const [selectedTableType, setSelectedTableType] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    // React Hook Form
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    const selectedDate = watch('date');

    // 1. Fetch Single Food Details
    const { data: food = {}, isLoading } = useQuery({
        queryKey: ['food', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/foodDishes/${id}`);
            return res.data;
        }
    });

    // 2. Fetch Layouts
    const { data: layoutData } = useQuery({
        queryKey: ['restaurant-layout', food.email], 
        queryFn: async () => {
            if (!food.email) return null;
            const res = await axiosSecure.get('/restaurant/layout');
            const myLayout = res.data.find(l => l.email === food.email);
            return myLayout;
        },
        enabled: !!food.email && isModalOpen,
    });

    useEffect(() => {
        if (layoutData) {
            setSelectedLayout(layoutData);
        }
    }, [layoutData]);

    // 3. Fetch Existing Bookings
    const { data: existingBookings = [] } = useQuery({
        queryKey: ['bookings', food.email, selectedDate],
        queryFn: async () => {
            if (!food.email || !selectedDate) return [];
            const res = await axiosSecure.get(`/bookTable?email=${food.email}&date=${selectedDate}`);
            return res.data;
        },
        enabled: !!food.email && !!selectedDate && isModalOpen,
    });

    // --- TIME SLOT LOGIC ---
    const manualTimeSlots = [
        { value: "12:00", label: "12:00 PM", display: "12:00 PM" },
        { value: "14:00", label: "02:00 PM", display: "02:00 PM" },
        { value: "16:00", label: "04:00 PM", display: "04:00 PM" },
        { value: "18:00", label: "06:00 PM", display: "06:00 PM" },
        { value: "20:00", label: "08:00 PM", display: "08:00 PM" },
        { value: "22:00", label: "10:00 PM", display: "10:00 PM" }
    ];

    const isTimeSlotDisabled = (timeValue) => {
        if (!selectedTableType || !selectedLayout || !selectedDate) return true;

        const duration = selectedLayout.booking_duration || 90;
        const totalTablesOfType = selectedLayout.tables.filter(t => t.type === selectedTableType).length;

        const slotStart = parse(timeValue, 'HH:mm', new Date());
        const slotEnd = addMinutes(slotStart, duration);

        const overlappingBookings = existingBookings.filter(booking => {
            if (booking.tableType !== selectedTableType) return false;
            if (booking.status === 'cancelled') return false; 

            const bookingStart = parse(booking.time, 'HH:mm', new Date());
            const bookingDuration = booking.duration || 90;
            const bookingEnd = addMinutes(bookingStart, bookingDuration);

            return isBefore(slotStart, bookingEnd) && isAfter(slotEnd, bookingStart);
        });

        return overlappingBookings.length >= totalTablesOfType;
    };

    // --- HANDLE SUBMIT ---
    const onSubmit = async (data) => {
        try {
            const tableDetails = selectedLayout?.tables.find(t => t.type === selectedTableType);
            const selectedTimeSlot = manualTimeSlots.find(slot => slot.value === selectedTime);

            const bookingData = {
                restaurantName: food.restaurant_name,
                restaurantEmail: food.email,
                customerName: user?.displayName,
                customerEmail: user?.email,
                phone: data.phone,
                partySize: parseInt(tableDetails?.capacity || data.guests),
                date: data.date,
                time: selectedTime,
                timeDisplay: selectedTimeSlot?.display || selectedTime,
                tableId: tableDetails?.table_id || 'Any',
                tableType: selectedTableType,
                duration: selectedLayout?.booking_duration || 90,
                preOrderMenu: [{
                    _id: food._id,
                    title: food.title,
                    price: food.price,
                    image: food.image
                }],
                totalEstimatedPrice: parseFloat(food.price),
                status: 'pending' // CreatedAt backend e handle kora better
            };

            const res = await axiosSecure.post('/bookTable', bookingData);

            if (res.data.insertedId || res.data.success) {
                Swal.fire({
                    title: '🎉 Booking Confirmed!',
                    text: `Table reserved at ${food.restaurant_name} for ${selectedTimeSlot?.display}!`,
                    icon: 'success',
                    confirmButtonColor: '#db2777',
                });
                reset();
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMsg = error.response?.data?.message || 'Something went wrong.';
            Swal.fire({
                icon: 'error',
                title: 'Booking Failed',
                text: errorMsg,
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <Loader2 className="w-12 h-12 text-pink-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-30 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                
                {/* --- MAIN DETAILS CARD --- */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        
                        {/* LEFT: Image Section */}
                        <div className="lg:w-1/2 relative h-[400px] lg:h-auto">
                            <img src={food.image} alt={food.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                            <div className="absolute top-4 left-4 flex gap-2">
                                <span className="bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-lg">
                                    {food.category || 'Special'}
                                </span>
                                {food.availability && (
                                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" /> Available
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* RIGHT: Details Section */}
                        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-2">{food.title}</h1>
                                    <div className="flex items-center gap-2 text-pink-600 font-medium cursor-pointer hover:underline">
                                        <ChefHat className="w-5 h-5" /> 
                                        <span>{food.restaurant_name}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-4xl font-bold text-pink-600">${food.price}</p>
                                    <p className="text-gray-400 text-sm">per serving</p>
                                </div>
                            </div>

                            {/* Stats Grid - "Ektu beshi details" */}
                            <div className="grid grid-cols-4 gap-4 py-6 border-t border-b border-gray-100 mb-6">
                                <div className="text-center border-r border-gray-100 last:border-0">
                                    <div className="flex justify-center text-yellow-400 mb-1"><FaStar /></div>
                                    <span className="text-sm font-bold text-gray-700">4.8</span>
                                    <p className="text-xs text-gray-400">Rating</p>
                                </div>
                                <div className="text-center border-r border-gray-100 last:border-0">
                                    <div className="flex justify-center text-orange-500 mb-1"><Flame size={16} /></div>
                                    <span className="text-sm font-bold text-gray-700">120</span>
                                    <p className="text-xs text-gray-400">Kcal</p>
                                </div>
                                <div className="text-center border-r border-gray-100 last:border-0">
                                    <div className="flex justify-center text-blue-500 mb-1"><Clock size={16} /></div>
                                    <span className="text-sm font-bold text-gray-700">20m</span>
                                    <p className="text-xs text-gray-400">Prep</p>
                                </div>
                                <div className="text-center">
                                    <div className="flex justify-center text-green-500 mb-1"><ShieldCheck size={16} /></div>
                                    <span className="text-sm font-bold text-gray-700">Safe</span>
                                    <p className="text-xs text-gray-400">Quality</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-gray-800 mb-2">About this dish</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {food.description || "A delicious culinary masterpiece prepared with fresh ingredients and authentic spices. Perfect for any meal, offering a delightful taste that will leave you craving more."}
                                </p>
                            </div>

                            {/* Tags/Ingredients (Mock Data if not in DB) */}
                            <div className="flex flex-wrap gap-2 mb-10">
                                {['Fresh', 'Organic', 'Spicy', 'Dinner'].map((tag, i) => (
                                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            {/* Action Button */}
                            <div className="mt-auto">
                                <button 
                                    onClick={() => {
                                        setIsModalOpen(true);
                                        setValue('date', '');
                                        setSelectedTableType('');
                                        setSelectedTime('');
                                    }}
                                    disabled={!food.availability}
                                    className={`w-full py-4 rounded-xl text-lg font-bold text-white flex justify-center items-center gap-2 shadow-lg transition-all transform hover:-translate-y-1 hover:shadow-2xl
                                    ${food.availability ? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700' : 'bg-gray-400 cursor-not-allowed'}`}
                                >
                                    <Utensils className="w-5 h-5" />
                                    {food.availability ? 'Reserve a Table for This Dish' : 'Currently Unavailable'}
                                </button>
                                <p className="text-center text-gray-400 text-xs mt-3">
                                    *Cancellation available up to 2 hours before booking
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- SMART BOOKING MODAL (Same as before, cleaner styling) --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8 relative animate-in fade-in zoom-in duration-300">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-6 text-white rounded-t-3xl flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-bold">Table Reservation</h3>
                                <p className="text-pink-100 text-sm mt-1 opacity-90">Book your spot at {food.restaurant_name}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                
                                {/* Selected Food Summary */}
                                <div className="flex items-center gap-4 p-4 bg-rose-50 rounded-2xl border border-rose-100">
                                    <img src={food.image} alt="" className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                                    <div>
                                        <p className="text-xs font-bold text-rose-500 uppercase tracking-wider">Pre-ordering</p>
                                        <h4 className="font-bold text-gray-900">{food.title}</h4>
                                        <p className="text-sm text-gray-600">${food.price}</p>
                                    </div>
                                </div>

                                {/* Inputs */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Select Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                            <input 
                                                type="date" 
                                                {...register("date", { required: true })}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none bg-gray-50 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Contact Number</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                            <input 
                                                type="text" 
                                                {...register("phone", { required: true })}
                                                placeholder="017..."
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none bg-gray-50 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Table Layout Selection */}
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-gray-700">Choose Table Type</label>
                                    {!selectedLayout ? (
                                        <div className="text-center p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 text-sm">
                                            {food.email ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin w-4 h-4"/> Loading tables...</span> : 'Layout unavailable'}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {[...new Set(selectedLayout.tables.map(t => t.type))].map((type, idx) => {
                                                const tInfo = selectedLayout.tables.find(t => t.type === type);
                                                const isSelected = selectedTableType === type;
                                                return (
                                                    <div 
                                                        key={idx}
                                                        onClick={() => { setSelectedTableType(type); setSelectedTime(''); }}
                                                        className={`cursor-pointer rounded-xl p-4 border-2 transition-all relative text-center group
                                                            ${isSelected ? 'border-pink-500 bg-pink-50 shadow-md' : 'border-gray-100 hover:border-pink-300'}`}
                                                    >
                                                        <span className="block font-bold text-gray-800">{type}</span>
                                                        <span className="text-xs text-gray-500 group-hover:text-pink-500 transition-colors">{tInfo?.capacity} Seats</span>
                                                        {isSelected && <CheckCircle className="absolute top-2 right-2 text-pink-500 w-4 h-4"/>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Time Selection */}
                                {selectedDate && selectedTableType && (
                                    <div className="space-y-3 animate-fade-in-up">
                                        <label className="text-sm font-bold text-gray-700 flex justify-between">
                                            Available Time Slots
                                            {selectedLayout?.booking_duration && <span className="text-xs font-normal text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3"/> {selectedLayout.booking_duration} mins/slot</span>}
                                        </label>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                            {manualTimeSlots.map((slot, index) => {
                                                const disabled = isTimeSlotDisabled(slot.value);
                                                return (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        disabled={disabled}
                                                        onClick={() => setSelectedTime(slot.value)}
                                                        className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all
                                                            ${selectedTime === slot.value 
                                                                ? 'bg-pink-600 text-white border-pink-600 shadow-md' 
                                                                : disabled 
                                                                    ? 'bg-gray-100 text-gray-300 border-transparent cursor-not-allowed' 
                                                                    : 'bg-white text-gray-700 border-gray-200 hover:border-pink-500 hover:text-pink-600'}`}
                                                    >
                                                        {slot.display}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                <button 
                                    type="submit" 
                                    disabled={isSubmitting || !selectedTime || !selectedTableType}
                                    className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-pink-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                                >
                                    {isSubmitting ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin"/> Confirming...</span> : 'Confirm Reservation'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailsOfFood;
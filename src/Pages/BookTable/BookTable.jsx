import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import { 
  MapPin, Info, Store, Calendar, Clock, Users, Utensils, 
  Trash2, UtensilsCrossed, PlusCircle, CheckCircle 
} from 'lucide-react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { format, parse, addMinutes, isBefore, isAfter } from 'date-fns';

const BookTable = () => {
  const axiosSecure = useAxiosSecure();
  
  // State for selections
  const [selectedRestaurantInfo, setSelectedRestaurantInfo] = useState(null);
  const [selectedLayout, setSelectedLayout] = useState(null);
  
  // State for Food Selection
  const [selectedDishes, setSelectedDishes] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  // Watch fields
  const selectedRestaurantEmail = watch('restaurantEmail');
  const selectedTableType = watch('tableType');
  const selectedDate = watch('date');
  const selectedTime = watch('time');

  // 1. Fetch Restaurants
  const { data: restaurants = [] } = useQuery({
    queryKey: ['restaurantApplications'],
    queryFn: async () => {
      const res = await axiosSecure.get('/restaurantApplications');
      return res.data;
    }
  });

  // 2. Fetch Layouts
  const { data: allLayouts = [] } = useQuery({
    queryKey: ['restaurant-layouts'],
    queryFn: async () => {
      const res = await axiosSecure.get('/restaurant/layout');
      return res.data;
    }
  });

  // 3. Fetch Existing Bookings
  const { data: existingBookings = [], refetch: refetchBookings } = useQuery({
    queryKey: ['bookings', selectedRestaurantEmail, selectedDate],
    queryFn: async () => {
      if (!selectedRestaurantEmail || !selectedDate) return [];
      const res = await axiosSecure.get(`/bookTable?email=${selectedRestaurantEmail}&date=${selectedDate}`);
      return res.data; 
    },
    enabled: !!selectedRestaurantEmail && !!selectedDate,
  });

  // 4. Fetch Food Dishes
  const { data: restaurantMenu = [] } = useQuery({
    queryKey: ['foodDishes', selectedRestaurantEmail],
    queryFn: async () => {
      if (!selectedRestaurantEmail) return [];
      const res = await axiosSecure.get(`/foodDishes`); 
      return res.data.filter(dish => dish.email === selectedRestaurantEmail);
    },
    enabled: !!selectedRestaurantEmail,
  });

  // Effect: Reset choices when restaurant changes
  useEffect(() => {
    if (selectedRestaurantEmail) {
      const rInfo = restaurants.find(r => r.email === selectedRestaurantEmail);
      setSelectedRestaurantInfo(rInfo);
      const layoutInfo = allLayouts.find(l => l.email === selectedRestaurantEmail);
      setSelectedLayout(layoutInfo);
      
      setValue('tableType', '');
      setValue('time', '');
      setSelectedDishes([]); 
    }
  }, [selectedRestaurantEmail, restaurants, allLayouts, setValue]);

  // --- LOGIC: Handle Food Selection (Select Option Style) ---
  const handleAddDish = (e) => {
    const dishId = e.target.value;
    if (!dishId) return;

    const dishToAdd = restaurantMenu.find(d => d._id === dishId);
    
    // Add to selection
    setSelectedDishes([...selectedDishes, { 
      ...dishToAdd,
      uniqueId: Date.now() // unique ID for frontend list rendering
    }]);

    // Reset the select dropdown
    e.target.value = "";
  };

  const removeDish = (uniqueId) => {
    setSelectedDishes(selectedDishes.filter(d => d.uniqueId !== uniqueId));
  };

  // --- MANUAL TIME SLOTS ---
  const manualTimeSlots = [
    { value: "12:00", label: "12:00 PM", display: "12:00 PM" },
    { value: "14:00", label: "02:00 PM", display: "02:00 PM" },
    { value: "16:00", label: "04:00 PM", display: "04:00 PM" },
    { value: "18:00", label: "06:00 PM", display: "06:00 PM" },
    { value: "20:00", label: "08:00 PM", display: "08:00 PM" },
    { value: "22:00", label: "10:00 PM", display: "10:00 PM" }
  ];

  // Function to check if a time slot is disabled
  const isTimeSlotDisabled = (timeValue) => {
    if (!selectedTableType || !selectedLayout || !selectedDate) return true; 

    const duration = selectedLayout.booking_duration || 90;
    const totalTablesOfType = selectedLayout.tables.filter(t => t.type === selectedTableType).length;
    
    // Parse the selected time
    const slotStart = parse(timeValue, 'HH:mm', new Date());
    const slotEnd = addMinutes(slotStart, duration);

    // Check for overlapping bookings
    const overlappingBookings = existingBookings.filter(booking => {
      if (booking.tableType !== selectedTableType) return false;
      
      const bookingStart = parse(booking.time, 'HH:mm', new Date());
      const bookingDuration = booking.duration || 90;
      const bookingEnd = addMinutes(bookingStart, bookingDuration);
      
      // Check if time slots overlap
      const hasOverlap = isBefore(slotStart, bookingEnd) && isAfter(slotEnd, bookingStart);
      return hasOverlap;
    });

    // If number of overlapping bookings equals or exceeds available tables, disable the slot
    return overlappingBookings.length >= totalTablesOfType;
  };

  const totalEstimatedPrice = selectedDishes.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);

  const onSubmit = async (data) => {
    try {
      const tableDetails = selectedLayout?.tables.find(t => t.type === data.tableType);
      
      // Find the selected time display label
      const selectedTimeSlot = manualTimeSlots.find(slot => slot.value === data.time);
      
      const bookingData = {
        restaurantName: selectedRestaurantInfo?.restaurant_name,
        restaurantEmail: data.restaurantEmail,
        customerName: data.name,
        customerEmail: data.email,
        phone: data.phone,
        partySize: parseInt(data.partySize),
        date: data.date,
        time: data.time,
        timeDisplay: selectedTimeSlot?.display || data.time,
        tableId: tableDetails?.table_id || 'Any',
        tableType: data.tableType, 
        duration: selectedLayout?.booking_duration || 90,
        preOrderMenu: selectedDishes.map(dish => ({
          _id: dish._id,
          title: dish.title,
          price: dish.price,
          image: dish.image
        })),
        totalEstimatedPrice: totalEstimatedPrice,
        createdAt: new Date(),
        status: 'pending'
      };

      console.log("Booking Data:", bookingData);

      const res = await axiosSecure.post('/bookTable', bookingData);

      if (res.data.insertedId || res.data.success) {
        reset();
        setSelectedRestaurantInfo(null);
        setSelectedLayout(null);
        setSelectedDishes([]);
        refetchBookings(); 
        Swal.fire({
          title: '🎉 Booking Confirmed!',
          text: `Table reserved successfully for ${selectedTimeSlot?.display}! Total Bill: $${totalEstimatedPrice.toFixed(2)}`,
          icon: 'success',
          confirmButtonColor: '#db2777',
        });
      }
    } catch (error) {
      console.error('Error booking table:', error);
      Swal.fire({
        icon: 'error',
        title: 'Booking Failed',
        text: error.response?.data?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 py-20">
      
      {/* Header */}
      <div className="bg-pink-50 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Reserve Your <span className="text-pink-600">Table</span>
          </h1>
          <p className="text-gray-600">Select restaurant, choose food, and pick your time.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-6">
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-gray-100">
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* 1. RESTAURANT SELECTION */}
            <div className="space-y-4">
              <label className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Store className="text-pink-500" /> Select Restaurant
              </label>
              
              <select
                {...register("restaurantEmail", { required: "Please select a restaurant" })}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-lg focus:border-pink-500 outline-none"
              >
                <option value="">-- Choose a Restaurant --</option>
                {restaurants.map((res) => (
                  <option key={res._id} value={res.email}>
                    {res.restaurant_name} ({res.location})
                  </option>
                ))}
              </select>

              {/* Selected Info */}
              {selectedRestaurantInfo && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-4 flex items-start gap-4">
                  <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                    <Info size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-800 text-lg">{selectedRestaurantInfo.restaurant_name}</h3>
                    <p className="text-blue-600 text-sm flex items-center gap-1 mt-1">
                      <MapPin size={14}/> {selectedRestaurantInfo.location}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {selectedRestaurantEmail && (
              <div className="animate-fade-in-up space-y-10">
                <hr className="border-gray-200" />
                
                {/* 2. DATE & PERSONAL INFO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Select Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-3.5 text-gray-400 w-5 h-5"/>
                      <input
                        {...register("date", { required: true })}
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-12 pr-5 py-3 bg-gray-50 border rounded-xl focus:border-pink-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      {...register("name", { required: true })} 
                      placeholder="Name" 
                      className="px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:border-pink-500" 
                    />
                    <input 
                      {...register("phone", { required: true })} 
                      placeholder="Phone" 
                      className="px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:border-pink-500" 
                    />
                  </div>
                  <input 
                    {...register("email", { required: true })} 
                    type="email" 
                    placeholder="Email" 
                    className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:border-pink-500" 
                  />
                  
                </div>

                {/* 3. MENU PRE-ORDER */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <UtensilsCrossed className="text-pink-500" /> Pre-order Menu <span className="text-sm font-normal text-gray-500">(Optional)</span>
                    </label>
                  </div>

                  {/* Dropdown Selection */}
                  <div className="relative">
                    <select 
                      onChange={handleAddDish}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-pink-500 appearance-none"
                    >
                      <option value="">-- Add Items to your Order --</option>
                      {restaurantMenu.map(dish => (
                        <option key={dish._id} value={dish._id}>
                          {dish.title} - ${dish.price} ({dish.category})
                        </option>
                      ))}
                    </select>
                    <PlusCircle className="absolute right-4 top-3.5 text-pink-500 w-5 h-5 pointer-events-none"/>
                  </div>

                  {/* Selected Items List */}
                  {selectedDishes.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">Selected Items</h4>
                      <ul className="space-y-3">
                        {selectedDishes.map((dish) => (
                          <li key={dish.uniqueId} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3">
                              <img src={dish.image} alt={dish.title} className="w-10 h-10 rounded-md object-cover"/>
                              <div>
                                <p className="font-bold text-gray-800 text-sm">{dish.title}</p>
                                <p className="text-xs text-pink-600 font-semibold">${dish.price}</p>
                              </div>
                            </div>
                            <button 
                              type="button" 
                              onClick={() => removeDish(dish.uniqueId)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={18}/>
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                        <span className="font-bold text-gray-600">Total Estimated Cost:</span>
                        <span className="font-bold text-xl text-pink-600">${totalEstimatedPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. TABLE TYPE */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <Utensils className="text-pink-500" /> Select Table
                    </label>
                  </div>
                  {!selectedLayout ? (
                    <div className="text-center p-6 bg-gray-50 rounded-xl border border-dashed">
                      <p>Loading Layout...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[...new Set(selectedLayout.tables.map(t => t.type))].map((type, idx) => {
                        const tInfo = selectedLayout.tables.find(t => t.type === type);
                        return (
                          <div 
                            key={idx}
                            onClick={() => setValue('tableType', type)}
                            className={`
                              cursor-pointer rounded-xl p-4 border-2 transition-all relative
                              ${selectedTableType === type 
                                ? 'border-pink-500 bg-pink-50 shadow-md' 
                                : 'border-gray-100 bg-white hover:border-pink-200'}
                            `}
                          >
                            <h4 className="font-bold text-gray-800">{type}</h4>
                            <p className="text-sm text-gray-500 mt-1">Capacity: {tInfo?.capacity} Persons</p>
                            {selectedTableType === type && <CheckCircle className="absolute top-2 right-2 text-pink-500 w-5 h-5"/>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <input type="hidden" {...register("tableType", { required: "Select a table" })} />
                  {errors.tableType && <p className="text-red-500 text-sm mt-1">{errors.tableType.message}</p>}
                </div>

                {/* 5. TIME SLOTS (MANUAL SELECTION) */}
                {selectedDate && selectedTableType && (
                  <div className="space-y-4 animate-fade-in-up">
                    <label className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <Clock className="text-pink-500" /> Select Time Slot
                    </label>
                    <p className="text-sm text-gray-500">
                      Available time slots for {selectedDate}
                    </p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {manualTimeSlots.map((slot, index) => {
                        const disabled = isTimeSlotDisabled(slot.value);
                        return (
                          <button
                            key={index}
                            type="button"
                            disabled={disabled}
                            onClick={() => setValue('time', slot.value)}
                            className={`
                              py-4 px-3 rounded-xl text-sm font-semibold border transition-all duration-200 flex flex-col items-center justify-center
                              ${selectedTime === slot.value 
                                ? 'bg-pink-600 text-white border-pink-600 shadow-lg scale-105' 
                                : disabled
                                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
                                  : 'bg-white text-gray-700 border-gray-200 hover:border-pink-400 hover:text-pink-500 hover:bg-pink-50'}
                            `}
                          >
                            <span className="text-base font-bold">{slot.display}</span>
                            {disabled && <span className="text-xs uppercase font-bold mt-1 text-red-400">Booked</span>}
                            {!disabled && selectedTime === slot.value && (
                              <span className="text-xs mt-1">Selected</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <input type="hidden" {...register("time", { required: "Select a time" })} />
                    {errors.time && <p className="text-red-500 text-sm mt-1">Please select an available time slot.</p>}
                    
                    {/* Display booking duration */}
                    {selectedLayout?.booking_duration && (
                      <div className="bg-blue-50 p-3 rounded-lg mt-2">
                        <p className="text-sm text-blue-700">
                          <strong>Note:</strong> Each booking lasts for <strong>{selectedLayout.booking_duration} minutes</strong>. 
                          Please ensure your selected time doesn't overlap with existing bookings.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedTime}
                  className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold text-lg rounded-xl shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                >
                  {isSubmitting ? 'Confirming...' : `Confirm Booking ${selectedDishes.length > 0 ? `($${totalEstimatedPrice.toFixed(2)})` : ''}`}
                </button>

              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookTable;
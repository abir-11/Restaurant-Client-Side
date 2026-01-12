import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { Utensils, Calendar, Clock, Users, MapPin, CheckCircle } from 'lucide-react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
const BookTable = () => {
  const axiosSecure = useAxiosSecure();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      seatingPreference: 'Any',
    },
  });

  const selectedSeating = watch('seatingPreference');

  const onSubmit = async (data) => {
    try {
      // Prepare the data for the API call
      const bookingData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        partySize: parseInt(data.partySize),
        date: data.date,
        time: data.time,
        menuInterest: data.menu,
        seatingPreference: data.seatingPreference,
        createdAt: new Date(),
      };

      // Post the data to the server
      const res = await axiosSecure.post('/bookTable', bookingData);

      if (res.data.success || res.data.insertedId) {
        reset();
        Swal.fire({
          title: 'Booking Confirmed!',
          text: 'Your table has been successfully booked. We look forward to seeing you!',
          icon: 'success',
          confirmButtonColor: '#db2777', 
        });
      }
    } catch (error) {
      console.error('Error booking table:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong while processing your booking. Please try again.',
        confirmButtonColor: '#db2777',
      });
    }
  };

  const seatingOptions = [
    {
      title: "Window Seat",
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Enjoy natural light and a view of the city while you dine. Perfect for a relaxing meal."
    },
    {
      title: "Corner Booth",
      image: "https://i.ibb.co.com/QFytV727/l-shape-restaurant-booth-corner.avif",
      description: "A cozy and intimate spot, ideal for private conversations and romantic dinners."
    },
    {
      title: "Outdoor Patio",
      image: "https://i.ibb.co.com/bRqhhJqv/istockphoto-949988530-612x612.jpg",
      description: "Dine al fresco and soak up the atmosphere. Great for sunny days and pleasant evenings."
    },
    {
      title: "Vibrant Center",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Be at the heart of the action. Experience the lively ambiance of the restaurant."
    }
  ];

  const seatingButtons = ['Any', 'Window', 'Corner', 'Outdoor', 'Center'];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 pb-20">
      {/* Header/Hero Section */}
      <div className="bg-pink-50 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Book Your <span className="text-pink-500">Perfect Table</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Reserve your spot now for an unforgettable dining experience. Choose your preferred seating and let us take care of the rest.
          </p>
        </div>
      </div>

      {/* Seating Options Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-12">
        <h2 className="text-3xl font-bold text-center">Choose Your Experience</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {seatingOptions.map((option, index) => (
            <div key={index} className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white">
              <img src={option.image} alt={option.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">{option.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{option.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Form Section */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
          <h2 className="text-3xl font-bold text-center mb-10">Book Your <span className="text-pink-500">Table!</span></h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Row 1: Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <input
                  {...register("name", { required: "Name is required" })}
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-full text-gray-700 focus:outline-none focus:border-pink-400 focus:bg-white transition-colors"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1 ml-4">{errors.name.message}</p>}
              </div>
              <div>
                <input
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  type="email"
                  placeholder="email"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-full text-gray-700 focus:outline-none focus:border-pink-400 focus:bg-white transition-colors"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1 ml-4">{errors.email.message}</p>}
              </div>
            </div>

            {/* Row 2: Phone & Party Size */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <input
                  {...register("phone", { required: "Phone number is required" })}
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-full text-gray-700 focus:outline-none focus:border-pink-400 focus:bg-white transition-colors"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1 ml-4">{errors.phone.message}</p>}
              </div>
              <div>
                <input
                  {...register("partySize", { 
                    required: "Party size is required",
                    min: { value: 1, message: "Must be at least 1 person" }
                  })}
                  type="number"
                  placeholder="Party Size"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-full text-gray-700 focus:outline-none focus:border-pink-400 focus:bg-white transition-colors"
                />
                {errors.partySize && <p className="text-red-500 text-sm mt-1 ml-4">{errors.partySize.message}</p>}
              </div>
            </div>

            {/* Row 3: Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <input
                  {...register("date", { required: "Date is required" })}
                  type="date"
                  placeholder="Date"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-full text-gray-700 focus:outline-none focus:border-pink-400 focus:bg-white transition-colors"
                />
                {errors.date && <p className="text-red-500 text-sm mt-1 ml-4">{errors.date.message}</p>}
              </div>
              <div>
                <input
                  {...register("time", { required: "Time is required" })}
                  type="time"
                  placeholder="Time"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-full text-gray-700 focus:outline-none focus:border-pink-400 focus:bg-white transition-colors"
                />
                {errors.time && <p className="text-red-500 text-sm mt-1 ml-4">{errors.time.message}</p>}
              </div>
            </div>

            {/* Row 4: Menu */}
            <div>
              <input
                {...register("menu")}
                type="text"
                placeholder="Menu (Optional - e.g., Vegetarian, Special Occasion)"
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-full text-gray-700 focus:outline-none focus:border-pink-400 focus:bg-white transition-colors"
              />
            </div>

            {/* Seating Preferences */}
            <div className="space-y-4">
              <label className="block text-gray-700 font-semibold ml-4 mb-2">Seating Preference</label>
              <div className="flex flex-wrap justify-center gap-4">
                {seatingButtons.map((option) => (
                  <button
                    type="button"
                    key={option}
                    onClick={() => setValue('seatingPreference', option)}
                    className={`px-8 py-3 rounded-full border-2 font-medium transition-all duration-200 ${
                      selectedSeating === option
                        ? 'bg-pink-500 text-white border-pink-500 shadow-md'
                        : 'bg-white text-pink-500 border-pink-300 hover:bg-pink-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <input type="hidden" {...register("seatingPreference")} />
            </div>

            {/* Submit Button */}
            <div className="mt-10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-300 disabled:opacity-70"
              >
                {isSubmitting ? 'Booking...' : 'Book Now'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookTable;
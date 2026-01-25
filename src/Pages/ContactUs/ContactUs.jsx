import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { MapPin, Phone, Mail, Store, User, ChefHat, Send } from 'lucide-react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import useAuth from '../../Hooks/useAuth';

const ContactUs = () => {
    const { user,loading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm();



    // ২. ফর্মের ডিফল্ট ভ্যালু সেট করা (নাম এবং ইমেইল)
    useEffect(() => {
        if (user) {
            setValue('name', user?.displayName || '');
            setValue('email', user?.email || '');
        }
    }, [user, setValue]);


    // ৪. ফর্ম সাবমিট হ্যান্ডলার
    const onSubmit = async (data) => {
        try {
            const applicationData = {
                owner_name: data.name,
                email: data.email,
                phone: data.phone,
                restaurant_name: data.restaurantName,
                location: data.location,
                message: data.message,
                status: 'pending',
                applied_date: new Date().toISOString()
            };

            await axiosSecure.post('/restaurantApplications', applicationData);

            Swal.fire({
                title: 'Success',
                text: 'Application submitted successfully!',
                icon: 'success',
                confirmButtonColor: '#3085d6',
            });

            reset();
        } catch (error) {
            Swal.fire({
                title: 'Submission Failed',
                text: error.response?.data?.message || error.message || 'Something went wrong.',
                icon: 'error',
                confirmButtonColor: '#d33',
            });
        }
    };


    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">

            {/* Header / Hero Section */}
            <div className="relative bg-gray-900 text-white py-20 md:py-28">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop"
                        alt="Restaurant Background"
                        className="w-full h-full object-cover opacity-30"
                    />
                </div>
                <div className="relative max-w-6xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Become a <span className="text-pink-500">Partner</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                        Own a restaurant? Join BookerIt to streamline reservations, manage tables, and grow your business.
                    </p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="max-w-6xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Left Column: Information */}
                    <div className="space-y-10">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Why Partner with Us?</h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Join hundreds of top-tier restaurants using our platform. We provide comprehensive dashboards for owners.
                            </p>
                            <div className="space-y-6">
                                <ContactCard icon={<Store className="w-6 h-6" />} title="Business Expansion" content="Reach more customers digitally." />
                                <ContactCard icon={<Phone className="w-6 h-6" />} title="Support Hotline" content={<a href="tel:+8801306979918" className="hover:underline">+880 1306 979918</a>} />
                                <ContactCard icon={<Mail className="w-6 h-6" />} title="Email Us" content={<a href='tomail:malam2331103@bscse.uiu.ac.bd'>malam2331103@bscse.uiu.ac.bd</a>} />
                                <ContactCard icon={<MapPin className="w-6 h-6" />} title="Office" content="Banani, Dhaka 1213" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="bg-pink-50/50 p-8 md:p-10 rounded-3xl shadow-lg border border-pink-100">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <ChefHat className="text-pink-500" />
                            Register Your Restaurant
                        </h3>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                            {/* Owner Name (Read Only) */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Owner's Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                    <input
                                        {...register("name", { required: "Owner Name is required" })}
                                        type="text"
                                        placeholder="John Doe"
                                        readOnly // Name usually comes from Auth profile
                                        className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-200 bg-base-100 cursor-not-allowed focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Restaurant Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Restaurant Name</label>
                                <div className="relative">
                                    <Store className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                    <input
                                        {...register("restaurantName", { required: "Restaurant Name is required" })}
                                        type="text"
                                        placeholder="e.g. The Spicy Crab"
                                        className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all bg-white"
                                    />
                                </div>
                                {errors.restaurantName && <span className="text-red-500 text-sm mt-1">{errors.restaurantName.message}</span>}
                            </div>

                            {/* Email & Phone */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Business Email</label>
                                    <input
                                        {...register("email", { required: "Email is required" })}
                                        type="email"
                                        readOnly
                                        className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-base-100 cursor-not-allowed focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        {...register("phone", { required: "Phone is required" })}
                                        type="tel"
                                        placeholder="+880 1XXX..."
                                        className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all bg-white"
                                    />
                                    {errors.phone && <span className="text-red-500 text-sm mt-1">{errors.phone.message}</span>}
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Restaurant Address</label>
                                <input
                                    {...register("location", { required: "Location is required" })}
                                    type="text"
                                    placeholder="Full address of your restaurant"
                                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all bg-white"
                                />
                                {errors.location && <span className="text-red-500 text-sm mt-1">{errors.location.message}</span>}
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Information</label>
                                <textarea
                                    {...register("message")}
                                    rows="4"
                                    placeholder="Tell us about your restaurant..."
                                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all bg-white resize-none"
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 cursor-pointer text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        Processing... <span className="loading loading-spinner loading-xs"></span>
                                    </span>
                                ) : (
                                    <>
                                        Submit Application <Send className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

const ContactCard = ({ icon, title, content }) => (
    <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 flex-shrink-0">
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-gray-900">{title}</h4>
            <div className="text-gray-600 text-sm mt-1">{content}</div>
        </div>
    </div>
);

export default ContactUs;
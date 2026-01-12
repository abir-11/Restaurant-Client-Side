import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react';

const ContactUs = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (data) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log(data);
        reset();
        Swal.fire({
            title: 'Message Sent!',
            text: 'Thank you for reaching out. We will get back to you shortly.',
            icon: 'success',
            confirmButtonColor: '#ec4899', // Pink-500
        });
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">

            {/* Header / Hero Section */}
            <div className="relative bg-gray-900 text-white py-20 md:py-28">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="https://i.ibb.co.com/LX4h8zDs/p1.webp"
                        alt="Office"
                        className="w-full h-full object-cover opacity-30"
                    />
                </div>
                <div className="relative max-w-6xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Get in <span className="text-pink-500">Touch</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                        Have questions about BookerIt? We're here to help you optimize your restaurant management.
                    </p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="max-w-6xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Left Column: Contact Info & Map */}
                    <div className="space-y-10">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Whether you're a restaurant owner looking to integrate our system or a diner with a booking query, our team is ready to assist you.
                            </p>

                            <div className="space-y-6">
                                {/* Address */}
                                <ContactCard
                                    icon={<MapPin className="w-6 h-6" />}
                                    title="Visit Us"
                                    content="House 12, Road 5, Block C, Banani, Dhaka 1213, Bangladesh"
                                />

                                <ContactCard
                                    icon={<Phone className="w-6 h-6" />}
                                    title="Call Us"
                                    content={
                                        <a
                                            href="tel:+8801306979918"
                                            className="hover:underline"
                                        >
                                            +880 1306 979918
                                        </a>
                                    }
                                />


                                {/* Email */}
                                <ContactCard
                                    icon={<Mail className="w-6 h-6" />}
                                    title="Email Us"
                                    content={
                                        <a
                                            href="mailto:malam2331103@bscse.uiu.ac.bd"
                                            className="hover:underline"
                                        >
                                            malam2331103@bscse.uiu.ac.bd
                                        </a>
                                    }
                                />

                                {/* Hours */}
                                <ContactCard
                                    icon={<Clock className="w-6 h-6" />}
                                    title="Business Hours"
                                    content={
                                        <div>
                                            <p>Mon - Fri: 9:00 AM - 11:00 PM</p>
                                            <p>Sat - Sun: 2:00 PM - 11:00 PM</p>
                                        </div>
                                    }
                                />
                            </div>
                        </div>

                        {/* Embedded Map */}
                        <div className="rounded-2xl overflow-hidden shadow-lg h-64 border border-gray-200">
                            <iframe
                                src="https://www.google.com/maps?q=House+12,+Road+5,+Block+C,+Banani,+Dhaka+1213,+Bangladesh&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Banani Office Location"
                            ></iframe>
                        </div>

                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="bg-pink-50/50 p-8 md:p-10 rounded-3xl shadow-lg border border-pink-100">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <MessageSquare className="text-pink-500" />
                            Send a Message
                        </h3>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                            {/* Name Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                <input
                                    {...register("name", { required: "Name is required" })}
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all bg-white"
                                />
                                {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name.message}</span>}
                            </div>

                            {/* Email Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                <input
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    type="email"
                                    placeholder="name@example.com"
                                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all bg-white"
                                />
                                {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
                            </div>

                            {/* Subject Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                                <input
                                    {...register("subject", { required: "Subject is required" })}
                                    type="text"
                                    placeholder="How can we help?"
                                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all bg-white"
                                />
                                {errors.subject && <span className="text-red-500 text-sm mt-1">{errors.subject.message}</span>}
                            </div>

                            {/* Message Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                                <textarea
                                    {...register("message", { required: "Message is required" })}
                                    rows="5"
                                    placeholder="Write your message here..."
                                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all bg-white resize-none"
                                ></textarea>
                                {errors.message && <span className="text-red-500 text-sm mt-1">{errors.message.message}</span>}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 cursor-pointer text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <span>Sending...</span>
                                ) : (
                                    <>
                                        Send Message <Send className="w-5 h-5" />
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

// Sub-component for Contact Cards
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
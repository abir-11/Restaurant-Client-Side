import React, { useState } from 'react';
import { Zap, TrendingUp, Users, MapPin, Smartphone, Sliders, ChevronDown, ChevronUp } from 'lucide-react';

const BookerItLanding = () => {
  // State for tracking which FAQ is open
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "How does the smart algorithm work?",
      answer: "Our algorithm analyzes table combinations, reservation times, and party sizes in real-time. It automatically assigns the most efficient table to maximize your restaurant's capacity."
    },
    {
      question: "Can I customize the table layout?",
      answer: "Yes! BookerIt provides an intuitive drag-and-drop floor plan editor. You can replicate your exact restaurant layout and define logic for which tables can be pushed together."
    },
    {
      question: "Does it integrate with my POS system?",
      answer: "BookerIt integrates with most major POS systems including Toast, Square, and Clover, allowing for real-time table status updates directly on your host stand map."
    },
    {
      question: "Is there a fee for diners to book?",
      answer: "No, BookerIt is completely free for diners. We charge restaurants a flat monthly subscription fee based on their seating capacity, with no per-cover charges."
    }
  ];

  return (
    <div className="min-h-screen  font-sans text-gray-800">
      
      {/* Container */}
      <div className="max-w-11/12 mx-auto px-4 py-12 md:py-20 space-y-24">

        {/* SECTION 1: About & Header (Same as before) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              About <span className="text-pink-500">BookerIt</span>
            </h1>
            <p className="text-lg text-gray-600">
              Revolutionizing restaurant table management with intelligent seat assignment.
            </p>
          </div>
          <div className="md:w-1/2 relative">
            <img 
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Modern Restaurant Interior" 
              className="rounded-3xl shadow-lg w-full h-64 object-cover"
            />
          </div>
        </div>

        {/* SECTION 2: Our Mission (Same as before) */}
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-5/12">
            <img 
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80" 
              alt="Restaurant Tables" 
              className="rounded-3xl shadow-xl w-full h-[500px] object-cover"
            />
          </div>
          <div className="md:w-7/12 space-y-6">
            <h2 className="text-4xl font-bold text-right md:text-left">
              Our <span className="text-pink-500">Mission</span>
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed text-sm md:text-base text-justify">
              <p>
                At BookerIt, we're dedicated to solving the complex challenge of restaurant table management through smart technology. Our mission is to optimize the dining experience.
              </p>
              <p>
                We believe that every table matters. Our platform ensures that a 2-person party never blocks a table meant for 6, helping restaurants serve more customers efficiently.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 3: Why Choose BookerIt (Same as before) */}
        <div className="space-y-12">
          <h2 className="text-4xl font-bold text-center">
            Why Choose <span className="text-pink-500">BookerIt</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={<Zap className="w-5 h-5 text-white" />} title="Smart Algorithm" description="Intelligent allocation system finds the perfect table based on party size." />
            <FeatureCard icon={<TrendingUp className="w-5 h-5 text-white" />} title="Optimized Revenue" description="Maximize seating capacity and revenue by ensuring every table is used efficiently." />
            <FeatureCard icon={<Users className="w-5 h-5 text-white" />} title="Customer Preferences" description="Allow diners to choose their preferred seating location – window, corner, or outdoor." />
            <FeatureCard icon={<MapPin className="w-5 h-5 text-white" />} title="No Double Bookings" description="Real-time availability checking ensures no table is double-booked." />
            <FeatureCard icon={<Smartphone className="w-5 h-5 text-white" />} title="Auto-Management" description="Automated table holds and no-show cancellations mean less manual work." />
            <FeatureCard icon={<Sliders className="w-5 h-5 text-white" />} title="Easy Customization" description="Configure table layout, capacities, and booking policies easily." />
          </div>
        </div>

        {/* SECTION 4: How It Works (Same as before) */}
        <div className="bg-pink-50 rounded-2xl p-8 md:p-12">
          <h3 className="text-2xl font-bold text-center mb-10">
            How <span className="text-pink-500">BookerIt</span> Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <Step number="1" title="Search" desc="Browse restaurants by name or cuisine" />
            <Step number="2" title="Select" desc="Enter party size, date, and time" />
            <Step number="3" title="Smart Match" desc="Algorithm finds the best table" />
            <Step number="4" title="Confirm" desc="Book instantly with confirmation" />
          </div>
        </div>

        {/* SECTION 5: NEW FAQ SECTION */}
        <div className=" w-full">
          <h2 className="text-4xl font-bold text-center mb-10">
            Frequently Asked <span className="text-pink-500">Questions</span>
          </h2>
          
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div 
                key={index} 
                className={`border rounded-xl transition-all duration-200 ${
                  openFaqIndex === index ? 'border-pink-500 bg-pink-50/30' : 'border-gray-200 hover:border-pink-200'
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                >
                  <span className={`font-bold text-lg ${openFaqIndex === index ? 'text-pink-600' : 'text-gray-800'}`}>
                    {faq.question}
                  </span>
                  {openFaqIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-pink-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                
                {openFaqIndex === index && (
                  <div className="px-5 pb-5 pt-0">
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base border-t border-pink-100 pt-3">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 6: Stats Footer (Same as before) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard highlight="100%" text="Smart Table Matching" />
          <StatCard highlight="30%" text="Average Revenue Increase" />
          <StatCard highlight="24/7" text="Automated Operations" />
        </div>

      </div>
    </div>
  );
};

// Sub-components
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-pink-50 p-6 rounded-xl hover:shadow-md transition-shadow">
    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center mb-4 shadow-sm">
      {icon}
    </div>
    <h3 className="font-bold text-lg mb-2">{title}</h3>
    <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const Step = ({ number, title, desc }) => (
  <div className="flex flex-col items-center text-center z-10">
    <div className="w-12 h-12 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 shadow-md">
      {number}
    </div>
    <h4 className="font-bold mb-2">{title}</h4>
    <p className="text-xs text-gray-600 px-2">{desc}</p>
  </div>
);

const StatCard = ({ highlight, text }) => (
  <div className="bg-pink-100 p-8 rounded-xl flex flex-col justify-center h-32">
    <span className="text-pink-500 font-bold text-2xl mb-1">{highlight}</span>
    <span className="text-gray-800 font-medium">{text}</span>
  </div>
);

export default BookerItLanding;
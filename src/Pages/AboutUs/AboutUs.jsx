import React from "react";
import { Utensils, Heart, Leaf, Users, Award } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">

      {/* Hero Section */}
      <section className="bg-pink-50 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Welcome to <span className="text-pink-500">BookerIt</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-600">
          A modern restaurant where flavor meets comfort. We serve unforgettable
          meals crafted with passion, quality ingredients, and love.
        </p>
      </section>

      {/* Our Story */}
      <section className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
        <img
          src="https://images.unsplash.com/photo-1552566626-52f8b828add9"
          alt="Restaurant Interior"
          className="rounded-3xl shadow-xl"
        />
        <div>
          <h4 className="text-pink-500 font-semibold uppercase mb-2">
            Our Story
          </h4>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Crafted With Passion Since 2023
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            BookerIt was founded with a simple goal — to bring people together
            over great food. What started as a small idea has grown into a
            welcoming dining space loved by food enthusiasts.
          </p>
          <p className="text-gray-600 leading-relaxed">
            From fresh ingredients to warm hospitality, every detail at BookerIt
            is designed to give you a memorable experience.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Makes Us Special
          </h2>
          <p className="text-gray-600">
            The values that define BookerIt Restaurant
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          <ValueCard
            icon={<Utensils />}
            title="Quality Food"
            desc="Every dish is prepared with fresh ingredients and expert care."
          />
          <ValueCard
            icon={<Heart />}
            title="Warm Hospitality"
            desc="We believe great food tastes even better with great service."
          />
          <ValueCard
            icon={<Leaf />}
            title="Fresh & Clean"
            desc="Hygiene, sustainability, and freshness are always our priority."
          />
        </div>
      </section>

      {/* Team */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Meet Our <span className="text-pink-500">Team</span>
        </h2>
        <p className="text-gray-600 mb-12">
          Passionate people behind your favorite meals
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          <TeamMember
            name="Alex fernandez"
            role="Head Chef"
            image="https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
          />
          <TeamMember
            name="Sofia Martinez"
            role="Restaurant Manager"
            image="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"
          />
          <TeamMember
            name="Liam Johnson"
            role="Sous Chef"
            image="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-pink-500 text-white py-20 text-center">
        <Award className="w-14 h-14 mx-auto mb-6 opacity-80" />
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Dine With Us Today
        </h2>
        <p className="text-pink-100 max-w-xl mx-auto mb-8">
          Experience flavors you’ll remember. Reserve your table now and enjoy
          the taste of BookerIt.
        </p>
        <button className="px-8 py-3 bg-white text-pink-600 font-semibold rounded-full hover:bg-gray-100 transition">
          Book a Table
        </button>
      </section>
    </div>
  );
};

/* Components */

const ValueCard = ({ icon, title, desc }) => (
  <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
    <div className="w-12 h-12 bg-pink-100 text-pink-500 rounded-xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-500 text-sm">{desc}</p>
  </div>
);

const TeamMember = ({ image, name, role }) => (
  <div className="text-center">
    <img
      src={image}
      alt={name}
      className="w-full h-80 object-cover rounded-2xl shadow mb-4"
    />
    <h3 className="text-xl font-bold">{name}</h3>
    <p className="text-pink-500">{role}</p>
  </div>
);

export default AboutUs;

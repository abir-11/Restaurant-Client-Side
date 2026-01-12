import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import BookerAI from "../../assets/ChatGPT Image Dec 2, 2025, 12_28_43 AM 1.png";
import { Link } from "react-router";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 font-sans">
            <div className="container mx-auto px-6 md:px-12">

                {/* Main Footer Content - 4 Columns Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/*  Brand & Logo */}
                    <div className="space-y-4">
                        <Link to="/" className="btn btn-ghost bg-gray-800">
                            <img src={BookerAI} alt="BookerAI Logo" className="w-32" />
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mt-4">
                            Revolutionizing restaurant table management with intelligent seat assignment.
                        </p>
                    </div>

                    {/*  Quick Links */}
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-6 relative inline-block">
                            Quick Links
                            <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-pink-500"></span>
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className="hover:text-pink-500 hover:pl-2 transition-all duration-300 block">Home</Link>
                            </li>
                            <li>
                                <Link to="/our-menu" className="hover:text-pink-500 hover:pl-2 transition-all duration-300 block">Our Menu</Link>
                            </li>
                            <li>
                                <Link to="/book-table" className="hover:text-pink-500 hover:pl-2 transition-all duration-300 block">Book a Table</Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-pink-500 hover:pl-2 transition-all duration-300 block">Contact Us</Link>
                            </li>
                        </ul>
                    </div>

                    {/*  Contact Info */}
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-6 relative inline-block">
                            Contact Info
                            <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-pink-500"></span>
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <FaMapMarkerAlt className="mt-1 text-pink-500 shrink-0" />
                                <span className="text-sm">House 12, Road 5, Block C, Banani, Dhaka 1213, Bangladesh</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FaPhoneAlt className="text-pink-500 shrink-0" />
                                <a
                                    href="https://wa.me/8801306979918"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm hover:underline"
                                >
                                    +880 1306 979918
                                </a>
                            </li>

                            <li className="flex items-center gap-3">
                                <FaEnvelope className="text-pink-500 shrink-0" />
                                <a
                                    href="mailto:malam2331103@bscse.uiu.ac.bd"
                                    className="text-sm hover:underline"
                                >
                                    malam2331103@bscse.uiu.ac.bd
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Socials & Hours */}
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-6 relative inline-block">
                            Follow Us
                            <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-pink-500"></span>
                        </h3>
                        <div className="flex space-x-4 mb-8">
                            <Link to='https://www.facebook.com/arafatalom.abir.1' className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all duration-300">
                                <FaFacebookF />
                            </Link>
                            
                            <Link to='https://x.com/arafat1abir' className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all duration-300">
                                <FaTwitter />
                            </Link>
                            <Link to='https://www.linkedin.com/in/md-arafat-alam-abir/' className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all duration-300">
                                <FaLinkedinIn />
                            </Link>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-semibold mb-2">Business Hours:</p>
                            <p className="text-sm">Mon - Fri: 9AM - 11PM</p>
                            <p className="text-sm">Sat - Sun: 2PM - 11PM</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar: Copyright */}
                <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} BookerAI. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="/privacy" className="hover:text-pink-500 transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-pink-500 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
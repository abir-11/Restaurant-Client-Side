import React, { use } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import hero1 from '../../assets/photo-15.jpg';
import hero2 from '../../assets/banner1.png';
import hero3 from '../../assets/b1.jpg';
import FoodCardShow from './FoodCardShow';
import BookerItLanding from '../BookerItLanding/BookerItLanding';
import useAuth from '../../Hooks/useAuth';
import { useNavigate } from 'react-router';


const Home = () => {
    const { user } = useAuth();
    const navigate=useNavigate();
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="w-full">
                {/* Swiper Custom Styles */}
                <style>
                    {`
          /* Pagination dots */
          .swiper-pagination-bullet {
            width: 10px;
            height: 10px;
            background: rgba(255,255,255,0.6);
            opacity: 1;
            margin: 0 6px !important;
            border-radius: 9999px;
            transition: all 0.3s ease;
          }

          .swiper-pagination-bullet-active {
            width: 28px;
            background: #ec4899;
            border-radius: 9999px;
          }

          /* Navigation arrows */
          .swiper-button-next,
          .swiper-button-prev {
            color: #ec4899;
            
            width: 44px;
            height: 44px;
            border-radius: 50%;
          }

          .swiper-button-next:after,
          .swiper-button-prev:after {
            font-size: 18px;
            font-weight: bold;
          }

          .swiper-button-next:hover,
          .swiper-button-prev:hover {
            background: #ec4899;
            color: #fff;
          }

          /* IMPORTANT: remove rounded */
          .swiper {
            width: 100%;
            max-width: 100vw;
            border-radius: 0 !important;
            overflow: hidden;
          }
        `}
                </style>

                <Swiper
                    spaceBetween={0}
                    centeredSlides
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    pagination={{ clickable: true }}
                    navigation
                    modules={[Pagination, Navigation, Autoplay]}
                    className="w-full"
                >
                    {/* Slide 1 */}
                    <SwiperSlide>
                        <div
                            className="h-[400px] md:h-[500px] lg:h-[600px] w-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${hero1})` }}
                        >
                            <div className="w-full h-full bg-gradient-to-r from-black/70 via-black/50 to-transparent flex flex-col justify-center px-6 md:px-12 lg:px-20 text-white">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 max-w-2xl">
                                    Taste the Art of Dining
                                </h2>
                                <p className="text-lg md:text-xl text-gray-200 max-w-xl">
                                    Savor every bite with fresh, flavorful dishes. <br />
                                    Experience a dining journey unlike any other.
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>

                    {/* Slide 2 */}
                    <SwiperSlide>
                        <div
                            className="h-[400px] md:h-[500px] lg:h-[600px] w-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${hero3})` }}
                        >
                            <div className="w-full h-full bg-gradient-to-r from-black/70 via-black/50 to-transparent flex flex-col justify-center px-6 md:px-12 lg:px-20 text-white">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 max-w-2xl">
                                    Where Flavor Meets Elegance <br />
                                </h2>
                                <p className="text-lg md:text-xl text-gray-200 max-w-xl">
                                    From farm-fresh ingredients to your table, <br />
                                    every meal is a masterpiece.
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>

                    {/* Slide 3 */}
                    <SwiperSlide>
                        <div
                            className="h-[400px] md:h-[500px] lg:h-[600px] w-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${hero2})` }}
                        >
                            <div className="w-full h-full bg-gradient-to-r from-black/70 via-black/50 to-transparent flex flex-col justify-center px-6 md:px-12 lg:px-20 text-white">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 max-w-2xl">
                                    Your Table Awaits
                                </h2>
                                <p className="text-lg md:text-xl text-gray-200 max-w-xl">
                                    Delicious moments, crafted with care. <br />
                                    Booker Restaurant — making every meal special.
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
            <div>
                {/* Card Show Section */}
                <div >
                    <FoodCardShow></FoodCardShow>
                </div>

                {/* detailas */}
                <div>
                    <BookerItLanding></BookerItLanding>
                </div>
                <div>
                    <section className="py-20 max-w-11/12 mx-auto text-center bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-fixed bg-center relative rounded-xl mb-10 overflow-hidden">
                        
                        <div className="absolute inset-0 bg-black/60"></div>
                        <div className="relative z-10 text-white max-w-3xl mx-auto px-4">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                Ready to <span className="text-pink-500">BOOK</span> Your Seat?
                            </h2>
                            <p className="text-xl mb-8 text-gray-200">
                                Stop losing revenue to inefficient seating. Join thousands of restaurants maximizing capacity with BookerIt today.
                            </p>
                            <button
                                onClick={() => navigate(user ? "/book-table" : "/login")}
                                className="btn btn-lg bg-pink-500 hover:bg-pink-600 border-none text-white shadow-lg hover:scale-105 transition-transform rounded-full px-8"
                            >
                                Get Started Book Now
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Home;

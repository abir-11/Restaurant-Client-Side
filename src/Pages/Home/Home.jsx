import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import hero1 from '../../assets/photo-15.jpg';
import hero2 from '../../assets/banner1.png';
import hero3 from '../../assets/b1.jpg';
import CardShow from './CardShow';

const Home = () => {
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
                 <div>

                 </div>
                 {/* Card Show Section */}
                <div >
                   <CardShow></CardShow> 
                </div>
            </div>
        </div>
    );
};

export default Home;

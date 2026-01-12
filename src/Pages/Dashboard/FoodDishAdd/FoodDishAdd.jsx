import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth';


const FoodDishAdd = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { loading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const onSubmit = async (data) => {

        try {

            let uploadedImgUrl = '';

            if (data.image && data.image.length > 0) {
                const formData = new FormData();
                formData.append('image', data.image[0]);
                const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;

                const res = await axios.post(image_API_URL, formData);
                uploadedImgUrl = res.data?.data?.url;
            }

            
            const newDish = {
                title: data.name,
                image: uploadedImgUrl,
                description: data.description,
                price: parseFloat(data.price),
                category: data.category,
                rating: parseFloat(data.rating || 0),
                spiceLevel: data.spiceLevel,
                vegType: data.vegType,
                calories: parseInt(data.calories),
                availability: data.availability === 'true',
                featured: data.featured === 'true',
                createdAt: new Date()
            };





            Swal.fire({
                title: "Are you sure?",
                text: "You are adding this food dish to the menu.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, submit it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    axiosSecure.post('/foodDishes', newDish)
                        .then(res => {
                            console.log('After data post', res.data);
                            reset();

                            if (res.data.insertedId) {
                                Swal.fire({
                                    title: "Submitted",
                                    text: "Your dishes has been successfully submitted.",
                                    icon: "success"
                                });
                            }
                        })
                        .catch(err => {
                            console.error('Error posting lesson:', err);
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Something went wrong while submitting your dishes!'
                            });
                        });
                }
            });
        }
        catch (error) {
            console.error("Error adding item:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong! Please try again.',
            });
        } finally {

        }
    };
    if (loading) {
        return <p className="text-sm text-pink-500 flex justify-center items-center">Loading...</p>

    }

    return (
        <div className='bg-gray-50 min-h-screen py-10 px-4'>
            <div className='max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden'>

                {/* হেডার সেকশন */}
                <div className='bg-gradient-to-r from-pink-500 to-rose-500 py-6 text-center'>
                    <h2 className='text-3xl font-bold text-white'>Add New Food Dish</h2>
                    <p className='text-pink-100 mt-2'>Fill out the details to add a new item to the menu</p>
                </div>

                {/* ফর্ম সেকশন */}
                <div className='p-8'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

                            {/* Dish Name */}
                            <div className="form-control">
                                <label className="label font-semibold text-gray-700 mb-1">Dish Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Chocolate Lava Cake"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-200"
                                    {...register("name", { required: true })}
                                />
                                {errors.name && <p className='text-red-500 text-sm mt-1'>* Name is required</p>}
                            </div>

                            {/* Category Dropdown */}
                            <div className="form-control">
                                <label className="label font-semibold text-gray-700 mb-1">Category</label>
                                <select
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                                    {...register("category", { required: true })}
                                >
                                    <option value="">Select Category</option>
                                    <option value="Dessert">Dessert</option>
                                    <option value="Bakery">Bakery</option>
                                    <option value="Fast Food">Fast Food</option>
                                    <option value="Drinks">Drinks</option>
                                </select>
                                {errors.category && <p className='text-red-500 text-sm mt-1'>* Category is required</p>}
                            </div>

                            {/* Price */}
                            <div className="form-control">
                                <label className="label font-semibold text-gray-700 mb-1">Price (Tk)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Enter dish price"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    {...register("price", { required: true })}
                                />
                                {errors.price && <p className='text-red-500 text-sm mt-1'>* Price is required</p>}
                            </div>

                            {/* Calories */}
                            <div className="form-control">
                                <label className="label font-semibold text-gray-700 mb-1">Calories</label>
                                <input
                                    type="number"
                                    placeholder="Dish calories (320)"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    {...register("calories", { required: true })}
                                />
                                {errors.calories && <p className='text-red-500 text-sm mt-1'>* Calories is required</p>}
                            </div>

                            {/* Spice Level */}
                            <div className="form-control">
                                <label className="label font-semibold text-gray-700 mb-1">Spice Level</label>
                                <select
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                                    {...register("spiceLevel")}
                                >
                                    <option value="None">None</option>
                                    <option value="Mild">Mild</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hot">Hot</option>
                                    <option value="Extra Hot">Extra Hot</option>
                                </select>
                            </div>

                            {/* Rating */}
                            <div className="form-control">
                                <label className="label font-semibold text-gray-700 mb-1">Rating</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    max="5"
                                    placeholder="4.7"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    {...register("rating")}
                                />
                            </div>

                            {/* Veg Type */}
                            <div className="form-control">
                                <label className="label font-semibold text-gray-700 mb-1">
                                    Veg / Non-Veg / Mixed / None
                                </label>

                                <div className="flex gap-6 mt-2">

                                    {/* Veg */}
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="Veg"
                                            className="radio text-pink-500 focus:ring-pink-500"
                                            {...register("vegType", { required: true })}
                                        />
                                        <span>Veg</span>
                                    </label>

                                    {/* Non-Veg */}
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="Non-Veg"
                                            className="radio text-pink-500 focus:ring-pink-500"
                                            {...register("vegType", { required: true })}
                                        />
                                        <span>Non-Veg</span>
                                    </label>

                                    {/* Mixed */}
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="Mixed"
                                            className="radio text-pink-500 focus:ring-pink-500"
                                            {...register("vegType", { required: true })}
                                        />
                                        <span>Mixed</span>
                                    </label>
                                    {/* none */}
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="None"
                                            className="radio text-pink-500 focus:ring-pink-500"
                                            {...register("vegType", { required: true })}
                                        />
                                        <span>None</span>
                                    </label>
                                </div>
                               { errors.vegType && <p className='text-red-500 text-sm mt-1'>* Veg Type is required</p> }

                            </div>


                            {/* Availability & Featured */}
                            <div className="form-control flex flex-col justify-center">
                                <label className="label font-semibold text-gray-700 mb-1">Status</label>
                                <div className="flex gap-6 mt-2">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" value="true" {...register("availability")} className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500" defaultChecked />
                                        <span>Available</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" value="true" {...register("featured")} className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500" />
                                        <span>Featured</span>
                                    </label>
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div className="form-control md:col-span-2">
                                <label className="label font-semibold text-gray-700 mb-1">Upload Image</label>
                                <input
                                    type="file"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                                    {...register("image", { required: true })}
                                />
                                {errors.image && <p className='text-red-500 text-sm mt-1'>* Image is required</p>}
                            </div>

                            {/* Description - Full Width */}
                            <div className="form-control md:col-span-2">
                                <label className="label font-semibold text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                                    placeholder="Rich chocolate cake with molten center..."
                                    {...register("description", { required: true })}
                                ></textarea>
                                {errors.description && <p className='text-red-500 text-sm mt-1'>* Description is required</p>}
                            </div>

                        </div>

                        {/* Submit Button */}
                        <div className="mt-8 text-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full md:w-1/2 py-3 px-6 rounded-lg text-white font-bold text-lg shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700'}`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : "Add Item"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FoodDishAdd;
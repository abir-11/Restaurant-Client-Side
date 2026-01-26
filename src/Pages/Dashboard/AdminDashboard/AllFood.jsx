import React, { useState } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { FaEdit, FaTrashAlt, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';

const AllFood = () => {
    const axiosSecure = useAxiosSecure();

    // 1. Fetching Data
    const { data: items = [], refetch, isLoading } = useQuery({
        queryKey: ['allfood'],
        queryFn: async () => {
            const res = await axiosSecure.get('/foodDishes');
            return res.data;
        }
    });


  

    // 4. Handle Delete
    const handleDelete = (item) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await axiosSecure.delete(`/foodDishes/${item._id}`);
                if (res.data.deletedCount > 0) {
                    refetch();
                    Swal.fire("Deleted!", "Your file has been deleted.", "success");
                }
            }
        });
    };

    if (isLoading) return <div className="text-center mt-20">Loading...</div>;

    return (
        <div className="w-full px-4 mb-10 relative">
            <div className="flex justify-between items-center my-8">
                <h2 className="text-3xl font-bold">My Items: {items.length}</h2>
            </div>

            {/* --- TABLE SECTION --- */}
            <div className="overflow-x-auto rounded-t-lg shadow-lg">
                <table className="table w-full">
                    <thead className="bg-gray-200 text-gray-700 text-center uppercase">
                        <tr>
                            <th className="py-4">#</th>
                            <th className="py-4">Image</th>
                            <th className="py-4">Owner Info</th>
                            <th className="py-4">Item Name</th>
                            <th className="py-4">Price</th>
                            <th className="py-4">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={item._id} className="border-b hover:bg-gray-50 text-center">
                                <td className="font-bold">{index + 1}</td>
                                <td>
                                    <div className="flex items-center justify-center">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12">
                                                <img src={item.image} alt={item.title} />
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="font-medium ">{item.email}</td>
                                <td className="font-medium">{item.title}</td>
                                <td className="font-bold text-gray-600">${item.price}</td>
                               
                                <td>
                                    <button onClick={() => handleDelete(item)} className="btn btn-ghost btn-md bg-red-600 hover:bg-red-700 text-white rounded-md">
                                        <FaTrashAlt className="text-lg" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

          
        </div>
    );
};

export default AllFood;
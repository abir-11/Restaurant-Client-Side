import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaEdit, FaTrashAlt, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const MyItems = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    console.log(user);

    // 1. Fetching Data
    const { data: items = [], isLoading, refetch } = useQuery({
        queryKey: ['my-food-items', user?.email],
        enabled: !loading && !!user?.email, // ইউজার লোড হওয়ার পরেই কল হবে
        queryFn: async () => {
            const res = await axiosSecure.get(`/foodDishes/${user?.email}`);
            return res.data;
        }
    });
  console.log(items)
    // 2. Open Modal
    const openEditModal = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    // 3. Handle Update
    const handleUpdate = async (e) => {
        e.preventDefault();
        const form = e.target;
        
        const updatedItem = {
            title: form.title.value,
            category: form.category.value,
            price: parseFloat(form.price.value),
            image: form.image.value,
            // ইমেইল চেঞ্জ করা যাবে না, তাই আগেরটাই থাকবে
            email: selectedItem.email 
        };

        try {
            const res = await axiosSecure.patch(`/foodDishes/${selectedItem._id}`, updatedItem);
            
            if (res.data.modifiedCount > 0) {
                refetch(); 
                setIsModalOpen(false);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Item updated successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'Something went wrong!' });
        }
    };

    // 4. Handle Delete
    const handleDelete = (item) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
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

    if (loading || isLoading) return <div className="text-center mt-20">Loading...</div>;

    return (
        <div className="w-full px-4 mb-10 relative">
            <h2 className="text-3xl font-bold my-8">My Items: {items.length}</h2>

            {items.length === 0 ? (
                <div className="text-center text-gray-500 text-xl mt-10">
                    No items found for this email. Please add a new item first.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-t-lg shadow-lg">
                    <table className="table w-full">
                        <thead className="bg-gray-200 text-gray-700 text-center uppercase">
                            <tr>
                                <th>#</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Update</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={item._id} className="text-center border-b">
                                    <th>{index + 1}</th>
                                    <td>
                                        <div className="avatar flex justify-center">
                                            <div className="mask mask-squircle w-12 h-12">
                                                <img src={item.image} alt={item.title} />
                                            </div>
                                        </div>
                                    </td>
                                    <td>{item.title}</td>
                                    <td className="font-bold">${item.price}</td>
                                    <td>
                                        <button onClick={() => openEditModal(item)} className="btn btn-ghost bg-orange-500 text-white btn-sm">
                                            <FaEdit />
                                        </button>
                                    </td>
                                    <td>
                                        <button onClick={() => handleDelete(item)} className="btn btn-ghost bg-red-600 text-white btn-sm">
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Part kept same as yours but clean */}
            {isModalOpen && selectedItem && (
               <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                   <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
                       <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 btn btn-sm btn-circle btn-ghost"><FaTimes/></button>
                       <h3 className="text-2xl font-bold text-center mb-4">Update Item</h3>
                       <form onSubmit={handleUpdate}>
                           <div className="form-control mb-3">
                               <label className="label">Name</label>
                               <input type="text" name="title" defaultValue={selectedItem.title} className="input input-bordered" required />
                           </div>
                           <div className="flex gap-2 mb-3">
                               <div className="form-control w-1/2">
                                   <label className="label">Category</label>
                                   <select name="category" defaultValue={selectedItem.category} className="select select-bordered">
                                       <option value="salad">Salad</option>
                                       <option value="pizza">Pizza</option>
                                       <option value="soup">Soup</option>
                                       <option value="dessert">Dessert</option>
                                       <option value="drinks">Drinks</option>
                                   </select>
                               </div>
                               <div className="form-control w-1/2">
                                   <label className="label">Price</label>
                                   <input type="number" step="any" name="price" defaultValue={selectedItem.price} className="input input-bordered" required />
                               </div>
                           </div>
                           <div className="form-control mb-4">
                               <label className="label">Image URL</label>
                               <input type="text" name="image" defaultValue={selectedItem.image} className="input input-bordered" required />
                           </div>
                           <button className="btn bg-orange-500 hover:bg-orange-600 text-white w-full">Update</button>
                       </form>
                   </div>
               </div>
            )}
        </div>
    );
};

export default MyItems;
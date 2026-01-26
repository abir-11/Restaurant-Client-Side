import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { Edit, Save, Trash2, Plus, Clock, Armchair } from 'lucide-react';
import useAxiosSecure from './../../../Hooks/useAxiosSecure';
import useAuth from './../../../Hooks/useAuth';

const UpdateInfo = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ১. ডাটা ফেচ করা (GET Request)
    const { data: restaurantData, isLoading } = useQuery({
        queryKey: ['restaurant-layout', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/restaurant/layout/${user?.email}`);
            return res.data;
        }
    });

    // ২. ফর্ম সেটআপ
    const { register, control, handleSubmit, reset, setValue } = useForm({
        defaultValues: {
            booking_duration: 90,
            tables: [{ table_id: '', capacity: 2, type: 'Standard Dining', isBookable: true }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "tables"
    });

    // ডাটা লোড হলে ফর্মে ভ্যালু সেট করা (Modal এর জন্য)
    useEffect(() => {
        if (restaurantData) {
            reset({
                booking_duration: restaurantData.booking_duration,
                tables: restaurantData.tables
            });
        }
    }, [restaurantData, reset]);

    // ৩. আপডেট মিউটেশন (PATCH Request)
    const mutation = useMutation({
        mutationFn: async (updatedData) => {
            const res = await axiosSecure.patch(`/restaurant/update-layout/${user?.email}`, updatedData);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['restaurant-layout']);
            setIsModalOpen(false);
            Swal.fire('Updated!', 'Table layout has been updated successfully.', 'success');
        },
        onError: () => {
            Swal.fire('Error!', 'Failed to update layout.', 'error');
        }
    });

    const onSubmit = (data) => {
        // ডাটা ফরম্যাট ঠিক করা (String to Number conversion if needed)
        const formattedData = {
            ...data,
            tables: data.tables.map(t => ({
                ...t,
                capacity: parseInt(t.capacity)
            }))
        };
        mutation.mutate(formattedData);
    };

    if (isLoading) return <div>Loading layout...</div>;

    // --- VIEW MODE (যদি ডাটা থাকে তাহলে শুধু ডিসপ্লে হবে) ---
    if (restaurantData && restaurantData.tables?.length > 0 && !isModalOpen) {
        return (
            <div className="p-8 max-w-5xl mx-auto bg-white shadow-xl rounded-2xl border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">🍽️ Restaurant Table Layout</h2>
                        <p className="text-gray-500 flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4" /> Default Booking Duration: <span className="font-semibold text-pink-600">{restaurantData.booking_duration} mins</span>
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-semibold shadow-lg transition-all"
                    >
                        <Edit className="w-4 h-4" /> Edit Layout
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {restaurantData.tables.map((table, index) => (
                        <div key={index} className="border border-gray-200 p-4 rounded-xl flex justify-between items-center hover:shadow-md transition-shadow bg-gray-50">
                            <div>
                                <h4 className="font-bold text-gray-800 text-lg">{table.table_id}</h4>
                                <p className="text-sm text-gray-500">{table.type}</p>
                            </div>
                            <div className="text-right">
                                <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                    <Armchair className="w-3 h-3" /> {table.capacity} Seater
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // --- FORM / MODAL MODE (নতুন ডাটা দেওয়া অথবা এডিট করার জন্য) ---
    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${!restaurantData ? 'static bg-transparent' : 'bg-black/50 backdrop-blur-sm'}`}>
            <div className={`bg-white p-8 rounded-2xl w-full max-w-4xl shadow-2xl relative ${!restaurantData ? '' : 'max-h-[90vh] overflow-y-auto'}`}>
                
                {/* Close Button for Modal */}
                {restaurantData && (
                    <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl">
                        ✕
                    </button>
                )}

                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    {restaurantData ? '✏️ Edit Table Configuration' : '⚙️ Setup Your Tables'}
                </h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Duration Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Default Booking Duration (Minutes)</label>
                        <input 
                            {...register("booking_duration", { required: true })}
                            type="number" 
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 outline-none"
                            placeholder="e.g. 90"
                        />
                    </div>

                    {/* Table List Inputs */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-12 gap-2 text-sm font-bold text-gray-500 bg-gray-100 p-3 rounded-t-lg">
                            <div className="col-span-3">Table ID</div>
                            <div className="col-span-4">Type</div>
                            <div className="col-span-2">Capacity</div>
                            <div className="col-span-2">Bookable</div>
                            <div className="col-span-1">Action</div>
                        </div>

                        {fields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-12 gap-2 items-center">
                                {/* Table ID */}
                                <div className="col-span-3">
                                    <input 
                                        {...register(`tables.${index}.table_id`)} 
                                        placeholder="e.g. WIN-01" 
                                        className="w-full border rounded p-2 text-sm uppercase"
                                    />
                                </div>

                                {/* Table Type */}
                                <div className="col-span-4">
                                    <select 
                                        {...register(`tables.${index}.type`)} 
                                        className="w-full border rounded p-2 text-sm"
                                    >
                                        <option value="Standard Dining">Standard Dining</option>
                                        <option value="Window View">Window View</option>
                                        <option value="Private Booth">Private Booth</option>
                                        <option value="Family Lounge">Family Lounge</option>
                                        <option value="Rooftop">Rooftop</option>
                                        <option value="Couple Spot">Couple Spot</option>
                                    </select>
                                </div>

                                {/* Capacity */}
                                <div className="col-span-2">
                                    <input 
                                        type="number" 
                                        {...register(`tables.${index}.capacity`)} 
                                        className="w-full border rounded p-2 text-sm"
                                        min="1"
                                    />
                                </div>

                                {/* Is Bookable */}
                                <div className="col-span-2 flex justify-center">
                                    <input 
                                        type="checkbox" 
                                        {...register(`tables.${index}.isBookable`)} 
                                        className="checkbox checkbox-sm checkbox-secondary" 
                                    />
                                </div>

                                {/* Delete Button */}
                                <div className="col-span-1 flex justify-center">
                                    <button type="button" onClick={() => remove(index)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add New Row Button */}
                    <button 
                        type="button" 
                        onClick={() => append({ table_id: '', capacity: 2, type: 'Standard Dining', isBookable: true })}
                        className="mt-4 flex items-center gap-2 text-pink-600 font-semibold hover:bg-pink-50 px-4 py-2 rounded-lg transition-colors w-full justify-center border border-pink-200 border-dashed"
                    >
                        <Plus className="w-4 h-4" /> Add Another Table
                    </button>

                    {/* Submit Button */}
                    <div className="mt-8 flex justify-end">
                        <button type="submit" className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                            <Save className="w-5 h-5" /> {restaurantData ? 'Update Configuration' : 'Save Setup'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateInfo;
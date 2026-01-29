import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { Trash2, Calendar, Clock, User, Phone, DollarSign } from 'lucide-react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth'; // আপনার Auth hook টি ইম্পোর্ট করুন

const OrderRequest = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth(); // লগইন করা রেস্টুরেন্ট ওনারের তথ্য

    // ১. শুধুমাত্র এই রেস্টুরেন্টের ডাটা ফেচ করা
    const { data: orders = [], refetch, isLoading } = useQuery({
        queryKey: ['restaurant-orders', user?.email],
        queryFn: async () => {
            if (!user?.email) return [];
            // কুয়েরি প্যারামিটারে ইমেইল পাঠানো হচ্ছে
            const res = await axiosSecure.get(`/bookTable?restaurantEmail=${user.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });
    console.log(orders);

    // ২. রিজেক্ট বা ডিলিট ফাংশন
    const handleReject = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, Reject it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.delete(`/bookTable/${id}`);
                    if (res.data.deletedCount > 0) {
                        refetch(); // ডাটা রিফ্রেশ
                        Swal.fire(
                            'Rejected!',
                            'The booking has been rejected.',
                            'success'
                        );
                    }
                } catch (error) {
                    Swal.fire('Error!', 'Something went wrong.', 'error');
                }
            }
        });
    };

    const handleConfirm = async (id) => {
        const result = await Swal.fire({
            title: 'Confirm this order?',
            text: 'This booking will be confirmed',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Confirm'
        });

        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.patch(`/bookTable/${id}`, {
                    status: 'confirmed'
                });

                if (res.data.modifiedCount > 0) {
                    refetch();
                    Swal.fire('Confirmed!', 'Order has been confirmed.', 'success');
                }
            } catch (error) {
                Swal.fire('Error!', 'Could not confirm order.', 'error');
            }
        }
    };


    if (isLoading) return <div className="text-center p-10">Loading Orders...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
                Order Requests ({orders.length})
            </h2>

            <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
                <table className="table-auto w-full text-left">
                    <thead className="bg-pink-50 text-pink-700 uppercase text-sm font-semibold">
                        <tr>
                            <th className="px-6 py-4">Customer Info</th>
                            <th className="px-6 py-4">Date & Time</th>
                            <th className="px-6 py-4">Table Info</th>
                            <th className="px-6 py-4">Pre-Order Menu</th>
                            <th className="px-6 py-4 text-center">Total Bill</th>
                            <th className="px-6 py-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-10 text-gray-500">
                                    No orders found for your restaurant.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                    {/* Customer Info */}
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-800 flex items-center gap-2">
                                            <User size={16} className="text-pink-500" /> {order.customerName}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">{order.customerEmail}</p>
                                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                            <Phone size={14} /> {order.phone}
                                        </p>
                                    </td>

                                    {/* Date & Time */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-700 font-medium">
                                            <Calendar size={16} className="text-blue-500" />
                                            {order.date}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                                            <Clock size={16} className="text-orange-500" />
                                            {order.timeDisplay || order.time}
                                        </div>
                                        <span className="text-xs text-gray-400 mt-1 block">
                                            Duration: {order.duration} min
                                        </span>
                                    </td>

                                    {/* Table Info */}
                                    <td className="px-6 py-4">
                                        <span className="bg-purple-100 text-purple-700 py-1 px-3 rounded-full text-xs font-bold uppercase">
                                            {order.tableType}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Table ID: <span className="font-mono text-gray-700">{order.tableId}</span>
                                        </p>
                                    </td>

                                    {/* Pre-Order Menu */}
                                    <td className="px-6 py-4">
                                        {order.preOrderMenu && order.preOrderMenu.length > 0 ? (
                                            <div className="space-y-2">
                                                {order.preOrderMenu.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                                        <img src={item.image} alt="" className="w-8 h-8 rounded object-cover border" />
                                                        <span>{item.title}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-sm italic">No Pre-order</span>
                                        )}
                                    </td>

                                    {/* Total Bill */}
                                    <td className="px-6 py-4 text-center">
                                        <p className="text-lg font-bold text-gray-800 flex items-center justify-center gap-1">
                                            <DollarSign size={16} className="text-green-600" />
                                            {order.totalEstimatedPrice}
                                        </p>
                                        <span className={`text-xs px-2 py-0.5 rounded ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {order.status}
                                        </span>
                                    </td>

                                    {/* Action (Reject) */}
                                    <td className="px-6 py-4 text-center">
                                        {order.status === 'pending' ? (
                                            <div className="flex justify-center gap-2">
                                                {/* Confirm Button */}
                                                <button
                                                    onClick={() => handleConfirm(order._id)}
                                                    className="bg-green-50 hover:bg-green-100 text-green-600 p-2 rounded-lg border border-green-200"
                                                    title="Confirm Order"
                                                >
                                                    ✔
                                                </button>

                                                {/* Reject Button */}
                                                <button
                                                    onClick={() => handleReject(order._id)}
                                                    className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg border border-red-200"
                                                    title="Reject Order"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                    onClick={() => handleReject(order._id)}
                                                    className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg border border-red-200"
                                                    title="Reject Order"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                        )}
                                    </td>


                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default OrderRequest;
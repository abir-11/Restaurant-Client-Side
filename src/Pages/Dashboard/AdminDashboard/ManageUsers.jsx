import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { Trash2, Users, Shield, ChefHat } from 'lucide-react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth';

const ManageUsers = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    // 1. Fetch Users Data
    const { data: users = [], isLoading, isError, error } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        }
    });

    // 2. Mutation for Deleting a User
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            // FIX: সরাসরি ID আসবে
            const res = await axiosSecure.delete(`/users/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            Swal.fire({
                title: 'Deleted!',
                text: 'User has been deleted.',
                icon: 'success',
                confirmButtonColor: '#ec4899',
            });
        },
        onError: (err) => {
            Swal.fire('Error', err.response?.data?.message || 'Failed to delete user', 'error');
        }
    });

    // 3. Mutation for Updating User Role
    const roleMutation = useMutation({
        mutationFn: async ({ id, role }) => {
            const res = await axiosSecure.patch(`/users/role/${id}`, { role });
            return res.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['users']);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `Role updated to ${variables.role}`,
                showConfirmButton: false,
                timer: 1500
            });
        },
        onError: (err) => {
            Swal.fire('Error', err.response?.data?.message || 'Failed to update role', 'error');
        }
    });

    // Handle Delete Click
    const handleDelete = (userToDelete) => {
        Swal.fire({
            title: "Are you sure?",
            text: `You won't be able to revert this!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                // FIX: এখানে users._id এর বদলে userToDelete._id হবে
                // এবং সরাসরি ID পাঠানো হচ্ছে (অবজেক্ট নয়)
                deleteMutation.mutate(userToDelete._id);
            }
        });
    };

    // Handle Role Change
    const handleRoleChange = (e, userId) => {
        const newRole = e.target.value;
        roleMutation.mutate({ id: userId, role: newRole });
    };

    if (isLoading) return <div className="text-center py-10"><span className="loading loading-spinner loading-lg text-pink-500"></span></div>;
    if (isError) return <div className="text-center py-10 text-red-500">Error: {error.message}</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Manage Users</h2>
                    <p className="text-gray-500 mt-1">Total Users: <span className="font-bold text-pink-500">{users.length}</span></p>
                </div>
                <div className="bg-pink-100 p-3 rounded-full">
                    <Users className="w-8 h-8 text-pink-500" />
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold">
                            <tr>
                                <th className="py-5 pl-6 text-left">#</th>
                                <th className="py-5 text-left">Name</th>
                                <th className="py-5 text-left">Email</th>
                                <th className="py-5 text-left">Role</th>
                                <th className="py-5 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 font-medium">
                            {users.map((user, index) => (
                                <tr key={user._id} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-none">
                                    <td className="pl-6">{index + 1}</td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div><img src={user?.photoURL} alt="" className="w-10 h-10 rounded-full object-cover border border-pink-500" /></div>
                                            <div><div className="font-bold">{user.name}</div></div>
                                        </div>
                                    </td>
                                    <td className="text-gray-500">{user.email}</td>
                                    <td className="text-gray-500">
                                       {user.role}
                                    </td>
                                    <td className="text-center">
                                        <button
                                            onClick={() => handleDelete(user)}
                                            className="btn btn-ghost btn-md text-red-500 hover:bg-red-50 hover:text-red-700 transition-all tooltip"
                                            data-tip="Delete User"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;
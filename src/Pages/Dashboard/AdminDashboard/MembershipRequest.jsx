import React from 'react';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const MembershipRequest = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    // 1. Fetch All Users (To get the role)
    const { data: users = [] } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        }
    });

    // 2. Fetch Restaurant Applications
    const { data: applications = [] } = useQuery({
        queryKey: ['restaurantApplications'],
        queryFn: async () => {
            const res = await axiosSecure.get('/restaurantApplications');
            return res.data;
        }
    });

    // 3. Mutation to Update User Role
    const updateRoleMutation = useMutation({
        mutationFn: async ({ email, role }) => {
            const res = await axiosSecure.patch(`/users/role/${email}`, { role });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "User role updated successfully",
                showConfirmButton: false,
                timer: 1500
            });
        },
        onError: () => {
            Swal.fire("Error", "Failed to update role", "error");
        }
    });

    // 4. Mutation to DELETE Application
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const res = await axiosSecure.delete(`/restaurantApplications/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['restaurantApplications']); // Refresh the list
            Swal.fire({
                title: "Deleted!",
                text: "The application has been deleted.",
                icon: "success"
            });
        },
        onError: () => {
            Swal.fire("Error", "Failed to delete application", "error");
        }
    });

    // Handle Dropdown Change (Role Update)
    const handleRoleChange = (email, role) => {
        Swal.fire({
            title: "Are you sure?",
            text: `You are about to change the role to ${role}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Update it!"
        }).then((result) => {
            if (result.isConfirmed) {
                updateRoleMutation.mutate({ email, role: role });
            }
        });
    };

    // Handle Delete Action
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(id);
            }
        });
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-center">Membership Applications</h2>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="table w-full">
                    {/* Head */}
                    <thead className="bg-gray-200 text-gray-700">
                        <tr>
                            <th>#</th>
                            <th>Applicant Info</th>
                            <th>Restaurant Info</th>
                            <th>Message</th>
                            <th>Current Role</th>
                            <th>Change Role</th>
                            <th>Action</th> {/* New Column */}
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app, index) => {
                            const matchingUser = users.find(u => u.email === app.email);
                            const currentRole = matchingUser?.role || 'user';

                            return (
                                <tr key={app._id} className="hover:bg-gray-50">
                                    <th>{index + 1}</th>

                                    {/* Applicant Info */}
                                    <td>
                                        <div className="font-bold">{app.owner_name}</div>
                                        <div className="text-sm opacity-50">{app.email}</div>
                                        <div className="text-xs text-gray-500">{app.phone}</div>
                                    </td>

                                    {/* Restaurant Info */}
                                    <td>
                                        <div className="font-bold text-blue-600">{app.restaurant_name}</div>
                                        <span className="badge badge-ghost badge-sm">{app.location}</span>
                                        <div className="text-xs mt-1 text-gray-400">
                                            {new Date(app.applied_date).toLocaleDateString()}
                                        </div>
                                    </td>

                                    {/* Message */}
                                    <td className="max-w-xs truncate" title={app.message}>
                                        {app.message.substring(0, 30)}...
                                    </td>

                                    {/* Current User Role */}
                                    <td>
                                        <span className={`badge ${currentRole === 'admin' ? 'badge-primary' : currentRole === 'restaurant-owner' ? 'badge-secondary' : 'badge-ghost'}`}>
                                            {currentRole.toUpperCase()}
                                        </span>
                                    </td>

                                    {/* Action: Select Role */}
                                    <td>
                                        <select
                                            className="select select-bordered select-sm w-full max-w-xs"
                                            defaultValue={currentRole}
                                            onChange={(e) => handleRoleChange(app.email, e.target.value)}
                                        >
                                            <option disabled>Select Role</option>
                                            <option value="user">User</option>
                                            <option value="restaurant-owner">Restaurant Owner</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>

                                    {/* New: Delete Action */}
                                    <td>
                                        <button 
                                            onClick={() => handleDelete(app._id)}
                                            className="btn btn-ghost btn-xs text-red-500 hover:bg-red-100"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MembershipRequest;
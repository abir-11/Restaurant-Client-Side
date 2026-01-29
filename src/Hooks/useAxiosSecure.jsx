import axios from 'axios';
import React from 'react';

const axiosSecure=axios.create({
    baseURL:'https://restaurant-web-side-backend.vercel.app'
});

const useAxiosSecure = () => {
    return axiosSecure;
};

export default useAxiosSecure;
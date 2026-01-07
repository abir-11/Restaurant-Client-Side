import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiLock, FiMail, FiUser } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router';
import { FaEyeSlash, FaUserAlt } from 'react-icons/fa';
import { IoEyeSharp } from 'react-icons/io5';
import axios from 'axios';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import bgCover from '../../assets/photo-1517248135467-4c7edcad34c4.jpg';
import BookerAI from "../../assets/ChatGPT Image Dec 2, 2025, 12_28_43 AM 1.png";

const SignUp = () => {
  const [showEyes, setShowEyes] = useState(false);
  const { setUser, registerUser, updateUserProfie, signInGoogle } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const imageFile = data.photoURL?.[0];
      if (!imageFile) {
        alert("Please upload a photo");
        return;
      }

      const result = await registerUser(data.email, data.password);
      console.log("After register", result.user);

      const formData = new FormData();
      formData.append('image', imageFile);

      const image_API_USER_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key_user}`;
      const res = await axios.post(image_API_USER_URL, formData);
      const photoURL = res.data?.data?.url;

      const userInfo = {
        displayName: data.username,
        email: data.email,
        photoURL: photoURL
      };

      await axiosSecure.post('/users', userInfo);
      console.log("User data stored in DB");

      await updateUserProfie({ displayName: data.username, photoURL });
      console.log("User profile updated");

      setUser(result.user);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoogleSubmit = async () => {
    try {
      const result = await signInGoogle();
      const user = result.user;
      setUser(user);

      const userInfo = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      };

      await axiosSecure.post('/users', userInfo);
      console.log("Google user stored");

      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4" style={{
      backgroundImage: `url(${bgCover})`,
      backgroundRepeat: 'no-repeat', width: '100%', height: '120vh', backgroundSize: 'cover'
    }}>
      <div className="bg-white/10 backdrop-blur-2xl shadow-3xl rounded-3xl overflow-hidden flex flex-col sm:flex-row w-full max-w-4xl">
        {/* LEFT SIDE FORM */}
        <div className="w-full sm:w-1/2 p-10">
           <Link to="/" className="btn btn-ghost mb-3 mr-10 flex justify-center">
          <img src={BookerAI} alt="BookerAI Logo"  />
        </Link>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-3xl font-extrabold text-primary mb-8">Create Account</h2>

            {/* Username */}
            <div className="relative mb-5">
              <input
                {...register("username", { required: "Username is required" })}
                type="text"
                placeholder="Username"
                className="input input-bordered w-full pl-12  bg-transparent text-white border-white"
              />
              <FiUser className="absolute left-4 top-3 text-gray-500 text-xl" />
            </div>
            {errors.username && <p className="text-red-600 text-sm mb-2">{errors.username.message}</p>}

            {/* Email */}
            <div className="relative mb-5">
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                type="email"
                placeholder="Email"
                className="input input-bordered w-full pl-12 bg-transparent text-white border-white"
              />
              <FiMail className="absolute left-4 top-3 text-gray-500 text-xl" />
            </div>
            {errors.email && <p className="text-red-600 text-sm mb-2">{errors.email.message}</p>}

            {/* Photo */}
            <div className="relative mb-5">
              <input
                type="file"
                {...register('photoURL', { required: 'Photo file is required' })}
                className="
      file-input w-full pl-12
      bg-transparent text-white border border-white
      file:bg-transparent
      file:text-white
      file:border-0
      file:mr-4
      file:px-4
      file:py-2
      file:cursor-pointer
    "
              />
              <FaUserAlt className="absolute left-4 top-3 text-white text-xl" />

              {errors.photoURL && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.photoURL.message}
                </p>
              )}
            </div>


            {/* Password */}
            <div className="relative mb-6">
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
                type={showEyes ? 'text' : 'password'}
                placeholder="Password"
                className="input input-bordered w-full pl-12 bg-transparent text-white border-white"
              />
              <FiLock className="absolute left-4 top-3 text-gray-500 text-xl" />
              <button type='button' className='absolute right-3 top-3 text-gray-600' onClick={() => setShowEyes(!showEyes)}>
                {showEyes ? <FaEyeSlash className='text-white' /> : <IoEyeSharp className='text-white' />}
              </button>
            </div>
            {errors.password && <p className="text-red-600 text-sm mb-2">{errors.password.message}</p>}

            <button type="submit" className="btn w-full border-none bg-primary hover:bg-pink-600 text-white">Sign Up</button>
          </form>

          <div className='text-center font-medium text-xl text-primary  my-3'>or</div>
          <button onClick={handleGoogleSubmit} className="btn bg-white text-black border-none hover:bg-primary hover:text-white w-full ">
            <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
            Login with Google
          </button>

          <p className="mt-4 text-center text-white text-sm ">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">Sign In</Link>
          </p>
        </div>

        {/* RIGHT SIDE BLUE PANEL */}
        <div className="w-full sm:w-1/2 bg-primary text-white flex items-center justify-center p-10 rounded-t-[50px] sm:rounded-t-none sm:rounded-l-[80px]" style={{
          backgroundImage: `url(${bgCover})`,
          backgroundRepeat: 'no-repeat', backgroundSize: 'cover'
        }}>
          <div className="text-center">
            <h2 className="text-3xl font-extrabold mb-2">Welcome Back!</h2>
            <p className="mb-4 font-bold bg-primary/80 text-white p-1 rounded-2xl">Already have an account?</p>
            <Link to="/login">
              <button className="btn bg-pink-500 text-white  shadow-2xl border-none hover:bg-pink-600 hover:text-white">Login</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

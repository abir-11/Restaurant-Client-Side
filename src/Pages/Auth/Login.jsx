import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiLock, FiMail } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router';
import { FaEyeSlash } from 'react-icons/fa';
import { IoEyeSharp } from 'react-icons/io5';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import bgCover from '../../assets/photo-1517248135467-4c7edcad34c4.jpg' ;
import BookerAI from "../../assets/ChatGPT Image Dec 2, 2025, 12_28_43 AM 1.png";
import Swal from 'sweetalert2';


const Login = () => {
  const [showEyes, setShowEyes] = useState(false);
  const location = useLocation();
  const { signInUser, signInGoogle, setUser,user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Login Data:", data);
    // Handle login logic here
    signInUser(data.email, data.password)
      .then(result => {
        console.log(result.user)
        setUser(result.user)
        navigate(location?.state || '/')
      })
      .catch(error => {
          Swal.fire({
    icon: 'error',
    title: 'Login Failed',
    text: 'Invalid email or password'
  });
      })
  };
  const handleGoogleSubmit = () => {
    signInGoogle()
      .then(result => {
        const user = result.user;
        setUser(user);

        console.log("Google User:", user);
        const userInfo = {
          displayName: user?.displayName,
          email: user.email,
          photoURL: user.photoURL
        }
        axiosSecure.post('/users', userInfo)
          .then((res) => {
            if (res.data.insertedId) {
              console.log("user data has been store")
            }
          })
          .catch(error=>{
            console.log(error)
          })

        navigate(location?.state || "/");
      })
      .catch(error => {
        console.log(error);
      });
  };


  return (
    <div className="min-h-screen  flex items-center justify-center bg-gray-100 p-4" style={{ backgroundImage: `url(${bgCover})`,
          backgroundRepeat: 'no-repeat',width:'100%',height:'110vh',backgroundSize:'cover' }}>
      <div className="bg-white/10 backdrop-blur-2xl shadow-3xl rounded-3xl overflow-hidden flex flex-col sm:flex-row w-full max-w-4xl">

        {/* LEFT SIDE FORM */}
        <div className="w-full sm:w-1/2 p-10">
         <Link to="/" className="btn btn-ghost mb-3 mr-10 flex justify-center">
                  <img src={BookerAI} alt="BookerAI Logo"  />
                </Link>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-3xl text-primary font-extrabold mb-8">Welcome Back!</h2>

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
                {
                  showEyes ? <FaEyeSlash className='text-white' /> : <IoEyeSharp className='text-white' />
                }
              </button>
            </div>
            {errors.password && <p className="text-red-600 text-sm mb-2">{errors.password.message}</p>}

            {/* Remember me & Forgot password */}
            <div className="flex justify-between items-center mb-6">
              <label className="flex items-center">
                <input type="checkbox" className="checkbox checkbox-sm border-white" />
                <span className="ml-2 text-sm text-white">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn w-full border-none bg-primary hover:bg-pink-600 text-white"
            >
              Login
            </button>

          </form>
          <div>
            <div className='text-center  font-medium  text-xl text-primary'>
              or
            </div>
            <div>
              <button onClick={handleGoogleSubmit} className="btn bg-white border-none text-black  hover:bg-primary hover:text-white w-full ">
                <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                Login with Google
              </button>
            </div>
          </div>

          <p className="mt-4 text-center text-sm text-white">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary  hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

        {/* RIGHT SIDE BLUE PANEL */} 
        <div className="w-full sm:w-1/2  text-white flex items-center justify-center p-10 rounded-t-[50px] sm:rounded-t-none sm:rounded-l-[80px]" style={{ backgroundImage: `url(${bgCover})`,
          backgroundRepeat: 'no-repeat',backgroundSize:'cover' }}>
          <div className="text-center">
            <h2 className="text-3xl font-extrabold mb-2">New Here?</h2>
            <p className="mb-4 font-bold bg-primary/80 text-white p-1 rounded-2xl">Create an account</p>
            <Link to="/signup">
              <button className="btn bg-pink-500 text-white  shadow-2xl border-none hover:bg-pink-600 hover:text-white">
                Register
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
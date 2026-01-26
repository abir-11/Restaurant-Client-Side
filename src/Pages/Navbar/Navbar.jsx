import { Link, NavLink, useNavigate } from "react-router";
import useAuth from "../../Hooks/useAuth";
import BookerAI from "../../assets/ChatGPT Image Dec 2, 2025, 12_28_43 AM 1.png";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
const Navbar = () => {
  const { user, logOut, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate=useNavigate();
  const { data: users = {} } = useQuery({
    queryKey: ['users', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user?.email}`);
      return res.data;
    }
  });
  const handleLogout = () => {
    logOut().catch(console.error);
    navigate('/')
  };

  const navLinks = (
    <>
      <li><NavLink to="/" className={({ isActive }) =>
        isActive
          ? "bg-pink-500 rounded-full text-white font-semibold"
          : "text-white hover:text-pink-400"
      }>Home</NavLink></li>
      <li><NavLink to="/our-menu" className={({ isActive }) =>
        isActive
          ? "bg-pink-500 rounded-full font-semibold"
          : "text-white hover:text-pink-400"
      }>Our Menu</NavLink></li>
      

      <li><NavLink to="/contact" className={({ isActive }) =>
        isActive
          ? "bg-pink-500 rounded-full font-semibold"
          : "text-white hover:text-pink-400"
      }>Contact Us</NavLink></li>
      <li><NavLink to="/about" className={({ isActive }) =>
        isActive
          ? "bg-pink-500 rounded-full font-semibold"
          : "text-white hover:text-pink-400"
      }>About Us</NavLink></li>
    </>
  );

  if (loading) {
    return (
      <p className="text-sm text-pink-500 flex justify-center items-center">
        Loading...
      </p>
    );
  }

  return (
    <div className="navbar fixed top-0 z-50 px-4 bg-gray-900 text-white shadow-[0_0px_60px_10px_rgba(255,255,255,0.5)]">
      {/* Left */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            ☰
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-black rounded-box mt-3 w-52 p-2  shadow"
          >
            {navLinks}
          </ul>
        </div>
        <NavLink to="/" className="btn btn-ghost ">
          <img src={BookerAI} alt="BookerAI Logo" className="w-32" />
        </NavLink>
      </div>

      {/* Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navLinks}
        </ul>
      </div>

      {/* Right */}
      <div className="navbar-end gap-3">


        {user ? (
          <div className="gap-2 flex items-center">
            {users.role==='user'&&
            <NavLink to="/book-table" className="btn btn-sm  bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 border-none text-white">
              Book Now
            </NavLink>}

            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10  rounded-full">
                  <img
                    src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
                    alt="user"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-gray-900 rounded-box mt-3 w-52 z-[1] p-2 shadow"
              >
                <li className="menu-title rounded-full text-white font-semibold
                     pr-2  flex flex-col">
                  <span className=" truncate block">{users?.displayName || "User"}</span>
                  <span className="text-xs font-light text-gray-100 capitalize">{users?.role || "user"}</span>
                </li>
                {
                  users?.role === 'admin' || users?.role==='restaurant-owner' ? (
                    <li>
                      <NavLink
                        to={users?.role==='admin'?'/dashboard/admin-dashboard':'/dashboard/restaurantDashboard'}
                        className={({ isActive }) =>
                          `rounded-full px-2 py-2 text-white font-semibold
      hover:bg-pink-500 ${isActive ? "bg-pink-600" : ""}`
                        }
                      >
                        Dashboard
                      </NavLink>
                    </li>
                  ) : (
                    <li>
                      <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                          `rounded-full px-2 py-2 my-1 text-white font-semibold
      hover:bg-pink-500 ${isActive ? "bg-pink-600" : ""}`
                        }
                      >
                        Profile
                      </NavLink>
                    </li>
                  )
                }
                <li className="  rounded-full text-white font-semibold
         hover:text-white hover:bg-pink-500"><button onClick={handleLogout}>Logout</button></li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <NavLink to="/login" className="btn btn-outline btn-sm bg-gradient-to-r hover:from-pink-600 hover:to-rose-700 hover:border-none hover:text-white">
              Login
            </NavLink>
            <NavLink to="/signup" className="btn border-none btn-sm  bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700  text-white ">
              SignUp
            </NavLink>

          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

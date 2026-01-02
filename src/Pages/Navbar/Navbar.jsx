import { NavLink } from "react-router";
import useAuth from "../../Hooks/useAuth";
import BookerAI from "../../assets/ChatGPT Image Dec 2, 2025, 12_28_43 AM 1.png";
import SignUp from './../Auth/SignUp';
const Navbar = () => {
  const { user, logOut,loading } = useAuth();

  const handleLogout = () => {
    logOut().catch(console.error);
  };

  const navLinks = (
    <>
      <li><NavLink to="/"  className={({ isActive }) =>
      isActive
        ? "bg-pink-500 rounded-full text-white font-semibold"
        : "text-white hover:text-pink-400"
    }>Home</NavLink></li>
      <li><NavLink to="/restaurants"  className={({ isActive }) =>
      isActive
        ? "text-pink-500 font-semibold"
        : "text-white hover:text-pink-400"
    }>Restaurants</NavLink></li>
      <li><NavLink to="/contact"  className={({ isActive }) =>
      isActive
        ? "text-pink-500 font-semibold"
        : "text-white hover:text-pink-400"
    }>Contact Us</NavLink></li>
      <li><NavLink to="/about"  className={({ isActive }) =>
      isActive
        ? "text-pink-500 font-semibold"
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
    <div className="navbar fixed top-0 z-50 px-4 bg-black text-white shadow-[0_0px_60px_10px_rgba(255,255,255,0.5)]">
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
          <div>
             <NavLink to="/booking" className="btn btn-sm bg-pink-500 text-white">
          Book Now
        </NavLink>
           <NavLink to="/booking" className="btn btn-sm bg-pink-500 text-white">
          Book Now
        </NavLink>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
                  alt="user"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow"
            >
              <li><span>{user.displayName || "User"}</span></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
          </div>
        ) : (
         <div className="flex gap-3">
           <NavLink to="/signup" className="btn border-none btn-sm bg-pink-500 text-white hover:bg-pink-600">
            SignUp
          </NavLink>
           <NavLink to="/login" className="btn btn-outline btn-sm">
            Login
          </NavLink>
         </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

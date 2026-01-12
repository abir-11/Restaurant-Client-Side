import { createBrowserRouter } from "react-router";
import RootLayout from "../Layout/RootLayout";
import Home from "../Pages/Home/Home";
import AuthLayout from "../Layout/AuthLayout";
import Login from "../Pages/Auth/Login";
import SignUp from "../Pages/Auth/SignUp";
import DashboardLayout from "../Layout/DashboardLayout";
import FoodDishAdd from "../Pages/Dashboard/FoodDishAdd/FoodDishAdd";
import BookTable from "../Pages/BookTable/BookTable";
import ContactUs from "../Pages/ContactUs/ContactUs";
import AboutUs from "../Pages/AboutUs/AboutUs";
import OurMenu from "../Pages/OurMenu/OurMenu";
import Profile from "../Pages/Profile/Profile";

const router=createBrowserRouter([
    {
        path:'/',
        Component:RootLayout,
        children:[
            {
                index:true,
                Component:Home
            },
            {
                path:'/book-table',
                Component:BookTable
            },
            {
                path:'/contact',
                Component:ContactUs
            },
            {
                path:'/about',
                Component:AboutUs
            },
            {
                path:'/our-menu',
                Component:OurMenu
            },
            {
                path:'/profile',
                Component:Profile
            }
        ]
    },
    {
        path:'/',
        Component:AuthLayout,
        children:[
            {   
                path:'/login',
                Component:Login,
            },
            {
                path:'/signup',
                Component:SignUp
            }
        ]
    },
    {
        path:'/dashboard',
        Component:DashboardLayout,
        children:[
            {
                path:'dashborad-home',

            },
            {
                path:'food-dish-add',
                Component:FoodDishAdd
            }
        ]
    }
])

export default router;
import { createBrowserRouter } from "react-router";
import RootLayout from "../Layout/RootLayout";
import Home from "../Pages/Home/Home";
import AuthLayout from "../Layout/AuthLayout";
import Login from "../Pages/Auth/Login";
import SignUp from "../Pages/Auth/SignUp";
import DashboardLayout from "../Layout/DashboardLayout";
import FoodDishAdd from "../Pages/Dashboard/FoodDishAdd/FoodDishAdd";

const router=createBrowserRouter([
    {
        path:'/',
        Component:RootLayout,
        children:[
            {
                index:true,
                Component:Home
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
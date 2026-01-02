import { createBrowserRouter } from "react-router";
import RootLayout from "../Layout/RootLayout";
import Home from "../Pages/Home/Home";
import AuthLayout from "../Layout/AuthLayout";
import Login from "../Pages/Auth/Login";
import SignUp from "../Pages/Auth/SignUp";

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
    }
])

export default router;
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
import ManageUsers from "../Pages/Dashboard/AdminDashboard/ManageUsers";
import MyItems from "../Pages/Dashboard/MyItems/MyItems";
import RestaurantDashboard from "../Pages/Dashboard/RestaurantDashboard/RestaurantDashboard";
import AdminDashboard from "../Pages/Dashboard/AdminDashboard/AdminDashboard";
import AllFood from "../Pages/Dashboard/AdminDashboard/AllFood";
import MembershipRequest from "../Pages/Dashboard/AdminDashboard/MembershipRequest";
import DetailsOfFood from "../Pages/DetailsOfFood/DetailsOfFood";
import UpdateInfo from "../Pages/Dashboard/UpdateInfo/UpdateInfo";
import OrderRequest from "../Pages/Dashboard/OderRequest/OderRequest";

const router = createBrowserRouter([
    {
        path: '/',
        Component: RootLayout,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: '/book-table',
                Component:BookTable
            },
            {
                path: '/contact',
                Component: ContactUs
            },
            {
                path: '/about',
                Component: AboutUs
            },
            {
                path: '/our-menu',
                Component: OurMenu
            },
            {
                path: '/profile',
                Component: Profile
            },
            {
                path: '/details/:id',
                element: <DetailsOfFood />
            }
        ]
    },
    {
        path: '/',
        Component: AuthLayout,
        children: [
            {
                path: '/login',
                Component: Login,
            },
            {
                path: '/signup',
                Component: SignUp
            }
        ]
    },
    {
        path: '/dashboard',
        Component: DashboardLayout,
        children: [
            {
                path: 'dashborad-home',

            },
            {
                path: 'food-dish-add',
                Component: FoodDishAdd
            },
            {
                path: 'mange-user',
                Component: ManageUsers
            },
            {
                path: 'my-items',
                Component: MyItems
            },
            {
                path: 'restaurantDashboard',
                Component: RestaurantDashboard
            },
            {
                path: 'admin-dashboard',
                Component: AdminDashboard
            },
            {
                path: 'all-food',
                Component: AllFood
            },
            {
                path: 'resquest-owner-ship',
                Component: MembershipRequest
            },
            {
                path:'update-info',
                Component:UpdateInfo
            },
            {
                path:'oder-request',
                Component:OrderRequest
            }
        ]
    }
])

export default router;
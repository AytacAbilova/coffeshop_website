import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Home from "./pages/Home/Home";
import Reservation from "./pages/Reservation/Reservation";
import Layout from "./components/layout/Layout";
import Menu from "./pages/Menu/Menu";
import MyOrders from "./pages/My orders/MyOrders";
import NotFoundPage from "./pages/NotFoundPage";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminMenu from "./pages/Admin/AdminMenu";
import AdminStaff from "./pages/Admin/AdminStaff";
import AdminTables from "./pages/Admin/AdminTables";
import { clearAdminAuth, isAdminAuthed } from "./pages/Admin/adminStorage";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Contact from "./pages/Contact/Contact";


const requireAdminLoader = () => {
  if (!isAdminAuthed()) return redirect("/admin/login");
  return null;
};

const adminLoginLoader = () => {
  if (isAdminAuthed()) return redirect("/admin");
  return null;
};

const adminLogoutLoader = () => {
  clearAdminAuth();
  return redirect("/admin/login");
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/reservation", element: <Reservation /> },
      { path: "/menu", element: <Menu /> },
      { path: "/myorders", element: <MyOrders /> },
      { path: "/contact", element: <Contact /> }


    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/admin/login",
    loader: adminLoginLoader,
    element: <AdminLogin />,
  },
  {
    path: "/admin/logout",
    loader: adminLogoutLoader,
  },
  {
    path: "/admin",
    loader: requireAdminLoader,
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "menu", element: <AdminMenu /> },
      { path: "staff", element: <AdminStaff /> },
      { path: "tables", element: <AdminTables /> },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import axios from "axios";
import "./index.css";
import Home from "./pages/Home/Home";
import Reservation from "./pages/Reservation/Reservation";
import Detail from "./pages/Detail/Detail";
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
import {
  clearAdminAuth,
  clearAuthTokens,
  ensureValidAccessToken,
  getAccessToken,
  isAccessTokenExpired,
  isAdminAuthed,
} from "./pages/Admin/adminStorage";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
 import Contact from "./pages/Contact/Contact"

import Wishlist from "./pages/Wishlist/Wishlist";

const TABLES_API_URL = "https://simulation2-production-7983.up.railway.app/api/Tables";

if (!globalThis.__axiosAuthSetup) {
  globalThis.__axiosAuthSetup = true;

  axios.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  let refreshInFlight = null;

  axios.interceptors.response.use(
    (res) => res,
    async (error) => {
      const status = error?.response?.status;
      const original = error?.config;

      if (status === 401 && original && !original._retry) {
        original._retry = true;

        refreshInFlight =
          refreshInFlight ||
          ensureValidAccessToken().finally(() => {
            refreshInFlight = null;
          });

        const nextToken = await refreshInFlight;
        if (nextToken) {
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${nextToken}`;
          return axios(original);
        }

        clearAdminAuth();
        clearAuthTokens();
        if (typeof window !== "undefined") {
          const isAdminPath = window.location.pathname.startsWith("/admin");
          window.location.assign(isAdminPath ? "/admin/login" : "/login");
        }
      }

      return Promise.reject(error);
    }
  );
}

const requireAdminLoader = async () => {
  if (!isAdminAuthed()) return redirect("/admin/login");
  const token = getAccessToken();
  if (!token) {
    clearAdminAuth();
    clearAuthTokens();
    return redirect("/admin/login");
  }
  if (isAccessTokenExpired(token)) {
    const refreshed = await ensureValidAccessToken();
    if (!refreshed) {
      clearAdminAuth();
      clearAuthTokens();
      return redirect("/admin/login");
    }
  }
  return null;
};

const adminLoginLoader = async () => {
  if (!isAdminAuthed()) return null;
  const token = getAccessToken();
  if (!token) {
    clearAdminAuth();
    clearAuthTokens();
    return null;
  }
  if (isAccessTokenExpired(token)) {
    const refreshed = await ensureValidAccessToken();
    if (!refreshed) {
      clearAdminAuth();
      clearAuthTokens();
      return null;
    }
  }
  return redirect("/admin");
};

const adminLogoutLoader = () => {
  clearAdminAuth();
  clearAuthTokens();
  return redirect("/admin/login");
};

const adminTablesLoader = async () => {
  if (!isAdminAuthed()) return redirect("/admin/login");
  const token = await ensureValidAccessToken();
  if (!token) {
    clearAdminAuth();
    clearAuthTokens();
    return redirect("/admin/login");
  }

  try {
    const res = await fetch(TABLES_API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/reservation", element: <Reservation /> },
      { path: "/menu/:id", element: <Detail /> },
      { path: "/menu", element: <Menu /> },
      { path: "/myorders", element: <MyOrders /> },
      { path: "/wishlist", element: <Wishlist /> },
      { path: "/contact", element: <Contact /> },
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
      { path: "tables", loader: adminTablesLoader, element: <AdminTables /> },
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

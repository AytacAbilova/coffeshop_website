import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home/Home";
import Reservation from "./pages/Reservation/Reservation";
import Layout from "./components/layout/Layout";
import Menu from "./pages/Menu/Menu";
import MyOrders from "./pages/My orders/MyOrders";
import NotFoundPage from "./pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/reservation", element: <Reservation /> },
      { path: "/menu", element: <Menu /> },
      { path: "/myorders", element: <MyOrders /> },
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

import { createBrowserRouter } from "react-router-dom";
import ClientLayout from "../layouts/ClientLayout";
import AdminLayout from "../layouts/AdminLayout";
import HomeProduct from "../pages/HomeProduct/HomeProduct";
import ProductList from "../pages/ProductList/ProductList";
import FieldList from "../pages/FieldList/FieldList";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminCategories from "../pages/Admin/AdminCategories";
import AdminFields from "../pages/Admin/AdminFields";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      {
        path: "/",
        element: <HomeProduct />,
      },
      {
        path: "/productlist",
        element: <ProductList />,
      },
      {
        path: "/san-bong",
        element: <FieldList />,
      },
      {
        path: "/product/:id",
        element: <ProductDetail />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "/admin/fields",
        element: <AdminFields />,
      },
      {
        path: "/admin/categories",
        element: <AdminCategories />,
      },
    ],
  },
]);

export default router;

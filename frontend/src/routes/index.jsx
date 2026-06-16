import { createBrowserRouter } from "react-router-dom";
import HomeProduct from "../pages/HomeProduct/HomeProduct";
import ProductList from "../pages/ProductList/ProductList";
import FieldList from "../pages/FieldList/FieldList";

const router = createBrowserRouter([
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
]);

export default router;
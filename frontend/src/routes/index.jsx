import { createBrowserRouter } from "react-router-dom";
import HomeProduct from "../pages/HomeProduct/HomeProduct";
import ProductList from "../pages/ProductList/ProductList";
import ProductDetail from "../pages/ProductDetail/ProductDetail";

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
        path: "/product/:id",
        element: <ProductDetail />,
    },
]);

export default router;

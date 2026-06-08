import { createBrowserRouter } from "react-router-dom";
import HomeProduct from "../pages/HomeProduct/HomeProduct";
import ProductList from "../pages/ProductList/ProductList";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeProduct />,
    },
    {
        path: "/productlist",
        element: <ProductList />,
    }
]);

export default router;
import axios from "axios";

const api = "http://localhost:3000/api/products";

export const getProducts = async () => {
    const response = await axios.get(api);
    return response.data;
};
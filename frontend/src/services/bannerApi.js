import axios from "axios";

export const getBanners = async () => {
    const response = await axios.get('http://localhost:3000/api/banners');
    return response.data;
};
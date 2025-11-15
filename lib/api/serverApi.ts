import axios from "axios";


export const serverApi = axios.create({
baseURL: process.env.API_BASE_URL ?? "",
});
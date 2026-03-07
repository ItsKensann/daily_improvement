import axios from "axios";

// Create an instance of axios with default config
/*
  Tells axios that every time I ask it to fetch something, start the URL with the address in the baseURL
  can just write api.get("/api/users")
 */
const api = axios.create({
  baseURL: "http://localhost:5000", // Points to the backend
  withCredentials: true, // Sends cookies to the backend
});

export default api; // import api in any page

// Import Navigate component from react-router-dom
// Used to redirect user to another route
import { Navigate } from "react-router-dom";


// ProtectedRoute component
// children → represents the component/page we want to protect
export default function ProtectedRoute({ children }) {

  // Get token from localStorage
  // Token is stored after user login
  const token = localStorage.getItem("token");

  // If token exists → allow access (render the requested component)
  // If no token → redirect user to login page
  return token ? children : <Navigate to="/login" />;
}
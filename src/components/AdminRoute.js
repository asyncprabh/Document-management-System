import { Navigate } from "react-router-dom";
import { getUserRole } from "../utils/auth";

export default function AdminRoute({ children }) {

  const role = getUserRole();

  if (role !== "Admin") {

    return <Navigate to="/dashboard" />;

  }

  return children;

}
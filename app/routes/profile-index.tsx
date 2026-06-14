import { Navigate } from "react-router";
import { useRole } from "../context/role-context";

export default function ProfileIndex() {
  const { demoUserId } = useRole();
  return <Navigate to={`/profile/${demoUserId}`} replace />;
}

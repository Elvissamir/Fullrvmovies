import { Navigate } from "react-router-dom"
import { useContext } from 'react';
import { UserContext } from "./context/userContext";

function RequireAuth ({ children, redirectTo, destination }) {
    const { currentUser } = useContext(UserContext)

    return currentUser? children: <Navigate to={redirectTo} state={destination} replace />
}

export default RequireAuth 
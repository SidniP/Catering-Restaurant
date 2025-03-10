import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from './Spinner';

const PrivateRoute = ({ allowedRoles = ['user', 'staff', 'admin'] }) => {
    const { user, isLoading } = useSelector((state) => state.auth);

    if (isLoading) {
        return <Spinner />;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default PrivateRoute; 
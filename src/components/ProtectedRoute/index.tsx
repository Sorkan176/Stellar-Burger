import { Navigate, useLocation } from 'react-router-dom';
import { FC, ReactElement } from 'react';
import { useSelector } from '../../services/store';
import { selectUser } from '../../services/slices/userSlice';

interface ProtectedRouteProps {
  element: ReactElement;
  onlyUnAuth?: boolean; // для /login и /register
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  element,
  onlyUnAuth = false
}) => {
  const location = useLocation();
  const user = useSelector(selectUser);

  const isAuthenticated = !!user.email;

  if (onlyUnAuth && isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return element;
};

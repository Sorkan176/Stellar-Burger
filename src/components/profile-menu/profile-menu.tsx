import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { fetchLogout } from '../../services/slices/userSlice';
import { clearConstructor } from '../../services/slices/burgerConstructorSlice';
import { clearMyOrders } from '../../services/slices/myOrdersSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(fetchLogout());
    dispatch(clearConstructor());
    dispatch(clearMyOrders());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};

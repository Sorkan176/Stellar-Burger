import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';
import { useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { fetchUser } from '../../services/slices/userSlice';
import { OrderModal } from '../modal/OrderModal';

const App = () => {
  const location = useLocation();
  const background = location.state && location.state.background;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);
  return (
    <div className={styles.app}>
      <Routes location={background || location}>
        <Route path='*' element={<NotFound404 />} />
        <Route path='/' element={<AppHeader />}>
          <Route index element={<ConstructorPage />} />
          <Route path='feed' element={<Feed />}>
            <Route path=':number' element={<OrderInfo />} />
          </Route>
          <Route
            path='login'
            element={<ProtectedRoute onlyUnAuth element={<Login />} />}
          />
          <Route
            path='register'
            element={<ProtectedRoute onlyUnAuth element={<Register />} />}
          />
          <Route
            path='forgot-password'
            element={<ProtectedRoute onlyUnAuth element={<ForgotPassword />} />}
          />
          <Route
            path='reset-password'
            element={<ProtectedRoute onlyUnAuth element={<ResetPassword />} />}
          />
          <Route
            path='profile'
            element={<ProtectedRoute element={<Profile />} />}
          />
          <Route
            path='profile/orders'
            element={<ProtectedRoute element={<ProfileOrders />} />}
          >
            <Route path=':number' element={<OrderInfo />} />
          </Route>
          <Route path='ingredients'>
            <Route path=':id' element={<IngredientDetails />} />
          </Route>
        </Route>
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal onClose={() => navigate(-1)} title={'Детали ингредиента'}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={<OrderModal onClose={() => navigate(-1)} />}
          />
          <Route
            path='/profile/orders/:number'
            element={<OrderModal onClose={() => navigate(-1)} />}
          />
        </Routes>
      )}
    </div>
  );
};

export default App;

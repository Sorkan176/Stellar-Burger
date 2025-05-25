import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchIngredients,
  selectIsLoaded,
  selectIsLoading
} from '../../services/slices/ingredientsSlice';
import { Preloader } from '@ui';
import {
  selectMyOrders,
  selectIsMyOrdersLoading,
  fetchMyOrders
} from '../../services/slices/myOrdersSlice';
import { selectUserLoading } from '../../services/slices/userSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const isIngredientsLoading = useSelector(selectIsLoading);
  const isIngredientsLoaded = useSelector(selectIsLoaded);
  const isOrdersLoading = useSelector(selectIsMyOrdersLoading);
  const isLoading = useSelector(selectUserLoading);

  useEffect(() => {
    if (!isIngredientsLoaded) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, isIngredientsLoaded]);
  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const orders: TOrder[] = useSelector(selectMyOrders);

  if (isIngredientsLoading || isOrdersLoading || isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};

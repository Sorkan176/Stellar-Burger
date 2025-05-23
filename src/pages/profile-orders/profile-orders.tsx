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
} from '../../services/slices/orderSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const isIngredientsLoading = useSelector(selectIsLoading);
  const isIngredientsLoaded = useSelector(selectIsLoaded);
  const isOrdersLoading = useSelector(selectIsMyOrdersLoading);
  useEffect(() => {
    if (!isIngredientsLoaded) {
      dispatch(fetchIngredients());
      console.log('get ingredients! twice');
    }
  }, [dispatch, isIngredientsLoaded]);
  useEffect(() => {
    dispatch(fetchMyOrders());
    console.log('get my orders, twice');
  }, [dispatch]);

  const orders: TOrder[] = useSelector(selectMyOrders);

  if (isIngredientsLoading || isOrdersLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};

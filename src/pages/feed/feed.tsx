import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchOrders,
  selectIsOrdersLoaded,
  selectIsOrdersLoading,
  selectOrderList
} from '../../services/slices/ordersSlice';
import {
  fetchIngredients,
  selectIsLoaded,
  selectIsLoading
} from '../../services/slices/ingredientsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const isIngredientsLoading = useSelector(selectIsLoading);
  const isIngredientsLoaded = useSelector(selectIsLoaded);
  const isOrdersLoading = useSelector(selectIsOrdersLoading);
  const isOrdersLoaded = useSelector(selectIsOrdersLoaded);
  useEffect(() => {
    if (!isIngredientsLoaded) {
      dispatch(fetchIngredients());
      console.log('get ingredients! twice');
    }
  }, [dispatch, isIngredientsLoaded]);
  useEffect(() => {
    if (!isOrdersLoaded) {
      dispatch(fetchOrders());
      console.log('get feeds, twice');
    }
  }, [dispatch, isOrdersLoaded]);

  const orders: TOrder[] = useSelector(selectOrderList);

  if (!orders.length || isIngredientsLoading || isOrdersLoading) {
    return <Preloader />;
  }
  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(fetchOrders());
      }}
    />
  );
};

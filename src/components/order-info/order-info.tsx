import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchOrders,
  selectIsOrdersLoaded,
  selectOrderList
} from '../../services/slices/ordersSlice';
import {
  fetchIngredients,
  selectIngredients,
  selectIsLoaded
} from '../../services/slices/ingredientsSlice';
import {
  fetchMyOrders,
  selectIsMyOrdersLoaded,
  selectMyOrders
} from '../../services/slices/myOrdersSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const location = useLocation();
  const firstPathSegment = `/${location.pathname.split('/')[1]}`;
  const isProfilePage = firstPathSegment === '/profile';

  const dispatch = useDispatch();
  const isIngredientsLoaded = useSelector(selectIsLoaded);
  const isOrdersLoaded = useSelector(selectIsOrdersLoaded);
  const isMyOrdersLoaded = useSelector(selectIsMyOrdersLoaded);

  const ingredients: TIngredient[] = useSelector(selectIngredients);
  const publicOrders = useSelector(selectOrderList);
  const privateOrders = useSelector(selectMyOrders);
  const orderList = isProfilePage ? privateOrders : publicOrders;

  useEffect(() => {
    if (!isIngredientsLoaded) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, isIngredientsLoaded]);

  useEffect(() => {
    if (!isOrdersLoaded && !isProfilePage) {
      dispatch(fetchOrders());
    } else if (isProfilePage && !isMyOrdersLoaded) {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, isProfilePage, isOrdersLoaded, isMyOrdersLoaded]);

  const orderData = orderList.find((order) => order.number === Number(number));

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};

import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectOrderList } from '../../services/slices/ordersSlice';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { selectMyOrders } from '../../services/slices/myOrdersSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const location = useLocation();
  const firstPathSegment = `/${location.pathname.split('/')[1]}`;
  let orderList;
  if (firstPathSegment === '/profile') {
    orderList = useSelector(selectMyOrders);
  } else {
    orderList = useSelector(selectOrderList);
  }
  const orderData = orderList.find((order) => order.number === Number(number));
  const ingredients: TIngredient[] = useSelector(selectIngredients);

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

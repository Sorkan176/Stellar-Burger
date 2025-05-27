import { FC, useEffect, useMemo, useState } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearConstructor,
  selectBurgerConstructor
} from '../../services/slices/burgerConstructorSlice';
import {
  fetchOrder,
  closeOrderModalAction,
  selectOrderModalData,
  selectIsMyOrdersLoading,
  fetchMyOrders
} from '../../services/slices/myOrdersSlice';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../utils/cookie';
import { fetchOrders } from '../../services/slices/ordersSlice';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(selectBurgerConstructor);
  const { bun, ingredients } = constructorItems;
  const [shouldFetchOrder, setShouldFetchOrder] = useState(false);
  const ingredientIds: string[] = [
    bun._id,
    ...ingredients.map((item) => item._id),
    bun._id
  ];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderRequest = useSelector(selectIsMyOrdersLoading);
  const orderModalData = useSelector(selectOrderModalData);

  const onOrderClick = () => {
    if (bun._id.length === 0 || ingredientIds.length === 0) return;
    const token = getCookie('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
    dispatch(fetchOrder(ingredientIds));
    setShouldFetchOrder(true);
  };

  useEffect(() => {
    if (!orderRequest && shouldFetchOrder) {
      dispatch(fetchOrders());
      dispatch(fetchMyOrders());
      dispatch(clearConstructor());
      setShouldFetchOrder(false);
    }
  }, [dispatch, orderRequest, shouldFetchOrder]);

  const closeOrderModal = () => {
    dispatch(closeOrderModalAction());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};

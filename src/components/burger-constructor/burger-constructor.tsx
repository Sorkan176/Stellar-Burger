import { FC, useMemo } from 'react';
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
  selectIsMyOrdersLoading
} from '../../services/slices/myOrdersSlice';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../utils/cookie';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(selectBurgerConstructor);
  const { bun, ingredients } = constructorItems;
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
    dispatch(clearConstructor());
  };
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

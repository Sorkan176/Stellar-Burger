import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchIngredients,
  selectIngredients,
  selectIsLoaded
} from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const isIngredientsLoaded = useSelector(selectIsLoaded);

  useEffect(() => {
    if (!isIngredientsLoaded) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, isIngredientsLoaded]);

  const ingredients = useSelector(selectIngredients);
  const ingredientData = ingredients.find(
    (ingredients) => ingredients._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};

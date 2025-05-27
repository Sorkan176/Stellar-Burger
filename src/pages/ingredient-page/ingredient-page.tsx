import React from 'react';
import { IngredientDetails } from '@components';
import styles from './ingredient-page.module.css';

export const IngredientPage = () => (
  <main className={styles.content}>
    <h1 className={`${styles.header} text text_type_main-large`}>
      Детали ингредиента
    </h1>
    <IngredientDetails />
  </main>
);

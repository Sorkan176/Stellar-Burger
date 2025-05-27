import React from 'react';
import { OrderInfo } from '@components';
import styles from './order-page.module.css';
import { useParams } from 'react-router-dom';

export const OrderPage = () => {
  const title = useParams();
  return (
    <main className={styles.content}>
      <h1 className={`${styles.header} text text_type_main-large`}>
        #{title.number}
      </h1>
      <OrderInfo />
    </main>
  );
};

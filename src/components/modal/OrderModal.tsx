import { useParams } from 'react-router-dom';
import { Modal } from './modal';
import { OrderInfo } from '../order-info/order-info';

export const OrderModal = ({ onClose }: { onClose: () => void }) => {
  const { number } = useParams();

  return (
    <Modal onClose={onClose} title={`#${number}`}>
      <OrderInfo />
    </Modal>
  );
};

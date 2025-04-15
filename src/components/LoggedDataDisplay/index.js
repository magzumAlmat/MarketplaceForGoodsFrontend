// src/components/LoggedDataDisplay.js
'use client';

import { useSelector, useStore } from 'react-redux';

export default function LoggedDataDisplay() {
  const store = useStore();
//   console.log('Store in LoggedDataDisplay:', store.getState());

  const allProducts = useSelector((state) => state.usercart.allProducts);
  const allOrders = useSelector((state) => state.usercart.allOrders);
  const userCart = useSelector((state) => state.usercart.userCart);
  const order = useSelector((state) => state.usercart.order);
  const editedOrder = useSelector((state) => state.usercart.editedOrder);
  const editedProduct = useSelector((state) => state.usercart.editedProduct);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#fff',
        padding: '10px',
        borderTop: '1px solid #ccc',
        zIndex: 1000,
      }}
    >
      {/* <h3>Logged Data</h3> */}
      {/* <pre>{JSON.stringify({ allProducts, allOrders, userCart, order, editedOrder, editedProduct }, null, 2)}</pre> */}
    </div>
  );
}
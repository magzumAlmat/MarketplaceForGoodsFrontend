"use client"; // Add directive for Client Component

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../store/provider';

const OrderDetails = ({ orderId, onGoBack }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Order Details</h1>
      <p>Order ID: {order.id}</p>
      <p>Total: ${order.total}</p>
      <p>Status: {order.status}</p>
      <p>Shipping Address: {order.shippingAddress}</p>
      <p>Payment Method: {order.paymentMethod}</p>
      <h2>Items:</h2>
      <ul>
        {order.items.map((item) => (
          <li key={item.productId}>
            Product ID: {item.productId}, Quantity: {item.quantity}
          </li>
        ))}
      </ul>
      <button onClick={onGoBack}>Go Back</button>
    </div>
  );
};

export default OrderDetails;

"use client"; // Directive for Client Component

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../store/provider';

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/store/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>All Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <h2>Order ID: {order.id}</h2>
            <p>Total: ${order.total}</p>
            <p>Status: {order.status}</p>
            <p>Shipping Address: {order.shippingAddress}</p>
            <p>Payment Method: {order.paymentMethod}</p>
            <h3>Items:</h3>
            <ul>
              {order.items.map((item) => (
                <li key={item.productId}>
                  Product ID: {item.productId}, Quantity: {item.quantity}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllOrders;

"use client"; // Добавляем директиву для клиентского компонента

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../store/provider';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchCart = async () => {
      if (token) {
        try {
          const response = await axios.get('http://localhost:8000/api/store/cart', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCart(response.data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchCart();
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Your Cart</h1>
      {cart && cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.items.map((item) => (
            <div key={item.productId}>
              <p>Product ID: {item.productId}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
          ))}
          <div>
            <p>Total: ${cart.total}</p>
            <button>Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;

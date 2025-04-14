"use client"; // Directive for Client Component

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../store/provider';

const ProductDetails = ({ productId, onGoBack }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/store/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Product Details</h1>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <p>Stock: {product.stock}</p>
      <button onClick={onGoBack}>Go Back</button>
    </div>
  );
};

export default ProductDetails;

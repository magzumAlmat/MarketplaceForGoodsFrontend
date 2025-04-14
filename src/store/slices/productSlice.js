import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/store';

export const getAllProductsAction = createAsyncThunk(
  'products/getAllProducts',
  async () => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  }
);

export const getProductByIdAction = createAsyncThunk(
  'products/getProductById',
  async (productId) => {
    const response = await axios.get(`${API_URL}/products/${productId}`);
    return response.data;
  }
);

export const addToCartAction = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }, { getState }) => {
    const { token } = getState().auth;
    const response = await axios.post(
      `${API_URL}/cart`,
      { productId, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
);

export const getCartAction = createAsyncThunk(
  'cart/getCart',
  async (_, { getState }) => {
    const { token } = getState().auth;
    const response = await axios.get(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

export const createOrderAction = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { getState }) => {
    const { token } = getState().auth;
    const response = await axios.post(`${API_URL}/orders`, orderData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

export const getAllOrdersAction = createAsyncThunk(
  'orders/getAllOrders',
  async (_, { getState }) => {
    const { token } = getState().auth;
    const response = await axios.get(`${API_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    allProducts: [],
    product: null,
    cart: [],
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProductsAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProductsAction.fulfilled, (state, action) => {
        state.allProducts = action.payload;
        state.loading = false;
      })
      .addCase(getAllProductsAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getProductByIdAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductByIdAction.fulfilled, (state, action) => {
        state.product = action.payload;
        state.loading = false;
      })
      .addCase(getProductByIdAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addToCartAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAction.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false;
      })
      .addCase(addToCartAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getCartAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCartAction.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false;
      })
      .addCase(getCartAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createOrderAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrderAction.fulfilled, (state, action) => {
        state.orders.push(action.payload);
        state.loading = false;
      })
      .addCase(createOrderAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getAllOrdersAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrdersAction.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(getAllOrdersAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;

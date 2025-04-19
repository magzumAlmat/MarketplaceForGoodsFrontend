import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import END_POINT from "@/components/config";
axios.defaults.timeout = 10000; // 10 секунд

let initialState = {
  userCart: [],
  allProducts: [],
  allOrders: [],
  isAuth: false,
  order: {},
  editedOrder: {},
  editedProduct: null,
  selectedMainType: "Все товары",
  selectedType: "",
  clickCount: 0,
  host: 'http://localhost:8000/api/store/',
  filters: {
    searchTerm: "",
    sortBy: "",
    selectedCategories: [],
    minPrice: "",
    maxPrice: "",
    minVolume: "",
    maxVolume: "",
    minStock: "",
    maxStock: "",
    descriptionKeyword: "",
    featuresKeyword: "",
    page: 1,
    limit: 8,
  },
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  total: 0,
};

export const userPostsSlice = createSlice({
  name: "usercart",
  initialState,

  reducers: {
    addClickCountReducer: (state, action) => {
      state.clickCount = state.clickCount + 1;
    },
    deleteClickCountReducer: (state, action) => {
      state.clickCount = state.clickCount - 1;
    },
    addDataToUserCartReducer: (state, action) => {
      const product = action.payload;
      const existingItem = state.userCart.find((item) => item.id === product.id);
      if (existingItem) {
        existingItem.count = (existingItem.count || 0) + 1;
        existingItem.totalPrice = parseFloat(existingItem.price) * existingItem.count;
      } else {
        state.userCart.push({
          ...product,
          count: 1,
          totalPrice: parseFloat(product.price),
        });
      }
      console.log('Added to cart:', state.userCart);
    },
    incrementReducer: (state, action) => {
      const id = action.payload;
      const item = state.userCart.find((item) => item.id === id);
      if (item) {
        item.count = (item.count || 0) + 1;
        item.totalPrice = parseFloat(item.price) * item.count;
        console.log('Incremented:', item);
      }
    },
    decrementReducer: (state, action) => {
      const id = action.payload;
      const item = state.userCart.find((item) => item.id === id);
      if (item && (item.count || 0) > 0) {
        item.count -= 1;
        item.totalPrice = parseFloat(item.price) * item.count;
        if (item.count === 0) {
          state.userCart = state.userCart.filter((i) => i.id !== id);
        }
        console.log('Decremented:', item);
      }
    },
    getAllOrdersReducer: (state, action) => {
      console.log('getAllOrdersReducer called with payload:', action.payload);
      const existingOrders = state.allOrders.map((order) => order.id);
      const newOrders = action.payload.filter(
        (newOrder) => !existingOrders.includes(newOrder.id)
      );
      state.allOrders.push(...newOrders);
    },
    getAllProductsReducer: (state, action) => {
      console.log('getAllProductsReducer called with payload:', action.payload);
      state.status = "succeeded";
      state.allProducts = action.payload;
      state.total = action.payload.length;
      state.error = null;
    },
    filterAllProductsReducer: (state, action) => {
      state.allProducts = action.payload;
    },
    getOrderReducer: (state, action) => {
      console.log('getOrderReducer called with payload:', action.payload);
      state.order = action.payload;
    },
    getProductByIdReducer: (state, action) => {
      console.log('getProductByIdReducer called with payload:', action.payload);
      state.editedProduct = action.payload; // Убрали [0], так как payload — это объект
    },
    isAuthReducer: (state, action) => {
      state.isAuth = action.payload;
    },
    createProductReducer: (state, action) => {
      state.allProducts = [...state.allProducts, action.payload];
    },
    editOrderReducer: (state, action) => {
      console.log('editOrderReducer called with payload:', action.payload);
      state.editedOrder = action.payload;
    },
    editProductReducer: (state, action) => {
      console.log('editProductReducer called with payload:', action.payload);
      const index = state.allProducts.findIndex((product) => product.id === state.editedProduct.id);
      if (index !== -1) {
        state.allProducts[index] = state.editedProduct;
      } else {
        console.log('Продукт не найден в массиве allProducts');
      }
      state.selectedMainType = 'Все товары';
    },
    deleteProductReducer: (state, action) => {
      console.log('deleteProductReducer called with payload:', action.payload);
      state.allProducts = state.allProducts.filter(
        (item) => item.id !== action.payload
      );
      state.selectedMainType = 'Все товары';
    },
    deleteOrderReducer: (state, action) => {
      console.log('deleteOrderReducer called with payload:', action.payload);
      state.allOrders = state.allOrders.filter(
        (item) => item.id !== action.payload
      );
    },
    setSelectedMainTypeReducer: (state, action) => {
      state.selectedMainType = action.payload;
    },
    setSelectedTypeReducer: (state, action) => {
      state.selectedType = action.payload;
    },
    clearCartAction: (state) => {
      state.userCart = [];
    },
    setFiltersReducer: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFiltersReducer: (state) => {
      state.filters = initialState.filters;
    },
    setLoadingStateReducer: (state) => {
      state.status = "loading";
      state.error = null;
    },
    setErrorStateReducer: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const {
  addDataToUserCartReducer,
  incrementReducer,
  decrementReducer,
  getAllOrdersReducer,
  clearCartAction,
  getAllProductsReducer,
  isAuthReducer,
  getOrderReducer,
  editOrderReducer,
  editProductReducer,
  deleteProductReducer,
  filterAllProductsReducer,
  setSelectedMainTypeReducer,
  setSelectedTypeReducer,
  addClickCountReducer,
  deleteClickCountReducer,
  getProductByIdReducer,
  createProductReducer,
  deleteOrderReducer,
  setFiltersReducer,
  resetFiltersReducer,
  setLoadingStateReducer,
  setErrorStateReducer,
} = userPostsSlice.actions;

// Обновленный getAllProductsAction
export const getAllProductsAction = () => async (dispatch) => {
  console.log('getAllProductsAction called');
  const host = initialState.host;
  try {
    dispatch(setLoadingStateReducer());
    const response = await axios.get(`${host}allproducts`);
    dispatch(getAllProductsReducer(response.data));
  } catch (error) {
    console.error('Ошибка API:', error.response?.data || error.message);
    dispatch(setErrorStateReducer(error.response?.data || error.message));
  }
};

// Существующие экшены
export const addToCartProductAction = (item) => async (dispatch) => {
  console.log('addToCartProductAction called with item:', item);
  dispatch(addDataToUserCartReducer(item));
};

export const incrementAction = (id) => async (dispatch) => {
  console.log('incrementAction called with id:', id);
  dispatch(incrementReducer(id));
};

export const decrementAction = (id) => async (dispatch) => {
  console.log('decrementAction called with id:', id);
  dispatch(decrementReducer(id));
};

export const isAuthAction = (isAuth) => async (dispatch) => {
  dispatch(isAuthReducer(isAuth));
};

export const createOrderAction = (data, userCartIds) => async (dispatch) => {
  console.log('createOrderAction called with data:', data, 'and userCartIds:', userCartIds);
  const host = initialState.host;

  const productIds = userCartIds.map(([id]) => id);

  const orderData = {
    username: data.username || '',
    phone: data.phone || '',
    address: data.address || '',
    status: data.status || 'pending',
    product_ids: productIds,
    totalPrice: parseFloat(data.totalPrice) || 0,
  };

  if (!orderData.username || !orderData.phone || !orderData.address || !orderData.totalPrice) {
    console.error('Missing required fields:', orderData);
    dispatch({
      type: 'CREATE_ORDER_FAIL',
      payload: 'All fields except product_ids are required',
    });
    return;
  }

  try {
    const response = await axios.post(`${host}createorder`, orderData);
    dispatch({
      type: 'CREATE_ORDER_SUCCESS',
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    console.error('Error in createOrderAction:', error.message);
    dispatch({
      type: 'CREATE_ORDER_FAIL',
      payload: error.message,
    });
    throw error;
  }
};

export const editOrderAction = (data, orderId) => async (dispatch) => {
  console.log('editOrderAction called with data:', data, 'and orderId:', orderId);
  const host = initialState.host;
  await dispatch(editOrderReducer(data));
  try {
    const response = await axios.put(`${host}orders/${orderId}`, {
      username: data.username,
      phone: data.phone,
      address: data.address,
      status: data.status,
      totalPrice: data.totalPrice,
    });
    console.log("response from edit order action ", response.data);
  } catch (error) {
    throw error;
  }
};

export const createProductAction = (data) => async (dispatch) => {
  console.log('createProductAction called with data:', data);
  const host = initialState.host;
  try {
    const response = await axios.post(`${host}products`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(createProductReducer(response.data));
  } catch (error) {
    throw error;
  }
};

export const editProductAction = (mainType, type, name, price, description, productId, selectedFiles) => async (dispatch) => {
  console.log('editProductAction called with:', { mainType, type, name, price, description, productId, selectedFiles });
  const host = initialState.host;
  const formData = new FormData();
  formData.append('mainType', mainType);
  formData.append('type', type);
  formData.append('name', name);
  formData.append('price', price);
  formData.append('description', description);
  if (selectedFiles) {
    selectedFiles.forEach((file) => formData.append('image', file));
  }
  try {
    const response = await axios.put(`${host}edit-product/${productId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    dispatch(editProductReducer());
  } catch (error) {
    throw error;
  }
};

export const deleteProductAction = (productId) => async (dispatch) => {
  console.log('deleteProductAction called with productId:', productId);
  const host = initialState.host;
  try {
    await axios.delete(`${host}products/${productId}`);
    dispatch(deleteProductReducer(productId));
  } catch (error) {
    throw error;
  }
};

export const deleteOrderAction = (orderId) => async (dispatch) => {
  console.log('deleteOrderAction called with orderId:', orderId);
  const host = initialState.host;
  try {
    await axios.delete(`${host}orders/${orderId}`);
    dispatch(deleteOrderReducer(orderId));
  } catch (error) {
    throw error;
  }
};

export const getAllOrdersAction = () => async (dispatch) => {
  console.log('getAllOrdersAction called');
  const host = initialState.host;
  try {
    const response = await axios.get(`${host}allorders`);
    dispatch(getAllOrdersReducer(response.data));
  } catch (error) {
    throw error;
  }
};

export const getProductByIdAction = (id) => async (dispatch) => {
  console.log('getProductByIdAction called with id:', id);
  const host = initialState.host;
  try {
    const response = await axios.get(`${host}product/${id}`);
    dispatch(getProductByIdReducer(response.data));
  } catch (error) {
    throw error;
  }
};

export const getOrderAction = (orderId) => async (dispatch) => {
  console.log('getOrderAction called with orderId:', orderId);
  const host = initialState.host;
  try {
    const response = await axios.get(`${host}orders/${orderId}`);
    dispatch(getOrderReducer(response.data));
  } catch (error) {
    throw error;
  }
};

export default userPostsSlice.reducer;
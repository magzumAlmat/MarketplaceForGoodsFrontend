import { configureStore } from '@reduxjs/toolkit'
import ProductSlice from './slices/productSlice';
import  authSlice  from './slices/authSlice';
// import getUsersPostsReducer from './slices/getUsersPostsSlice'


const store = configureStore({
  reducer: {
    usercart:ProductSlice,
    auth:authSlice,
    
    
  },
})


export default store;


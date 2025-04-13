import { configureStore } from '@reduxjs/toolkit'
import ProductSlice from './slices/productSlice';
// import getUsersPostsReducer from './slices/getUsersPostsSlice'


const store = configureStore({
  reducer: {
    usercart:ProductSlice,
    // userposts:getUsersPostsReducer,
    
    
  },
})


export default store;


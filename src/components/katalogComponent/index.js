// "use client";

// import React, { useEffect, useState, useMemo, useCallback, useTransition } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   Button,
//   Container,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   CardActions,
//   Pagination,
//   Stack,
//   Box,
//   TextField,
//   InputAdornment,
//   Paper,
//   Drawer,
//   FormControl,
//   Select,
//   MenuItem,
//   IconButton,
//   Skeleton,
//   Checkbox,
//   FormControlLabel,
//   FormGroup,
//   CircularProgress,
// } from "@mui/material";
// import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
// import { Search, FilterList, Clear } from "@mui/icons-material";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import {
//   getAllProductsAction,
//   addToCartProductAction,
//   setFiltersReducer as setFilters,
//   resetFiltersReducer as resetFilters,
// } from "@/store/slices/productSlice";
// import Image from "next/image";
// import debounce from "lodash/debounce";

// // Custom MUI Theme
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#ADD8E6",
//     },
//     secondary: {
//       main: "#FFB6C1",
//     },
//     background: {
//       default: "#F8FAFC",
//       paper: "#FFFFFF",
//     },
//     text: {
//       primary: "#333333",
//       secondary: "#666666",
//     },
//   },
//   typography: {
//     fontFamily: "'Montserrat', sans-serif",
//     h4: {
//       fontWeight: 700,
//       color: "#333333",
//       textTransform: "uppercase",
//     },
//     body2: {
//       color: "#666666",
//     },
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: "30px",
//           textTransform: "none",
//           fontWeight: 600,
//           padding: "10px 24px",
//           background: "linear-gradient(45deg, #ADD8E6 30%, #87CEEB 90%)",
//           color: "#333333",
//           boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
//           "&:hover": {
//             background: "linear-gradient(45deg, #87CEEB 30%, #ADD8E6 90%)",
//             transform: "scale(1.05)",
//             boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
//           },
//           "&:disabled": {
//             background: "#E0E0E0",
//             color: "#666666",
//           },
//         },
//       },
//     },
//     MuiTextField: {
//       styleOverrides: {
//         root: {
//           "& .MuiOutlinedInput-root": {
//             borderRadius: "30px",
//             background: "#FFFFFF",
//             boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//             "& fieldset": {
//               border: "none",
//             },
//             "&:hover fieldset": {
//               border: "none",
//             },
//             "&.Mui-focused fieldset": {
//               border: "none",
//               boxShadow: "0 0 10px rgba(173, 216, 230, 0.5)",
//             },
//           },
//           "& .MuiInputBase-input": {
//             padding: "12px 16px",
//             color: "#333333",
//           },
//           "& .MuiInputLabel-root": {
//             color: "#666666",
//           },
//         },
//       },
//     },
//     MuiSelect: {
//       styleOverrides: {
//         root: {
//           borderRadius: "30px",
//           background: "#FFFFFF",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//           "& .MuiSelect-select": {
//             padding: "12px 32px 12px 16px",
//             color: "#333333",
//           },
//           "& .MuiOutlinedInput-notchedOutline": {
//             border: "none",
//           },
//           "&:hover .MuiOutlinedInput-notchedOutline": {
//             border: "none",
//           },
//           "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//             border: "none",
//             boxShadow: "0 0 10px rgba(173, 216, 230, 0.5)",
//           },
//         },
//       },
//     },
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           borderRadius: "15px",
//           boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//           transition: "all 0.3s ease",
//           "&:hover": {
//             transform: "translateY(-8px)",
//             boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
//           },
//         },
//       },
//     },
//   },
// });

// // Styled Components
// const ProductCard = styled(Card)(({ theme }) => ({
//   width: "300px", // Фиксированная ширина карточки
//   maxWidth: "300px",
//   minWidth: "300px",
//   height: "100%",
//   display: "flex",
//   flexDirection: "column",
//   backgroundColor: "#FFFFFF",
//   margin: "0 auto", // Центрирование карточки в Grid
// }));

// const FilterDrawer = styled(Drawer)(({ theme }) => ({
//   "& .MuiDrawer-paper": {
//     width: 320,
//     padding: theme.spacing(3),
//     background: "linear-gradient(135deg, #F8FAFC 0%, #E6F0FA 100%)",
//   },
// }));

// const CategoryButton = styled(Button)(({ theme, active }) => ({
//   borderRadius: "25px",
//   padding: "8px 20px",
//   margin: "5px",
//   fontWeight: 600,
//   color: active ? "#333333" : "#666666",
//   background: active
//     ? "linear-gradient(45deg, #ADD8E6 30%, #87CEEB 90%)"
//     : "#F5F5F5",
//   boxShadow: active
//     ? "0 4px 15px rgba(135, 206, 235, 0.5)"
//     : "none",
//   "&:hover": {
//     background: "linear-gradient(45deg, #87CEEB 30%, #ADD8E6 90%)",
//     color: "#333333",
//     boxShadow: "0 4px 15px rgba(135, 206, 235, 0.5)",
//   },
// }));

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/store";

// export default function KatalogComponent() {
//   const dispatch = useDispatch();
//   const {
//     allProducts,
//     userCart,
//     selectedMainType,
//     selectedType,
//     filters,
//     status,
//     error,
//     total,
//   } = useSelector((state) => state.usercart);
//   const [isPending, startTransition] = useTransition();
//   const [minLoadingTimeMet, setMinLoadingTimeMet] = useState(false);
//   const [filterOpen, setFilterOpen] = useState(false);
//   const [imageErrors, setImageErrors] = useState({});

//   const itemsPerPage = 8;
//   const categories = [
//     "Все товары",
//     "Купание",
//     "Уход",
//     "Защита",
//     "Средства для мамы",
//     "Органическая линейка",
//     "Другое",
//   ];

//   // Debounced filter updates
//   const debouncedSetFilters = useCallback(
//     debounce((newFilters) => {
//       startTransition(() => {
//         dispatch(setFilters({ ...newFilters }));
//       });
//     }, 300),
//     [dispatch]
//   );

//   // Minimum loading time to prevent flickering
//   useEffect(() => {
//     const timer = setTimeout(() => setMinLoadingTimeMet(true), 500);
//     return () => clearTimeout(timer);
//   }, []);

//   // Fetch products on mount
//   useEffect(() => {
//     if (status === "idle") {
//       dispatch(getAllProductsAction());
//     }
//   }, [dispatch, status]);

//   const isInCart = (item) => userCart.some((cartItem) => cartItem.id === item.id);

//   // Client-side filtering
//   const filteredProducts = useMemo(() => {
//     let filtered = [...allProducts];

//     // Filter by categories
//     if (filters.selectedCategories.length > 0) {
//       filtered = filtered.filter((product) =>
//         product.Categories.some((cat) => filters.selectedCategories.includes(cat.name))
//       );
//     }

//     // Filter by search term (name)
//     if (filters.searchTerm) {
//       filtered = filtered.filter((product) =>
//         product.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
//       );
//     }

//     // Filter by price
//     if (filters.minPrice) {
//       filtered = filtered.filter(
//         (product) => parseFloat(product.price) >= parseFloat(filters.minPrice)
//       );
//     }
//     if (filters.maxPrice) {
//       filtered = filtered.filter(
//         (product) => parseFloat(product.price) <= parseFloat(filters.maxPrice)
//       );
//     }

//     // Filter by volume
//     if (filters.minVolume) {
//       filtered = filtered.filter(
//         (product) => parseFloat(product.volume) >= parseFloat(filters.minVolume)
//       );
//     }
//     if (filters.maxVolume) {
//       filtered = filtered.filter(
//         (product) => parseFloat(product.volume) <= parseFloat(filters.maxVolume)
//       );
//     }

//     // Filter by stock
//     if (filters.minStock) {
//       filtered = filtered.filter(
//         (product) => product.stock >= parseInt(filters.minStock)
//       );
//     }
//     if (filters.maxStock) {
//       filtered = filtered.filter(
//         (product) => product.stock <= parseInt(filters.maxStock)
//       );
//     }

//     // Filter by description
//     if (filters.descriptionKeyword) {
//       filtered = filtered.filter((product) =>
//         product.description.toLowerCase().includes(filters.descriptionKeyword.toLowerCase())
//       );
//     }

//     // Filter by features
//     if (filters.featuresKeyword) {
//       filtered = filtered.filter((product) =>
//         product.features.toLowerCase().includes(filters.featuresKeyword.toLowerCase())
//       );
//     }

//     // Sorting
//     if (filters.sortBy) {
//       filtered = filtered.sort((a, b) => {
//         switch (filters.sortBy) {
//           case "price_asc":
//             return parseFloat(a.price) - parseFloat(b.price);
//           case "price_desc":
//             return parseFloat(b.price) - parseFloat(a.price);
//           case "name_asc":
//             return a.name.localeCompare(b.name);
//           case "name_desc":
//             return b.name.localeCompare(a.name);
//           case "volume_asc":
//             return parseFloat(a.volume) - parseFloat(b.volume);
//           case "volume_desc":
//             return parseFloat(b.volume) - parseFloat(a.volume);
//           case "stock_asc":
//             return a.stock - b.stock;
//           case "stock_desc":
//             return b.stock - a.stock;
//           default:
//             return 0;
//         }
//       });
//     }

//     return filtered;
//   }, [allProducts, filters]);

//   const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
//   const currentItems = filteredProducts.slice(
//     (filters.page - 1) * itemsPerPage,
//     filters.page * itemsPerPage
//   );

//   const handleSortChange = (event) => {
//     debouncedSetFilters({ ...filters, sortBy: event.target.value });
//   };

//   const handleCategoryChange = (cat) => {
//     const newCategories = cat === "Все товары"
//       ? []
//       : filters.selectedCategories.includes(cat)
//         ? filters.selectedCategories.filter((c) => c !== cat)
//         : [...filters.selectedCategories, cat];
//     debouncedSetFilters({ ...filters, selectedCategories: newCategories, page: 1 });
//   };

//   const handleResetFilters = () => {
//     dispatch(resetFilters());
//     setFilterOpen(false);
//   };

//   const isLoading = status === "loading" || !minLoadingTimeMet || isPending;

//   return (
//     <ThemeProvider theme={theme}>
//       <Container maxWidth="lg" sx={{ py: 6, bgcolor: "transparent" }}>
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//         >
//           <Typography variant="h4" sx={{ mb: 4, textAlign: "left" }}>
//             {selectedMainType || "Каталог товаров"}
//           </Typography>
//         </motion.div>

//         {/* Search and Filters */}
//         <Paper
//           elevation={0}
//           sx={{
//             p: 3,
//             bgcolor: "background.paper",
//             borderRadius: "20px",
//             mb: 4,
//             position: "sticky",
//             top: 0,
//             zIndex: 10,
//           }}
//         >
//           <Stack spacing={3}>
//             <Stack direction="row" spacing={2} alignItems="center">
//               <TextField
//                 fullWidth
//                 placeholder="Поиск по названию..."
//                 value={filters.searchTerm}
//                 onChange={(e) => debouncedSetFilters({ ...filters, searchTerm: e.target.value, page: 1 })}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <Search sx={{ color: "primary.main" }} />
//                     </InputAdornment>
//                   ),
//                   endAdornment: filters.searchTerm && (
//                     <InputAdornment position="end">
//                       <IconButton onClick={() => debouncedSetFilters({ ...filters, searchTerm: "", page: 1 })}>
//                         <Clear sx={{ color: "primary.main" }} />
//                       </IconButton>
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//               <FormControl sx={{ minWidth: 200 }}>
//                 <Select
//                   value={filters.sortBy}
//                   onChange={handleSortChange}
//                   displayEmpty
//                   renderValue={(value) => (value ? value : "Сортировка")}
//                 >
//                   <MenuItem value="">Сортировка</MenuItem>
//                   <MenuItem value="price_asc">Цена: по возрастанию</MenuItem>
//                   <MenuItem value="price_desc">Цена: по убыванию</MenuItem>
//                   <MenuItem value="name_asc">Название: А-Я</MenuItem>
//                   <MenuItem value="name_desc">Название: Я-А</MenuItem>
//                   <MenuItem value="volume_asc">Объем: по возрастанию</MenuItem>
//                   <MenuItem value="volume_desc">Объем: по убыванию</MenuItem>
//                   <MenuItem value="stock_asc">Наличие: по возрастанию</MenuItem>
//                   <MenuItem value="stock_desc">Наличие: по убыванию</MenuItem>
//                 </Select>
//               </FormControl>
//               <IconButton
//                 onClick={() => setFilterOpen(true)}
//                 sx={{
//                   bgcolor: "primary.main",
//                   color: "#333333",
//                   borderRadius: "50%",
//                   p: 1.5,
//                   "&:hover": {
//                     bgcolor: "#87CEEB",
//                     transform: "scale(1.1)",
//                   },
//                 }}
//               >
//                 <FilterList />
//               </IconButton>
//             </Stack>
//             <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
//               {categories.map((cat) => (
//                 <CategoryButton
//                   key={cat}
//                   active={
//                     cat === "Все товары"
//                       ? filters.selectedCategories.length === 0
//                       : filters.selectedCategories.includes(cat)
//                       ? 1
//                       : 0
//                   }
//                   onClick={() => handleCategoryChange(cat)}
//                   component={motion.button}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   {cat}
//                 </CategoryButton>
//               ))}
//             </Box>
//             {(filters.searchTerm ||
//               filters.sortBy ||
//               filters.minPrice ||
//               filters.maxPrice ||
//               filters.minVolume ||
//               filters.maxVolume ||
//               filters.minStock ||
//               filters.maxStock ||
//               filters.descriptionKeyword ||
//               filters.featuresKeyword ||
//               filters.selectedCategories.length > 0) && (
//               <Box sx={{ textAlign: "center" }}>
//                 <Button onClick={handleResetFilters}>
//                   Сбросить фильтры
//                 </Button>
//               </Box>
//             )}
//           </Stack>
//         </Paper>

//         {/* Error Message */}
//         {error && (
//           <Box textAlign="center" mb={2}>
//             <Typography color="error">Ошибка загрузки товаров: {error}</Typography>
//             <Button
//               onClick={() => dispatch(getAllProductsAction())}
//               disabled={isPending}
//               startIcon={isPending ? <CircularProgress size={20} /> : null}
//               sx={{ mt: 1 }}
//             >
//               Повторить
//             </Button>
//           </Box>
//         )}

//         {/* Product Grid */}
//         <Box mb={6}>
//           <Grid container spacing={3} justifyContent="center">
//             {isLoading ? (
//               [...Array(8)].map((_, idx) => (
//                 <Grid item xs={12} sm={6} md={3} key={idx}>
//                   <Skeleton variant="rectangular" height={400} sx={{ borderRadius: "15px", width: "300px", margin: "0 auto" }} />
//                 </Grid>
//               ))
//             ) : currentItems.length === 0 ? (
//               <Grid item xs={12}>
//                 <Typography variant="body1" color="text.secondary" textAlign="center">
//                   Товары не найдены.
//                 </Typography>
//               </Grid>
//             ) : (
//               currentItems.map((item) => {
//                 const images = item.ProductImages || [];
//                 const imageUrl = images.length > 0
//                   ? `${BASE_URL.replace(/\/api\/store$/, "")}${images[0].imagePath.replace(/^\/api\/store/, "")}`
//                   : "/placeholder-image.jpg";

//                 return (
//                   <Grid item xs={12} sm={6} md={3} key={item.id}>
//                     <ProductCard
//                       component={motion.div}
//                       initial={{ opacity: 0, y: 50 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: item.id * 0.1 }}
//                     >
//                       {images.length > 0 ? (
//                         <Box sx={{ height: "200px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
//                           <Image
//                             src={imageErrors[item.id] ? "/placeholder-image.jpg" : imageUrl}
//                             alt={item.name}
//                             width={280}
//                             height={180}
//                             style={{ objectFit: "contain", maxWidth: "100%", maxHeight: "100%" }}
//                             onError={() => setImageErrors((prev) => ({ ...prev, [item.id]: true }))}
//                             unoptimized
//                           />
//                         </Box>
//                       ) : (
//                         <Box
//                           sx={{
//                             height: "200px",
//                             width: "100%",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             bgcolor: "#F5F5F5",
//                             borderRadius: "10px",
//                           }}
//                         >
//                           <Typography variant="body1" color="text.secondary">
//                             Нет фото
//                           </Typography>
//                         </Box>
//                       )}
//                       <CardContent sx={{ flexGrow: 1, padding: "16px" }}>
//                         <Typography
//                           variant="h6"
//                           component={Link}
//                           href={`/product/${item.id}`}
//                           sx={{
//                             textDecoration: "none",
//                             color: "text.primary",
//                             "&:hover": { color: "primary.main" },
//                             display: "-webkit-box",
//                             WebkitLineClamp: 2,
//                             WebkitBoxOrient: "vertical",
//                             overflow: "hidden",
//                             textOverflow: "ellipsis",
//                           }}
//                         >
//                           {item.name}
//                         </Typography>
//                         <Typography
//                           variant="body2"
//                           sx={{
//                             display: "-webkit-box",
//                             WebkitLineClamp: 1,
//                             WebkitBoxOrient: "vertical",
//                             overflow: "hidden",
//                             textOverflow: "ellipsis",
//                           }}
//                         >
//                           {item.Categories.length > 0
//                             ? item.Categories.map((cat) => cat.name).join(", ")
//                             : "Без категории"}
//                         </Typography>
//                         <Typography
//                           variant="body2"
//                           mt={1}
//                           sx={{
//                             display: "-webkit-box",
//                             WebkitLineClamp: 3,
//                             WebkitBoxOrient: "vertical",
//                             overflow: "hidden",
//                             textOverflow: "ellipsis",
//                           }}
//                         >
//                           {item.description}
//                         </Typography>
//                         <Typography variant="body2" mt={1}>
//                           Объем: {item.volume}
//                         </Typography>
//                         <Typography variant="body2" mt={1}>
//                           Наличие: {item.stock} шт.
//                         </Typography>
//                       </CardContent>
//                       <CardActions sx={{ p: 2, justifyContent: "space-between" }}>
//                         <Typography variant="subtitle1" fontWeight={700}>
//                           {parseFloat(item.price)?.toLocaleString() || "0"} ₸
//                         </Typography>
//                         <Button
//                           onClick={() => dispatch(addToCartProductAction(item))}
//                           disabled={isInCart(item)}
//                         >
//                           {isInCart(item) ? "В корзине" : "Добавить"}
//                         </Button>
//                       </CardActions>
//                     </ProductCard>
//                   </Grid>
//                 );
//               })
//             )}
//           </Grid>
//         </Box>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <Stack spacing={2} alignItems="center" mt={4}>
//             <Pagination
//               count={totalPages}
//               page={filters.page}
//               onChange={(e, page) => debouncedSetFilters({ ...filters, page })}
//               sx={{
//                 "& .MuiPaginationItem-root": {
//                   color: "primary.main",
//                 },
//                 "& .Mui-selected": {
//                   background: "linear-gradient(45deg, #ADD8E6 30%, #87CEEB 90%)",
//                   color: "#333333",
//                   boxShadow: "0 2px 8px rgba(135, 206, 235, 0.5)",
//                 },
//               }}
//             />
//             <Typography variant="caption" color="text.secondary">
//               Показано {currentItems.length} из {filteredProducts.length} товаров
//             </Typography>
//           </Stack>
//         )}

//         {/* Filter Drawer */}
//         <FilterDrawer
//           anchor="right"
//           open={filterOpen}
//           onClose={() => setFilterOpen(false)}
//           component={motion.div}
//           initial={{ x: "100%" }}
//           animate={{ x: filterOpen ? 0 : "100%" }}
//           transition={{ duration: 0.5 }}
//         >
//           <Typography variant="h6" gutterBottom fontWeight={700}>
//             Фильтры
//           </Typography>
//           <Box sx={{ mt: 2 }}>
//             <Typography variant="subtitle1">Категории</Typography>
//             <FormGroup>
//               {categories.slice(1).map((cat) => (
//                 <FormControlLabel
//                   key={cat}
//                   control={
//                     <Checkbox
//                       checked={filters.selectedCategories.includes(cat)}
//                       onChange={() => handleCategoryChange(cat)}
//                       sx={{ color: "primary.main" }}
//                     />
//                   }
//                   label={cat}
//                 />
//               ))}
//             </FormGroup>
//             <Typography variant="subtitle1" mt={2}>Цена</Typography>
//             <TextField
//               label="Минимальная цена"
//               type="number"
//               fullWidth
//               value={filters.minPrice}
//               onChange={(e) => debouncedSetFilters({ ...filters, minPrice: e.target.value, page: 1 })}
//               sx={{ mt: 2 }}
//             />
//             <TextField
//               label="Максимальная цена"
//               type="number"
//               fullWidth
//               value={filters.maxPrice}
//               onChange={(e) => debouncedSetFilters({ ...filters, maxPrice: e.target.value, page: 1 })}
//               sx={{ mt: 2 }}
//             />
//             <Typography variant="subtitle1" mt={2}>Объем</Typography>
//             <TextField
//               label="Минимальный объем"
//               type="number"
//               fullWidth
//               value={filters.minVolume}
//               onChange={(e) => debouncedSetFilters({ ...filters, minVolume: e.target.value, page: 1 })}
//               sx={{ mt: 2 }}
//             />
//             <TextField
//               label="Максимальный объем"
//               type="number"
//               fullWidth
//               value={filters.maxVolume}
//               onChange={(e) => debouncedSetFilters({ ...filters, maxVolume: e.target.value, page: 1 })}
//               sx={{ mt: 2 }}
//             />
//             <Typography variant="subtitle1" mt={2}>Наличие</Typography>
//             <TextField
//               label="Минимальное наличие"
//               type="number"
//               fullWidth
//               value={filters.minStock}
//               onChange={(e) => debouncedSetFilters({ ...filters, minStock: e.target.value, page: 1 })}
//               sx={{ mt: 2 }}
//             />
//             <TextField
//               label="Максимальное наличие"
//               type="number"
//               fullWidth
//               value={filters.maxStock}
//               onChange={(e) => debouncedSetFilters({ ...filters, maxStock: e.target.value, page: 1 })}
//               sx={{ mt: 2 }}
//             />
//             <Typography variant="subtitle1" mt={2}>Описание</Typography>
//             <TextField
//               label="Ключевое слово в описании"
//               fullWidth
//               value={filters.descriptionKeyword}
//               onChange={(e) => debouncedSetFilters({ ...filters, descriptionKeyword: e.target.value, page: 1 })}
//               sx={{ mt: 2 }}
//             />
//             <Typography variant="subtitle1" mt={2}>Особенности</Typography>
//             <TextField
//               label="Ключевое слово в особенностях"
//               fullWidth
//               value={filters.featuresKeyword}
//               onChange={(e) => debouncedSetFilters({ ...filters, featuresKeyword: e.target.value, page: 1 })}
//               sx={{ mt: 2 }}
//             />
//           </Box>
//           <Button fullWidth sx={{ mt: 3 }} onClick={() => setFilterOpen(false)}>
//             Применить
//           </Button>
//         </FilterDrawer>
//       </Container>
//     </ThemeProvider>
//   );
// }








"use client";
import { FixedSizeList } from 'react-window';
import React, { useEffect, useState, useMemo, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Pagination,
  Stack,
  Box,
  TextField,
  InputAdornment,
  Paper,
  Drawer,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Search, FilterList } from "@mui/icons-material";
import Link from "next/link";
import Slider from "react-slick";
import { motion } from "framer-motion";
import {
  getAllProductsAction,
  addToCartProductAction,
} from "@/store/slices/productSlice";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/store";

// В начале файла Products.js добавим утилиту для группировки
const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};
// Стилизация
const ProductCard = styled(Card)(({ theme }) => ({
  width: "18.75rem", // 300px / 16 = 18.75rem
  maxWidth: "18.75rem",
  minWidth: "18.75rem",
  height: "35rem", // Оставляем как есть
  display: "flex",
  flexDirection: "column",
  borderRadius: "0.9375rem", // 15px / 16 = 0.9375rem
  boxShadow: "0 0.25rem 0.75rem rgba(0,0,0,0.1)", // 4px и 12px
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-0.5rem)", // 8px / 16 = 0.5rem
    boxShadow: "0 0.5rem 1.25rem rgba(0,0,0,0.15)", // 8px и 20px
  },
  backgroundColor: "#FFFFFF",
  margin: "0 auto",
}));



// const ProductItem = memo(({ item, imageErrors, setImageErrors, isInCart, dispatch }) => {
//   const images = item.ProductImages || [];
//   console.log('IMAGES= ', images);

//   // Выбираем основное изображение (isPrimary: true), если его нет — берем первое
//   const primaryImage = images.find((img) => img.isPrimary) || images[0];
//   const imageUrl = images.length > 0
//     ? `${BASE_URL.replace(/\/api\/store$/, "")}${primaryImage.imagePath}`
//     : "/placeholder-image.jpg";
//   console.log('IMAGE URL= ', imageUrl); // Для отладки

//   return (
//     <ProductCard>
//       {images.length > 0 ? (
//         <Box sx={{ height: "12.5rem", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
//           <Image
//             src={imageErrors[item.id] ? "/placeholder-image.jpg" : imageUrl}
//             alt={item.name || "Продукт"}
//             width={17.5} // 280px / 16 = 17.5rem
//             height={11.25} // 180px / 16 = 11.25rem
//             style={{ objectFit: "contain", maxWidth: "100%", maxHeight: "100%" }}
//             onError={() => {
//               console.log(`Failed to load image for product ${item.id}: ${imageUrl}`);
//               setImageErrors((prev) => ({ ...prev, [item.id]: true }));
//             }}
//             loading="lazy"
//           />
//         </Box>
//       ) : (
//         <Box
//           sx={{
//             height: "12.5rem",
//             width: "100%",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             bgcolor: "#F5F5F5",
//             borderRadius: "0.625rem",
//           }}
//         >
//           <Typography variant="body1" color="text.secondary">
//             Нет фото
//           </Typography>
//         </Box>
//       )}
//       <CardContent sx={{ flexGrow: 1, padding: "1rem" }}>
//         <Typography
//           variant="h6"
//           component={Link}
//           href={`/product/${item.id}`}
//           sx={{
//             textDecoration: "none",
//             color: "#333333",
//             "&:hover": { color: "#ADD8E6" },
//             display: "-webkit-box",
//             WebkitLineClamp: 2,
//             WebkitBoxOrient: "vertical",
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//           }}
//         >
//           {item.name || "Без названия"}
//         </Typography>
//         <Typography
//           variant="body2"
//           sx={{
//             display: "-webkit-box",
//             WebkitLineClamp: 1,
//             WebkitBoxOrient: "vertical",
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//           }}
//         >
//           {item.Categories?.length > 0
//             ? item.Categories.map((cat) => cat.name).join(", ")
//             : "Без категории"}
//         </Typography>
//         <Typography
//           variant="body2"
//           mt={1}
//           sx={{
//             display: "-webkit-box",
//             WebkitLineClamp: 3,
//             WebkitBoxOrient: "vertical",
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//           }}
//         >
//           {item.description || "Без описания"}
//         </Typography>
//         <Typography variant="body2" mt={1}>
//           Объем: {item.volume || "Не указан"}
//         </Typography>
//         <Typography variant="body2" mt={1}>
//           Наличие: {item.stock || 0} шт.
//         </Typography>
//       </CardContent>
//       <CardActions sx={{ p: 2, justifyContent: "space-between" }}>
//         <Typography variant="subtitle1" fontWeight="700">
//           {parseFloat(item.price || 0).toLocaleString()} ₸
//         </Typography>
//         <StyledButton
//           onClick={() => dispatch(addToCartProductAction(item))}
//           disabled={isInCart(item)}
//         >
//           {isInCart(item) ? "В корзине" : "Добавить"}
//         </StyledButton>
//       </CardActions>
//     </ProductCard>
//   );
// });

// Компонент Row для рендеринга строки с 4 карточками

const ProductItem = memo(({ item, imageErrors, setImageErrors, isInCart, dispatch }) => {
  const images = item.ProductImages || [];
  const imageUrl = images.length > 0
    ? `${BASE_URL.replace(/\/api\/store$/, "")}${images[0].imagePath.replace(/^\/api\/store/, "")}`
    : "/placeholder-image.jpg";

  return (
    <ProductCard>
      {images.length > 0 ? (
        <Box sx={{ height: "200px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Image
            src={imageErrors[item.id] ? "/placeholder-image.jpg" : imageUrl}
            alt={item.name || "Продукт"}
            width={280}
            height={180}
            style={{ objectFit: "contain", maxWidth: "100%", maxHeight: "100%" }}
            onError={() => setImageErrors((prev) => ({ ...prev, [item.id]: true }))}
            loading="lazy"
          />
        </Box>
      ) : (
        <Box
          sx={{
            height: "200px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#F5F5F5",
            borderRadius: "10px",
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Нет фото
          </Typography>
        </Box>
      )}
      <CardContent sx={{ flexGrow: 1, padding: "16px" }}>
        <Typography
          variant="h6"
          component={Link}
          href={`/product/${item.id}`}
          sx={{
            textDecoration: "none",
            color: "#333333",
            "&:hover": { color: "#ADD8E6" },
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.name || "Без названия"}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.Categories?.length > 0
            ? item.Categories.map((cat) => cat.name).join(", ")
            : "Без категории"}
        </Typography>
        <Typography
          variant="body2"
          mt={1}
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.description || "Без описания"}
        </Typography>
        <Typography variant="body2" mt={1}>
          Объем: {item.volume || "Не указан"}
        </Typography>
        <Typography variant="body2" mt={1}>
          Наличие: {item.stock || 0} шт.
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Typography variant="subtitle1" fontWeight="700">
          {parseFloat(item.price || 0).toLocaleString()} ₸
        </Typography>
        <StyledButton
          onClick={() => dispatch(addToCartProductAction(item))}
          disabled={isInCart(item)}
        >
          {isInCart(item) ? "В корзине" : "Добавить"}
        </StyledButton>
      </CardActions>
    </ProductCard>
  );
});


const Row = ({ index, style, data }) => {
  const rowItems = data.items[index];
  return (
    <div style={{ ...style, padding: '0.75rem 0 1.5rem 0' }}> {/* 12px сверху, 24px снизу */}
      <Grid container spacing={3} justifyContent="center">
        {rowItems.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.id}>
            <ProductItem
              item={item}
              imageErrors={data.imageErrors}
              setImageErrors={data.setImageErrors}
              isInCart={data.isInCart}
              dispatch={data.dispatch}
            />
          </Grid>
        ))}
        {rowItems.length < 4 &&
          Array.from({ length: 4 - rowItems.length }).map((_, idx) => (
            <Grid item xs={12} sm={6} md={3} key={`empty-${idx}`} />
          ))}
      </Grid>
    </div>
  );
};

const FilterDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: 320,
    padding: theme.spacing(3),
    backgroundColor: "#F8FAFC",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "30px",
  padding: "10px 24px",
  backgroundColor: "#ADD8E6",
  color: "#333333",
  textTransform: "none",
  fontWeight: "600",
  "&:hover": {
    backgroundColor: "#87CEEB",
  },
  "&:disabled": {
    backgroundColor: "#E0E0E0",
    color: "#666666",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#FFFFFF",
    "& fieldset": {
      borderColor: "#ADD8E6",
    },
    "&:hover fieldset": {
      borderColor: "#87CEEB",
    },
  },
}));

const Banner = styled(Box)(({ theme }) => ({
  backgroundImage: "url('/images/podguz.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  borderRadius: "15px",
  padding: theme.spacing(6),
  color: "#FFFFFF",
  textAlign: "center",
  marginBottom: theme.spacing(4),
  position: "relative",
  overflow: "hidden",
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.3)",
    zIndex: 1,
  },
  "& > *": {
    position: "relative",
    zIndex: 2,
  },
}));

const NaturalBadge = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "10px",
  right: "10px",
  backgroundColor: "#E6F3E6",
  color: "#4A704A",
  padding: "4px 12px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: "600",
}));

export default function Products() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  const itemsPerPage = 8;

  const { allProducts, userCart } = useSelector((state) => state.usercart);

  useEffect(() => {
    setLoading(true);
    dispatch(getAllProductsAction()).then(() => setLoading(false));
  }, [dispatch]);

  const isInCart = (item) => userCart.some((cartItem) => cartItem.id === item.id);

  const categories = [
    "Все товары",
    "Купание",
    "Уход",
    "Защита",
    "Средства для мамы",
    "Органическая линейка",
    "Другое",
  ];

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Фильтрация по категории
    if (category && category !== "Все товары") {
      filtered = filtered.filter((product) =>
        product.Categories?.some((cat) => cat.name === category)
      );
    }

    // Фильтрация по поисковому запросу
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Фильтрация по цене
    if (minPrice) {
      filtered = filtered.filter(
        (product) => parseFloat(product.price || 0) >= parseFloat(minPrice)
      );
    }
    if (maxPrice) {
      filtered = filtered.filter(
        (product) => parseFloat(product.price || 0) <= parseFloat(maxPrice)
      );
    }

    // Сортировка
    if (sortBy) {
      filtered = filtered.sort((a, b) => {
        switch (sortBy) {
          case "price_asc":
            return parseFloat(a.price || 0) - parseFloat(b.price || 0);
          case "price_desc":
            return parseFloat(b.price || 0) - parseFloat(a.price || 0);
          case "name_asc":
            return a.name?.localeCompare(b.name) || 0;
          case "name_desc":
            return b.name?.localeCompare(a.name) || 0;
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [allProducts, category, searchTerm, minPrice, maxPrice, sortBy]);

  const featuredProducts = filteredProducts.slice(0, 5);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSortChange = (event) => setSortBy(event.target.value);
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setCurrentPage(1);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 960,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  // const Row = ({ index, style, data }) => {
  //   const item = data[index];
  //   const images = item.ProductImages || [];
  //   const imageUrl = images.length > 0
  //     ? `${BASE_URL.replace(/\/api\/store$/, "")}${images[0].imagePath.replace(/^\/api\/store/, "")}`
  //     : "/placeholder-image.jpg";
  
  //   return (
  //     <div style={{ ...style, padding: '12px', display: 'flex', justifyContent: 'center' }}>
  //       <ProductCard>
  //         {images.length > 0 ? (
  //           <Box sx={{ height: "200px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
  //             <Image
  //               src={imageErrors[item.id] ? "/placeholder-image.jpg" : imageUrl}
  //               alt={item.name || "Продукт"}
  //               width={280}
  //               height={180}
  //               style={{ objectFit: "contain", maxWidth: "100%", maxHeight: "100%" }}
  //               onError={() => setImageErrors((prev) => ({ ...prev, [item.id]: true }))}
  //               unoptimized
  //             />
  //           </Box>
  //         ) : (
  //           <Box
  //             sx={{
  //               height: "200px",
  //               width: "100%",
  //               display: "flex",
  //               alignItems: "center",
  //               justifyContent: "center",
  //               bgcolor: "#F5F5F5",
  //               borderRadius: "10px",
  //             }}
  //           >
  //             <Typography variant="body1" color="text.secondary">
  //               Нет фото
  //             </Typography>
  //           </Box>
  //         )}
  //         <CardContent sx={{ flexGrow: 1, padding: "16px" }}>
  //           <Typography
  //             variant="h6"
  //             component={Link}
  //             href={`/product/${item.id}`}
  //             sx={{
  //               textDecoration: "none",
  //               color: "#333333",
  //               "&:hover": { color: "#ADD8E6" },
  //               display: "-webkit-box",
  //               WebkitLineClamp: 2,
  //               WebkitBoxOrient: "vertical",
  //               overflow: "hidden",
  //               textOverflow: "ellipsis",
  //             }}
  //           >
  //             {item.name || "Без названия"}
  //           </Typography>
  //           <Typography
  //             variant="body2"
  //             sx={{
  //               display: "-webkit-box",
  //               WebkitLineClamp: 1,
  //               WebkitBoxOrient: "vertical",
  //               overflow: "hidden",
  //               textOverflow: "ellipsis",
  //             }}
  //           >
  //             {item.Categories?.length > 0
  //               ? item.Categories.map((cat) => cat.name).join(", ")
  //               : "Без категории"}
  //           </Typography>
  //           <Typography
  //             variant="body2"
  //             mt={1}
  //             sx={{
  //               display: "-webkit-box",
  //               WebkitLineClamp: 3,
  //               WebkitBoxOrient: "vertical",
  //               overflow: "hidden",
  //               textOverflow: "ellipsis",
  //             }}
  //           >
  //             {item.description || "Без описания"}
  //           </Typography>
  //           <Typography variant="body2" mt={1}>
  //             Объем: {item.volume || "Не указан"}
  //           </Typography>
  //           <Typography variant="body2" mt={1}>
  //             Наличие: {item.stock || 0} шт.
  //           </Typography>
  //         </CardContent>
  //         <CardActions sx={{ p: 2, justifyContent: "space-between" }}>
  //           <Typography variant="subtitle1" fontWeight="700">
  //             {parseFloat(item.price || 0).toLocaleString()} ₸
  //           </Typography>
  //           <StyledButton
  //             onClick={() => dispatch(addToCartProductAction(item))}
  //             disabled={isInCart(item)}
  //           >
  //             {isInCart(item) ? "В корзине" : "Добавить"}
  //           </StyledButton>
  //         </CardActions>
  //       </ProductCard>
  //     </div>
  //   );
  // };


  const remToPixels = (rem) => {
    const baseFontSize = 16;
    return rem * baseFontSize;
  };
  
  const itemSizeInPixels = remToPixels(37.75); // 37.75rem * 16 = 604px
  const listHeight = itemSizeInPixels * chunkArray(currentItems, 4).length; // Динамическая высота

  return (
    <Container maxWidth="lg" sx={{ py: 6, fontFamily: "Montserrat, sans-serif" }}>
      {/* Баннер */}
     

   

      {/* Заголовок и поиск */}
      <Stack spacing={3} mb={4}>
        <Typography
          variant="h4"
          fontWeight="700"
          color="#333333"
          sx={{ textTransform: "uppercase" }}
        >
          Каталог продуктов
        </Typography>

        <Paper elevation={0} sx={{ p: 2, backgroundColor: "#F8FAFC", borderRadius: "15px" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <StyledTextField
              fullWidth
              variant="outlined"
              placeholder="Поиск товаров..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "#ADD8E6" }} />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <Select
                value={sortBy}
                onChange={handleSortChange}
                displayEmpty
                sx={{
                  borderRadius: "10px",
                  color: "#333333",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ADD8E6",
                  },
                }}
              >
                <MenuItem value="">Сортировка</MenuItem>
                <MenuItem value="price_asc">Цена: по возрастанию</MenuItem>
                <MenuItem value="price_desc">Цена: по убыванию</MenuItem>
                <MenuItem value="name_asc">Название: А-Я</MenuItem>
                <MenuItem value="name_desc">Название: Я-А</MenuItem>
              </Select>
            </FormControl>
            <IconButton color="primary" onClick={() => setFilterOpen(true)}>
              <FilterList sx={{ color: "#ADD8E6" }} />
            </IconButton>
          </Stack>
        </Paper>
      </Stack>

      {/* Сетка продуктов */}
   

      <Box mb={6} position="relative">
  {loading && (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 10,
      }}
    >
      <CircularProgress sx={{ color: "#ADD8E6" }} size={60} />
    </Box>
  )}
  {loading ? (
    <Grid container spacing={3} justifyContent="center">
      {[...Array(8)].map((_, idx) => (
        <Grid item xs={12} sm={6} md={3} key={idx}>
          <Skeleton
            variant="rectangular"
            height="35rem"
            sx={{ borderRadius: "0.9375rem", width: "18.75rem", margin: "0 auto" }}
          />
        </Grid>
      ))}
    </Grid>
  ) : currentItems.length === 0 ? (
    <Typography variant="body1" color="#666666" textAlign="center">
      Товары не найдены
    </Typography>
  ) : (
    <Grid container spacing={3} justifyContent="center">
      {currentItems.map((item) => (
        <Grid item xs={12} sm={6} md={3} key={item.id}>
          <ProductItem
            item={item}
            imageErrors={imageErrors}
            setImageErrors={setImageErrors}
            isInCart={isInCart}
            dispatch={dispatch}
          />
        </Grid>
      ))}
    </Grid>
  )}
</Box>

      {/* Пагинация */}
      {totalPages > 1 && (
        <Stack spacing={2} alignItems="center" mt={4}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#ADD8E6",
              },
              "& .Mui-selected": {
                backgroundColor: "#ADD8E6",
                color: "#333333",
              },
            }}
          />
          <Typography variant="caption" color="#666666">
            Показано {currentItems.length} из {filteredProducts.length} товаров
          </Typography>
        </Stack>
      )}

      {/* Боковая панель фильтров */}
      <FilterDrawer anchor="right" open={filterOpen} onClose={() => setFilterOpen(false)}>
        <Typography variant="h6" gutterBottom color="#333333" fontWeight="700">
          Фильтры
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" color="#333333">
            Категория
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <Select
              value={category}
              onChange={handleCategoryChange}
              displayEmpty
              sx={{
                borderRadius: "10px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ADD8E6",
                },
              }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat === "Все товары" ? "" : cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" color="#333333">
            Цена
          </Typography>
          <StyledTextField
            label="Минимальная цена"
            type="number"
            fullWidth
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            sx={{ mt: 2 }}
          />
          <StyledTextField
            label="Максимальная цена"
            type="number"
            fullWidth
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            sx={{ mt: 2 }}
          />
        </Box>
        <StyledButton fullWidth sx={{ mt: 3 }} onClick={() => setFilterOpen(false)}>
          Применить
        </StyledButton>
      </FilterDrawer>
    </Container>
  );
}
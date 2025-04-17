
"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Search, FilterList } from "@mui/icons-material";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  getAllProductsAction,
  addToCartProductAction,
} from "@/store/slices/productSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";

// Стилизация
const ProductCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: "15px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  },
  backgroundColor: "#FFFFFF",
}));

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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/store";

export default function KatalogComponent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { allProducts, userCart, selectedMainType, selectedType, status } = useSelector(
    (state) => state.usercart
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("");
  const itemsPerPage = 8;

  // Состояние для обработки ошибок загрузки изображений
  const [imageErrors, setImageErrors] = useState({});

  // Debounce для поиска
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  // Загрузка продуктов с фильтрами
  useEffect(() => {
    const filters = {
      mainType: selectedMainType,
      type: selectedType,
      category,
      search: searchTerm,
      minPrice,
      maxPrice,
      sortBy,
    };
    dispatch(getAllProductsAction(filters));
  }, [dispatch, selectedMainType, selectedType, category, searchTerm, minPrice, maxPrice, sortBy]);

  const isInCart = (item) => userCart.some((cartItem) => cartItem.id === item.id);

  // Мемоизация отфильтрованных продуктов
  const filteredProducts = useMemo(() => {
    return allProducts;
  }, [allProducts]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSortChange = (event) => setSortBy(event.target.value);
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setCurrentPage(1); // Сбрасываем страницу при смене категории
  };

  const categories = [
    "Все товары",
    "Купание",
    "Уход",
    "Защита",
    "Средства для мамы",
    "Органическая линейка",
    "Другое",
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6, fontFamily: "Montserrat, sans-serif" }}>
      {/* Заголовок и поиск */}
      <Stack spacing={3} mb={4}>
        <Typography
          variant="h4"
          fontWeight="700"
          color="#333333"
          sx={{ textTransform: "uppercase" }}
        >
          {selectedMainType || "Продукты"}
        </Typography>

        <Paper elevation={0} sx={{ p: 2, backgroundColor: "#F8FAFC", borderRadius: "15px" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <StyledTextField
              fullWidth
              variant="outlined"
              placeholder="Поиск товаров..."
              onChange={(e) => debouncedSearch(e.target.value)}
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
      <Box mb={6}>
        <Grid container spacing={3}>
          {status === "loading" ? (
            [...Array(8)].map((_, idx) => (
              <Grid item xs={3} key={idx}>
                <Skeleton variant="rectangular" height={400} />
              </Grid>
            ))
          ) : currentItems.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="body1" color="#666666" textAlign="center">
                Товары не найдены.
              </Typography>
            </Grid>
          ) : (
            currentItems.map((item) => {
              const images = item.ProductImages || [];
              const imageUrl = images.length > 0
                ? `${BASE_URL.replace(/\/api\/store$/, "")}${images[0].imagePath.replace(/^\/api\/store/, "")}`
                : "/placeholder-image.jpg";

              console.log(`Image URL for ${item.name}:`, imageUrl);

              return (
                <Grid item xs={3} key={item.id}>
                  <ProductCard
                    component={motion.div}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: item.id * 0.1 }}
                  >
                    {images.length > 0 ? (
                      <Box sx={{ height: "200px", display: "flex", justifyContent: "center" }}>
                        <Image
                          src={imageErrors[item.id] ? "/placeholder-image.jpg" : imageUrl}
                          alt={item.name}
                          width={300}
                          height={200}
                          style={{ objectFit: "contain" }}
                          loading="lazy"
                          onError={() => setImageErrors((prev) => ({ ...prev, [item.id]: true }))}
                        />
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          height: "200px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#F5F5F5",
                          borderRadius: "10px",
                        }}
                      >
                        <Typography variant="body1" color="#666666">
                          Нет фото
                        </Typography>
                      </Box>
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        component={Link}
                        href={`/product/${item.id}`}
                        sx={{
                          textDecoration: "none",
                          color: "#333333",
                          fontWeight: "600",
                          "&:hover": { color: "#ADD8E6" },
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="#666666">
                        {item.Categories.length > 0
                          ? item.Categories.map((cat) => cat.name).join(", ")
                          : "Без категории"}
                      </Typography>
                      <Typography variant="body2" color="#666666" mt={1}>
                        {item.description.length > 150
                          ? `${item.description.slice(0, 150)}...`
                          : item.description}
                      </Typography>
                      {item.natural && (
                        <NaturalBadge>97% натуральных ингредиентов</NaturalBadge>
                      )}
                    </CardContent>
                    <CardActions sx={{ p: 2, justifyContent: "space-between" }}>
                      <Typography variant="subtitle1" fontWeight="700" color="#333333">
                        {parseFloat(item.price)?.toLocaleString() || "0"} ₸
                      </Typography>
                      <StyledButton
                        onClick={() => dispatch(addToCartProductAction(item))}
                        disabled={isInCart(item)}
                      >
                        {isInCart(item) ? "В корзине" : "Добавить"}
                      </StyledButton>
                    </CardActions>
                  </ProductCard>
                </Grid>
              );
            })
          )}
        </Grid>
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
        

        <StyledButton fullWidth sx={{ mt: 3 }} onClick={() => setFilterOpen(false)}>
          Применить
        </StyledButton>
      </FilterDrawer>
    </Container>
  );
}

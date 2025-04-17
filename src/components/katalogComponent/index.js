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
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { Search, FilterList, Clear } from "@mui/icons-material";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  getAllProductsAction,
  addToCartProductAction,
} from "@/store/slices/productSlice";
import Image from "next/image";
import debounce from "lodash/debounce";

// Custom MUI Theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#ADD8E6", // Light Blue from Biolane.kz
    },
    secondary: {
      main: "#FFB6C1", // Soft Pink
    },
    background: {
      default: "#F8FAFC", // Light Gray Background
      paper: "#FFFFFF",
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
    },
  },
  typography: {
    fontFamily: "'Montserrat', sans-serif",
    h4: {
      fontWeight: 700,
      color: "#333333",
      textTransform: "uppercase",
    },
    body2: {
      color: "#666666",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "30px",
          textTransform: "none",
          fontWeight: 600,
          padding: "10px 24px",
          background: "linear-gradient(45deg, #ADD8E6 30%, #87CEEB 90%)",
          color: "#333333",
          boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
          "&:hover": {
            background: "linear-gradient(45deg, #87CEEB 30%, #ADD8E6 90%)",
            transform: "scale(1.05)",
            boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
          },
          "&:disabled": {
            background: "#E0E0E0",
            color: "#666666",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "30px",
            background: "#FFFFFF",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            "& fieldset": {
              border: "none",
            },
            "&:hover fieldset": {
              border: "none",
            },
            "&.Mui-focused fieldset": {
              border: "none",
              boxShadow: "0 0 10px rgba(173, 216, 230, 0.5)",
            },
          },
          "& .MuiInputBase-input": {
            padding: "12px 16px",
            color: "#333333",
          },
          "& .MuiInputLabel-root": {
            color: "#666666",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: "30px",
          background: "#FFFFFF",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          "& .MuiSelect-select": {
            padding: "12px 32px 12px 16px",
            color: "#333333",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "none",
            boxShadow: "0 0 10px rgba(173, 216, 230, 0.5)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "15px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          },
        },
      },
    },
  },
});

// Styled Components
const ProductCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#FFFFFF",
}));

const FilterDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: 320,
    padding: theme.spacing(3),
    background: "linear-gradient(135deg, #F8FAFC 0%, #E6F0FA 100%)",
  },
}));

const CategoryButton = styled(Button)(({ theme, active }) => ({
  borderRadius: "25px",
  padding: "8px 20px",
  margin: "5px",
  fontWeight: 600,
  color: active ? "#333333" : "#666666",
  background: active
    ? "linear-gradient(45deg, #ADD8E6 30%, #87CEEB 90%)"
    : "#F5F5F5",
  boxShadow: active
    ? "0 4px 15px rgba(135, 206, 235, 0.5)"
    : "none",
  "&:hover": {
    background: "linear-gradient(45deg, #87CEEB 30%, #ADD8E6 90%)",
    color: "#333333",
    boxShadow: "0 4px 15px rgba(135, 206, 235, 0.5)",
  },
}));

const NaturalBadge = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "10px",
  right: "10px",
  background: "linear-gradient(45deg, #E6F3E6 30%, #D4EAD4 90%)",
  color: "#4A704A",
  padding: "4px 12px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: 600,
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
}));

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/store";

export default function KatalogComponent() {
  const dispatch = useDispatch();
  const { allProducts, userCart, selectedMainType, selectedType, status, error } = useSelector(
    (state) => state.usercart
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minVolume, setMinVolume] = useState("");
  const [maxVolume, setMaxVolume] = useState("");
  const [minStock, setMinStock] = useState("");
  const [maxStock, setMaxStock] = useState("");
  const [descriptionKeyword, setDescriptionKeyword] = useState("");
  const [featuresKeyword, setFeaturesKeyword] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [imageErrors, setImageErrors] = useState({});

  const itemsPerPage = 8;
  const categories = [
    "Все товары",
    "Купание",
    "Уход",
    "Защита",
    "Средства для мамы",
    "Органическая линейка",
    "Другое",
  ];

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  useEffect(() => {
    const filters = {
      mainType: selectedMainType,
      type: selectedType,
      categories: selectedCategories,
      search: searchTerm,
      minPrice,
      maxPrice,
      minVolume,
      maxVolume,
      minStock,
      maxStock,
      description: descriptionKeyword,
      features: featuresKeyword,
      sortBy,
    };
    dispatch(getAllProductsAction(filters));
  }, [
    dispatch,
    selectedMainType,
    selectedType,
    selectedCategories,
    searchTerm,
    minPrice,
    maxPrice,
    minVolume,
    maxVolume,
    minStock,
    maxStock,
    descriptionKeyword,
    featuresKeyword,
    sortBy,
  ]);

  const isInCart = (item) => userCart.some((cartItem) => cartItem.id === item.id);

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        product.Categories.some((cat) => selectedCategories.includes(cat.name))
      );
    }

    // Filter by search term (name)
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price
    if (minPrice) {
      filtered = filtered.filter(
        (product) => parseFloat(product.price) >= parseFloat(minPrice)
      );
    }
    if (maxPrice) {
      filtered = filtered.filter(
        (product) => parseFloat(product.price) <= parseFloat(maxPrice)
      );
    }

    // Filter by volume
    if (minVolume) {
      filtered = filtered.filter(
        (product) => parseFloat(product.volume) >= parseFloat(minVolume)
      );
    }
    if (maxVolume) {
      filtered = filtered.filter(
        (product) => parseFloat(product.volume) <= parseFloat(maxVolume)
      );
    }

    // Filter by stock
    if (minStock) {
      filtered = filtered.filter(
        (product) => product.stock >= parseInt(minStock)
      );
    }
    if (maxStock) {
      filtered = filtered.filter(
        (product) => product.stock <= parseInt(maxStock)
      );
    }

    // Filter by description
    if (descriptionKeyword) {
      filtered = filtered.filter((product) =>
        product.description.toLowerCase().includes(descriptionKeyword.toLowerCase())
      );
    }

    // Filter by features
    if (featuresKeyword) {
      filtered = filtered.filter((product) =>
        product.features.toLowerCase().includes(featuresKeyword.toLowerCase())
      );
    }

    // Sorting
    if (sortBy) {
      filtered = filtered.sort((a, b) => {
        switch (sortBy) {
          case "price_asc":
            return parseFloat(a.price) - parseFloat(b.price);
          case "price_desc":
            return parseFloat(b.price) - parseFloat(a.price);
          case "name_asc":
            return a.name.localeCompare(b.name);
          case "name_desc":
            return b.name.localeCompare(a.name);
          case "volume_asc":
            return parseFloat(a.volume) - parseFloat(b.volume);
          case "volume_desc":
            return parseFloat(b.volume) - parseFloat(a.volume);
          case "stock_asc":
            return a.stock - b.stock;
          case "stock_desc":
            return b.stock - a.stock;
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [
    allProducts,
    selectedCategories,
    searchTerm,
    minPrice,
    maxPrice,
    minVolume,
    maxVolume,
    minStock,
    maxStock,
    descriptionKeyword,
    featuresKeyword,
    sortBy,
  ]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat) => {
    if (cat === "Все товары") {
      setSelectedCategories([]);
    } else {
      setSelectedCategories((prev) =>
        prev.includes(cat)
          ? prev.filter((c) => c !== cat)
          : [...prev, cat]
      );
    }
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSortBy("");
    setMinPrice("");
    setMaxPrice("");
    setMinVolume("");
    setMaxVolume("");
    setMinStock("");
    setMaxStock("");
    setDescriptionKeyword("");
    setFeaturesKeyword("");
    setSelectedCategories([]);
    setCurrentPage(1);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 6, bgcolor: "transparent" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h4" sx={{ mb: 4, textAlign: "left" }}>
            {selectedMainType || "Каталог товаров"}
          </Typography>
        </motion.div>

        {/* Search and Filters */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            bgcolor: "background.paper",
            borderRadius: "20px",
            mb: 4,
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Stack spacing={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                fullWidth
                placeholder="Поиск по названию..."
                value={searchTerm}
                onChange={(e) => debouncedSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "primary.main" }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setSearchTerm("")}>
                        <Clear sx={{ color: "primary.main" }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl sx={{ minWidth: 200 }}>
                <Select
                  value={sortBy}
                  onChange={handleSortChange}
                  displayEmpty
                  renderValue={(value) => (value ? value : "Сортировка")}
                >
                  <MenuItem value="">Сортировка</MenuItem>
                  <MenuItem value="price_asc">Цена: по возрастанию</MenuItem>
                  <MenuItem value="price_desc">Цена: по убыванию</MenuItem>
                  <MenuItem value="name_asc">Название: А-Я</MenuItem>
                  <MenuItem value="name_desc">Название: Я-А</MenuItem>
                  <MenuItem value="volume_asc">Объем: по возрастанию</MenuItem>
                  <MenuItem value="volume_desc">Объем: по убыванию</MenuItem>
                  <MenuItem value="stock_asc">Наличие: по возрастанию</MenuItem>
                  <MenuItem value="stock_desc">Наличие: по убыванию</MenuItem>
                </Select>
              </FormControl>
              <IconButton
                onClick={() => setFilterOpen(true)}
                sx={{
                  bgcolor: "primary.main",
                  color: "#333333",
                  borderRadius: "50%",
                  p: 1.5,
                  "&:hover": {
                    bgcolor: "#87CEEB",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <FilterList />
              </IconButton>
            </Stack>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
              {categories.map((cat) => (
                <CategoryButton
                  key={cat}
                  active={
                    cat === "Все товары"
                      ? selectedCategories.length === 0
                      : selectedCategories.includes(cat)
                      ? 1
                      : 0
                  }
                  onClick={() => handleCategoryChange(cat)}
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {cat}
                </CategoryButton>
              ))}
            </Box>
            {(searchTerm ||
              sortBy ||
              minPrice ||
              maxPrice ||
              minVolume ||
              maxVolume ||
              minStock ||
              maxStock ||
              descriptionKeyword ||
              featuresKeyword ||
              selectedCategories.length > 0) && (
              <Box sx={{ textAlign: "center" }}>
                <Button onClick={handleResetFilters}>
                  Сбросить фильтры
                </Button>
              </Box>
            )}
          </Stack>
        </Paper>

        {/* Error Message */}
        {error && (
          <Typography color="error" textAlign="center" mb={2}>
            Ошибка загрузки товаров: {error}
          </Typography>
        )}

        {/* Product Grid */}
        <Box mb={6}>
          <Grid container spacing={3}>
            {status === "loading" ? (
              [...Array(8)].map((_, idx) => (
                <Grid item xs={12} sm={6} md={3} key={idx}>
                  <Skeleton variant="rectangular" height={400} sx={{ borderRadius: "15px" }} />
                </Grid>
              ))
            ) : currentItems.length === 0 ? (
              <Grid item xs={12}>
                <Typography variant="body1" color="text.secondary" textAlign="center">
                  Товары не найдены.
                </Typography>
              </Grid>
            ) : (
              currentItems.map((item) => {
                const images = item.ProductImages || [];
                const imageUrl = images.length > 0
                  ? `${BASE_URL.replace(/\/api\/store$/, "")}${images[0].imagePath.replace(/^\/api\/store/, "")}`
                  : "/placeholder-image.jpg";

                return (
                  <Grid item xs={12} sm={6} md={3} key={item.id}>
                    <ProductCard
                      component={motion.div}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
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
                            bgcolor: "#F5F5F5",
                            borderRadius: "10px",
                          }}
                        >
                          <Typography variant="body1" color="text.secondary">
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
                            color: "text.primary",
                            "&:hover": { color: "primary.main" },
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Typography variant="body2">
                          {item.Categories.length > 0
                            ? item.Categories.map((cat) => cat.name).join(", ")
                            : "Без категории"}
                        </Typography>
                        <Typography variant="body2" mt={1}>
                          {item.description.length > 150
                            ? `${item.description.slice(0, 150)}...`
                            : item.description}
                        </Typography>
                        <Typography variant="body2" mt={1}>
                          Объем: {item.volume}
                        </Typography>
                        <Typography variant="body2" mt={1}>
                          Наличие: {item.stock} шт.
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ p: 2, justifyContent: "space-between" }}>
                        <Typography variant="subtitle1" fontWeight={700}>
                          {parseFloat(item.price)?.toLocaleString() || "0"} ₸
                        </Typography>
                        <Button
                          onClick={() => dispatch(addToCartProductAction(item))}
                          disabled={isInCart(item)}
                        >
                          {isInCart(item) ? "В корзине" : "Добавить"}
                        </Button>
                      </CardActions>
                    </ProductCard>
                  </Grid>
                );
              })
            )}
          </Grid>
        </Box>

        {/* Pagination */}
        {totalPages > 1 && (
          <Stack spacing={2} alignItems="center" mt={4}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "primary.main",
                },
                "& .Mui-selected": {
                  background: "linear-gradient(45deg, #ADD8E6 30%, #87CEEB 90%)",
                  color: "#333333",
                  boxShadow: "0 2px 8px rgba(135, 206, 235, 0.5)",
                },
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Показано {currentItems.length} из {filteredProducts.length} товаров
            </Typography>
          </Stack>
        )}

        {/* Filter Drawer */}
        <FilterDrawer
          anchor="right"
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          component={motion.div}
          initial={{ x: "100%" }}
          animate={{ x: filterOpen ? 0 : "100%" }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h6" gutterBottom fontWeight={700}>
            Фильтры
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Категории</Typography>
            <FormGroup>
              {categories.slice(1).map((cat) => (
                <FormControlLabel
                  key={cat}
                  control={
                    <Checkbox
                      checked={selectedCategories.includes(cat)}
                      onChange={() => handleCategoryChange(cat)}
                      sx={{ color: "primary.main" }}
                    />
                  }
                  label={cat}
                />
              ))}
            </FormGroup>
            <Typography variant="subtitle1" mt={2}>Цена</Typography>
            <TextField
              label="Минимальная цена"
              type="number"
              fullWidth
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Максимальная цена"
              type="number"
              fullWidth
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Typography variant="subtitle1" mt={2}>Объем</Typography>
            <TextField
              label="Минимальный объем"
              type="number"
              fullWidth
              value={minVolume}
              onChange={(e) => setMinVolume(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Максимальный объем"
              type="number"
              fullWidth
              value={maxVolume}
              onChange={(e) => setMaxVolume(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Typography variant="subtitle1" mt={2}>Наличие</Typography>
            <TextField
              label="Минимальное наличие"
              type="number"
              fullWidth
              value={minStock}
              onChange={(e) => setMinStock(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Максимальное наличие"
              type="number"
              fullWidth
              value={maxStock}
              onChange={(e) => setMaxStock(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Typography variant="subtitle1" mt={2}>Описание</Typography>
            <TextField
              label="Ключевое слово в описании"
              fullWidth
              value={descriptionKeyword}
              onChange={(e) => setDescriptionKeyword(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Typography variant="subtitle1" mt={2}>Особенности</Typography>
            <TextField
              label="Ключевое слово в особенностях"
              fullWidth
              value={featuresKeyword}
              onChange={(e) => setFeaturesKeyword(e.target.value)}
              sx={{ mt: 2 }}
            />
          </Box>
          <Button fullWidth sx={{ mt: 3 }} onClick={() => setFilterOpen(false)}>
            Применить
          </Button>
        </FilterDrawer>
      </Container>
    </ThemeProvider>
  );
}
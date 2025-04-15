import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Container,
  Typography,
  Divider,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Pagination,
  Stack,
  Box,
  InputAdornment,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Search, SwapVertOutlined } from "@mui/icons-material";
import Link from "next/link";
import "rsuite/dist/rsuite-no-reset.min.css";
import { Carousel } from "rsuite";
import {
  getAllProductsAction,
  addToCartProductAction,
  addClickCountReducer,
} from "@/store/slices/productSlice";

// Стилизованные компоненты
const ProductCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[4],
  },
}));

const ProductImage = styled("div")({
  padding: "16px",
  backgroundColor: "#f5f5f5",
  borderRadius: "8px 8px 0 0",
});

const StyledCarousel = styled(Carousel)({
  height: 200,
  "& .rs-carousel-item img": {
    height: "200px !important",
    objectFit: "contain",
  },
});

export default function Pizzas() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortState, setSortState] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const crossOptical = useSelector((state) => state.usercart.allProducts);
  const host = useSelector((state) => state.usercart.host);
  const userCart = useSelector((state) => state.usercart.userCart);
  const selectedMainType = useSelector((state) => state.usercart.selectedMainType);
  const selectedType = useSelector((state) => state.usercart.selectedType);

  useEffect(() => {
    dispatch(getAllProductsAction());
  }, [dispatch]);

  const isInCart = (item) => userCart.some((cartItem) => cartItem.id === item.id);

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleSort = () => {
    setSortState(sortState === "1" ? "2" : "1");
  };

  // Фильтрация и сортировка
  const filteredProducts = crossOptical
    .filter((item) => {
      if (selectedMainType && selectedMainType !== "Все товары") {
        return item.mainType === selectedMainType;
      }
      return true;
    })
    .filter((item) => (selectedType ? item.type === selectedType : true))
    .filter((item) =>
      item.name && searchTerm
        ? item.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    )
    .sort((a, b) => {
      if (sortState === "1") return a.price - b.price;
      if (sortState === "2") return b.price - a.price;
      return 0;
    });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Заголовок и поиск */}
      <Stack spacing={3} mb={4}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          {selectedMainType || "Продукты"}
        </Typography>
        
        <Paper elevation={2} sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Поиск товаров..."
              value={searchTerm}
              onChange={handleSearchTermChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="outlined"
              startIcon={<SwapVertOutlined />}
              onClick={toggleSort}
              sx={{ minWidth: 200 }}
            >
              {sortState === "1" ? "По убыванию цены" : "По возрастанию цены"}
            </Button>
          </Stack>
        </Paper>
      </Stack>

      {/* Сетка продуктов */}
      <Grid container spacing={3}>
        {currentItems.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.id}>
            <ProductCard>
              {/* <ProductImage>
                <StyledCarousel autoplay>
                  {item.image.split(",").map((imageUrl, index) => (
                    <img
                      key={index}
                      src={`${host + imageUrl.trim()}`}
                      alt={item.name}
                    />
                  ))}
                </StyledCarousel>
              </ProductImage> */}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h6"
                  component={Link}
                  href={`/product/${item.id}`}
                  sx={{ textDecoration: "none", color: "inherit", "&:hover": { color: "primary.main" } }}
                >
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.type}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {item.description.slice(0, 100)}...
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, justifyContent: "space-between" }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {item.price.toLocaleString()} ₸
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => dispatch(addToCartProductAction(item))}
                  disabled={isInCart(item)}
                  sx={{ borderRadius: 20 }}
                >
                  {isInCart(item) ? "В корзине" : "Добавить"}
                </Button>
              </CardActions>
            </ProductCard>
          </Grid>
        ))}
      </Grid>

      {/* Пагинация */}
      {totalPages > 1 && (
        <Stack spacing={2} alignItems="center" mt={4}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            color="primary"
            size="large"
          />
          <Typography variant="caption" color="text.secondary">
            Показано {currentItems.length} из {filteredProducts.length} товаров
          </Typography>
        </Stack>
      )}
    </Container>
  );
}
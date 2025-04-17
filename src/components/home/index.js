
"use client";

import React, { useEffect, useState } from "react";
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
import { Search, FilterList, ShoppingCartOutlined} from "@mui/icons-material";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Link from "next/link";
import Slider from "react-slick";
import { motion } from "framer-motion";
import {
  getAllProductsAction,
  addToCartProductAction,
} from "@/store/slices/productSlice";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Carousel } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Стилизация
const ProductCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: 0,
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  transition: "all 0.3s ease",
  backgroundColor: "#FFFFFF",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
    border: "1px solid #E0E0E0",
  },
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

const Banner = styled(Box)(({ theme, bgImage }) => ({
  backgroundImage: `url(${bgImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
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

const BannerCarousel = styled(Carousel)({
  borderRadius: "15px",
  overflow: "hidden",
  "& .rs-carousel-item": {
    height: "400px",
  },
  "& .rs-carousel-slider": {
    borderRadius: "15px",
  },
  [`.rs-carousel-btn-prev, .rs-carousel-btn-next`]: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "#fff",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
  },
  [`.rs-carousel-indicators button`]: {
    backgroundColor: "#ADD8E6",
    "&.rs-carousel-indicator-active": {
      backgroundColor: "#87CEEB",
    },
  },
});

const banners = [
  {
    image: "/image/kupanie.png",
    title: "Забота с первых дней",
    subtitle: "Продукция Biolane — это мягкость и натуральность для нежной кожи вашего малыша.",
  },
  {
    image: "/image/podguz.png",
    title: "Нежность природы",
    subtitle: "Органические средства для ухода за всей семьёй.",
  },
  {
    image: "/image/shampun2.png",
    title: "Для мам и малышей",
    subtitle: "Безопасные и натуральные продукты от Biolane.",
  },
  {
    image: "/image/uhod.png",
    title: "97% натуральных ингредиентов",
    subtitle: "Доверяйте лучшее для вашего ребёнка.",
  },
];

const NaturalBadge = styled(motion(Box))(({ theme }) => ({
  position: "absolute",
  top: "8px",
  right: "8px",
  backgroundColor: "#E6F3E6",
  color: "#4A704A",
  padding: "4px 10px",
  fontSize: "11px",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
}));

const StyledCarousel = styled(Carousel)({
  borderRadius: "10px",
  overflow: "hidden",
  "& .rs-carousel-item": {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "240px",
  },
  "&:hover": {
    "& .rs-carousel-item": {
      opacity: 0.8,
      transition: "opacity 0.3s ease",
    },
  },
});

const StyledCarousel2 = styled(Carousel)({
  width: "100%",
  height: "240px",
  "&:hover": {
    "& .rs-carousel-item": {
      opacity: 0.8,
      transition: "opacity 0.3s ease",
    },
  },
});

const CartIconButton = styled(IconButton)(({ theme, inCart }) => ({
  color: inCart ? "#ADD8E6" : "#666666",
  "&:hover": {
    color: "#ADD8E6",
    transform: "scale(1.1)",
    transition: "all 0.3s ease",
  },
  "&:disabled": {
    color: "#E0E0E0",
  },
}));

const PriceTypography = styled(Typography)(({ theme }) => ({
  fontWeight: "700",
  color: "#333333",
  "&:after": {
    content: '"₸"',
    marginLeft: "4px",
  },
}));

const BASE_URL = "http://localhost:8000";

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
  const itemsPerPage = 8;
  const router = useRouter();
  const { allProducts, host, userCart, selectedMainType, selectedType } = useSelector(
    (state) => state.usercart
  );

  useEffect(() => {
    dispatch(getAllProductsAction()).then(() => setLoading(false));
  }, [dispatch]);

  const isInCart = (item) => userCart.some((cartItem) => cartItem.id === item.id);

  // Фильтрация и сортировка продуктов
  const filteredProducts = allProducts
    .filter((item) => {
      if (selectedMainType && selectedMainType !== "Все товары") {
        return item.Categories.some((cat) => cat.name === selectedMainType);
      }
      return true;
    })
    .filter((item) => {
      if (selectedType) {
        return item.type === selectedType;
      }
      return true;
    })
    .filter((item) => {
      if (category) {
        return item.Categories.some((cat) => cat.name === category);
      }
      return true;
    })
    .filter((item) => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        (item.name && item.name.toLowerCase().includes(search)) ||
        (item.volume && item.volume.toLowerCase().includes(search)) ||
        (item.description && item.description.toLowerCase().includes(search)) ||
        (item.features && item.features.toLowerCase().includes(search)) ||
        (item.Categories &&
          item.Categories.some((cat) => cat.name.toLowerCase().includes(search)))
      );
    })
    .filter((item) => {
      const price = parseFloat(item.price) || 0;
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;
      return price >= min && price <= max;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price_asc":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price_desc":
          return parseFloat(b.price) - parseFloat(a.price);
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSortChange = (event) => setSortBy(event.target.value);
  const handleCategoryChange = (event) => setCategory(event.target.value);

  // Настройки карусели для новинок
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
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

  // Категории из HTML
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
      <BannerCarousel autoplay autoplayInterval={1500} placement="bottom">
        {banners.map((banner, index) => (
          <Banner
            key={index}
            bgImage={banner.image}
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          ></Banner>
        ))}
      </BannerCarousel>

      {/* Карусель новинок */}
      <Box mb={6}>
        <Typography variant="h5" fontWeight="700" color="#333333" mb={3}>
          Новинки Biolane
        </Typography>
        {loading ? (
          <Grid container spacing={3}>
            {[...Array(4)].map((_, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Skeleton variant="rectangular" height={400} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Slider {...sliderSettings}>
            {allProducts
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 5)
              .map((item) => {
                const images = item.ProductImages || [];
                return (
                  <Box key={item.id} px={1}>
                    <ProductCard
                      component={motion.div}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: item.id * 0.1 }}
                    >
                      <Link href={`/product/${item.id}`} passHref>
                        <Box sx={{ position: "relative" }}>
                          {images.length > 0 ? (
                            <StyledCarousel autoplay>
                              {images.map((img, index) => (
                                <Box
                                  key={img.id || index}
                                  sx={{ display: "flex", justifyContent: "center" }}
                                >
                                  <Image
                                    src={`${BASE_URL}${img.imagePath}`}
                                    alt={`${item.name} image ${index + 1}`}
                                    width={600}
                                    height={400}
                                    style={{ objectFit: "contain" }}
                                    priority={index === 0}
                                  />
                                </Box>
                              ))}
                            </StyledCarousel>
                          ) : (
                            <Box
                              sx={{
                                height: "240px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#F5F5F5",
                              }}
                            >
                              <Typography variant="body1" color="#666666">
                                Нет фото
                              </Typography>
                            </Box>
                          )}
                          {item.natural && (
                            <NaturalBadge
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              97% натуральных
                            </NaturalBadge>
                          )}
                        </Box>
                      </Link>
                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        <Link href={`/product/${item.id}`} passHref>
                          <Typography
                            variant="h6"
                            sx={{
                              textDecoration: "none",
                              color: "#333333",
                              fontWeight: "700",
                              fontSize: "1rem",
                              "&:hover": {
                                textDecoration: "underline",
                                color: "#ADD8E6",
                              },
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {item.name}
                          </Typography>
                        </Link>
                        <Typography
                          variant="body2"
                          color="#666666"
                          sx={{ mt: 0.5, fontSize: "0.85rem" }}
                        >
                          {item.Categories.length > 0
                            ? item.Categories.map((cat) => cat.name).join(", ")
                            : "Без категории"}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="#666666"
                          sx={{
                            mt: 1,
                            fontSize: "0.85rem",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {item.description.length > 100
                            ? `${item.description.slice(0, 100)}...`
                            : item.description}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ p: 2, justifyContent: "space-between", alignItems: "center" }}>
                        <PriceTypography variant="subtitle1">
                          {parseFloat(item.price)?.toLocaleString() || "0"}
                        </PriceTypography>
                        <CartIconButton
                          onClick={() => dispatch(addToCartProductAction(item))}
                          disabled={isInCart(item)}
                          inCart={isInCart(item)}
                          aria-label={isInCart(item) ? "Товар в корзине" : "Добавить в корзину"}
                        >
                          <ShoppingBagIcon
                            sx={{ fontSize: "24px" }}
                          />
                        </CartIconButton>
                      </CardActions>
                    </ProductCard>
                  </Box>
                );
              })}
          </Slider>
        )}
      </Box>

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
      <Box mb={6}>
        <Grid container spacing={3}>
          {loading ? (
            [...Array(8)].map((_, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
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
              return (
                <Grid item xs={12} sm={6} md={3} key={item.id}>
                  <ProductCard
                    component={motion.div}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: item.id * 0.1 }}
                  >
                    <Link href={`/product/${item.id}`} passHref>
                      <Box sx={{ position: "relative" }}>
                        {images.length > 0 ? (
                          <StyledCarousel2 autoplay>
                            {images.map((img, index) => (
                              <Box
                                key={img.id || index}
                                sx={{ display: "flex", justifyContent: "center" }}
                              >
                                <Image
                                  src={`${BASE_URL}${img.imagePath}`}
                                  alt={`${item.name} image ${index + 1}`}
                                  width={300}
                                  height={240}
                                  style={{ objectFit: "contain" }}
                                  priority={index === 0}
                                />
                              </Box>
                            ))}
                          </StyledCarousel2>
                        ) : (
                          <Box
                            sx={{
                              height: "240px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#F5F5F5",
                            }}
                          >
                            <Typography variant="body1" color="#666666">
                              Нет фото
                            </Typography>
                          </Box>
                        )}
                        {item.natural && (
                          <NaturalBadge
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            97% натуральных
                          </NaturalBadge>
                        )}
                      </Box>
                    </Link>
                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                      <Link href={`/product/${item.id}`} passHref>
                        <Typography
                          variant="h6"
                          sx={{
                            textDecoration: "none",
                            color: "#333333",
                            fontWeight: "700",
                            fontSize: "1rem",
                            "&:hover": {
                              textDecoration: "underline",
                              color: "#ADD8E6",
                            },
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {item.name}
                        </Typography>
                      </Link>
                      <Typography
                        variant="body2"
                        color="#666666"
                        sx={{ mt: 0.5, fontSize: "0.85rem" }}
                      >
                        {item.Categories.length > 0
                          ? item.Categories.map((cat) => cat.name).join(", ")
                          : "Без категории"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="#666666"
                        sx={{
                          mt: 1,
                          fontSize: "0.85rem",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.description.length > 100
                          ? `${item.description.slice(0, 100)}...`
                          : item.description}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ p: 2, justifyContent: "space-between", alignItems: "center" }}>
                      <PriceTypography variant="subtitle1">
                        {parseFloat(item.price)?.toLocaleString() || "0"}
                      </PriceTypography>
                      <CartIconButton
                        onClick={() => dispatch(addToCartProductAction(item))}
                        disabled={isInCart(item)}
                        inCart={isInCart(item)}
                        aria-label={isInCart(item) ? "Товар в корзине" : "Добавить в корзину"}
                      >
                        <ShoppingBagIcon
                          sx={{ fontSize: "24px" }}
                        />
                      </CartIconButton>
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

      {/* Форма обратной связи */}
      <Box mt={8} p={4} bgcolor="#F8FAFC" borderRadius="15px" textAlign="center">
        <Typography variant="h5" fontWeight="700" color="#333333" mb={2}>
          Нужна консультация специалиста?
        </Typography>
        <Typography variant="body1" color="#666666" mb={3}>
          Оставьте заявку, и наши специалисты свяжутся с вами в ближайшее время.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" maxWidth="600px" mx="auto">
          <StyledTextField placeholder="Ваше имя" />
          <StyledTextField placeholder="Ваш телефон" />
          <StyledButton>Оставить заявку</StyledButton>
        </Stack>
      </Box>

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

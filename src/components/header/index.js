"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  MenuItem,
  Select,
  FormControl,
  Badge,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Container,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Phone, ShoppingCartOutlined, Menu as MenuIcon } from "@mui/icons-material";
import {
  getAllProductsAction,
  setSelectedMainTypeReducer,
  setSelectedTypeReducer,
} from "@/store/slices/productSlice";
import { logoutAction } from "@/store/slices/authSlice";
import logo from "/public/image/cable/cable_logo.png";

// Стилизованные компоненты
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#ADD8E6", // Светло-голубой
  boxShadow: "0 3px 15px rgba(0,0,0,0.1)",
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  color: "#333333", // Темно-серый
  "& .MuiSelect-icon": {
    color: "#333333",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#ADD8E6",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#ADD8E6",
  },
}));

const CartButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  padding: "6px 16px",
  textTransform: "none",
  backgroundColor: "#FFFFE0", // Бледно-желтый
  color: "#333333",
  "&:hover": {
    backgroundColor: "#FFFACD", // Светлее бледно-желтого
  },
}));

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const { clickCount, allProducts, selectedMainType, selectedType } = useSelector(
    (state) => state.usercart
  );

  const uniqueMainTypes = [...new Set(allProducts.map((item) => item.mainType))];
  const uniqueTypes = selectedMainType
    ? [...new Set(allProducts.filter((item) => item.mainType === selectedMainType).map((item) => item.type))]
    : [];

  useEffect(() => {
    dispatch(getAllProductsAction());
  }, [dispatch]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleNavItemClick = (mainType) => {
    dispatch(setSelectedMainTypeReducer(mainType));
    dispatch(setSelectedTypeReducer(""));
  };

  const handleTypeChange = (event) => {
    dispatch(setSelectedTypeReducer(event.target.value));
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    router.push("/login");
  };

  // Мобильное меню
  const drawer = (
    <Box sx={{ width: 250, p: 2, backgroundColor: "#F5F5F5" }}>
      <List>
        <ListItem button onClick={() => router.push("/")}>
          <ListItemText primary="Главная" />
        </ListItem>
        {uniqueMainTypes.map((type) => (
          <ListItem button key={type} onClick={() => handleNavItemClick(type)}>
            <ListItemText primary={type} />
          </ListItem>
        ))}
        <ListItem button onClick={handleLogout}>
          <ListItemText primary="Выход" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      {/* Верхняя панель с контактами */}
      <Box sx={{ bgcolor: "#F5F5F5", py: 1 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body2" color="#333333">
              Мы работаем по всему Казахстану!
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Phone fontSize="small" color="primary" />
              <Typography
                variant="body2"
                component="a"
                href="tel:+77779618253"
                sx={{ textDecoration: "none", color: "#333333" }}
              >
                +7 (777) 961 82 53
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Основной хедер */}
      <StyledAppBar position="static">
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            {/* Левая часть - логотип */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button onClick={() => router.push("/")} sx={{ p: 0 }}>
                <Image src={logo} alt="logo" width={38} height={38} />
              </Button>
              <Box>
                <Typography variant="h6" sx={{ color: "#333333", fontWeight: "bold" }}>
                  SCVolokno.kz
                </Typography>
                <Typography variant="caption" sx={{ color: "#666666" }}>
                  Самые лучшие кабеля
                </Typography>
              </Box>
            </Box>

            {/* Центральная часть - навигация (десктоп) */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
              <FormControl>
                <StyledSelect
                  value={selectedMainType || "Все товары"}
                  onChange={(e) => handleNavItemClick(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="Все товары">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <MenuIcon sx={{ color: "#333333" }} />
                      Все
                    </Box>
                  </MenuItem>
                  {uniqueMainTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </FormControl>

              {selectedMainType && (
                <FormControl>
                  <StyledSelect
                    value={selectedType || ""}
                    onChange={handleTypeChange}
                    displayEmpty
                  >
                    <MenuItem value="">Все подкатегории</MenuItem>
                    {uniqueTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </StyledSelect>
                </FormControl>
              )}
            </Box>

            {/* Правая часть */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CartButton
                variant="contained"
                startIcon={<ShoppingCartOutlined sx={{ color: "#333333" }} />}
                onClick={() => router.push("/cart")}
              >
                Корзина
                {clickCount > 0 && (
                  <Badge badgeContent={clickCount} color="error" sx={{ ml: 1 }} />
                )}
              </CartButton>

              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{ display: { xs: "none", md: "flex" }, color: "#333333" }}
              >
                Выход
              </Button>

              {/* Кнопка мобильного меню */}
              <IconButton
                color="inherit"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ display: { md: "none" }, color: "#333333" }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </StyledAppBar>

      {/* Мобильное меню */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { md: "none" } }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
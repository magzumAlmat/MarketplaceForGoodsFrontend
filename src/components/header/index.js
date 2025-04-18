
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
import logo from "/public/image/cable/logo.svg";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

// Стилизованные компоненты
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#ADD8E6",
  boxShadow: "0 3px 15px rgba(0,0,0,0.1)",
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  color: "#333333",
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
  backgroundColor: "#ADD8E6",
  color: "#333333",
  "&:hover": {
    backgroundColor: "#FFFACD",
  },
  width: '0.5rem',
}));

const CategoryButton = styled(Button)(({ theme }) => ({
  color: "#333333",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
}));

export default function Header() {
  console.log('Header rendering');
  const dispatch = useDispatch();
  const { host, userCart } = useSelector((state) => state.usercart);
  const cartItemCount = userCart.length;

  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const { clickCount, allProducts, selectedMainType, selectedType } = useSelector(
    (state) => state.usercart
  );

  // Извлекаем все уникальные категории из allProducts
  const uniqueCategories = [
    ...new Set(
      allProducts
        .flatMap((item) => item.Categories)
        .map((category) => category.name)
    ),
  ];

  const uniqueTypes = selectedMainType
    ? [
        ...new Set(
          allProducts
            .filter((item) =>
              item.Categories.some((cat) => cat.name === selectedMainType)
            )
            .map((item) => item.type)
        ),
      ]
    : [];

  useEffect(() => {
    // Загружаем все товары только при монтировании, без фильтров
    dispatch(getAllProductsAction());
  }, [dispatch]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleNavItemClick = (mainType) => {
    dispatch(setSelectedMainTypeReducer(mainType === "Все товары" ? "" : mainType));
    dispatch(setSelectedTypeReducer(""));
    router.push("/katalog-tovarov");
  };

  const handleTypeChange = (event) => {
    const type = event.target.value;
    dispatch(setSelectedTypeReducer(type === "Все типы" ? "" : type));
    router.push("/katalog-tovarov");
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    router.push("/login");
  };

  const handleCategorySelect = (category) => {
    dispatch(setSelectedMainTypeReducer(category));
    dispatch(setSelectedTypeReducer(""));
    router.push("/katalog-tovarov");
  };

  console.log("Все данные =", allProducts, "Уникальные категории", uniqueCategories);
  console.log("Selected Main Type:", selectedMainType, "Selected Type:", selectedType);

  // Мобильное меню
  const drawer = (
    <Box sx={{ width: 250, p: 2, backgroundColor: "#F5F5F5" }}>
      <List>
        <ListItem button key="home" onClick={() => router.push("/")}>
          <ListItemText primary="Главная" />
        </ListItem>
        <ListItem button key="categories">
          <ListItemText primary="Категории" />
        </ListItem>
        {uniqueCategories.map((category) => (
          <ListItem
            button
            key={category}
            onClick={() => handleCategorySelect(category)}
            sx={{ pl: 4 }}
          >
            <ListItemText primary={category} />
          </ListItem>
        ))}
        <ListItem button key="about" onClick={() => router.push("/about")}>
          <ListItemText primary="О бренде" />
        </ListItem>
        <ListItem button key="tips" onClick={() => router.push("/tips")}>
          <ListItemText primary="Советы для малышей и мам" />
        </ListItem>
        <ListItem button key="promo" onClick={() => router.push("/promo")}>
          <ListItemText primary="Промо месяца" />
        </ListItem>
        <ListItem button key="contactpage" onClick={() => router.push("/contactpage")}>
          <ListItemText primary="Контакты" />
        </ListItem>
        <ListItem button key="logout" onClick={handleLogout}>
          <ListItemText primary="Выход" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <Box sx={{ bgcolor: "#F5F5F5", py: 1 }}>
        <Container maxWidth="lg"></Container>
      </Box>

      <StyledAppBar position="static">
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button onClick={() => router.push("/")} sx={{ p: 0 }}>
                <Image src={logo} alt="logo" width={170} height={90} />
              </Button>
              
            </Box>

          
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
            
              <CategoryButton onClick={() => router.push("/katalog-tovarov")}>
              Каталог товаров
              </CategoryButton>
           {/*    <FormControl>
                <StyledSelect
                  value={selectedMainType || "Все товары"}
                  onChange={(e) => handleNavItemClick(e.target.value)}
                  displayEmpty
                >
                  <MenuItem key="all-products" value="Все товары">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <MenuIcon sx={{ color: "#333333" }} />
                      Каталог товаров
                    </Box>
                  </MenuItem>
                  {uniqueCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </FormControl>

              {selectedMainType && uniqueTypes.length > 0 && (
                <FormControl>
                  <StyledSelect
                    value={selectedType || "Все типы"}
                    onChange={handleTypeChange}
                    displayEmpty
                  >
                    <MenuItem value="Все типы">Все типы</MenuItem>
                    {uniqueTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </StyledSelect>
                </FormControl>
              )} */}

              <CategoryButton onClick={() => router.push("/about")}>
                О бренде
              </CategoryButton>
              <CategoryButton onClick={() => router.push("/tips")}>
                Советы для малышей и мам
              </CategoryButton>
              <CategoryButton onClick={() => router.push("/promo")}>
                Промо месяца
              </CategoryButton>
              <CategoryButton onClick={() => router.push("/contactpage")}>
                Контакты
              </CategoryButton>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CartButton
                variant="contained"
                startIcon={<ShoppingBagOutlinedIcon sx={{ color: "#333333" }} />}
                onClick={() => router.push("/cart")}
              >
                {cartItemCount > 0 && (
                  <Badge badgeContent={cartItemCount} color="black" sx={{ ml: 1 }} />
                )}
              </CartButton>

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





// "use client";

// import React, { useEffect } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   Box,
//   MenuItem,
//   Select,
//   FormControl,
//   Badge,
//   IconButton,
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
//   Container,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import { Phone, ShoppingCartOutlined, Menu as MenuIcon } from "@mui/icons-material";
// import {
//   getAllProductsAction,
//   setSelectedMainTypeReducer,
//   setSelectedTypeReducer,
// } from "@/store/slices/productSlice";
// import { logoutAction } from "@/store/slices/authSlice";
// import logo from "/public/image/cable/cable_logo.png";

// // Стилизованные компоненты
// const StyledAppBar = styled(AppBar)(({ theme }) => ({
//   backgroundColor: "#ADD8E6", // Светло-голубой
//   boxShadow: "0 3px 15px rgba(0,0,0,0.1)",
// }));

// const StyledSelect = styled(Select)(({ theme }) => ({
//   color: "#333333", // Темно-серый
//   "& .MuiSelect-icon": {
//     color: "#333333",
//   },
//   "& .MuiOutlinedInput-notchedOutline": {
//     borderColor: "#ADD8E6",
//   },
//   "&:hover .MuiOutlinedInput-notchedOutline": {
//     borderColor: "#ADD8E6",
//   },
// }));

// const CartButton = styled(Button)(({ theme }) => ({
//   borderRadius: 20,
//   padding: "6px 16px",
//   textTransform: "none",
//   backgroundColor: "#FFFFE0", // Бледно-желтый
//   color: "#333333",
//   "&:hover": {
//     backgroundColor: "#FFFACD", // Светлее бледно-желтого
//   },
// }));

// export default function Header() {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const [mobileOpen, setMobileOpen] = React.useState(false);

//   const { clickCount, allProducts, selectedMainType, selectedType } = useSelector(
//     (state) => state.usercart
//   );

//   const uniqueMainTypes = [...new Set(allProducts.map((item) => item.mainType))];
//   const uniqueTypes = selectedMainType
//     ? [...new Set(allProducts.filter((item) => item.mainType === selectedMainType).map((item) => item.type))]
//     : [];

//   useEffect(() => {
//     dispatch(getAllProductsAction());
//   }, [dispatch]);

//   const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

//   const handleNavItemClick = (mainType) => {
//     dispatch(setSelectedMainTypeReducer(mainType));
//     dispatch(setSelectedTypeReducer(""));
//   };

//   const handleTypeChange = (event) => {
//     dispatch(setSelectedTypeReducer(event.target.value));
//   };

//   const handleLogout = () => {
//     dispatch(logoutAction());
//     router.push("/login");
//   };

//   // Мобильное меню
//   const drawer = (
//     <Box sx={{ width: 250, p: 2, backgroundColor: "#F5F5F5" }}>
//       <List>
//         <ListItem button key="home" onClick={() => router.push("/")}>
//           <ListItemText primary="Главная" />
//         </ListItem>
//         {uniqueMainTypes.map((type) => (
//           <ListItem button key={type} onClick={() => handleNavItemClick(type)}>
//             <ListItemText primary={type} />
//           </ListItem>
//         ))}
//         <ListItem button key="logout" onClick={handleLogout}>
//           <ListItemText primary="Выход" />
//         </ListItem>
//       </List>
//     </Box>
//   );

//   return (
//     <>
//       {/* Верхняя панель с контактами */}
//       <Box sx={{ bgcolor: "#F5F5F5", py: 1 }}>
//         <Container maxWidth="lg">
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             <Typography variant="body2" color="#333333">
//               Мы работаем по всему Казахстану!
//             </Typography>
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//               <Phone fontSize="small" color="primary" />
//               <Typography
//                 variant="body2"
//                 component="a"
//                 href="tel:+77779618253"
//                 sx={{ textDecoration: "none", color: "#333333" }}
//               >
//                 +7 (777) 961 82 53
//               </Typography>
//             </Box>
//           </Box>
//         </Container>
//       </Box>

//       {/* Основной хедер */}
//       <StyledAppBar position="static">
//         <Container maxWidth="lg">
//           <Toolbar sx={{ justifyContent: "space-between" }}>
//             {/* Левая часть - логотип */}
//             <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//               <Button onClick={() => router.push("/")} sx={{ p: 0 }}>
//                 <Image src={logo} alt="logo" width={38} height={38} />
//               </Button>
//               <Box>
//                 <Typography variant="h6" sx={{ color: "#333333", fontWeight: "bold" }}>
//                   SCVolokno.kz
//                 </Typography>
//                 <Typography variant="caption" sx={{ color: "#666666" }}>
//                   Самые лучшие кабеля
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Центральная часть - навигация (десктоп) */}
//             <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
//               <FormControl>
//                 <StyledSelect
//                   value={selectedMainType || "Все товары"}
//                   onChange={(e) => handleNavItemClick(e.target.value)}
//                   displayEmpty
//                 >
//                   <MenuItem key="all-products" value="Все товары">
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                       <MenuIcon sx={{ color: "#333333" }} />
//                       Все
//                     </Box>
//                   </MenuItem>
//                   {uniqueMainTypes.map((type) => (
//                     <MenuItem key={type} value={type}>
//                       {type}
//                     </MenuItem>
//                   ))}
//                 </StyledSelect>
//               </FormControl>

//               {selectedMainType && (
//                 <FormControl>
//                   <StyledSelect
//                     value={selectedType || ""}
//                     onChange={handleTypeChange}
//                     displayEmpty
//                   >
//                     <MenuItem key="all-subcategories" value="">Все подкатегории</MenuItem>
//                     {uniqueTypes.map((type) => (
//                       <MenuItem key={type} value={type}>
//                         {type}
//                       </MenuItem>
//                     ))}
//                   </StyledSelect>
//                 </FormControl>
//               )}
//             </Box>

//             {/* Правая часть */}
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//               <CartButton
//                 variant="contained"
//                 startIcon={<ShoppingCartOutlined sx={{ color: "#333333" }} />}
//                 onClick={() => router.push("/cart")}
//               >
//                 Корзина
//                 {clickCount > 0 && (
//                   <Badge badgeContent={clickCount} color="error" sx={{ ml: 1 }} />
//                 )}
//               </CartButton>

//               <Button
//                 color="inherit"
//                 onClick={handleLogout}
//                 sx={{ display: { xs: "none", md: "flex" }, color: "#333333" }}
//               >
//                 Выход
//               </Button>

//               {/* Кнопка мобильного меню */}
//               <IconButton
//                 color="inherit"
//                 edge="end"
//                 onClick={handleDrawerToggle}
//                 sx={{ display: { md: "none" }, color: "#333333" }}
//               >
//                 <MenuIcon />
//               </IconButton>
//             </Box>
//           </Toolbar>
//         </Container>
//       </StyledAppBar>

//       {/* Мобильное меню */}
//       <Drawer
//         anchor="right"
//         open={mobileOpen}
//         onClose={handleDrawerToggle}
//         sx={{ display: { md: "none" } }}
//       >
//         {drawer}
//       </Drawer>
//     </>
//   );
// }
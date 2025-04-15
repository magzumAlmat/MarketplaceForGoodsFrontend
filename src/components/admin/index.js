"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { checkAuth, logoutAction } from "@/store/slices/authSlice";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import AddProductForm from "@/components/addProduct";
import AllProducts from "@/components/allProducts";
import AllOrders from "@/components/allOrders";

const drawerWidth = 240;

export default function AdminPanel() {
  const [component, setComponent] = useState("allProducts");
  const { isAuth, currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      if (!isMounted || hasCheckedAuth) return;
      console.log('AdminPanel: dispatching checkAuth');
      setIsLoading(true);
      await dispatch(checkAuth());
      if (isMounted) {
        console.log('AdminPanel: checkAuth completed');
        setIsLoading(false);
        setHasCheckedAuth(true);
      }
    };

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [dispatch, hasCheckedAuth]);

  useEffect(() => {
    if (!isLoading && hasCheckedAuth) {
      console.log('AdminPanel: checking redirect, isAuth:', isAuth);
      if (!isAuth) {
        console.log('AdminPanel: redirecting to /login');
        router.push("/login");
      }
    }
  }, [isAuth, isLoading, hasCheckedAuth, router]);

  const handleComponentSet = (value) => {
    setComponent(value);
  };

  const handleLogout = () => {
    console.log('AdminPanel: logging out');
    dispatch(logoutAction());
    router.push("/login");
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuth) {
    console.log('AdminPanel: rendering null, expecting redirect');
    return null;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Typography variant="h6" sx={{ p: 2 }}>
          Админ-панель
        </Typography>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton
              selected={component === "addProduct"}
              onClick={() => handleComponentSet("addProduct")}
            >
              <ListItemText primary="Добавить продукт" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={component === "allProducts"}
              onClick={() => handleComponentSet("allProducts")}
            >
              <ListItemText primary="Все продукты" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={component === "orders"}
              onClick={() => handleComponentSet("orders")}
            >
              <ListItemText primary="Все заказы" />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={handleLogout}
          >
            Выйти
          </Button>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, bgcolor: "#f5f5f5", minHeight: "100vh" }}
      >
        <Typography variant="h4" gutterBottom>
          {component === "addProduct" && "Добавить продукт"}
          {component === "allProducts" && "Все продукты"}
          {component === "orders" && "Все заказы"}
        </Typography>
        {component === "addProduct" && <AddProductForm />}
        {component === "allProducts" && <AllProducts />}
        {component === "orders" && <AllOrders />}
      </Box>
    </Box>
  );
}
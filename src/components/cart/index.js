
"use client";

import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  incrementAction,
  decrementAction,
  clearCartAction,
} from "@/store/slices/productSlice";
import { useRouter } from "next/navigation";
import cartLogo from "../../../public/image/logo/telezhka_pbuneqj5o42t_256.png";
import Image from "next/image";
import {
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { AddOutlined, RemoveOutlined } from "@mui/icons-material";
import { motion } from "framer-motion";

// Стилизация
const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  fontFamily: "Montserrat, sans-serif",
}));

const StyledTable = styled(Table)(({ theme }) => ({
  borderRadius: "15px",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  backgroundColor: "#FFFFFF",
  "& .MuiTableCell-head": {
    backgroundColor: "#ADD8E6",
    color: "#333333",
    fontWeight: "700",
    fontSize: "16px",
  },
  "& .MuiTableCell-body": {
    color: "#333333",
    fontSize: "14px",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "30px",
  padding: "10px 24px",
  textTransform: "none",
  fontWeight: "600",
  "&:hover": {
    transform: "scale(1.05)",
    transition: "all 0.3s ease",
  },
}));

const ClearButton = styled(StyledButton)(({ theme }) => ({
  backgroundColor: "#FFCDD2",
  color: "#B71C1C",
  "&:hover": {
    backgroundColor: "#EF9A9A",
  },
}));

const OrderButton = styled(StyledButton)(({ theme }) => ({
  backgroundColor: "#ADD8E6",
  color: "#333333",
  "&:hover": {
    backgroundColor: "#87CEEB",
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  minWidth: "40px",
  padding: "4px",
  color: "#333333",
  "&:hover": {
    backgroundColor: "#F5F5F5",
    transform: "scale(1.1)",
  },
}));

const EmptyCartContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "60vh",
  backgroundColor: "#F8FAFC",
  borderRadius: "15px",
  padding: theme.spacing(4),
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
}));

const AnimatedImage = styled(motion(Image))({
  width: "80px !important",
  height: "80px !important",
});

export default function Cart() {
  const data = useSelector((state) => state.usercart.userCart) || [];
  const [updatedData, setUpdatedData] = useState(data);
  const dispatch = useDispatch();
  const router = useRouter();

  // Синхронизация с Redux
  useEffect(() => {
    setUpdatedData(data);
  }, [data]);

  const clickUpCount = (id) => {
    dispatch(incrementAction(id));
  };

  const clickDownCount = (id) => {
    dispatch(decrementAction(id));
  };

  const nextClick = () => {
    router.push("/order");
  };

  const clearCart = () => {
    dispatch(clearCartAction());
  };

  return (
    <StyledContainer>
      {updatedData.length >= 1 ? (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h4"
            fontWeight="700"
            color="#333333"
            sx={{ textTransform: "uppercase", mb: 4 }}
          >
            Корзина
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <ClearButton onClick={clearCart} variant="contained">
              Очистить
            </ClearButton>
          </Box>
          <Paper elevation={0}>
            <StyledTable>
              <TableHead>
                <TableRow>
                  <TableCell>Название</TableCell>
                  <TableCell>Цена</TableCell>
                  <TableCell align="center">Количество</TableCell>
                  <TableCell>Действия</TableCell>
                  <TableCell>Сумма</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {updatedData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      {parseFloat(item.price || 0).toLocaleString("ru-KZ", {
                        style: "currency",
                        currency: "KZT",
                      })}
                    </TableCell>
                    <TableCell align="center">{item.count || 0}</TableCell>
                    <TableCell>
                      <ActionButton onClick={() => clickUpCount(item.id)}>
                        <AddOutlined />
                      </ActionButton>
                      <ActionButton onClick={() => clickDownCount(item.id)}>
                        <RemoveOutlined />
                      </ActionButton>
                    </TableCell>
                    <TableCell>
                      {(item.totalPrice || 0).toLocaleString("ru-KZ", {
                        style: "currency",
                        currency: "KZT",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </StyledTable>
          </Paper>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <OrderButton onClick={nextClick} variant="contained">
              Оформить заказ
            </OrderButton>
          </Box>
        </motion.div>
      ) : (
        <EmptyCartContainer
          component={motion.div}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatedImage
            src={cartLogo}
            alt="cart logo"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <Typography variant="h5" fontWeight="700" color="#333333" mt={2}>
            В корзине нет товаров
          </Typography>
          <Typography variant="body1" color="#666666" mt={1}>
            Добавьте товары из каталога, чтобы начать покупки!
          </Typography>
          <OrderButton
            variant="contained"
            onClick={() => router.push("/")}
            sx={{ mt: 3 }}
          >
            Перейти в каталог
          </OrderButton>
        </EmptyCartContainer>
      )}
    </StyledContainer>
  );
}

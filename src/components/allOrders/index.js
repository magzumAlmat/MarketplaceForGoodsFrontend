"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import END_POINT from "@/components/config";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { authToken } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${END_POINT}/api/store/allorders`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        // Предполагаем, что response.data — массив заказов с вложенными товарами
        setOrders(response.data);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Ошибка загрузки заказов"
        );
      } finally {
        setIsLoading(false);
      }
    };
    if (authToken) {
      fetchOrders();
    }
  }, [authToken]);

  const handleDelete = async (id) => {
    if (!confirm("Вы уверены, что хотите удалить этот заказ?")) return;
    try {
      await axios.delete(`${END_POINT}/api/store/order/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setOrders(orders.filter((o) => o.id !== id));
      toast.success("Заказ удален");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Ошибка удаления заказа"
      );
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Все заказы
      </Typography>
      {orders.length === 0 ? (
        <Typography>Заказы отсутствуют</Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Пользователь</TableCell>
                <TableCell>Товары</TableCell>
                <TableCell>Общая сумма</TableCell>
                <TableCell>Дата</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.username || "-"}</TableCell>
                  <TableCell>
                    {order.orderProducts && order.orderProducts.length > 0 ? (
                      order.orderProducts.map((item, index) => (
                        <Typography key={index}>
                          {item.product?.name || `Товар ID ${item.productId}`} -{" "}
                          {item.count} шт.
                          {index < order.orderProducts.length - 1 && ", "}
                        </Typography>
                      ))
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>{order.totalPrice.toLocaleString()} ₸</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(order.id)}
                    >
                      Удалить
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
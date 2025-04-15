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
        setOrders(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Ошибка загрузки заказов");
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
      toast.error(error.response?.data?.message || "Ошибка удаления заказа");
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
                <TableCell>Продукт</TableCell>
                <TableCell>Количество</TableCell>
                <TableCell>Дата</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.user?.email || "-"}</TableCell>
                  <TableCell>{order.product?.name || "-"}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
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
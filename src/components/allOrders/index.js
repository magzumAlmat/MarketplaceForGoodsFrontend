import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersAction } from "@/store/slices/productSlice";
import OrderDetails from "../orderDetails/index";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";

const ViewOrders = () => {
  const allOrders = useSelector((state) => state.usercart.allOrders || []);
  const dispatch = useDispatch();
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Пример строки даты из вашей базы данных

  useEffect(() => {
    dispatch(getAllOrdersAction());
  }, [dispatch]);
  // Function to handle selecting an order
  const handleSelectOrder = (orderId) => {
    setSelectedOrderId(orderId);
  };

  const handleGoBack = () => {
    setSelectedOrderId(null);
  };

  return (
    <Container>
      <div className="row justify-content-center">
        <div className="col-md-10">
          <Typography variant="h4" className="mb-5 text-center">
            Просмотр заказов
          </Typography>

          {/* Conditionally render OrderDetails component */}
          {selectedOrderId ? (
            <OrderDetails orderId={selectedOrderId} onGoBack={handleGoBack} />
          ) : (
            <>
              {allOrders.length < 1 ? (
                <Typography variant="h4" align="center" className="fs-2">
                  Заказов нет(
                </Typography>
              ) : (
                <TableContainer>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID заказа</TableCell>
                        <TableCell>Имя</TableCell>
                        <TableCell>Телефон</TableCell>
                        <TableCell>Адрес</TableCell>
                        <TableCell>Статус</TableCell>
                        <TableCell>Дата создания</TableCell>
                        <TableCell>Действия</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{order.username}</TableCell>
                          <TableCell>{order.phone}</TableCell>
                          <TableCell>{order.address}</TableCell>
                          <TableCell>{order.status}</TableCell>
                          <TableCell>{order.createdAt}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              onClick={() => handleSelectOrder(order.id)}
                            >
                              Выбрать
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </div>
      </div>
    </Container>
  );
};

export default ViewOrders;

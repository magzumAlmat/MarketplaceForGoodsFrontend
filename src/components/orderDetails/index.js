import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  editOrderAction,
  editOrderReducer,
  getAllOrdersAction,
  getAllProductsAction,
  getOrderAction,
} from "@/store/slices/productSlice";
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
  TextField,
} from "@mui/material";
import { deleteOrderAction } from "@/store/slices/productSlice";
const theme = createTheme();

const OrderDetails = ({ orderId, onGoBack }) => {
  const dispatch = useDispatch();
  const crossOptical = useSelector((state) => state.usercart.allProducts);
  const allOrders = useSelector((state) => state.usercart.allOrders || []);
  const editedOrderFromSlice = useSelector(
    (state) => state.usercart.editedOrder
  );
  const order = allOrders.find((item) => item.id === orderId);
  const [isEdit, setIsEdit] = useState(false);
  const [editedOrder, setEditedOrder] = useState({
    username: order.username,
    phone: order.phone,
    address: order.address,
    status: order.status,
    totalPrice: order.totalPrice,
  });

  // Пример строки даты из вашей базы данных
  const createdAtFromDB = order.createdAt;

  // Создание объекта Date из строки даты
  const date = new Date(createdAtFromDB);

  // Получение компонентов даты
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  // Форматирование в нужный вид
  const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

  console.log(formattedDate);

  console.log("Order State:", order);

  useEffect(() => {
    dispatch(editOrderReducer());
    dispatch(getAllOrdersAction());
    dispatch(getAllProductsAction());
  }, [dispatch, allOrders]);

  console.log("Edited order", editedOrderFromSlice);

  // Function to trigger the callback when the "Go Back" button is clicked
  const handleGoBack = () => {
    onGoBack();
  };

  const handleDeleteOrder = (id) => {
    dispatch(deleteOrderAction(id));
    dispatch(getAllOrdersAction());
    setTimeout(2000)
    onGoBack();
  
}

  const editOrder = () => {
    dispatch(editOrderAction(editedOrder, orderId));
    dispatch(getOrderAction(orderId));
    setIsEdit(false);
    console.log("all orders ", allOrders);
  };

  const setButton = () => {
    setIsEdit(true);
  };

  const handleInputChange = (field, value) => {
    setEditedOrder((prevState) => ({ ...prevState, [field]: value }));
  };

  const renderOrderDetails = () => {
    return (
      <>
        {editedOrderFromSlice ? (
          <Container>
            <Typography variant="h4">Детали заказа</Typography>
            <Typography className="mb-3 mt-3">
              Номер заказа: {editedOrderFromSlice.id}
            </Typography>
            <Typography className="mb-3">
              Имя: {editedOrderFromSlice.username}
            </Typography>
            <Typography className="mb-3">
              Телефон: {editedOrderFromSlice.phone}
            </Typography>
            <Typography className="mb-3">
              Адрес доставки: {editedOrderFromSlice.address}
            </Typography>
            <Typography className="mb-3">
              Статус заказа: {editedOrderFromSlice.status}
            </Typography>
            <Typography className="mb-3">
              Дата создания: {formattedDate}
            </Typography>
            <Typography className="mb-3">
              Общая сумма заказа: {editedOrderFromSlice.totalPrice}
            </Typography>
          </Container>
        ) : (
          <Container>
            <Typography variant="h4">Детали заказа</Typography>
            <Typography className="mb-3 mt-3">
              Номер заказа: {order.id}
            </Typography>
            <Typography className="mb-3">Имя: {order.username}</Typography>
            <Typography className="mb-3">Телефон: {order.phone}</Typography>
            <Typography className="mb-3">
              Адрес доставки: {order.address}
            </Typography>
            <Typography className="mb-3">
              Статус заказа: {order.status}
            </Typography>
            <Typography className="mb-3">
              Дата создания: {formattedDate}
            </Typography>
            <Typography className="mb-3">
              Общая сумма заказа: {order.totalPrice}
            </Typography>
          </Container>
        )}
      </>
    );
  };

  const renderEditableOrderDetails = () => (
    <Container>
      <Typography variant="h4">Детали заказа</Typography>
      <Typography className="mb-3 mt-3">
        Номер заказа: {editedOrder.id}
      </Typography>
      <Typography className="mb-3 ">
        <TextField
          defaultValue={editedOrder.username}
          label="Имя"
          onChange={(e) => handleInputChange("username", e.target.value)}
          className="mb-3"
        />
      </Typography>
      <Typography className="mb-3">
        <TextField
          label="Телефон"
          defaultValue={editedOrder.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          className="mb-3"
        />
      </Typography>
      <Typography className="mb-3">
        <TextField
          label="Адрес доставки"
          defaultValue={editedOrder.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          className="mb-3"
        />
      </Typography>
      <Typography className="mb-3">
        <TextField
          label="Статус заказа"
          defaultValue={editedOrder.status}
          onChange={(e) => handleInputChange("status", e.target.value)}
          className="mb-3"
        />
      </Typography>
      <Typography className="mb-3">
        <TextField
          label="Общая сумма"
          defaultValue={editedOrder.totalPrice}
          onChange={(e) => handleInputChange("totalPrice", e.target.value)}
          className="mb-3"
        />
      </Typography>
    </Container>
  );

  return (
    <>
      <Container className="mt-5">
        {isEdit ? renderEditableOrderDetails() : renderOrderDetails()}
        <Container>
          <TableContainer>
            <Typography variant="h4">Товары:</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Номер</TableCell>
                  <TableCell>Название продукта</TableCell>
                  <TableCell>Количество</TableCell>
                  <TableCell>Цена</TableCell>
                  <TableCell>Сумма</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.product_ids.map((product) => {
                  const matchedProduct = crossOptical.find(
                    (item) => item.id === product[0]
                  );
                  return (
                    <TableRow key={product[0]}>
                      <TableCell>{product[0]}</TableCell>
                      <TableCell>
                        {matchedProduct
                          ? matchedProduct.name
                          : "Название не найдено"}
                      </TableCell>
                      <TableCell>{product[1]}</TableCell>
                      <TableCell>
                        {matchedProduct
                          ? matchedProduct.price
                          : "Цена не найдена"}
                      </TableCell>
                      <TableCell>
                        {matchedProduct
                          ? matchedProduct.price * product[1]
                          : "Сумма не найдена"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <Container className="d-flex gap-5">
              <Button
                variant="contained"
                color="warning"
                className="mb-5 mt-3"
                onClick={handleGoBack}
              >
                Назад к заказам
              </Button>
              {isEdit ? (
                <>
                <Button
                  variant="contained"
                  color="success"
                  className="mb-5 mt-3"
                  onClick={editOrder}
                >
                  Сохранить
                </Button>
                   <Button variant="contained" color="warning" className="mb-5 mt-3" onClick={() => {handleDeleteOrder(orderId)}}>
                   Удалить
               </Button>
                </>
                
              ) : (
                
                <Button
                  variant="contained"
                  color="info"
                  className="mb-5 mt-3"
                  onClick={setButton}
                >
                  Изменить
                </Button>
                
              )}
            </Container>
          </TableContainer>
        </Container>
      </Container>
    </>
  );
};

export default OrderDetails;

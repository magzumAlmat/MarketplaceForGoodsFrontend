
// "use client";

// import { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import END_POINT from "@/components/config";
// import {
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
//   Button,
//   CircularProgress,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";
// import { toast } from "react-toastify";

// export default function AllOrders() {
//   const [orders, setOrders] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const { authToken } = useSelector((state) => state.auth);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await axios.get(`${END_POINT}/api/store/allorders`, {
//           headers: { Authorization: `Bearer ${authToken}` },
//         });
//         setOrders(response.data);
//       } catch (error) {
//         toast.error(
//           error.response?.data?.message || "Ошибка загрузки заказов"
//         );
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     if (authToken) {
//       fetchOrders();
//     }
//   }, [authToken]);

//   const fetchOrderDetails = async (id) => {
//     try {
//       const response = await axios.get(`${END_POINT}/api/store/orderproductbyid/${id}`);
//       setSelectedOrder(response.data);
//       console.log('фетчим данные у')
//       setOpenDialog(true);
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message || "Ошибка загрузки деталей заказа"
//       );
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Вы уверены, что хотите удалить этот заказ?")) return;
//     try {
//       await axios.delete(`${END_POINT}/api/store/order/${id}`, {
//         headers: { Authorization: `Bearer ${authToken}` },
//       });
//       setOrders(orders.filter((o) => o.id !== id));
//       toast.success("Заказ удален");
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message || "Ошибка удаления заказа"
//       );
//     }
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setSelectedOrder(null);
//   };

//   if (isLoading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       <Typography variant="h6" gutterBottom>
//         Все заказы
//       </Typography>
//       {orders.length === 0 ? (
//         <Typography>Заказы отсутствуют</Typography>
//       ) : (
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>ID</TableCell>
//                 <TableCell>Пользователь</TableCell>
//                 <TableCell>Товары</TableCell>
//                 <TableCell>Общая сумма</TableCell>
//                 <TableCell>Дата</TableCell>
//                 <TableCell>Статус</TableCell>
//                 <TableCell>Действия</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
              
//               {orders.map((order) => (
//                 <TableRow key={order.id}>
//                   <TableCell>
//                     <Button
//                       variant="text"
//                       color="primary"
//                       onClick={() => fetchOrderDetails(order.id)}
//                     >
//                       {order.id}
//                     </Button>
//                   </TableCell>
//                   <TableCell>{order.username || "-"}</TableCell>
//                   <TableCell>
//                     {order.orderProducts && order.orderProducts.length > 0 ? (
//                       order.orderProducts.map((item, index) => (
//                         <Typography key={index}>
//                           {item.product?.name || `Товар ID ${item.productId}`} -{" "}
//                           {item.count} шт.
//                           {index < order.orderProducts.length - 1 && ", "}
//                         </Typography>
//                       ))
//                     ) : (
//                       "-"
//                     )}
//                   </TableCell>
//                   <TableCell>{order.totalPrice.toLocaleString()} ₸</TableCell>
//                   <TableCell>
//                     {new Date(order.createdAt).toLocaleDateString()}
//                   </TableCell>
//                   <TableCell>{order.status}</TableCell>
//                   <TableCell>
//                     <Button
//                       variant="contained"
//                       color="error"
//                       onClick={() => handleDelete(order.id)}
//                     >
//                       Удалить
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}

//       {/* Модальное окно для деталей заказа */}
//       {selectedOrder && (
//         <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
//           <DialogTitle>Детали заказа #{selectedOrder.id}</DialogTitle>
//           <DialogContent>
//             <Box sx={{ mb: 2 }}>
//               <Typography variant="body1">
//                 <strong>Статус:</strong> {selectedOrder.status}
//               </Typography>
//               <Typography variant="body1">
//                 <strong>Дата создания:</strong>{" "}
//                 {new Date(selectedOrder.createdAt).toLocaleDateString()}
//               </Typography>
//             </Box>
//             <Typography variant="h6" gutterBottom>
//               Товары
//             </Typography>
//             {selectedOrder.products && selectedOrder.products.length > 0 ? (
//               <TableContainer>
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Название</TableCell>
//                       <TableCell>Цена</TableCell>
//                       <TableCell>Количество</TableCell>
//                       <TableCell>Итого</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {selectedOrder.products.map((product) => (
//                       <TableRow key={product.productId}>
//                         <TableCell>{product.name}</TableCell>
//                         <TableCell>{product.price.toLocaleString()} ₸</TableCell>
//                         <TableCell>{product.count} шт.</TableCell>
//                         <TableCell>
//                           {(product.price * product.count).toLocaleString()} ₸
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             ) : (
//               <Typography>Товары отсутствуют</Typography>
//             )}
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseDialog} color="primary">
//               Закрыть
//             </Button>
//           </DialogActions>
//         </Dialog>
//       )}
//     </Box>
//   );
// }



//-----------------------------------------------------------------

"use client";
import React from "react";
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
  Collapse,
  IconButton,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { toast } from "react-toastify";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const { authToken } = useSelector((state) => state.auth);

  // Возможные статусы заказа
  const statusOptions = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${END_POINT}/api/store/allorders`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
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

  const fetchOrderDetails = async (id) => {
    if (orderDetails[id]) {
      setExpandedOrderId(expandedOrderId === id ? null : id);
      return;
    }
    try {
      // Запрос основных данных заказа
      const orderResponse = await axios.get(`${END_POINT}/api/store/order/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      // Запрос товаров заказа
      const productsResponse = await axios.get(
        `${END_POINT}/api/store/orderproductbyid/${id}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      // Комбинирование данных
      const combinedData = {
        ...orderResponse.data[0], // Берем первый элемент массива
        products: productsResponse.data.products || [],
      };
      setOrderDetails((prev) => ({ ...prev, [id]: combinedData }));
      setExpandedOrderId(id);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Ошибка загрузки деталей заказа"
      );
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Вы уверены, что хотите удалить этот заказ?")) return;
    try {
      await axios.delete(`${END_POINT}/api/store/order/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setOrders(orders.filter((o) => o.id !== id));
      setOrderDetails((prev) => {
        const newDetails = { ...prev };
        delete newDetails[id];
        return newDetails;
      });
      toast.success("Заказ удален");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Ошибка удаления заказа"
      );
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.patch(
        `${END_POINT}/api/store/order/${orderId}/editorder`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setOrderDetails((prev) => ({
        ...prev,
        [orderId]: { ...prev[orderId], status: newStatus },
      }));
      toast.success("Статус заказа обновлён");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Ошибка обновления статуса"
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
                <TableCell />
                <TableCell>ID</TableCell>
                <TableCell>Пользователь</TableCell>
                <TableCell>Общая сумма</TableCell>
                <TableCell>Дата</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <TableRow>
                    <TableCell>
                      <IconButton
                        onClick={() => fetchOrderDetails(order.id)}
                        size="small"
                      >
                        {expandedOrderId === order.id ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.username || "-"}</TableCell>
                    <TableCell>
                      {parseFloat(order.totalPrice).toLocaleString()} ₸
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <FormControl size="small">
                        <Select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                        >
                          {statusOptions.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
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
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                    >
                      <Collapse
                        in={expandedOrderId === order.id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ p: 2 }}>
                          {orderDetails[order.id] ? (
                            <Box>
                              <Typography variant="h6" gutterBottom>
                                Детали заказа #{order.id}
                              </Typography>
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="body1">
                                  <strong>ID:</strong> {orderDetails[order.id].id}
                                </Typography>
                                <Typography variant="body1">
                                  <strong>Пользователь:</strong>{" "}
                                  {orderDetails[order.id].username || "-"}
                                </Typography>
                                <Typography variant="body1">
                                  <strong>Адрес:</strong>{" "}
                                  {orderDetails[order.id].address || "-"}
                                </Typography>
                                <Typography variant="body1">
                                  <strong>Телефон:</strong>{" "}
                                  {orderDetails[order.id].phone || "-"}
                                </Typography>
                                <Typography variant="body1">
                                  <strong>Статус:</strong>{" "}
                                  {orderDetails[order.id].status}
                                </Typography>
                                <Typography variant="body1">
                                  <strong>Дата создания:</strong>{" "}
                                  {new Date(
                                    orderDetails[order.id].createdAt
                                  ).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body1">
                                  <strong>Дата обновления:</strong>{" "}
                                  {new Date(
                                    orderDetails[order.id].updatedAt
                                  ).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body1">
                                  <strong>Общая сумма:</strong>{" "}
                                  {parseFloat(
                                    orderDetails[order.id].totalPrice
                                  ).toLocaleString()} ₸
                                </Typography>
                              </Box>
                              <Typography variant="h6" gutterBottom>
                                Товары
                              </Typography>
                              {orderDetails[order.id].products &&
                              orderDetails[order.id].products.length > 0 ? (
                                <TableContainer>
                                  <Table size="small">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>Название</TableCell>
                                        <TableCell>Цена</TableCell>
                                        <TableCell>Количество</TableCell>
                                        <TableCell>Итого</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {orderDetails[order.id].products.map(
                                        (product) => (
                                          <TableRow key={product.productId}>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>
                                              {parseFloat(
                                                product.price
                                              ).toLocaleString()} ₸
                                            </TableCell>
                                            <TableCell>
                                              {product.count} шт.
                                            </TableCell>
                                            <TableCell>
                                              {(
                                                parseFloat(product.price) *
                                                product.count
                                              ).toLocaleString()} ₸
                                            </TableCell>
                                          </TableRow>
                                        )
                                      )}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              ) : (
                                <Typography>Товары отсутствуют</Typography>
                              )}
                            </Box>
                          ) : (
                            <CircularProgress size={24} />
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

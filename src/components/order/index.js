// // import { useDispatch, useSelector } from "react-redux";
// // import Header from "@/components/header";
// // import "bootstrap/dist/css/bootstrap.min.css";
// // import { useRouter } from "next/navigation";
// // import ContactForm from "@/components/contacts";
// // import {
// //   Box,
// //   Container,
// //   Table,
// //   TableHead,
// //   TableBody,
// //   TableRow,
// //   TableCell,
// // } from "@mui/material";

// // export default function Order() {
// //   const data = useSelector((state) => state.usercart.userCart);
// //   const dispatch = useDispatch();
// //   const router = useRouter();
// //   let total = 0;

// //   data.forEach((item) => {
// //     total += item.count * item.price;
// //   });

// //   return (
// //     <>
// //       <Container
// //         className="order__container_mobile"
// //         sx={{ display: "flex", gap: "5" }}
// //       >
// //         <Box sx={{ overflow: "auto" }}>
// //           <Box
// //             className="dropdown__onmobile"
// //             sx={{ width: "100%", display: "table", tableLayout: "fixed" }}
// //           >
// //             <Table>
// //               <TableHead>
// //                 <TableRow>
// //                   <TableCell className="mobile__fs_10">Название</TableCell>
// //                   <TableCell className="mobile__fs_10">Тип</TableCell>
// //                   <TableCell className="mobile__fs_10">Цена</TableCell>
// //                   <TableCell className="mobile__fs_10">Количество</TableCell>
// //                   <TableCell className="mobile__fs_10">Сумма</TableCell>
// //                 </TableRow>
// //               </TableHead>
// //               <TableBody>
// //                 {data.map((item, index) => (
// //                   <TableRow key={item.id}>
// //                     <TableCell className="mobile__fs_10">{item.name}</TableCell>
// //                     <TableCell className="mobile__fs_10">{item.type}</TableCell>
// //                     <TableCell className="mobile__fs_10">
// //                       {item.price.toLocaleString()}₸
// //                     </TableCell>
// //                     <TableCell align="center">{item.count}</TableCell>
// //                     <TableCell className="mobile__fs_10">
// //                       {(item.price * item.count).toLocaleString()}₸
// //                     </TableCell>
// //                   </TableRow>
// //                 ))}
// //               </TableBody>
// //               <div className="mt-5">Итог: {total.toLocaleString()}₸</div>
// //             </Table>
// //           </Box>
// //         </Box>
// //         <br></br>

// //         <ContactForm
// //           className="contact-form__mobile contact__form"
// //           total={total}
// //         />
// //       </Container>
// //     </>
// //   );
// // }


// "use client";

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter, useSearchParams } from "next/navigation";
// import ContactForm from "@/components/contacts";
// import {
//   Box,
//   Container,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
// } from "@mui/material";
// import "bootstrap/dist/css/bootstrap.min.css";

// export default function Order() {
//   const data = useSelector((state) => state.usercart.userCart);
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   let total = 0;
//   data.forEach((item) => {
//     total += item.count * item.price;
//   });

//   // Логирование данных корзины
//   useEffect(() => {
//     console.log("Данные корзины:", data);
//     data.forEach((item, index) => {
//       console.log(`Товар ${index + 1}:`, {
//         id: item.id,
//         name: item.name,
//         type: item.type,
//         price: item.price,
//         count: item.count,
//         total: item.price * item.count,
//       });
//     });
//   }, [data]);

//   // Проверка query-параметров (на случай редиректа)
//   useEffect(() => {
//     if (searchParams.get("status") === "success") {
//       alert("Всё готово! Ваш заказ успешно оплачен.");
//       // Опционально: очистка корзины или редирект
//       // dispatch(clearCart());
//       // router.push("/order/confirmation");
//     } else if (searchParams.get("status") === "fail") {
//       alert("Оплата не удалась. Пожалуйста, попробуйте снова.");
//     }
//   }, [searchParams, dispatch, router]);

//   return (
//     <Container
//       className="order__container_mobile"
//       sx={{ display: "flex", gap: "5", flexDirection: "column" }}
//     >
//       <Box sx={{ overflow: "auto" }}>
//         <Box
//           className="dropdown__onmobile"
//           sx={{ width: "100%", display: "table", tableLayout: "fixed" }}
//         >
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell className="mobile__fs_10">Название</TableCell>
//                 <TableCell className="mobile__fs_10">Тип</TableCell>
//                 <TableCell className="mobile__fs_10">Цена</TableCell>
//                 <TableCell className="mobile__fs_10">Количество</TableCell>
//                 <TableCell className="mobile__fs_10">Сумма</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {data.map((item) => (
//                 <TableRow key={item.id}>
//                   <TableCell className="mobile__fs_10">{item.name}</TableCell>
//                   <TableCell className="mobile__fs_10">{item.type || "Не указан"}</TableCell>
//                   <TableCell className="mobile__fs_10">
//                     {parseFloat(item.price).toLocaleString()} ₸
//                   </TableCell>
//                   <TableCell align="center">{item.count}</TableCell>
//                   <TableCell className="mobile__fs_10">
//                     {(item.price * item.count).toLocaleString()} ₸
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//           <Box sx={{ mt: 5, fontWeight: "bold" }}>
//             Итог: {total.toLocaleString()} ₸
//           </Box>
//         </Box>
//       </Box>
//       <ContactForm className="contact-form__mobile contact__form" total={total} />
//     </Container>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Button,
  Paper,
  Grid,
  Stack,
  TextField,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { ArrowForward } from "@mui/icons-material";

// Tailwind CSS
const TailwindCDN = () => (
  <link
    href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
    rel="stylesheet"
  />
);

// Стилизованные компоненты
const OrderContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(6, 2),
  background: "linear-gradient(180deg, #F9FAFB 0%, #EDE9FE 100%)",
  borderRadius: "24px",
  marginTop: theme.spacing(4),
  fontFamily: "'Mulish', sans-serif",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(4, 1),
  },
}));

const StyledTable = styled(Table)(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  "& th, & td": {
    fontFamily: "'Mulish', sans-serif",
    color: "#1F2937",
  },
  "& th": {
    fontWeight: 700,
    backgroundColor: "#F3E8FF",
    color: "#1F2937",
  },
  "& td": {
    fontWeight: 400,
    borderBottom: "1px solid #E5E7EB",
  },
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const MobileCard = styled(Paper)(({ theme }) => ({
  borderRadius: "16px",
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  background: "linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%)",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  fontFamily: "'Mulish', sans-serif",
  display: "none",
  [theme.breakpoints.down("sm")]: {
    display: "block",
  },
}));

const WidgetBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: "linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%)",
  borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  fontFamily: "'Mulish', sans-serif",
  height: "fit-content",
  [theme.breakpoints.down("md")]: {
    marginTop: theme.spacing(4),
  },
}));

const PayButton = styled(Button)(({ theme }) => ({
  borderRadius: "12px",
  padding: "12px 32px",
  background: "linear-gradient(90deg, #FF8C00 0%, #FFA500 100%)",
  color: "#FFFFFF",
  textTransform: "none",
  fontWeight: 600,
  fontFamily: "'Mulish', sans-serif",
  fontSize: "1.1rem",
  width: "100%",
  "&:hover": {
    background: "linear-gradient(90deg, #FF7B00 0%, #FF9500 100%)",
    transform: "scale(1.02)",
  },
  "&:disabled": {
    background: "#E5E7EB",
    color: "#9CA3AF",
  },
  transition: "all 0.3s ease",
}));

const TotalBox = styled(Box)(({ theme }) => ({
  fontFamily: "'Mulish', sans-serif",
  fontWeight: 700,
  fontSize: "1.25rem",
  color: "#1F2937",
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: "#F3E8FF",
  borderRadius: "12px",
  textAlign: "center",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#fff",
    fontFamily: "'Mulish', sans-serif",
    "& fieldset": {
      borderColor: "#D1D5DB",
    },
    "&:hover fieldset": {
      borderColor: "#A7F3D0",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#FECDD3",
    },
    "&.Mui-error fieldset": {
      borderColor: "#EF4444",
    },
  },
  "& .MuiInputLabel-root": {
    fontFamily: "'Mulish', sans-serif",
    color: "#6B7280",
  },
  "& .MuiFormHelperText-root": {
    fontFamily: "'Mulish', sans-serif",
    color: "#EF4444",
  },
}));

export default function Order() {
  const data = useSelector((state) => state.usercart.userCart);
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderId] = useState(`ORD-${Date.now()}`); // Уникальный ID заказа
  const [sdkLoaded, setSdkLoaded] = useState(false); // Статус загрузки SDK
  const [sdkError, setSdkError] = useState(""); // Ошибка загрузки SDK

  // Состояние для полей формы и ошибок
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    address: "",
  });

  let total = 0;
  data.forEach((item) => {
    total += item.count * item.price;
  });

  // Логирование данных корзины
  useEffect(() => {
    console.log("Данные корзины:", data);
    data.forEach((item, index) => {
      console.log(`Товар ${index + 1}:`, {
        id: item.id,
        name: item.name,
        type: item.type,
        price: item.price,
        count: item.count,
        total: item.price * item.count,
      });
    });
  }, [data]);

  // Обработка статуса оплаты
  useEffect(() => {
    if (searchParams.get("status") === "success") {
      alert("Всё готово! Ваш заказ успешно оплачен.");
      router.push("/order/confirmation");
    } else if (searchParams.get("status") === "fail") {
      alert("Оплата не удалась. Пожалуйста, попробуйте снова.");
    }
  }, [searchParams, router]);

  // Подгрузка скрипта Tiptop SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://widget.tiptoppay.kz/bundles/widget.js"; // Укажи правильный URL SDK
    script.async = true;
    script.onload = () => {
      console.log("Tiptop SDK loaded successfully");
      setSdkLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load Tiptop SDK");
      setSdkError("Не удалось загрузить модуль оплаты. Попробуйте позже.");
      setSdkLoaded(false);
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Валидация формы
  const validateForm = () => {
    const newErrors = { name: "", phone: "", address: "" };
    let isValid = true;

    // Имя
    if (!formData.name.trim()) {
      newErrors.name = "Имя обязательно";
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Имя должно содержать минимум 2 символа";
      isValid = false;
    }

    // Телефон
    const phoneRegex = /^(?:\+7|8)\d{10}$/; // Формат: +7 или 8, затем 10 цифр
    if (!formData.phone.trim()) {
      newErrors.phone = "Телефон обязателен";
      isValid = false;
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = "Введите корректный номер (например, +77001234567)";
      isValid = false;
    }

    // Адрес
    if (!formData.address.trim()) {
      newErrors.address = "Адрес обязателен";
      isValid = false;
    } else if (formData.address.trim().length < 5) {
      newErrors.address = "Адрес должен содержать минимум 5 символов";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Обработчик изменения полей
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Функция оплаты через Tiptop
  const handlePay = () => {
    if (!validateForm()) {
      return;
    }

    if (!sdkLoaded) {
      alert("Модуль оплаты не загружен. Попробуйте позже.");
      return;
    }

    if (typeof window !== "undefined" && window.tiptop) {
      const widget = new window.tiptop.Widget({
        language: "kk",
      });
      widget.pay(
        "auth",
        {
          publicId: "test_api_00000000000000000000002",
          description: "Оплата товаров в Biolane",
          amount: total,
          currency: "KZT",
          accountId: "user@example.com",
          invoiceId: orderId,
          skin: "classic",
          autoClose: 3,
        },
        {
          onSuccess: (options) => {
            router.push("/order?status=success");
          },
          onFail: (reason, options) => {
            router.push("/order?status=fail");
          },
          onComplete: (paymentResult, options) => {
            console.log("Payment completed:", paymentResult);
          },
        }
      );
    } else {
      console.error("Tiptop SDK not available");
      alert("Ошибка: Модуль оплаты недоступен. Попробуйте позже.");
    }
  };

  return (
    <>
      <TailwindCDN />
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Mulish:wght@400;600;700&display=swap');
        body {
          font-family: 'Mulish', sans-serif;
        }
      `}</style>
      <OrderContainer maxWidth="xl">
        <Typography
          variant="h4"
          sx={{
            fontFamily: "'Mulish', sans-serif",
            fontWeight: 700,
            color: "#1F2937",
            mb: 4,
            textAlign: "center",
            textTransform: "uppercase",
          }}
          component={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Корзина
        </Typography>

        <Grid container spacing={4}>
          {/* Левая колонка: Таблица товаров */}
          <Grid item xs={12} md={8}>
            <Box sx={{ overflow: "auto", mb: 4 }}>
              <StyledTable>
                <TableHead>
                  <TableRow>
                    <TableCell>Название</TableCell>
                    <TableCell>Тип</TableCell>
                    <TableCell>Цена</TableCell>
                    <TableCell align="center">Количество</TableCell>
                    <TableCell>Сумма</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item) => (
                    <TableRow
                      key={item.id}
                      component={motion.tr}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.type || "Не указан"}</TableCell>
                      <TableCell>{parseFloat(item.price).toLocaleString()} ₸</TableCell>
                      <TableCell align="center">{item.count}</TableCell>
                      <TableCell>{(item.price * item.count).toLocaleString()} ₸</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </StyledTable>

              {/* Карточки для мобильных */}
              {data.map((item) => (
                <MobileCard
                  key={item.id}
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography variant="subtitle1" fontWeight={600} color="#1F2937">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="#6B7280" mt={1}>
                    Тип: {item.type || "Не указан"}
                  </Typography>
                  <Typography variant="body2" color="#6B7280" mt={1}>
                    Цена: {parseFloat(item.price).toLocaleString()} ₸
                  </Typography>
                  <Typography variant="body2" color="#6B7280" mt={1}>
                    Количество: {item.count}
                  </Typography>
                  <Typography variant="body2" color="#1F2937" mt={1} fontWeight={600}>
                    Сумма: {(item.price * item.count).toLocaleString()} ₸
                  </Typography>
                </MobileCard>
              ))}
            </Box>
          </Grid>

          {/* Правая колонка: Виджет оплаты */}
          <Grid item xs={12} md={4}>
            <WidgetBox
              component={motion.div}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="#1F2937"
                mb={2}
              >
                Итоговая сумма
              </Typography>
              <TotalBox>
                {total.toLocaleString()} ₸
              </TotalBox>

              {/* Форма с валидацией */}
              <Stack spacing={2} sx={{ mt: 3, mb: 3 }}>
                <StyledTextField
                  label="Имя"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  fullWidth
                  variant="outlined"
                  component={motion.div}
                  whileFocus={{ scale: 1.02 }}
                  aria-label="Введите ваше имя"
                />
                <StyledTextField
                  label="Телефон"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  fullWidth
                  variant="outlined"
                  component={motion.div}
                  whileFocus={{ scale: 1.02 }}
                  aria-label="Введите ваш номер телефона"
                />
                <StyledTextField
                  label="Адрес"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  error={!!errors.address}
                  helperText={errors.address}
                  fullWidth
                  variant="outlined"
                  component={motion.div}
                  whileFocus={{ scale: 1.02 }}
                  aria-label="Введите ваш адрес доставки"
                />
              </Stack>

              {/* Уведомление об ошибке загрузки SDK */}
              {sdkError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {sdkError}
                </Alert>
              )}

              <PayButton
                id="payButton"
                onClick={handlePay}
                disabled={!sdkLoaded}
                component={motion.button}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Оплатить заказ"
              >
                Оплатить заказ
              </PayButton>
            </WidgetBox>
          </Grid>
        </Grid>
      </OrderContainer>
    </>
  );
}

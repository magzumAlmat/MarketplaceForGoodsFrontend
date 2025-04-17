



"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import ContactForm from "@/components/contacts";
import {
  Box,
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Paper,
  Grid,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";



// Стилизованные компоненты
const OrderContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(6, 2),
  
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

export default function Order() {
  const data = useSelector((state) => state.usercart.userCart);
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderId] = useState(`ORD-${Date.now()}`); // Уникальный ID заказа
  const [sdkLoaded, setSdkLoaded] = useState(false); // Статус загрузки SDK
  const [sdkError, setSdkError] = useState(""); // Ошибка загрузки SDK

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
      router.push("/confirmation");
    } else if (searchParams.get("status") === "fail") {
      alert("Оплата не удалась. Пожалуйста, попробуйте снова.");
    }
  }, [searchParams, router]);

  // Подгрузка скрипта Tiptop SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://widget.tiptoppay.kz/bundles/widget.js";
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

  // Функция оплаты через Tiptop
    // Функция оплаты через Tiptop
  const handlePay = () => {
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
          publicId: "pk_161f53c5cd0549ea828fa83f11200",
          description: "Оплата товаров в Biolane",
          amount: total,
          currency: "KZT",
          accountId: "almat.magzum@gmail.com",
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
         Оформление заказа
        </Typography>

        <Grid container spacing={3}>
            {/* Левая колонка: Таблица товаров */}

            <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ overflow: "auto" }}>
              <StyledTable>
                <TableHead>
                  <TableRow>
                    <TableCell>Название</TableCell>

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
          <Grid size={{ xs: 12, md: 4 }}>
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

              {/* Форма с валидацией через ContactForm */}
              {sdkError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {sdkError}
                </Alert>
              )}
              <ContactForm total={total} onPay={handlePay} sdkLoaded={sdkLoaded} />
            </WidgetBox>
          </Grid>
        </Grid>
      </OrderContainer>
    </>
  );
}
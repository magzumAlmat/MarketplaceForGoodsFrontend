
"use client";

import { useState, useEffect } from "react";
import { Button, TextField, Box, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "25px",
  padding: "10px 20px",
  backgroundColor: "#1976d2",
  color: "#FFFFFF",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#1565c0",
  },
}));

export default function ContactForm({ total, className }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Загрузка скрипта виджета
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://widget.tiptoppay.kz/v1/api.js";
    script.async = true;
    script.onload = () => {
      console.log("Скрипт TipTop Pay загружен");
      setScriptLoaded(true);
    };
    script.onerror = () => {
      console.error("Ошибка загрузки скрипта TipTop Pay");
      setError("Не удалось загрузить платежный модуль");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!scriptLoaded || !window.TTP) {
      setError("Платежный модуль не загружен. Попробуйте снова.");
      setLoading(false);
      return;
    }

    try {
      // Генерация уникального ID заказа
      const orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      // Параметры для виджета
      const paymentParams = {
        publicId: "ВАШ_PUBLIC_ID", // Замените на ваш publicId из личного кабинета
        amount: total.toFixed(2), // Сумма с двумя знаками
        currency: "KZT",
        accountId: formData.email || orderId, // ID клиента
        orderId: orderId,
        description: `Заказ ${orderId} для ${formData.name}`,
        email: formData.email,
        phone: formData.phone,
        name: formData.name,
        language: "ru",
        skin: "modern",
        autoClose: 3, // Закрыть через 3 секунды после успеха
      };

      // Логирование
      console.log("Данные формы:", formData);
      console.log("Параметры оплаты:", paymentParams);

      // Инициализация виджета
      const ttp = window.TTP({
        ...paymentParams,
        onSuccess: (result) => {
          console.log("Оплата успешна:", result);
          alert("Всё готово! Ваш заказ успешно оплачен.");
          setLoading(false);
          // Опционально: перенаправление или очистка формы
          // window.location.href = "/order/confirmation";
        },
        onError: (error) => {
          console.error("Ошибка оплаты:", error);
          setError("Оплата не удалась. Попробуйте снова.");
          setLoading(false);
        },
        onClose: (isClosed) => {
          console.log("Виджет закрыт:", isClosed);
          setLoading(false);
        },
      });

      // Открытие виджета
      ttp.open();
    } catch (err) {
      console.error("Ошибка инициализации оплаты:", err);
      setError("Не удалось инициировать оплату. Попробуйте снова.");
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className={className}
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}
    >
      <TextField
        label="Имя"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        label="Телефон"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        required
        fullWidth
      />
      <Box sx={{ mt: 2 }}>
        <p>Итоговая сумма: {total.toLocaleString()} ₸</p>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <StyledButton type="submit" disabled={loading || !scriptLoaded}>
          {loading ? <CircularProgress size={24} /> : "Оплатить"}
        </StyledButton>
      </Box>
    </Box>
  );
}

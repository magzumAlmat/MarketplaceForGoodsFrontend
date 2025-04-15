"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import END_POINT from "@/components/config";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  InputLabel,
  FormControl,
} from "@mui/material";
import { toast } from "react-toastify";

export default function AddProductForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { authToken } = useSelector((state) => state.auth);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error("Максимум 5 изображений");
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", parseFloat(price));
    images.forEach((image) => formData.append("image", image));

    try {
      await axios.post(`${END_POINT}/api/store/createproduct`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Продукт успешно добавлен!");
      setName("");
      setDescription("");
      setPrice("");
      setImages([]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Ошибка добавления продукта");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 600, mx: "auto" }}
    >
      <Typography variant="h6" gutterBottom>
        Новый продукт
      </Typography>
      <TextField
        fullWidth
        label="Название"
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
        multiline
        rows={4}
      />
      <TextField
        fullWidth
        label="Цена"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        margin="normal"
        required
      />
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel shrink>Изображения (до 5)</InputLabel>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          style={{ padding: "10px 0" }}
        />
      </FormControl>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : "Добавить"}
      </Button>
    </Box>
  );
}
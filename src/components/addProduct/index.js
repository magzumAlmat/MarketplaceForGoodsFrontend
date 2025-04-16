
"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import END_POINT from "@/components/config";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Grid,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import { Delete, AddPhotoAlternate } from "@mui/icons-material";
import Image from "next/image";

// Стилизованные компоненты
const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "25px",
  padding: "10px 20px",
  backgroundColor: "#ADD8E6",
  color: "#333333",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#87CEEB",
  },
  "&:disabled": {
    backgroundColor: "#D3D3D3",
    color: "#666666",
  },
}));

const ImagePreview = styled(Paper)(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: "100px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#F5F5F5",
  borderRadius: "10px",
  overflow: "hidden",
}));

export default function AddProductForm() {
  const [name, setName] = useState("");
  const [volume, setVolume] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryIds, setCategoryIds] = useState([]);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const { authToken } = useSelector((state) => state.auth);

  // Загрузка категорий
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${END_POINT}/api/store/getallcategories`);
        setCategories(response.data);
      } catch (error) {
        toast.error("Ошибка загрузки категорий");
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      toast.error("Максимум 5 изображений");
      return;
    }
    setImages([...images, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price) {
      toast.error("Название и цена обязательны");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("volume", volume || null);
    formData.append("description", description || "");
    formData.append("features", features || "");
    formData.append("price", parseFloat(price));
    formData.append("stock", parseInt(stock) || 0);
    formData.append("categoryIds", JSON.stringify(categoryIds));
    images.forEach((image) => formData.append("image", image));

    try {
      const response = await axios.post(`${END_POINT}/api/store/createproduct`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Продукт успешно добавлен!");
      setName("");
      setVolume("");
      setDescription("");
      setFeatures("");
      setPrice("");
      setStock("");
      setCategoryIds([]);
      setImages([]);
      return response.data; // Возвращаем данные для возможной обработки
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
      sx={{
        maxWidth: 800,
        mx: "auto",
        p: 3,
        backgroundColor: "#FFFFFF",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      <Typography variant="h5" sx={{ color: "#333333", mb: 3, fontWeight: "700" }}>
        Новый продукт
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Название"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
            sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Объем"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            margin="normal"
            sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={4}
            sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Характеристики"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            margin="normal"
            multiline
            rows={4}
            sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Цена (₸)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            margin="normal"
            required
            sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Наличие (шт)"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            margin="normal"
            sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Категории</InputLabel>
            <Select
              multiple
              value={categoryIds}
              onChange={(e) => setCategoryIds(e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((id) => {
                    const category = categories.find((cat) => cat.id === id);
                    return category ? (
                      <Chip
                        key={id}
                        label={category.name}
                        sx={{ backgroundColor: "#FFFFE0", color: "#333333" }}
                      />
                    ) : null;
                  })}
                </Box>
              )}
              sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel shrink>Изображения (до 5)</InputLabel>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AddPhotoAlternate />}
              sx={{
                borderColor: "#ADD8E6",
                color: "#333333",
                borderRadius: "25px",
                textTransform: "none",
                mb: 2,
              }}
            >
              Выбрать изображения
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleImageChange}
              />
            </Button>
            {images.length > 0 && (
              <Grid container spacing={2}>
                {images.map((image, index) => (
                  <Grid item xs={6} sm={4} key={index}>
                    <ImagePreview elevation={2}>
                      <Image
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index}`}
                        width={100}
                        height={100}
                        style={{ objectFit: "cover", width: "100%", height: "100%" }}
                      />
                      <IconButton
                        sx={{ position: "absolute", top: 5, right: 5, backgroundColor: "#FFFFFF" }}
                        onClick={() => handleRemoveImage(index)}
                      >
                        <Delete color="error" />
                      </IconButton>
                    </ImagePreview>
                  </Grid>
                ))}
              </Grid>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <StyledButton
            type="submit"
            variant="contained"
            sx={{ mt: 3, width: "100%" }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Добавить продукт"}
          </StyledButton>
        </Grid>
      </Grid>
    </Box>
  );
}

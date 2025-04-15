"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import END_POINT from "@/components/config";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { authToken } = useSelector((state) => state.auth);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${END_POINT}/api/store/allproducts`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setProducts(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Ошибка загрузки продуктов");
      } finally {
        setIsLoading(false);
      }
    };
    if (authToken) {
      fetchProducts();
    }
  }, [authToken]);

  const handleDelete = async (id) => {
    if (!confirm("Вы уверены, что хотите удалить этот продукт?")) return;
    try {
      await axios.delete(`${END_POINT}/api/store/product/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setProducts(products.filter((p) => p.id !== id));
      toast.success("Продукт удален");
    } catch (error) {
      toast.error(error.response?.data?.message || "Ошибка удаления продукта");
    }
  };

  const filteredProducts = products
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Поиск по названию"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Сортировка</InputLabel>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            label="Сортировка"
          >
            <MenuItem value="asc">По цене (возр.)</MenuItem>
            <MenuItem value="desc">По цене (убыв.)</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {currentItems.length === 0 ? (
        <Typography>Продукты не найдены</Typography>
      ) : (
        <Grid container spacing={3}>
          {currentItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card>
                {item.image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={`${END_POINT}/${item.image.split(",")[0].trim()}`}
                    alt={item.name}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography color="text.secondary">
                    {item.description?.slice(0, 100) || "-"}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Цена: {item.price} ₸
                  </Typography>
                  <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(item.id)}
                    >
                      Удалить
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 1 }}>
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Назад
        </Button>
        <Typography>Страница {currentPage} из {totalPages}</Typography>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Вперед
        </Button>
      </Box>
    </Box>
  );
}
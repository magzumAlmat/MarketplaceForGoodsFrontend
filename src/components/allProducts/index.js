
"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";

// Стилизованные компоненты
const ProductCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "25px",
  padding: "8px 20px",
  backgroundColor: "#1976d2",
  color: "#FFFFFF",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#1565c0",
  },
}));

export default function AllProducts() {
  const { allProducts, host } = useSelector((state) => state.usercart);
  const router = useRouter();

  // Логирование данных
  useEffect(() => {
    console.log("Все продукты:", allProducts);
    allProducts.forEach((product, index) => {
      console.log(`Продукт ${index + 1}:`, {
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        type: product.type,
        images: product.ProductImages,
      });
    });
  }, [allProducts]);

  const getPrimaryImage = (images) => {
    if (!images || images.length === 0) {
      console.log("Изображения отсутствуют, используется заглушка");
      return "/placeholder-image.jpg";
    }
    const primaryImage = images.find((img) => img.isPrimary);
    // Используем базовый URL, убирая лишние части вроде /api/store/
    const baseUrl = host.replace(/\/api\/store\/?$/, '');
    const imagePath = primaryImage ? primaryImage.imagePath : images[0].imagePath;
    const imageUrl = `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    console.log("Выбрано изображение:", imageUrl);
    return imageUrl;
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        {allProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <ProductCard>
              <Box sx={{ position: "relative", height: 200, p: 2 }}>
                <Image
                  src={getPrimaryImage(product.ProductImages)}
                  alt={product.name}
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                  priority={false}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="/placeholder-image.jpg"
                />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" color="#333333" fontWeight="600">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="#666666">
                  {product.type || "Тип не указан"}
                </Typography>
                <Typography variant="body2" color="#666666" mt={1}>
                  {product.description?.slice(0, 100) || "Описание отсутствует"}...
                </Typography>
                <Typography variant="subtitle1" fontWeight="700" color="#333333" mt={1}>
                  {parseFloat(product.price).toLocaleString()} ₸
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
                <StyledButton
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  Подробнее
                </StyledButton>
              </Box>
            </ProductCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Modal,
  Fade,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import axios from "axios";

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

const DeleteButton = styled(Button)(({ theme }) => ({
  borderRadius: "25px",
  padding: "8px 20px",
  backgroundColor: "#d32f2f",
  color: "#FFFFFF",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#b71c1c",
  },
}));

const ModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: "#FFFFFF",
  borderRadius: "10px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  padding: theme.spacing(4),
  textAlign: "center",
}));

const ModalButton = styled(Button)(({ theme }) => ({
  borderRadius: "25px",
  padding: "8px 20px",
  margin: theme.spacing(1),
  textTransform: "none",
}));

export default function AllProducts() {
  const { allProducts, host } = useSelector((state) => state.usercart);
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

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
    const baseUrl = host.replace(/\/api\/store\/?$/, "");
    const imagePath = primaryImage ? primaryImage.imagePath : images[0].imagePath;
    const imageUrl = `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
    console.log("Выбрано изображение:", imageUrl);
    return imageUrl;
  };

  const handleOpenModal = (productId) => {
    setSelectedProductId(productId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProductId(null);
  };

  const handleDelete = async () => {
    console.log('Я внутри handle delete id товара= ',selectedProductId)
    try {
      
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/product/${selectedProductId}`);
      alert("Продукт успешно удалён!");
      // Перезагрузка страницы для обновления списка продуктов
      router.refresh();
    } catch (error) {
      console.error("Ошибка при удалении продукта:", error);
      alert("Не удалось удалить продукт. Попробуйте снова.");
    } finally {
      handleCloseModal();
    }
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
              <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
                <StyledButton onClick={() => router.push(`/product/${product.id}`)}>
                  Подробнее
                </StyledButton>
                <DeleteButton onClick={() => handleOpenModal(product.id)}>
                  Удалить
                </DeleteButton>
              </Box>
            </ProductCard>
          </Grid>
        ))}
      </Grid>

      {/* Модальное окно для подтверждения удаления */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Fade in={openModal}>
          <ModalBox>
            <Typography id="modal-title" variant="h6" fontWeight="600" color="#333333" mb={3}>
              Вы точно хотите удалить этот продукт?
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <ModalButton
                onClick={handleDelete}
                sx={{ backgroundColor: "#d32f2f", color: "#FFFFFF", "&:hover": { backgroundColor: "#b71c1c" } }}
              >
                Да
              </ModalButton>
              <ModalButton
                onClick={handleCloseModal}
                sx={{ backgroundColor: "#1976d2", color: "#FFFFFF", "&:hover": { backgroundColor: "#1565c0" } }}
              >
                Нет
              </ModalButton>
            </Box>
          </ModalBox>
        </Fade>
      </Modal>
    </Box>
  );
}

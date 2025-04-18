import { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import { PersonOutline, PhoneOutlined } from "@mui/icons-material";

// Стилизация
const DarkStyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "12px",
  padding: "12px 24px",
  backgroundColor: "#003087",
  color: "#FFFFFF",
  textTransform: "none",
  fontWeight: "600",
  "&:hover": {
    backgroundColor: "#002060",
  },
  fontFamily: "Montserrat, sans-serif",
  width: "100%",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#FFFFFF",
    "& fieldset": {
      borderColor: "#E0E0E0",
    },
    "&:hover fieldset": {
      borderColor: "#ADD8E6",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#ADD8E6",
    },
  },
  "& .MuiInputBase-input": {
    padding: "12px",
    fontFamily: "Montserrat, sans-serif",
  },
}));

// Компонент секции
const ContactSection = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", { name, phone });
    // TODO: Implement actual submission logic (e.g., API call to your backend)
    setName("");
    setPhone("");
  };

  return (
    <Box
      mt={8}
      py={6}
      sx={{
        backgroundColor: "#FFE5D9",
        backgroundImage: `url("/image/contact_bg.png")`, // Замените на реальный путь, например: `/image/contact_bg.png`
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        "&:before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.2) 2px, transparent 2px)",
          backgroundSize: "10px 10px",
          opacity: 0.5,
          zIndex: 1,
        },
      }}
    >
      <Grid container spacing={4} alignItems="center" sx={{ position: "relative", zIndex: 2 }}>
        <Grid item xs={12} md={6}>
          <Typography
            variant="h4"
            fontWeight="700"
            color="#003087"
            mb={2}
            sx={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Нужна консультация специалиста?
          </Typography>
          <Typography
            variant="body1"
            color="#333333"
            mb={3}
            sx={{ fontFamily: "Montserrat, sans-serif", maxWidth: "400px" }}
          >
            Оставьте заявку на сайте и наш специалист свяжется с вами в самое
            ближайшее время
          </Typography>
          <Box sx={{ width: "100px", height: "40px" }}>
            {/* <Image
              src="https://biolane.kz/Uploads/arrow.png" // Замените на реальный путь, например: `/image/arrow.png`
              alt="Декоративная стрелка"
              width={100}
              height={40}
              style={{ objectFit: "contain" }}
              sizes="100px"
              priority={false}
              loading="lazy"
            /> */}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: "15px",
              backgroundColor: "#FFFFFF",
              maxWidth: "400px",
              mx: "auto",
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight="700"
              color="#333333"
              mb={3}
              sx={{
                fontFamily: "Montserrat, sans-serif",
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              Оставить заявку на обратный звонок
            </Typography>
            <form onSubmit={handleSubmit}>
              <StyledTextField
                fullWidth
                placeholder="Ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutline sx={{ color: "#666666" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <StyledTextField
                fullWidth
                placeholder="Ваш телефон"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneOutlined sx={{ color: "#666666" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <DarkStyledButton type="submit">
                Оставить заявку на звонок
              </DarkStyledButton>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactSection;
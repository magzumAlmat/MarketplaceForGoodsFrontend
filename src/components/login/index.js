"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { loginAction } from "@/store/slices/authSlice";
import { Box, TextField, Button, Typography, CircularProgress } from "@mui/material";

export default function Login() {
  const [username, setUsername] = useState(""); // Используем username вместо email
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const router = useRouter();
  const { error, isAuth } = useSelector((state) => state.auth);

  if (isAuth) {
    router.push("/admin");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await dispatch(loginAction({ username, password })).unwrap();
      router.push('/admin');
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        p: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Вход для администратора
      </Typography>
      
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ maxWidth: 400, width: "100%" }}
      >
        <TextField
          fullWidth
          label="Username" // Явно указываем Username
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
          required
        />
        
        <TextField
          fullWidth
          label="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
        />
        
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : "Войти"}
        </Button>
      </Box>
    </Box>
  );
}
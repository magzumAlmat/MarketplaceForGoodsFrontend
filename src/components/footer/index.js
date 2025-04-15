import { Box, Typography ,Container} from "@mui/material";
import Image from "next/image";
import logo from "/public/image/cable/cable_logo.png";
import Link from "next/link";
import { Phone } from "@mui/icons-material";

export default function Footer() {
  return (
    <Box sx={{ backgroundColor: "#F5F5F5", py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Image src={logo} alt="logo" width={38} height={38} />
            <Box>
              <Typography variant="h6" sx={{ color: "#333333", fontWeight: "bold" }}>
                SCVolokno.kz
              </Typography>
              <Typography variant="body2" sx={{ color: "#666666" }}>
                Самые лучшие кабеля
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <Typography variant="body2" sx={{ color: "#333333" }}>
              <Phone sx={{ mr: 1 }} />
              +7 (777) 961 82 53
            </Typography>
            <Typography variant="body2" sx={{ color: "#333333" }}>
              email: scvoloknokz@gmail.com
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
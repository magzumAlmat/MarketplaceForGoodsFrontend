import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  incrementAction,
  decrementAction,
  clearCartAction,
} from "@/store/slices/productSlice";
import { useRouter } from "next/navigation";
import cartLogo from "../../../public/image/logo/telezhka_pbuneqj5o42t_256.png";
import Image from "next/image";
import {
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { AddOutlined, RemoveOutlined } from "@mui/icons-material";

export default function Cart() {
  const data = useSelector((state) => state.usercart.userCart) || [];
  const [updatedData, setUpdatedData] = useState(data);
  const dispatch = useDispatch();
  const router = useRouter();

  // Синхронизация с Redux
  useEffect(() => {
    setUpdatedData(data);
  }, [data]);

  const clickUpCount = (id) => {
    dispatch(incrementAction(id));
  };

  const clickDownCount = (id) => {
    dispatch(decrementAction(id));
  };

  const nextClick = () => {
    router.push("/order");
  };

  const clearCart = () => {
    dispatch(clearCartAction());
  };

  return (
    <>
      {updatedData.length >= 1 ? (
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
          }}
        >
          <Button
            onClick={clearCart}
            sx={{ width: "100px", marginBottom: "10px" }}
            variant="contained"
            color="error"
          >
            Очистить
          </Button>
          <Box sx={{ overflow: "auto" }}>
            <Box
              className="dropdown__onmobile"
              sx={{ width: "100%", display: "table", tableLayout: "fixed" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="mobile__fs_10">Название</TableCell>
                    <TableCell className="mobile__fs_10">Тип</TableCell>
                    <TableCell className="mobile__fs_10">Цена</TableCell>
                    <TableCell className="mobile__fs_10">Количество</TableCell>
                    <TableCell className="mobile__fs_10">Действия</TableCell>
                    <TableCell className="mobile__fs_10">Сумма</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {updatedData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="mobile__fs_10">{item.name}</TableCell>
                      <TableCell className="mobile__fs_10">{item.type || '-'}</TableCell>
                      <TableCell className="mobile__fs_10">
                        {parseFloat(item.price || 0).toLocaleString('ru-KZ', { style: 'currency', currency: 'KZT' })}
                      </TableCell>
                      <TableCell className="mobile__fs_10" align="center">
                        {item.count || 0}
                      </TableCell>
                      <TableCell className="mobile__fs_10">
                        <Button onClick={() => clickUpCount(item.id)}>
                          <AddOutlined />
                        </Button>
                        <Button onClick={() => clickDownCount(item.id)}>
                          <RemoveOutlined />
                        </Button>
                      </TableCell>
                      <TableCell className="mobile__fs_10">
                        {(item.totalPrice || 0).toLocaleString('ru-KZ', { style: 'currency', currency: 'KZT' })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
          <Button
            onClick={nextClick}
            sx={{ width: "100px", marginTop: "10px" }}
            variant="contained"
            color="primary"
          >
            Далее
          </Button>
        </Container>
      ) : (
        <Container
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5",
          }}
        >
          <Image
            style={{ width: "50px", height: "50px" }}
            src={cartLogo}
            alt="cart logo"
          />
          <div>
            <div className="fs-2 mx-3">В корзине нет товаров</div>
          </div>
        </Container>
      )}
    </>
  );
}
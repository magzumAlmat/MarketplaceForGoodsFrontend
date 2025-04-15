import { useDispatch, useSelector } from "react-redux";
import Header from "@/components/header";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import ContactForm from "@/components/contacts";
import {
  Box,
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

export default function Order() {
  const data = useSelector((state) => state.usercart.userCart);
  const dispatch = useDispatch();
  const router = useRouter();
  let total = 0;

  data.forEach((item) => {
    total += item.count * item.price;
  });

  return (
    <>
      <Container
        className="order__container_mobile"
        sx={{ display: "flex", gap: "5" }}
      >
        <Box sx={{ overflow: "auto" }}>
          <Box
            className="dropdown__onmobile"
            sx={{ width: "100%", display: "table", tableLayout: "fixed" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell classname="mobile__fs_10">Название</TableCell>
                  <TableCell classname="mobile__fs_10">Тип</TableCell>
                  <TableCell classname="mobile__fs_10">Цена</TableCell>
                  <TableCell classname="mobile__fs_10">Количество</TableCell>
                  <TableCell classname="mobile__fs_10">Сумма</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell classname="mobile__fs_10">{item.name}</TableCell>
                    <TableCell classname="mobile__fs_10">{item.type}</TableCell>
                    <TableCell classname="mobile__fs_10">
                      {item.price.toLocaleString()}₸
                    </TableCell>
                    <TableCell align="center">{item.count}</TableCell>
                    <TableCell classname="mobile__fs_10">
                      {(item.price * item.count).toLocaleString()}₸
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <div className="mt-5">Итог: {total.toLocaleString()}₸</div>
            </Table>
          </Box>
        </Box>
        <br></br>

        <ContactForm
          className="contact-form__mobile contact__form"
          total={total}
        />
      </Container>
    </>
  );
}

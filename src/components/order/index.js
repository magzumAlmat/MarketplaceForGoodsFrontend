// import { useDispatch, useSelector } from "react-redux";
// import Header from "@/components/header";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { useRouter } from "next/navigation";
// import ContactForm from "@/components/contacts";
// import {
//   Box,
//   Container,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
// } from "@mui/material";

// export default function Order() {
//   const data = useSelector((state) => state.usercart.userCart);
//   const dispatch = useDispatch();
//   const router = useRouter();
//   let total = 0;

//   data.forEach((item) => {
//     total += item.count * item.price;
//   });

//   return (
//     <>
//       <Container
//         className="order__container_mobile"
//         sx={{ display: "flex", gap: "5" }}
//       >
//         <Box sx={{ overflow: "auto" }}>
//           <Box
//             className="dropdown__onmobile"
//             sx={{ width: "100%", display: "table", tableLayout: "fixed" }}
//           >
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell className="mobile__fs_10">Название</TableCell>
//                   <TableCell className="mobile__fs_10">Тип</TableCell>
//                   <TableCell className="mobile__fs_10">Цена</TableCell>
//                   <TableCell className="mobile__fs_10">Количество</TableCell>
//                   <TableCell className="mobile__fs_10">Сумма</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {data.map((item, index) => (
//                   <TableRow key={item.id}>
//                     <TableCell className="mobile__fs_10">{item.name}</TableCell>
//                     <TableCell className="mobile__fs_10">{item.type}</TableCell>
//                     <TableCell className="mobile__fs_10">
//                       {item.price.toLocaleString()}₸
//                     </TableCell>
//                     <TableCell align="center">{item.count}</TableCell>
//                     <TableCell className="mobile__fs_10">
//                       {(item.price * item.count).toLocaleString()}₸
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//               <div className="mt-5">Итог: {total.toLocaleString()}₸</div>
//             </Table>
//           </Box>
//         </Box>
//         <br></br>

//         <ContactForm
//           className="contact-form__mobile contact__form"
//           total={total}
//         />
//       </Container>
//     </>
//   );
// }


"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
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
import "bootstrap/dist/css/bootstrap.min.css";

export default function Order() {
  const data = useSelector((state) => state.usercart.userCart);
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  let total = 0;
  data.forEach((item) => {
    total += item.count * item.price;
  });

  // Логирование данных корзины
  useEffect(() => {
    console.log("Данные корзины:", data);
    data.forEach((item, index) => {
      console.log(`Товар ${index + 1}:`, {
        id: item.id,
        name: item.name,
        type: item.type,
        price: item.price,
        count: item.count,
        total: item.price * item.count,
      });
    });
  }, [data]);

  // Проверка query-параметров (на случай редиректа)
  useEffect(() => {
    if (searchParams.get("status") === "success") {
      alert("Всё готово! Ваш заказ успешно оплачен.");
      // Опционально: очистка корзины или редирект
      // dispatch(clearCart());
      // router.push("/order/confirmation");
    } else if (searchParams.get("status") === "fail") {
      alert("Оплата не удалась. Пожалуйста, попробуйте снова.");
    }
  }, [searchParams, dispatch, router]);

  return (
    <Container
      className="order__container_mobile"
      sx={{ display: "flex", gap: "5", flexDirection: "column" }}
    >
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
                <TableCell className="mobile__fs_10">Сумма</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="mobile__fs_10">{item.name}</TableCell>
                  <TableCell className="mobile__fs_10">{item.type || "Не указан"}</TableCell>
                  <TableCell className="mobile__fs_10">
                    {parseFloat(item.price).toLocaleString()} ₸
                  </TableCell>
                  <TableCell align="center">{item.count}</TableCell>
                  <TableCell className="mobile__fs_10">
                    {(item.price * item.count).toLocaleString()} ₸
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box sx={{ mt: 5, fontWeight: "bold" }}>
            Итог: {total.toLocaleString()} ₸
          </Box>
        </Box>
      </Box>
      <ContactForm className="contact-form__mobile contact__form" total={total} />
    </Container>
  );
}

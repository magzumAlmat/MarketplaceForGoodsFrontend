"use client";
import {
  addClickCountReducer,
  addToCartProductAction,
  getAllOrdersAction,
} from "@/store/slices/productSlice";
import { Button, Typography } from "@mui/material";
import { Carousel } from 'rsuite';
import 'rsuite/dist/rsuite-no-reset.min.css';
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import "bootstrap/dist/css/bootstrap.min.css";

export default function Page({ params }) {
  const crossOptical = useSelector((state) => state.usercart.allProducts);
  const product = crossOptical.find((item) => item.id == params.id);
  const userCart = useSelector((state) => state.usercart.userCart);

  console.log(crossOptical, "crossOptical");
  const dispatch = useDispatch();

  console.log(product, "product");
  console.log(params.id, "id");

  useEffect(() => {
    dispatch(getAllOrdersAction());
  }, [dispatch]);

  const host = useSelector((state) => state.usercart.host);

  const isInCart = (item) => {
    return userCart.some((cartItem) => cartItem.id === item.id);
  };

  const buttonClick = (item) => {
    dispatch(addClickCountReducer());
    dispatch(addToCartProductAction(item));
  };

  return (
<div className="product__details detail_image">
      {product && (
        <>
          <div style={{
            width: '100%'
          }}>
            <Typography variant="body2" className="pizza__item-text">
              {product.type}
            </Typography>
            <Typography variant="h4" className="my-3">
              {product.name}
            </Typography>
          <Carousel className="custom-slider custom-slide__mobile">
                {product.image.split(",").map((imageUrl, imageIndex) => (
                  <img
                    key={imageIndex}
                    src={`${host + imageUrl.trim()}`}
                    alt={`Product image ${imageIndex}`}
                    style={{ objectFit: "contain", width: "100%" }}
                  />
                ))}
              </Carousel>
          </div>
          <div>
            <Typography variant="h6" className="mb-2">
              Описание товара:
            </Typography>
            <Typography
              variant="body2"
              className="pizza__item-text"
              dangerouslySetInnerHTML={{
                __html: product.description.replace(/\n/g, "<br />"),
              }}
            ></Typography>
            <div className="pizza__item-end align-items-center d-flex justify-content-between mt-2">
              <Typography variant="body1" className="pizza__item-price">
                {product.price.toLocaleString()} ₸
              </Typography>

              <Button
                onClick={() => buttonClick(product)}
                disabled={isInCart(product)}
                variant="contained"
                color="primary"
              >
                {isInCart(product) ? "Добавлено" : "В корзину"}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

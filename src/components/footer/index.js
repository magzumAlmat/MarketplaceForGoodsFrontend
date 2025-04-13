import { Button, Typography } from "@mui/material";
import Image from "next/image";
import logo from "/public/image/cable/cable_logo.png";
import Link from "next/link";
import { Phone } from "@mui/icons-material";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer_logo">
        <div className="header__left align-items-center d-flex gap-1">
          <Button className="btn">
            <div className="header__logo">
              <Image width="38" src={logo} alt="logo pizza" />
            </div>
          </Button>
          <Button className="btn">
            <div className="footer_logo_text">
              <div className="header__title-text">SCVolokno.kz</div>
              <div className="footer__text">Cамые лучшие кабеля</div>
            </div>
          </Button>
        </div>
        {/* <div className="footer__links">
          <Link href="#">Доставка и оплата</Link>
          <Link href="#">О компании</Link>
        </div> */}
        <div className="footer__info">
          <a href="tel:+77779618253" className="footer__phone">
            <Phone color="primary" />
            тел: +7 (777) 961 82 53
          </a>
          <p>email: scvoloknokz@gmail.com</p>
        </div>
      </div>
    </footer>
  );
}

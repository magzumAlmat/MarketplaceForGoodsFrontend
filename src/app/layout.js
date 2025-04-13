import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/header';
import Home from '../components/home';
import Products from '../components/allProducts';
import Product from '../components/productDetails';
import Cart from '../components/cart';
import Orders from '../components/allOrders';
import Profile from '../components/orderDetails';
import Login from '../components/login';
import Register from '../components/contacts';
import { AuthProvider } from '../store/provider';
import './globals.css';

function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        {/*  */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0"
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-16464823771"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments)}
              gtag('js', new Date());

              gtag('config', 'AW-16464823771');
            `,
          }}
        />
      </Head>

      <ReduxProvider>
        <body>
          <ThemeProviderWrapper>
            <AuthProvider>
              <Router>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<Product />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </Router>
            </AuthProvider>
            <main>{children}</main>
            <Footer />
            <LoggedDataDisplay />
          </ThemeProviderWrapper>
        </body>
      </ReduxProvider>

      <GoogleAnalytics gaId="AW-16464823771" />
    </html>
  );
}

export default RootLayout;

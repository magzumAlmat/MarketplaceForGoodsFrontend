import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import AddProductForm from "../addProduct";
import AllOrders from "../allOrders";
import AllProducts from "@/components/allProducts";
import { isAuthAction } from "@/store/slices/productSlice";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Admin() {
  const [component, setComponent] = useState("allProducts");
  const isAuth = useSelector((state) => state.usercart.isAuth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        dispatch(isAuthAction({ isAuth: false, token: null }));
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/api/auth/check", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          dispatch(isAuthAction({ isAuth: data.role === "admin", token }));
        } else {
          localStorage.removeItem("token");
          dispatch(isAuthAction({ isAuth: false, token: null }));
          router.push("/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
        dispatch(isAuthAction({ isAuth: false, token: null }));
        router.push("/login");
      }
    };
    checkAuth();
  }, [dispatch, router]);

  const handleComponentSet = (value) => {
    try {
      setComponent(value);
    } catch (e) {
      console.error("Error setting component:", e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(isAuthAction({ isAuth: false, token: null }));
    router.push("/login");
  };

  return (
    <>
      <Header />
      {isAuth ? (
        <div className="container mt-3">
          <div className="row">
            <div className="col-md-2">
              <ul className="list-group">
                <li className={`list-group-item ${component === "addProduct" ? "active" : ""}`}>
                  <button
                    onClick={() => handleComponentSet("addProduct")}
                    className="btn btn-link w-100 text-left"
                  >
                    Добавить продукт
                  </button>
                </li>
                <li className={`list-group-item ${component === "orders" ? "active" : ""}`}>
                  <button
                    onClick={() => handleComponentSet("orders")}
                    className="btn btn-link w-100 text-left"
                  >
                    Просмотр заказов
                  </button>
                </li>
                <li className={`list-group-item ${component === "allProducts" ? "active" : ""}`}>
                  <button
                    onClick={() => handleComponentSet("allProducts")}
                    className="btn btn-link w-100 text-left"
                  >
                    Все продукты
                  </button>
                </li>
                <li className="list-group-item">
                  <button
                    onClick={handleLogout}
                    className="btn btn-danger w-100"
                  >
                    Выйти
                  </button>
                </li>
              </ul>
            </div>
            <div className="col-md-10">
              {component === "addProduct" && <AddProductForm />}
              {component === "orders" && <AllOrders />}
              {component === "allProducts" && <AllProducts useEffectStart={true} />}
            </div>
          </div>
        </div>
      ) : (
        <div className="container mt-5 text-center">
          <h4>Вы не авторизованы</h4>
          <p>Пожалуйста, войдите в систему, чтобы получить доступ к админ-панели.</p>
          <button
            className="btn btn-primary"
            onClick={() => router.push("/login")}
          >
            Войти
          </button>
        </div>
      )}
    </>
  );
}
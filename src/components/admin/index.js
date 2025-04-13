import Header from "@/components/header";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import AddProductForm from "../addProduct";
import AllOrders from "../allOrders";

import { useSelector } from "react-redux";
import AllProducts from "@/components/allProducts";

export default function Admin() {
  const [component, setComponent] = useState("allProducts");
  const isAuth = useSelector((state) => state.usercart.isAuth);
  

  const handleComponentSet = (value) => {
    try {
      setComponent(value);
    } catch (e) {
      console.log("catch flow");
    }
  };

  return (
    <>
      {isAuth ? (
        <div className="container mt-3">
          <div className="row">
            <div className="col-md-2">
              <ul className="list-group">
                <li className="list-group-item">
                  <button
                    onClick={() => {
                      handleComponentSet("addProduct");
                    }}
                    className="btn"
                  >
                    Добавить продукт
                  </button>
                </li>
                <li className="list-group-item">
                  <button
                    onClick={() => {
                      handleComponentSet("orders");
                    }}
                    className="btn"
                  >
                    Просмотр заказов
                  </button>
                </li>
                <li className="list-group-item">
                  {/* Добавляем кнопку для переключения на вкладку "Все продукты" */}
                  <button
                    onClick={() => {
                      handleComponentSet("allProducts");
                    }}
                    className="btn"
                  >
                    Все продукты
                  </button>
                </li>
              </ul>
            </div>
            <div className="col-md-10">
              <>
                {component === "addProduct" && (
                  <AddProductForm component={component} setComponent={setComponent}
                  />
                )}
                {component === "orders" && (
                  <AllOrders />
                )}
                {/* Добавляем условие для отображения компонента "Все продукты" */}
                {component === "allProducts" && (
                  <AllProducts useeffectStart={true}
                    
                  />
                )}
              </>
            </div>
          </div>
        </div>
      ) : (
        <div>
          вы не авторизованы
          {handleUnauthorizedAccess()}
        </div>
      )}
    </>
  );
}

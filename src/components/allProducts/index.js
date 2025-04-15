// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   addToCartProductAction,
//   getAllProductsAction,
//   getAllProductsReducer,
// } from "@/store/slices/productSlice";
// import {
//   Button,
//   Container,
//   Divider,
//   Stack,
//   ThemeProvider,
//   createTheme,
//   Typography,
// } from "@mui/material";
// import Image from "next/image";
// import OrderDetails from "@/components/orderDetails";
// import ProductDetails from "@/components/productDetails";

// const theme = createTheme();

// const AllProducts = () => {
//   const dispatch = useDispatch();
//   const [selectedMainType, setSelectedMainType] = useState("");
//   const crossOptical = useSelector((state) => state.usercart.allProducts);
//   const filteredCrossOptical = crossOptical.filter(
//     (item) => item.mainType === selectedMainType
//   );
//   const sortedCrossOptical = filteredCrossOptical
//     ? [...filteredCrossOptical].sort((a, b) => a.id - b.id)
//     : [];
//   const uniqueMainTypes = [
//     ...new Set(crossOptical.map((item) => item.mainType)),
//   ];
//   const [selectedProductId, setSelectedProductId] = useState(null);
//   const host = "http://localhost:8000/";

//   useEffect(() => {
//     dispatch(getAllProductsAction());
//     console.log(crossOptical);
//     setSelectedMainType(uniqueMainTypes[0]);
//   }, [crossOptical]);

//   const handleNavItemClick = (mainType) => {
//     setSelectedMainType(mainType);
//   };

//   const handleSelectProduct = (productId) => {
//     setSelectedProductId(productId);
//   };

//   const handleGoBack = () => {
//     setSelectedProductId(null);
//   };

//   return (
//     <>
//       {selectedProductId ? (
//         <ProductDetails productId={selectedProductId} onGoBack={handleGoBack} />
//       ) : (
//         <Container>
//           <Stack direction="row" spacing={2}>
//             {crossOptical
//               .filter(
//                 (item, index, array) =>
//                   array.findIndex((el) => el.mainType === item.mainType) ===
//                   index
//               )
//               .map((uniqueItem) => (
//                 <Button
//                   key={uniqueItem.id}
//                   onClick={() => handleNavItemClick(uniqueItem.mainType)}
//                 >
//                   {uniqueItem.mainType}
//                 </Button>
//               ))}
//           </Stack>
//           <Divider />
//           <div className="pizza">
//             <Typography variant="h4" className="pizza__title">
//               {selectedMainType}
//             </Typography>
//             <div className="pizza__body row">
//               {sortedCrossOptical.map((item, index) => (
//                 <div
//                   key={index}
//                   className="pizza__item d-flex flex-column gap-5 col-lg-3"
//                 >
//                   <div className="pizza__item-start">
//                     <Button className="pizza__img-button">
//                       {item.image.split(",").map((imageUrl, imageIndex) => {
//                         const trimmedUrl = `${host}${imageUrl.trim()}`;
//                         console.log(trimmedUrl);

//                         return (
//                           <div key={imageIndex}>
//                             <Image
//                               src={trimmedUrl}
//                               width={200}
//                               height={200}
//                               alt="Product image"
//                             />
//                           </div>
//                         );
//                       })}
//                     </Button>
//                     <Typography variant="h6" className="pizza__item-title">
//                       {item.name}
//                     </Typography>
//                     <Typography variant="body2" className="pizza__item-text">
//                       Тип: {item.type}
//                     </Typography>
//                   </div>
//                   <div className="pizza__item-end align-items-center d-flex justify-content-between">
//                     <Typography variant="body1" className="pizza__item-price">
//                       Цена: {item.price}
//                     </Typography>
//                     <Button
//                       onClick={() => handleSelectProduct(item.id)}
//                       className="pizza__item-button"
//                     >
//                       Изменить
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </Container>
//       )}
//     </>
//   );
// };

// export default AllProducts;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProductsAction,
  getAllProductsReducer,
} from "@/store/slices/productSlice";
import { Search, Sort, SwapVertOutlined } from "@mui/icons-material";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import {
  Button,
  Container,
  Divider,
  Stack,
  Typography,
  TextField,
  MenuItem,
} from "@mui/material";
import Image from "next/image";
import ProductDetails from "@/components/productDetails";
import { Carousel } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";

const AllProducts = (useeffectStart) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const crossOptical = useSelector((state) => state.usercart.allProducts);
  const [sortState, setSortState] = useState("");

  const [selectedProductId, setSelectedProductId] = useState(null);
  const host = useSelector((state) => state.usercart.host);
  const selectedMainType = useSelector(
    (state) => state.usercart.selectedMainType
  );

  const selectedType = useSelector((state) => state.usercart.selectedType);
  const filteredMainType = crossOptical.filter((item) => {
    if (selectedMainType && selectedMainType !== "Все товары") {
      return item.mainType === selectedMainType;
    } else {
      return true;
    }
  });
  const filteredByType = selectedType
    ? filteredMainType.filter((item) => item.type === selectedType)
    : filteredMainType;

  const sortedProducts = filteredByType
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortState === "1") {
        return a.price - b.price;
      } else if (sortState === "2") {
        return b.price - a.price;
      }
      return 0;
    });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  // Calculate the indexes for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const buttonClick = (item) => {
    dispatch(addClickCountReducer());
    dispatch(addToCartProductAction(item));
  };

  const setActiveState = (number) => {
    if (sortState == "1") {
      setSortState("2");
    } else {
      setSortState(number);
    }
    console.log(sortState);
  };

  useEffect(() => {
    dispatch(getAllProductsAction());
  }, [crossOptical]);

  const handleSelectProduct = (productId) => {
    setSelectedProductId(productId);
  };

  const handleGoBack = () => {
    setSelectedProductId(null);
    dispatch(getAllProductsAction());
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortDirection(event.target.value);
  };

  const sortedCrossOptical = crossOptical
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((item) =>
      selectedMainType ? item.mainType === selectedMainType : true
    )
    .filter((item) => (selectedType ? item.type === selectedType : true))
    .sort((a, b) => {
      return sortDirection === "asc" ? a.price - b.price : b.price - a.price;
    });

  console.log("CURR", currentItems);

  return (
    <>
      {selectedProductId ? (
        <ProductDetails productId={selectedProductId} onGoBack={handleGoBack} />
      ) : (
        <Container>
          
          <Divider className="mb-2" />
          

          <Divider />
          <div className="products__main">
            <Typography variant="h4" className="pizza__title">
              {selectedMainType || "Все товары"}
            </Typography>

            <div className="search-and-sort">
              <TextField
                label="Поиск по наименованию"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchTermChange}
              />
              <div className="mb-3">
                <Button
                  onClick={() => setActiveState("1")}
                  endIcon={<SwapVertOutlined />}
                >
                  Сортировать по цене
                </Button>
              </div>
            </div>
          </div>

          <Divider />

          <div className="pizza">
            <div className="pizza__body row">
              {currentItems.map(
                (item, index) => (
                  console.log("item from allProducts111", item),
                  (
                    <div
                      key={index}
                      className="pizza__item d-flex flex-column gap-5 col-lg-3"
                    >
                      <div className="pizza__item-start">
                        <Button className="pizza__img-button">
                          <Carousel className="custom-slider">
                            {item.image
                              .split(",")
                              .map((imageUrl, imageIndex) => (
                                <img
                                  key={imageIndex}
                                  src={`${host + imageUrl.trim()}`}
                                  alt={`Product image ${imageIndex}`}
                                  style={{
                                    objectFit: "contain",
                                    width: "100%",
                                  }}
                                />
                              ))}
                          </Carousel>
                        </Button>
                        <Typography variant="h6" className="pizza__item-title">
                          Наименование: {item.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          className="pizza__item-text"
                        >
                          Тип: {item.type}
                        </Typography>
                        <Typography
                          variant="body2"
                          className="pizza__item-text"
                        >
                          Описание: {item.description.slice(0, 100)}
                        </Typography>
                      </div>
                      <div className="pizza__item-end align-items-center d-flex justify-content-between">
                        <Typography
                          variant="body1"
                          className="pizza__item-price"
                        >
                          Цена: {item.price}
                        </Typography>
                        <Button
                          onClick={() => handleSelectProduct(item.id)}
                          className="pizza__item-button"
                        >
                          Изменить
                        </Button>
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          </div>
          <div className="pagination" style={{ "padding-left": "30%" }}>
            <Button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              endIcon={<WestIcon />}
            ></Button>
            <span>{`Страница ${currentPage}`}</span>
            <Button
              disabled={indexOfLastItem >= sortedProducts.length}
              onClick={() => handlePageChange(currentPage + 1)}
              endIcon={<EastIcon />}
            ></Button>
          </div>
        </Container>
      )}
    </>
  );
};

export default AllProducts;

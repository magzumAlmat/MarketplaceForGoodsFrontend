import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import { useRef } from 'react';
import {
    deleteProductAction,
    editOrderAction,
    editOrderReducer, editProductAction, editProductReducer,
    getAllOrdersAction,
    getAllProductsAction,
    getOrderAction,
    getProductByIdAction
} from '@/store/slices/productSlice';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextareaAutosize,
    Button, TextField
} from '@mui/material';
import {useDropzone} from "react-dropzone";
import { Carousel } from 'rsuite';
import 'rsuite/dist/rsuite-no-reset.min.css';


const theme = createTheme();

const ProductDetails = ({productId, onGoBack}) => {
    const dispatch = useDispatch();
    const crossOptical = useSelector(state => state.usercart.allProducts);
    const refreshedProducts = useSelector((state) => state.usercart.allProducts);
    const editedProductFromSlice = useSelector(state => state.usercart.editedProduct);
    const product = crossOptical.find(item => item.id == productId);
    const [isEdit, setIsEdit] = useState(false);
    const inputRef = useRef(null);
    const host = useSelector(state => state.usercart.host)
    console.log('product from product details====', editedProductFromSlice)
    const [selectedFiles, setSelectedFiles] = useState([])
    const [editedProduct, setEditedProduct] = useState({
        mainType: product.mainType,
        type: product.type,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
    });

    const handleFileChange1 = (acceptedFiles) => {
        setSelectedFiles(acceptedFiles);
        console.log(selectedFiles)
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*', // specify the file types you want to accept
        multiple: true,
        maxFiles: 10,
        onDrop: handleFileChange1,
    });

    useEffect(() => {
        dispatch(getAllOrdersAction());
        dispatch(getAllProductsAction());

    }, [dispatch, crossOptical]);

    console.log('Edited product', editedProduct)


    // Function to trigger the callback when the "Go Back" button is clicked
    const handleGoBack = () => {
        onGoBack();
    };
    const handleDeleteProduct = (id) => {
        dispatch(deleteProductAction(id));
        dispatch(getAllProductsAction());
        setTimeout(2000)
        onGoBack();
        
        console.log('All product', crossOptical);
    }

    useEffect( () => {

        dispatch(getAllProductsAction());
        dispatch(getProductByIdAction(productId))

    }, [dispatch, refreshedProducts]);

    const editProduct = () => {
        
        // dispatch(editProductAction(
        //     editedProduct.mainType,
        //     editedProduct.type,
        //     editedProduct.name,
        //     editedProduct.price,
        //     editedProduct.description,
        //     productId,
            
        //     selectedFiles));

        // setIsEdit(false);

        if (selectedFiles.length > 0) {
            dispatch(
              editProductAction(
                editedProduct.mainType,
                editedProduct.type,
                editedProduct.name,
                editedProduct.price,
                editedProduct.description,
                productId,
                selectedFiles
              )
            );
            
          } else {
            dispatch(
              editProductAction(
                editedProduct.mainType,
                editedProduct.type,
                editedProduct.name,
                editedProduct.price,
                editedProduct.description,
                product.image,
                productId
              )
            );
            
          }
      
          setIsEdit(false);
          
        };
    


        console.log('all products from edit', crossOptical);

    const setButton = () => {
        setIsEdit(true);
    };

    const handleInputChange = (field, value) => {
        setEditedProduct(prevState => ({...prevState, [field]: value}));
    };

    // const renderOrderDetails = () => {
    //     return (
    //         <>
    //             {editedOrderFromSlice ? (
    //                 <Container>
    //                     <Typography variant="h4">Детали заказа</Typography>
    //                     <Typography className='mb-3 mt-3'>Номер заказа: {editedOrderFromSlice.id}</Typography>
    //                     <Typography className='mb-3'>Имя: {editedOrderFromSlice.username}</Typography>
    //                     <Typography className='mb-3'>Телефон: {editedOrderFromSlice.phone}</Typography>
    //                     <Typography className='mb-3'>Адрес доставки: {editedOrderFromSlice.address}</Typography>
    //                     <Typography className='mb-3'>Статус заказа: {editedOrderFromSlice.status}</Typography>
    //                     <Typography className='mb-3'>Дата создания: {formattedDate}</Typography>
    //                     <Typography className='mb-3'>Общая сумма заказа: {editedOrderFromSlice.totalPrice}</Typography>
    //                 </Container>
    //             ) : (
    //                 <Container>
    //                     <Typography variant="h4">Детали заказа</Typography>
    //                     <Typography className='mb-3 mt-3'>Номер заказа: {order.id}</Typography>
    //                     <Typography className='mb-3'>Имя: {order.username}</Typography>
    //                     <Typography className='mb-3'>Телефон: {order.phone}</Typography>
    //                     <Typography className='mb-3'>Адрес доставки: {order.address}</Typography>
    //                     <Typography className='mb-3'>Статус заказа: {order.status}</Typography>
    //                     <Typography className='mb-3'>Дата создания: {formattedDate}</Typography>
    //                     <Typography className='mb-3'>Общая сумма заказа: {order.totalPrice}</Typography>
    //                 </Container>
    //             )}
    //         </>
    //     )
    // };
    //
    // const renderEditableOrderDetails = () => (
    //     <Container>
    //         <Typography variant="h4">Детали заказа</Typography>
    //         <Typography className='mb-3 mt-3'>Номер заказа: {editedOrder.id}</Typography>
    //         <Typography className='mb-3 '>
    //             <TextField
    //                 defaultValue={editedOrder.username}
    //                 label="Имя"
    //                 onChange={(e) => handleInputChange('username', e.target.value)}
    //                 className='mb-3'
    //             />
    //         </Typography>
    //         <Typography className='mb-3'>
    //             <TextField
    //                 label="Телефон"
    //                 defaultValue={editedOrder.phone}
    //                 onChange={(e) => handleInputChange('phone', e.target.value)}
    //                 className='mb-3'
    //             />
    //         </Typography>
    //         <Typography className='mb-3'>
    //             <TextField
    //                 label="Адрес доставки"
    //                 defaultValue={editedOrder.address}
    //                 onChange={(e) => handleInputChange('address', e.target.value)}
    //                 className='mb-3'
    //             />
    //         </Typography>
    //         <Typography className='mb-3'>
    //             <TextField
    //                 label="Статус заказа"
    //                 defaultValue={editedOrder.status}
    //                 onChange={(e) => handleInputChange('status', e.target.value)}
    //                 className='mb-3'
    //             />
    //         </Typography>
    //         <Typography className='mb-3'>
    //             <TextField
    //                 label="Общая сумма"
    //                 defaultValue={editedOrder.totalPrice}
    //                 onChange={(e) => handleInputChange('totalPrice', e.target.value)}
    //                 className='mb-3'
    //             />
    //         </Typography>
    //     </Container>
    // );
    if (editedProductFromSlice) {
        console.log(editedProductFromSlice)
        console.log(editedProduct)
    }
    
    return (
        <ThemeProvider theme={theme}>
            <Container className="mt-5">
                {isEdit ? 
                    <Container>
                        <Typography variant="h4">Детали продукта</Typography>
                        
                        <Typography className='mb-3 '>
                            <TextField
                                defaultValue={editedProduct.mainType}
                                label="Основной тип"
                                onChange={(e) => handleInputChange('mainType', e.target.value)}
                                className='mb-3'
                            />
                        </Typography>
                        <Typography className='mb-3'>
                            <TextField
                                label="Тип"
                                defaultValue={editedProduct.type}
                                onChange={(e) => handleInputChange('type', e.target.value)}
                                className='mb-3'
                            />
                        </Typography>
                        <Typography className='mb-3'>
                            <TextField
                                label="Название"
                                defaultValue={editedProduct.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className='mb-3'
                            />
                        </Typography>
                        <Typography className="mb-3">
                        <TextareaAutosize
                            maxRows={4}
                            aria-label="maximum height"
                            placeholder="Описание"
                            value={editedProduct.description}
                            onChange={(e) =>
                            handleInputChange("description", e.target.value)
                            }
                            style={{
                            width: "100%",
                            height: "100px",
                            padding: "10px",
                            fontFamily: "Montserrat",
                            marginTop: "10px",
                            }}
                        />
            </Typography>
                        <Typography className='mb-3'>
                            <TextField
                                label="Цена"
                                defaultValue={editedProduct.price}
                                onChange={(e) => handleInputChange('price', e.target.value)}
                                className='mb-3'
                            />
                        </Typography>
                        
                        <div {...getRootProps()} style={{ cursor: 'pointer', padding: '20px', border: '2px dashed #ddd' }}>
                            <input {...getInputProps()} ref={inputRef} style={{ display: 'none' }} />
                            <p>Перетащите сюда файлы</p>
                        </div>
                        <Button>
        <input
            {...getInputProps()}
            ref={inputRef}
            style={{ cursor: "pointer" }}
          />
        </Button>
                        
                        
                        {selectedFiles.length > 0 && (
                            <>
                                <p>Выбранные файлы:</p>
                                <ul>
                                    {selectedFiles.map((file) => (
                                        <li key={file.name}>{file.name}</li>
                                    ))}
                                </ul>
                            </>
                        )}

                        {selectedFiles.length > 0 &&
                            selectedFiles.map((file) => (
                                <div key={file.name}>
                                    <img src={URL.createObjectURL(file)} alt='' width={400} height={300} />
                                </div>
                            ))}
                    </Container>
                 : (
                    <>
                        {editedProductFromSlice ? (

                            <Container>
                                <Typography variant="h4">Детали продукта</Typography>
                                
                                <Typography className='mb-3'>Основной тип: {editedProductFromSlice.mainType}</Typography>
                                <Typography className='mb-3'>Тип: {editedProductFromSlice.type}</Typography>
                                <Typography className='mb-3'>Название: {editedProductFromSlice.name}</Typography>
                                <Typography className="mb-3"> Описание: {editedProductFromSlice.description}</Typography>
                                <Typography className='mb-3'>Цена: {editedProductFromSlice.price}</Typography>
                                <Button className="pizza__img-button">
                                    <Carousel className="custom-slider">
                                      {editedProductFromSlice.image.split(",").map((imageUrl, imageIndex) => (
                                        <img
                                          key={imageIndex}
                                          src={`${host + imageUrl.trim()}`}
                                          alt={`Product image ${imageIndex}`}
                                          style={{ objectFit: "contain", width: "100%" }}
                                        />
                                      ))}
                                    </Carousel>
                                    </Button>
                            </Container>


                        ) : (
                            <>
                                <Container>
                                    <Typography variant="h4">Детали продукта</Typography>
                                    
                                    <Typography className='mb-3'>Основной тип: {editedProduct.mainType}</Typography>
                                    <Typography className='mb-3'>Тип: {editedProduct.type}</Typography>
                                    <Typography className='mb-3'>Название: {editedProduct.name}</Typography>
                                    <Typography className="mb-3">Описание: {editedProduct.description}</Typography>
                                    <Typography className='mb-3'>Цена: {editedProduct.price}</Typography>
                                    {console.log(editedProduct.image)}
                                    {/* {editedProduct.image.split(",").map((imageUrl, imageIndex) => ( */}
                                    {/* // const trimmedUrl = `${host + imageUrl.trim()}`;
                                    // console.log(trimmedUrl); */}
                                    
                                    <Button className="pizza__img-button">
                                    <Carousel className="custom-slider">
                                      {editedProduct.image.split(",").map((imageUrl, imageIndex) => (
                                        <img
                                          key={imageIndex}
                                          src={`${host + imageUrl.trim()}`}
                                          alt={`Product image ${imageIndex}`}
                                          style={{ objectFit: "contain", width: "100%" }}
                                        />
                                      ))}
                                    </Carousel>
                                    </Button>
                                 
                                       
                                
                                  
                                    {/* ))} */}
                                </Container>
                            </>
                        )}
                    </>

                )}
                <Container className='d-flex gap-5'>
                    <Button variant="contained" color="warning" className="mb-5 mt-3" onClick={handleGoBack}>
                        Назад к продуктам
                    </Button>
                    {isEdit ? (
                        <Button variant="contained" color='success' className="mb-5 mt-3" onClick={editProduct}>
                            Сохранить
                        </Button>
                    ) : (
                        <Button variant="contained" color="info" className="mb-5 mt-3" onClick={setButton}>
                            Изменить
                        </Button>
                    )}
                    <Button variant="contained" color="warning" className="mb-5 mt-3" onClick={() => {handleDeleteProduct(productId)}}>
                        Удалить
                    </Button>
                </Container>
            </Container>
        </ThemeProvider>
    );
};

export default ProductDetails;
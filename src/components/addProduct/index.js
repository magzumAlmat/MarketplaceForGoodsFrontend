import React, { useState } from "react";
import { createProductAction, getAllProductsAction } from "@/store/slices/productSlice";
import { useDispatch } from "react-redux";
import { useDropzone } from "react-dropzone";
import { useRef } from "react";
import AllProduct from "../../components/allProducts/index"
import {
  Container,
  Typography,
  TextField,
  Button,
  TextareaAutosize,
} from "@mui/material";
import Image from "next/image";
import { FileUploadOutlined } from "@mui/icons-material";

const AddProductForm = ({component, setComponent}) => {
  const [mainType, setProductMainType] = useState("");
  const [type, setProductType] = useState("");
  const [name, setProductName] = useState("");
  const [price, setProductPrice] = useState("");
  const [productImages, setProductImages] = useState([]); // массив для хранения выбранных файлов
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();
  const formData = new FormData();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const inputRef = useRef(null);

  const handleFileChange1 = (acceptedFiles) => {
    setSelectedFiles(acceptedFiles);
    console.log(selectedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*", // specify the file types you want to accept
    multiple: true,
    maxFiles: 10,
    onDrop: handleFileChange1,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    formData.append("mainType", mainType);
    formData.append("type", type);
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    selectedFiles.forEach((file) => {
      console.log(file);
      formData.append("image", file);
    });

    dispatch(createProductAction(formData));
    setTimeout(1000)
    dispatch(getAllProductsAction());
    
    setComponent('allProducts')
    

    setProductName("");
    setProductMainType("");
    setProductType("");
    setProductPrice("");
    setProductImages([]);
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    setProductImages([...files]);
  };

  return (
    <Container>
      <Typography variant="h4">Добавление продукта</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Основной тип"
          value={mainType}
          onChange={(e) => setProductMainType(e.target.value)}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Категория"
          value={type}
          onChange={(e) => setProductType(e.target.value)}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Название продукта"
          value={name}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Цена продукта"
          value={price}
          onChange={(e) => setProductPrice(e.target.value)}
          required
        />
        <TextareaAutosize
          minRows={4}
          aria-label="maximum height"
          placeholder="Введите текст и нажмите Enter для новой строки *"
          value={description}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.altKey) {
              e.preventDefault();
              setDescription((prevDescription) => prevDescription + "\n");
              console.log("description", description);
            }
          }}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: "100%",
            height: "100px",
            padding: "10px",
            fontFamily: "Montserrat",
            marginTop: "10px",
          }}
          required
        />
        <div
          {...getRootProps()}
          style={{
            cursor: "pointer",
            padding: "20px",
            border: "2px dashed #ddd",
          }}
        >
          <input
            {...getInputProps()}
            ref={inputRef}
            style={{ display: "none", cursor: "pointer" }}
          />
          <FileUploadOutlined sx={{ marginRight: "10px" }} />
          <span>Перетащите сюда файлы</span>
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
              <Image
                src={URL.createObjectURL(file)}
                alt=""
                width={400}
                height={300}
              />
            </div>
          ))}

        <br />
        {/*<input*/}
        {/*    type="file"*/}
        {/*    onChange={handleFileChange}*/}
        {/*    accept="image/*"*/}
        {/*    multiple // Позволяет выбирать несколько файлов*/}
        {/*    required*/}
        {/*/>*/}
        <Button type="submit" variant="contained" color="primary">
          Добавить продукт
        </Button>
      </form>
    </Container>
  );
};

export default AddProductForm;

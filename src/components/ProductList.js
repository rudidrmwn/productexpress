import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import exportFromJSON from "export-from-json";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
 
const ProductList = () => {
  const [products, setProducts] = useState([]);
 
  useEffect(() => {
    getProducts();
  }, []);

  const [category, setCategory] = useState("");
  
  const options = [
    { value: "", label: "Kategori"},
    { value: "Makanan", label: "Makanan" },
    { value: "Snack", label: "Snack" },
    { value: "Minuman", label: "Minuman" }
  ];

  const searchProductList = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("category", category);
    try {
      const response = await axios.post("http://localhost:5000/searchproducts", formData);
      if(Object.keys(response.data).length){
        setProducts(response.data);
      }else{
        const response = await axios.get("http://localhost:5000/products");
        setProducts(response.data);
      }

    } catch (error) {
      console.log(error);
    }
  };
 
  const getProducts = async () => {
    const response = await axios.get("http://localhost:5000/products");
    var data = response.data;
    setProducts(data);
  };
 
  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/products/${productId}`);
      getProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const exportToXml = () => {
    const data = products;   //dataForXml
    const fileName = "data";
    let fields = products.fields ? products.fields : [];  //fieldsAsObjects or fieldsAsStrings, empty list means "use all"
    const exportType = 'xml';
    exportFromJSON({data, fileName, fields, exportType})
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(products);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Buffer to store the generated Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

    saveAs(blob, "data.xlsx");
};
 
  return (
    <div className="container mt-5">
       <div class="columns">
       <div class="column is-6">
       <form onSubmit={searchProductList}>
          <div className="select control">
          <select name="{category}" onChange={(e) => setCategory(e.target.value)}>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
          </select>  
          </div>
           <button type="submit" className="button is-success">
                Tampilkan
              </button>
          </form>
        </div>
        <div class="column">
          <Link to="/add" className="button is-success">
            Tambah Produk
          </Link>
        </div>
        <div class="column">
          <button className="button is-success" onClick={exportToXml}>Export as Xml</button>
        </div>
        <div class="column">
          <button className="button is-success" onClick={exportToExcel}>Export as Excel</button>
        </div>
      </div>
      <div className="columns is-multiline mt-2">
        {products.map((product) => (
          <div className="column is-one-quarter" key={product.id}>
            <div className="card">
              <div className="card-image">
                <figure className="image is-4by3">
                  <img src={product.url} alt="Image" />
                </figure>
              </div>
              <div className="card-content">
                <div className="media">
                  <div className="media-content">
                    <p className="title is-4">{product.title}</p>
                  </div>
                </div>
              </div>
 
              <footer className="card-footer">
                <Link to={`edit/${product.id}`} className="card-footer-item">
                  Edit
                </Link>
                <a
                  onClick={() => deleteProduct(product.id)}
                  className="card-footer-item"
                >
                  Delete
                </a>
              </footer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
 
export default ProductList;
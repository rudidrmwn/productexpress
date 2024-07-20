import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
 
const EditProduct = () => {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
 
  useEffect(() => {
    getProductById();
  }, []);

  const options = [
    { value: "", label: "Kategori"},
    { value: "Makanan", label: "Makanan" },
    { value: "Snack", label: "Snack" },
    { value: "Minuman", label: "Minuman" }
  ];
  
  const getProductById = async () => {
    const response = await axios.get(`http://localhost:5000/products/${id}`);
    setCategory(response.data.category);
    setTitle(response.data.title);
    setSlug(response.data.slug);
    setPrice(response.data.price);
    setFile(response.data.image);
    setPreview(response.data.url);
  };
 
  const loadImage = (e) => {
    const image = e.target.files[0];
    setFile(image);
    setPreview(URL.createObjectURL(image));
  };
 
  const updateProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("price", price);
    try {
      await axios.patch(`http://localhost:5000/products/${id}`, formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
 
  return (
    <div className="columns is-centered mt-5">
      <div className="column is-half">
        <form onSubmit={updateProduct}>
        <div className="field">
            <label className="label">Kategori Produk</label>
            <div className="select control">
            <select value={category}  onChange={(e) => setCategory(e.target.value)}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
            </select>
            </div>
          </div>
          <div className="field">
            <label className="label">Nama Produk</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nama Produk"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Slug</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Slug"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Harga</label>
            <div className="control">
              <input
                type="number"
                className="input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Harga"
              />
            </div>
          </div>
 
          <div className="field">
            <label className="label">Image</label>
            <div className="control">
              <div className="file">
                <label className="file-label">
                  <input
                    type="file"
                    className="file-input"
                    onChange={loadImage}
                  />
                  <span className="file-cta">
                    <span className="file-label">Choose a file...</span>
                  </span>
                </label>
              </div>
            </div>
          </div>
 
          {preview ? (
            <figure className="image is-128x128">
              <img src={preview} alt="Preview Image" />
            </figure>
          ) : (
            ""
          )}
 
          <div className="field">
            <div className="control">
              <button type="submit" className="button is-success">
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
 
export default EditProduct;
import express from "express";
import {
    searchProducts,
    getProducts,
    getProductById,
    saveProduct,
    updateProduct,
    deleteProduct
} from "../controllers/Product.js";
 
const router = express.Router();
 
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post('/products', saveProduct);
router.patch('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.post('/searchproducts', searchProducts);
 
export default router;
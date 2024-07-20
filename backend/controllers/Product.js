import Product from "../models/ProductModel.js";
import path from "path";
import fs from "fs";
 
export const getProducts = async(req, res)=>{
    try {
        const response = await Product.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const searchProducts = async(req, res)=>{
    try {
        const response = await Product.findAll({
            where:{
                category : req.body.category
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const getProductById = async(req, res)=>{
    try {
        const response = await Product.findOne({
            where:{
                id : req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}
 
export const saveProduct = (req, res)=>{
    if(req.files === null) return res.status(400).json({msg: "No File Uploaded"});
    const title = req.body.title;
    const slug = req.body.slug;
    const price = req.body.price;
    const category = req.body.category;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = ['.png','.jpg','.jpeg'];
 
    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
    if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});
 
    file.mv(`./public/images/${fileName}`, async(err)=>{
        if(err) return res.status(500).json({msg: err.message});
        try {
            await Product.create({title: title, slug:slug, price:price, category:category, image: fileName, url: url});
            res.status(201).json({msg: "Produk berhasil ditambahkan"});
        } catch (error) {
            console.log(error.message);
        }
    })
 
}
 
export const updateProduct = async(req, res)=>{
    const product = await Product.findOne({
        where:{
            id : req.params.id
        }
    });
    if(!product) return res.status(404).json({msg: "No Data Found"});
     
    let fileName = "";
    if(req.files === null){
        fileName = product.image;
    }else{
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png','.jpg','.jpeg'];
 
        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});
 
        file.mv(`./public/images/${fileName}`, (err)=>{
            if(err) return res.status(500).json({msg: err.message});
        });
    }
    const title = req.body.title;
    const slug = req.body.slug;
    const price = req.body.price;
    const category = req.body.category;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
     
    try {
        await Product.update({title: title, slug:slug, price:price, category:category,  image: fileName, url: url},{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Product Updated Successfuly"});
    } catch (error) {
        console.log(error.message);
    }
}
 
export const deleteProduct = async(req, res)=>{
    const product = await Product.findOne({
        where:{
            id : req.params.id
        }
    });
    
    if(!product) return res.status(404).json({msg: "No Data Found"});
 
    try {
        
        await Product.destroy({
            where:{
                id : req.params.id
            }
        });
        res.status(200).json({msg: "Product Deleted Successfuly"});
    } catch (error) {
        console.log(error.message);
    }
}

export const searchProductList = async(req, res)=>{
    try {
        const response = await Product.findAll({
            where:{
                category : req.body.category
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}
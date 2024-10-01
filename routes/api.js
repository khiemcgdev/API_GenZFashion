var express = require('express');
var router = express.Router();

//Thêm model
const Product =require("../models/product");
const Suppliers =require("../models/suppliers");
const Upload=require('../config/common/upload')
//Thêm nhà cung cấp
router.post('/add-supplier',Upload.single('image'),async(req,res)=>{
    try{
    const data=req.body;
    const {file}=req
    const urlsImage =`${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
    const newSuppliers =new Suppliers({
      name:data.name,
      phone:data.phone,
      email:data.email,
      description:data.description,
      image:urlsImage,
    })
    const result = await newSuppliers.save();
            if (result) {
                res.json({
                   "status": 200,
                    "message": "Thêm nhà cung cấp thành công",
                   "data": result
                });
            } else {
                res.json({
                   "status": 400,
                    "message": "Thất bại",
                   "data": []
                });
            }
    }catch(err){
      console.log(err);
    }
    });
//Thêm sản phẩm 
// router.post('/add-product',async(req,))

module.exports= router;
var express = require('express');
var router = express.Router();

//Thêm model
const Product =require("../models/product");
const Suppliers =require("../models/suppliers");    

//Thêm sản phẩm 
router.post('/add-product',Upload.single('image'),async(req,res)=>{
    try{
        const data =req.body;
        const { file } = req
        const newProduct=new Product({
            quantity:data.quantity,
            price:data.price,
            description:data.description,
            product_name:data.product_name,
            image:`${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
            id_suppliers:data.id_suppliers,
            id_producttype:data.id_producttype,  
        });
        const result=await newProduct.save();
        if (result) {
            //Nếu thêm thành công result !null trả về dữ liệu
            res.json({
              "status": 200,
              "messenger": "Thêm thành công",
              "data": result,
            })
          } else {
            //Nếu thêm không thành công result null, thông báo không thành công
            res.json({
              "status": 400,
              "messenger": "Lỗi,thêm không thành công",
              "data": []
            })
          }
    }catch(error){
        console.log(error);
    }
});

module.exports= router;
var express = require('express');
var router = express.Router();

//Thêm model
const Product =require("../models/product");
const Suppliers =require("../models/suppliers");
const Client =require("../models/client");
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
// xoá nhà cung cấp
router.delete("/delete-supplier-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Suppliers.findByIdAndDelete(id);
    if (result) {
      res.json({
        status: 200,
        messenger: "Xóa thành công",
        data: result,
      });
    } else {
      res.json({
        status: 400,
        messenger: "tìm và xóa thất bại",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});
//update nhà cung cấp
router.put('/update-supplier/:id', Upload.single('image'), async (req, res) => {
  try {
    const supplierId = req.params.id;
    const data = req.body;
    const { file } = req;

    // Lấy thông tin nhà cung cấp hiện tại từ DB theo id
    const supplier = await Suppliers.findById(supplierId);
    if (!supplier) {
      return res.json({
        "status": 404,
        "message": "Nhà cung cấp không tồn tại"
      });
    }

    // Nếu có file ảnh mới thì cập nhật, không thì giữ ảnh cũ
    let urlsImage = supplier.image; // Giữ ảnh cũ nếu không có ảnh mới
    if (file) {
      urlsImage = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
    }

    // Cập nhật các trường của nhà cung cấp
    supplier.name = data.name || supplier.name;
    supplier.phone = data.phone || supplier.phone;
    supplier.email = data.email || supplier.email;
    supplier.description = data.description || supplier.description;
    supplier.image = urlsImage;

    const result = await supplier.save();
    if (result) {
      res.json({
        "status": 200,
        "message": "Cập nhật nhà cung cấp thành công",
        "data": result
      });
    } else {
      res.json({
        "status": 400,
        "message": "Cập nhật thất bại",
        "data": []
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      "status": 500,
      "message": "Lỗi server",
    });
  }
});
//lấy danh sách nhà cung cấp
router.get('/suppliers', async (req, res) => {
  try {
    const suppliersList = await Suppliers.find().sort({ createdAt: -1 });
    if (suppliersList.length > 0) {
      res.json({
        "status": 200,
        "message": "Lấy danh sách nhà cung cấp thành công",
        "data": suppliersList
      });
    } else {
      res.json({
        "status": 404,
        "message": "Không có nhà cung cấp nào",
        "data": []
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      "status": 500,
      "message": "Lỗi server"
    });
  }
});
//tìm kiếm nhà cung cấp
router.get('/get-supplier-by-name', async (req,res)=>{
  try {
      const name = req.query.name
      const data = await Suppliers.find({name: {"$regex": name, "$options": "i"}}).sort({createdAt: -1})
      res.json({
          "status":200,
          "messenger":"Tìm kiếm thành công",
          "data":data
      })
  } catch (error) {
      console.log(error)
  }
})

// Thêm sản phẩm 
router.post('/add-product',Upload.single('image'),async(req,res)=>{
  try{
  const data=req.body;
  const {file}=req
  const urlsImage =`${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
  const newProduct =new Product({
    quantity:data.quantity,
    price:data.price,
    description:data.description,
    product_name:data.product_name,
    state:data.state,
    id_suppliers:data.id_suppliers,
    id_producttype:data.id_producttype,
    image:urlsImage,
  })
  const result = await newProduct.save();
          if (result) {
              res.json({
                 "status": 200,
                  "message": "Thêm sản phẩm thành công",
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
  //update nhà cung cấp
router.put('/update-product/:id', Upload.single('image'), async (req, res) => {
  try {
    const productId = req.params.id;
    const data = req.body;
    const { file } = req;

    // Lấy thông tin nhà cung cấp hiện tại từ DB theo id
    const product = await Product.findById(productId);
    if (!product) {
      return res.json({
        "status": 404,
        "message": "Sản phẩm không tồn tại"
      });
    }

    // Nếu có file ảnh mới thì cập nhật, không thì giữ ảnh cũ
    let urlsImage = product.image; // Giữ ảnh cũ nếu không có ảnh mới
    if (file) {
      urlsImage = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
    }

    // Cập nhật các trường của nhà cung cấp
    product.product_name = data.product_name || product.product_name;
    product.price = data.price || product.price;
    product.quantity = data.quantity || product.quantity;
    product.description = data.description || product.description;
    product.image = urlsImage;
    product.state=data.state||product.state;
    product.id_producttype = data.id_producttype || product.id_producttype;
    product.id_suppliers = data.id_suppliers || product.id_suppliers;

    const result = await product.save();
    if (result) {
      res.json({
        "status": 200,
        "message": "Cập nhật sản phẩm thành công",
        "data": result
      });
    } else {
      res.json({
        "status": 400,
        "message": "Cập nhật thất bại",
        "data": []
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      "status": 500,
      "message": "Lỗi server",
    });
  }
});
//lấy danh sách nhà cung cấp
router.get('/product', async (req, res) => {
  try {
    const productList = await Product.find().sort({ createdAt: -1 });
    if (productList.length > 0) {
      res.json({
        "status": 200,
        "message": "Lấy danh sách sản phẩm thành công",
        "data": productList
      });
    } else {
      res.json({
        "status": 404,
        "message": "Không có sản phẩm nào",
        "data": []
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      "status": 500,
      "message": "Lỗi server"
    });
  }
});
//tìm kiếm sản phẩm
router.get('/get-product-by-name', async (req,res)=>{
  try {
      const product_name = req.query.product_name
      const data = await Product.find({product_name: {"$regex": product_name, "$options": "i"}}).sort({createdAt: -1})
      res.json({
          "status":200,
          "messenger":"Tìm kiếm thành công",
          "data":data
      })
  } catch (error) {
      console.log(error)
  }
})



module.exports= router;
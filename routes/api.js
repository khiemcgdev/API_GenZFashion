var express = require('express');
var router = express.Router();

//Thêm model
const Product = require("../models/product");
const Suppliers = require("../models/suppliers");
const Upload = require('../config/common/upload')
const Sizes = require('../models/sizes')
const Typeproducts = require('../models/typeproducts')
const Typevouchers=require('../models/typevouchers')
const Vouchers=require('../models/vouchers')
//Thêm nhà cung cấp
router.post('/add-supplier', Upload.single('image'), async (req, res) => {
  try {
    const data = req.body;
    const { file } = req
    const urlsImage = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
    const newSuppliers = new Suppliers({
      name: data.name,
      phone: data.phone,
      email: data.email,
      description: data.description,
      image: urlsImage,
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
  } catch (err) {
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
router.get('/get-supplier-by-name', async (req, res) => {
  try {
    const name = req.query.name
    const data = await Suppliers.find({ name: { "$regex": name, "$options": "i" } }).sort({ createdAt: -1 })
    res.json({
      "status": 200,
      "messenger": "Tìm kiếm thành công",
      "data": data
    })
  } catch (error) {
    console.log(error)
  }
})

/* Sản phẩm*/
//tìm kiếm sản phẩm
router.get('/get-product-by-name', async (req, res) => {
  try {
    const product_name = req.query.product_name
    const data = await Product.find({ product_name: { "$regex": product_name, "$options": "i" } }).sort({ createdAt: -1 })
    res.json({
      "status": 200,
      "messenger": "Tìm kiếm thành công",
      "data": data
    })
  } catch (error) {
    console.log(error)
  }
})
// Thêm sản phẩm 
router.post('/add-product', Upload.single('image'), async (req, res) => {
  try {
    const data = req.body;
    const { file } = req
    const urlsImage = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
    const newProduct = new Product({
      image: urlsImage,
      quantity: data.quantity,
      price: data.price,
      description: data.description,
      product_name: data.product_name,
      state:data.state,
      id_producttype:data.id_producttype,
      id_suppliers:data.id_suppliers,
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
  } catch (err) {
    console.log(err);
  }
});

//sửa sản phẩm
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
        "message": "Nhà cung cấp không tồn tại"
      });
    }

    // Nếu có file ảnh mới thì cập nhật, không thì giữ ảnh cũ
    let urlsImage = product.image; // Giữ ảnh cũ nếu không có ảnh mới
    if (file) {
      urlsImage = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
    }

    // Cập nhật các trường của sản phẩm
    product.product_name = data.product_name || product.product_name;
    product.price = data.price || product.price;
    product.state = data.state || product.state;
    product.description = data.description || product.description;
    product.quantity = data.quantity || product.quantity;
    product.image = urlsImage;
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
// danh sách sản phẩm
router.get('/prodct', async (req, res) => {
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

//* Size
//thêm size
router.post('/add-size', async (req, res) => {
  try {
    const data = req.body;
    const newSizes = new Sizes({
      name: data.name
    });
    const result = await newSizes.save();
    if (result) {
      res.json({
        status: 200,
        messenger: "Thêm size thành công",
        data: result
      });
    } else {
      res.json({
        "status": 400,
        "messenger": "Thất bại",
        "data": []
      });
    }
  } catch (error) {
    console.error(error);
  }
});
// danh sách size
router.get("/get-list-size", async (req, res) => {
  try {
    const data = await Sizes.find().sort({ createdAt: -1 });
    if (data) {
      res.json({
        status: 200,
        messenger: "Lấy danh sách thành công",
        data: data,
      });
    } else {
      res.json({
        status: 400,
        messenger: "lấy danh sách thất bại",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});


//** loại sản phẩm */
// thêm loại
router.post('/add-type', Upload.single('image'), async (req, res) => {
  try {
    const data = req.body;
    const { file } = req
    const urlsImage = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

    const newTypeproducts = new Typeproducts({
      name: data.name,
      image: urlsImage,
      id_size: data.id_size
    })
    const result = await newTypeproducts.save();
    if (result) {
      res.json({
        "status": 200,
        "message": "Thêm thành công",

        "data": result
      });
    } else {
      res.json({
        "status": 400,
        "message": "Thất bại",
        "data": []
      });
    }
  } catch (err) {
    console.log(err);
  }
});

// danh sách loại sản phẩm
router.get('/typeproduct', async (req, res) => {
  try {
    const TypeproductsList = await Typeproducts.find().sort({ createdAt: -1 });
    if (TypeproductsList.length > 0) {
      res.json({
        "status": 200,
        "message": "Lấy danh sách thành công",
        "data": TypeproductsList
      });
    } else {
      res.json({
        "status": 404,
        "message": "Không có danh sach nào",
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
// xóa loại sản phẩm
router.delete("/delete-typeproduct-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Typeproducts.findByIdAndDelete(id);
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
//sửa loại sản phẩm
router.put('/update-typeproduct/:id', Upload.single('image'), async (req, res) => {
  try {
    const typeID = req.params.id;
    const data = req.body;
    const { file } = req;
    const typeproduct = await Typeproducts.findById(typeID);
    if (!typeproduct) {
      return res.json({
        "status": 404,
        "message": " không tồn tại"
      });
    }
    let urlsImage = typeproduct.image;
    if (file) {
      urlsImage = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
    }

    // Cập nhật các trường của type
    typeproduct.name = data.name || typeproduct.name;
    typeproduct.phone = data.phone || typeproduct.phone;
    typeproduct.email = data.email || typeproduct.email;
    typeproduct.description = data.description || typeproduct.description;
    typeproduct.image = urlsImage;

    const result = await typeproduct.save();
    if (result) {
      res.json({
        "status": 200,
        "message": "Cập nhật thành công",
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
//**loại voucher */
//thêm loại voucher
router.post('/add-typevoucher', async (req, res) => {
  try {
    const data = req.body;
    const newTypevouchers = new Typevouchers({
      name: data.name
    });
    const result = await newTypevouchers.save();
    if (result) {
      res.json({
        status: 200,
        messenger: "Thêm vouvher thành công",
        data: result
      });
    } else {
      res.json({
        "status": 400,
        "messenger": "Thất bại",
        "data": []
      });
    }
  } catch (error) {
    console.error(error);
  }
});
//danh sách loại voucher
router.get("/get-list-typevoucher", async (req, res) => {
  try {
    const data = await Typevouchers.find().sort({ createdAt: -1 });
    if (data) {
      res.json({
        status: 200,
        messenger: "Lấy danh sách thành công",
        data: data,
      });
    } else {
      res.json({
        status: 400,
        messenger: "lấy danh sách thất bại",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});
//**voucher */
// thêm voucher
router.post('/add-voucher', Upload.single('image'), async (req, res) => {
  try {
    const data = req.body;
    const { file } = req
    const urlsImage = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

    const newVouchers = new Vouchers ({
      name: data.name,
      image: urlsImage,
      pricevoucher: data.pricevoucher,  // Giá trị của voucher
      description: data.description,  // Mô tả về voucher
      discountValue: data.discountValue,  // Giá trị giảm giá
      discountType: data.discountType,  // Loại giảm giá (percent hoặc fixed)
      validFrom: data.validFrom,  // Ngày bắt đầu hiệu lực
      validUntil: data.validUntil,  // Ngày hết hạn
      minimumOrderValue: data.minimumOrderValue,// Giá tối thiểu
      id_type: data.id_type
    })
    const result = await newVouchers.save();
    if (result) {
      res.json({
        "status": 200,
        "message": "Thêm thành công",

        "data": result
      });
    } else {
      res.json({
        "status": 400,
        "message": "Thất bại",
        "data": []
      });
    }
  } catch (err) {
    console.log(err);
  }
});
// dánh sách voucher
router.get("/get-list-voucher", async (req, res) => {
  try {
    const data = await Vouchers.find().sort({ createdAt: -1 });
    if (data) {
      res.json({
        status: 200,
        messenger: "Lấy danh sách thành công",
        data: data,
      });
    } else {
      res.json({
        status: 400,
        messenger: "lấy danh sách thất bại",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});
// sửa vouher
router.put('/update-voucher/:id', Upload.single('image'), async (req, res) => {
  try {
    const voucherId = req.params.id;
    const data = req.body;
    let urlsImage;


    if (req.file) {
      urlsImage = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    } else {
      // Giữ lại đường dẫn ảnh cũ
      const existingVoucher = await Vouchers.findById(voucherId);
      if (!existingVoucher) {
        return res.status(404).json({
          "status": 404,
          "message": "Voucher không tồn tại",
        });
      }
      urlsImage = existingVoucher.image;
    }

    // Cập nhật thông tin voucher
    const updatedVoucher = await Vouchers.findByIdAndUpdate(
      voucherId,
      {
        name: data.name,
        image: urlsImage, 
        pricevoucher: data.pricevoucher,
        description: data.description,
        discountValue: data.discountValue,
        discountType: data.discountType,
        validFrom: data.validFrom,
        validUntil: data.validUntil,
        minimumOrderValue: data.minimumOrderValue,
        id_type: data.id_type,
      },
      { new: true } 
    );

    if (updatedVoucher) {
      res.json({
        "status": 200,
        "message": "Cập nhật thành công",
        "data": updatedVoucher,
      });
    } else {
      res.json({
        "status": 400,
        "message": "Cập nhật thất bại",
        "data": [],
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      "status": 500,
      "message": "Có lỗi xảy ra",
    });
  }
});



module.exports = router;
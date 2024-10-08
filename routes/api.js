var express = require('express');
var router = express.Router();

//Thêm model
const Product = require("../models/product");
const Suppliers = require("../models/suppliers");
const Upload = require('../config/common/upload')
const Sizes = require('../models/sizes')
const Evaluate = require('../models/evaluate')
const Favourite = require('../models/favourite')
const Cart = require('../models/cart')
const Typeproducts = require('../models/typeproducts')
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
/* API evaluate*/
// Thêm yêu thích
router.post('/add-favourite', async (req, res) => {
  try {
    const data = req.body;
    const newFavourite = new Favourite({
      name:data.name,
      id_product:data.id_product,
      id_client:data.id_client,
    })
    const result = await newFavourite.save();
    if (result) {
      res.json({
        "status": 200,
        "message": "Thêm danh sách yêu thích thành công",
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
// xoá danh sách yêu thích
router.delete("/delete-favourite-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Favourite.findByIdAndDelete(id);
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
//lấy danh sách yêu thích
router.get('/favourite', async (req, res) => {
  try {
    const { clientId } = req.query; // Lấy clientId từ query parameter

    // Kiểm tra nếu không có clientId được gửi lên
    if (!clientId) {
      return res.status(400).json({
        "status": 400,
        "message": "Thiếu clientId"
      });
    }

    // Tìm kiếm danh sách đánh giá theo clientId
    // const favouriteList = await Favourite.find({ clientId }).sort({ createdAt: -1 });
    const favouriteList = await Favourite.find({ id_client: clientId })
      .populate('id_product') // Populate để lấy dữ liệu từ bảng Product
      .sort({ createdAt: -1 });
    // const evaluateList = await Evaluate.find().sort({ createdAt: -1 });
    if (favouriteList.length > 0) {
      res.json({
        "status": 200,
        "message": "Lấy danh sách yêu thích thành công",
        "data": favouriteList
      });
    } else {
      res.json({
        "status": 404,
        "message": "Không có sản phẩm yêu thích nào",
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

/* Đánh giá sản phẩm */
// Thêm đánh giá 
router.post('/add-evaluate', async (req, res) => {
  try {
    const data = req.body;
    const newEvaluate = new Evaluate({
      id_product:data.id_product,
      id_client:data.id_client,
      rate:data.rate,
      chat:data.chat,
    })
    const result = await newEvaluate.save();
    if (result) {
      res.json({
        "status": 200,
        "message": "Thêm đánh giá thành công",
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
// xoá đánh giá
router.delete("/delete-evaluate-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Evaluate.findByIdAndDelete(id);
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
//lấy danh sách đánh giá
router.get('/evaluate', async (req, res) => {
  try {
    const { productId } = req.query; // Lấy productId từ query parameter

    // Kiểm tra nếu không có productId được gửi lên
    if (!productId) {
      return res.status(400).json({
        "status": 400,
        "message": "Thiếu productId"
      });
    }

    // Tìm kiếm danh sách đánh giá theo productId
    // const favouriteList = await Favourite.find({ productId }).sort({ createdAt: -1 });
    const evaluateList = await Evaluate.find({ id_product: productId })
      .sort({ createdAt: -1 });
    if (evaluateList.length > 0) {
      res.json({
        "status": 200,
        "message": "Lấy danh sách đánh giá thành công",
        "data": evaluateList
      });
    } else {
      res.json({
        "status": 404,
        "message": "Không có đánh giá nào",
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

/* Giỏ hàng */

// Hàm tính toán tổng giá trị
const calculateTotalPrice = async (products) => {
  let total = 0;
  for (const item of products) {
      const product = await Product.findById(item.id_product); // Lấy thông tin sản phẩm từ id_product
      if (product) {
          total += product.price * item.quantity; // Tính tổng giá
      }
  }
  return total;
};

router.post("/add-cart", async (req, res) => {
  const { clientId, productId, quantity } = req.body;

  // Kiểm tra xem có thiếu trường cần thiết không
  if (!clientId || !productId || !quantity) {
      return res.status(400).json({ message: 'Thiếu trường thông tin bắt buộc' });
  }

  try {
      // Tìm giỏ hàng của người dùng
      let cart = await Cart.findOne({ id_client: clientId }); // Sử dụng id_client cho nhất quán
      if (cart) {
          // Tìm sản phẩm trong giỏ hàng
          const productIndex = cart.id_product.findIndex(p => p._id.toString() === productId);
          if (productIndex !== -1) {
              // Tăng số lượng nếu sản phẩm đã tồn tại trong giỏ hàng
              cart.id_product[productIndex].quantity += quantity;
          } else {
              // Thêm sản phẩm mới vào giỏ hàng nếu chưa có
              cart.id_product.push({ _id: productId, quantity });
          }
      } else {
          // Tạo giỏ hàng mới nếu người dùng chưa có
          cart = new Cart({
              id_client: clientId, // Sử dụng clientId ở đây
              id_product: [{ _id: productId, quantity }]
          });
      }

      // Tính lại tổng giá trị của giỏ hàng
      cart.total_payment = await calculateTotalPrice(cart.id_product);
      // Lưu giỏ hàng
      const result = await cart.save();

      // Trả về phản hồi thành công
      res.status(200).json({
          status: 200,
          message: "Sản phẩm đã được thêm vào giỏ hàng thành công",
          data: result
      });
  } catch (err) {
      // Trả về lỗi nếu có lỗi xảy ra
      console.error(err); // Ghi lại lỗi để dễ dàng kiểm tra
      res.status(500).json({ message: err.message });
  }
});
// Lấy dánh sách giỏ hàng
router.get('/cart', async (req, res) => {
  try {
    const { clientId } = req.query; // Lấy productId từ query parameter

    // Kiểm tra nếu không có productId được gửi lên
    if (!clientId) {
      return res.status(400).json({
        "status": 400,
        "message": "Thiếu productId"
      });
    }

   
    const cartList = await Cart.find({ id_client: clientId })
      .sort({ createdAt: -1 });
    if (cartList.length > 0) {
      res.json({
        "status": 200,
        "message": "Lấy danh sách đánh giá thành công",
        "data": cartList
      });
    } else {
      res.json({
        "status": 404,
        "message": "Không có đánh giá nào",
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



module.exports = router;
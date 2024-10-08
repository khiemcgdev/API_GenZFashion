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

const Evaluate = require('../models/evaluate')
const Favourite = require('../models/favourite')
const Cart = require('../models/cart')
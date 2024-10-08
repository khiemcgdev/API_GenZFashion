// Thêm đơn hàng
// Thêm đơn hàng
router.post('/add-order', async (req, res) => {
  try {
    const data = req.body;

    // Khởi tạo đơn hàng mới với dữ liệu từ body và gán order_time mặc định là thời gian hiện tại
    const newOrder = new Order({
      id_client: data.id_client,  // Nhận id_client từ body
      id_product: data.id_product,  // Nhận id_product từ body
      id_voucher: data.id_voucher,  // Nhận id_voucher từ body
      state: data.state,
      payment_method: data.payment_method,
      total_amount: data.total_amount,
      quantity: data.quantity,
      order_time: data.payment_time || null,  // Đặt mặc định thời gian hiện tại
      payment_time: data.payment_time || null,  // Nếu không có, gán là null
      completion_time: data.completion_time || null  // Nếu không có, gán là null
    });

    // Lưu đơn hàng mới vào MongoDB
    const result = await newOrder.save();

    // Kiểm tra và phản hồi kết quả
    if (result) {
      res.status(200).json({
        status: 200,
        message: "Thêm đơn hàng thành công",
        data: result
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "Thêm đơn hàng thất bại",
        data: []
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 500,
      message: "Lỗi hệ thống",
      error: err.message
    });
  }
});
// lấy danh sách đơn hàng
router.get('/order', async (req, res) => {
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
    const orderList = await Order.find({ id_client: clientId })
      .populate('id_product') // Populate để lấy dữ liệu từ bảng Product
      .sort({ createdAt: -1 });
    // const evaluateList = await Evaluate.find().sort({ createdAt: -1 });
    if (orderList.length > 0) {
      res.json({
        "status": 200,
        "message": "Lấy danh sách yêu thích thành công",
        "data": orderList
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
// Cập nhật đơn hàng
router.put('/update-order/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const data = req.body;

    // Lấy thông tin đơn hàng hiện tại từ DB theo id
    const order = await Order.findById(orderId);
    if (!order) {
      return res.json({
        "status": 404,
        "message": "Đơn hàng không tồn tại"
      });
    }

    // Cập nhật các trường của đơn hàng
    order.id_client = data.id_client || order.id_client;
    order.id_product = data.id_product || order.id_product;
    order.id_voucher = data.id_voucher || order.id_voucher;
    order.state = data.state !== undefined ? data.state : order.state;
    order.payment_method = data.payment_method || order.payment_method;
    order.total_amount = data.total_amount || order.total_amount;
    order.quantity = data.quantity || order.quantity;
    order.order_time = data.order_time || order.order_time; // Giữ nguyên nếu không có dữ liệu mới
    order.payment_time = data.payment_time || order.payment_time; // Giữ nguyên nếu không có dữ liệu mới
    order.completion_time = data.completion_time || order.completion_time; // Giữ nguyên nếu không có dữ liệu mới

    const result = await order.save();
    if (result) {
      res.json({
        "status": 200,
        "message": "Cập nhật đơn hàng thành công",
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
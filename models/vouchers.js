const mongoose= require('mongoose');
const Scheme=mongoose.Schema;
const Vouchers=new Scheme({
    name: { type: String, required: true },
    image: { type: String },  
    pricevoucher: { type: Number, required: true },  // Giá trị của voucher (nếu cần)
    description: { type: String },  // Mô tả về voucher
    discountValue: { type: Number, required: true },  // Giá trị giảm giá
    discountType: { type: String, enum: ['percent', 'fixed'], required: true },  // Loại giảm giá
    validFrom: { type: Date, required: true },  // Ngày bắt đầu hiệu lực
    validUntil: { type: Date, required: true },  // Ngày hết hạn
    minimumOrderValue: { type: Number, required: true },  // Giá trị tối thiểu để sử dụng voucher
    id_type: { type: mongoose.Schema.Types.ObjectId, ref: 'typevouchers' }  // Tham chiếu đến loại voucher
},{
})
module.exports=mongoose.model('vouchers',Vouchers)
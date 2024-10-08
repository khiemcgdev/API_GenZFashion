const mongoose =require('mongoose');
const Scheme =mongoose.Schema;

const Order =new Scheme({
    id_client:{type:String,require: true},
    id_product:{type:Scheme.Types.ObjectId,ref:'product'},
    id_voucher:{type:Scheme.Types.ObjectId,ref:'vouchers'},
    state:{type:Number},
    payment_method:{type:String},
    total_amount:{type:Number},
    quantity:{type:Number},
    order_time:{type:Date,default:Date.now()},
    payment_time:{type:Date},
    completion_time:{type:Date},
},{
    timestamps:true,
})

module.exports=mongoose.model('order',Order)
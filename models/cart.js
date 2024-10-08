const mongoose =require('mongoose');
const Scheme =mongoose.Schema;

const Cart =new Scheme({
    id_client:{type:String,require: true},
    id_product:{type:Scheme.Types.ObjectId,ref:'product'},
    id_voucher:{type:Scheme.Types.ObjectId,ref:'vouchers'},
    total_payment:{type:Number},
    quantity:{type:Number},
},{
    timestamps:true,
})

module.exports=mongoose.model('cart',Cart)
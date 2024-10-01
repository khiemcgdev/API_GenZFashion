const mongoose =require('mongoose');
const Scheme =mongoose.Schema;

const Product=new Scheme({
    quantity:{type:Number},
    price:{type:Number},
    description:{type:String},
    product_name:{type:String},
    image:{type:String},
},{
    timestamps:true,
})

module.exports=mongoose.model('product',Product)
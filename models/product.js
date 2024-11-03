const mongoose =require('mongoose');
const Scheme =mongoose.Schema;

const Product=new Scheme({
    product_name:{type:String},
    quantity:{type:Number},
    price:{type:Number},
    description:{type:String},
    state:{type:Boolean},
    image:{type:Array},
    id_suppliers:{type:Scheme.Types.ObjectId,ref:'suppliers'},
    id_producttype:{type:Scheme.Types.ObjectId,ref:'typeproducts'},
},{
    timestamps:true,
})

module.exports=mongoose.model('product',Product)
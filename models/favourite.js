const mongoose =require('mongoose');
const Scheme =mongoose.Schema;

const Favourite =new Scheme({
    // userId: { type: String, required: true }, // userId từ Firebase
    name:{type:String },
    id_client:{type:String,require: true},
    id_product:{type:Scheme.Types.ObjectId,ref:'product'},
},{
    timestamps:true,
})

module.exports=mongoose.model('favourite',Favourite)
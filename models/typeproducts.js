const mongoose= require('mongoose');
const Scheme=mongoose.Schema;
const Typeproducts=new Scheme({
    name:{type:String},
    image:{type:String},
    id_size:{type:Scheme.Types.ObjectId,ref:'sizes'},
},{
    timestamps:true
})
module.exports=mongoose.model('typeproducts',Typeproducts)
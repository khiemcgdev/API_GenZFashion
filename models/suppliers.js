const mongoose= require('mongoose');
const Scheme=mongoose.Schema;
const Suppliers=new Scheme({
    name:{type:String},
    phone:{type:String},
    email:{type:String},
    description:{type:String},
    image:{type:String}
},{
    timestamps:true
})
module.exports=mongoose.model('suppliers',Suppliers)
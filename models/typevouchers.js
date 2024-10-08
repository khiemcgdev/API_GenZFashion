const mongoose= require('mongoose');
const Scheme=mongoose.Schema;
const Typevouchers=new Scheme({
    name:{type:String},
},{
    timestamps:true
})
module.exports=mongoose.model('typevouchers',Typevouchers)
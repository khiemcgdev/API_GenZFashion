const mongoose= require('mongoose');
const Scheme=mongoose.Schema;
const Sizes=new Scheme({
    name:{type:String},
},{
    timestamps:true
})
module.exports=mongoose.model('sizes',Sizes)
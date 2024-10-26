const mongoose=require('mongoose');
mongoose.set('strictQuery',true)
//compasss
const local="mongodb://127.0.0.1:27017/GenZFashion"

// const local="mongodb://127.0.0.1:27017/QLiProduct"
//alast(cloud)
const dataatlas="mongodb+srv://dieptvph40380:dieptvph40380@cluster0.hdhv3ze.mongodb.net/?retryWrites=true&w=majority"
const connect = async ()=>{
    try{
       await mongoose.connect(local,{useNewUrlParser:true,useUnifiedTopology:true,})
       console.log('connet success')
    }catch(error){
        console.log(error);
        console.log('connet fail')
    }
}
module.exports={connect}
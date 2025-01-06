import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    productName: { type: String },  
    category: { type: String },
    price:{type:Number},
    thumbnail:{type:String},
    quantity:{type:Number},
    description: { type: String },
    images: { type: Array },
    user_id:{type:String},

});





export default mongoose.model.product||mongoose.model('product',productSchema)
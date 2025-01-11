import mongoose from "mongoose";
const cartSchema = new mongoose.Schema({
    product_id: { type: String },  
    buyer_id: { type: String },
    product:{type:Object},
    quantity:{type:Number}
    
});





export default mongoose.model.cart||mongoose.model('cart',cartSchema)
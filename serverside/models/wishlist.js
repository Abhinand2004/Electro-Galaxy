import mongoose from "mongoose";
const wishlist = new mongoose.Schema({
    product_id: { type: String },  
    buyer_id: { type: String }
    
});





export default mongoose.model.wishlist||mongoose.model('wishlist',wishlist)
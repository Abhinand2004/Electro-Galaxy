import mongoose from "mongoose";
const orderplaced = new mongoose.Schema({
    seller_id: { type: String },  
    buyer_id: { type: String },
    address:{type:Object},
    product:{type:Object}
    
});





export default mongoose.model.orderplaced||mongoose.model('orderplaced',orderplaced)
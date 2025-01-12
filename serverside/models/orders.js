import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({  
    buyer_id: { type: String },
    products:{type:Object}
    
});





export default mongoose.model.orders||mongoose.model('orders',orderSchema)
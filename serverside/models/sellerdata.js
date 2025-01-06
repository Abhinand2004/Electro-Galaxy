import mongoose from "mongoose";
const sellerData = new mongoose.Schema({
    seller_id: { type: String },  
    companyname: { type: String },
    location:{type:String}
    
});





export default mongoose.model.sellerData||mongoose.model('sellerData',sellerData)
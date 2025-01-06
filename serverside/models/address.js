import mongoose from "mongoose";
const addressSchema = new mongoose.Schema({
    pincode: { type: Number },  
    locality: { type: String },
    address:{type:String},
    city:{type:String},
    state:{type:String},
    landmark: { type: String },
    place: { type: String },
    user_id:{type:String},

});





export default mongoose.model.address||mongoose.model('address',addressSchema)
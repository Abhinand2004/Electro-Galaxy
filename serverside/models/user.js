import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
    acctype: { type: String, required: true },
    pass: { type: String, required: true },
    location: { type: Array}
});

export default mongoose.models.user || mongoose.model('user', userSchema);

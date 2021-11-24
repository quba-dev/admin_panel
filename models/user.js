import mongoose from 'mongoose';

const User = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    password: {type: String, required: true},
    isBanned: {type: Boolean, default: false},
    isDeleted: {type: Boolean, default: false},
    isActivated: {type: Boolean, default: false},
    activation_code: {type: String},
    password_code: {type: String},
}, { timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'} });

export default mongoose.model('User', User)
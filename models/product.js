import mongoose from 'mongoose';

const Product = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    author: {type: String},
    author_id: {type: String},

}, { timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'} })

export default mongoose.model('Product', Product)
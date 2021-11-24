import Product from "../models/product.js";
import User from "../models/user.js";
import JWT from 'jsonwebtoken';

class ProductController {
    async create(req, res){
        try {
            const {title, content} = req.body
            const {authorization} = req.headers
            const token = authorization.split(' ')[1]
            const authorPost = JWT.verify(token, process.env.JWT_SECRET)
            const user = await User.findOne({_id:authorPost.id})
            const post = await Product.create({author: user.username , title,content, author_id: user._id, })
            return res.json(post)
        } catch (e){
            return res.status(500).json(e)
        }
    }

    async getAll(req, res){
        try {
            const posts = await Product.find()
            return res.json(posts)
        } catch(e){
            res.status(500).json(e)
        }

    }
    async getOne(req, res){
        try {
            const {id} = await req.params
            if (!id){
                res.status(400).json({message: "Id не указан"})
            }
            const post = await Product.findById(id)
            return res.json(post)
        } catch(e){
            res.status(500).json(e)
        }

    }
    async update(req, res){
        try {
            const {id} = req.params
            const product = req.body
            const {authorization} = req.headers
            const token = authorization.split(' ')[1]
            const authorPost = JWT.verify(token, process.env.JWT_SECRET)
            const user = await User.findOne({_id:authorPost.id})
            const authorIs = await Product.findOne({author_id: user.id})
            if (!id) {
                return res.status(400).json({message: "id не указан"})
            }
            if (!authorIs){
                return res.status(400).json({message: 'Не твой пост, дядя'})
            }
            const updatedPost = await Product.findByIdAndUpdate(id, product, {new: true})
            return res.json(updatedPost)
        } catch(e){
            res.status(500).json(e)
        }

    }
    async delete(req, res){
        try {
            const {id} = req.params
            const {authorization} = req.headers
            const token = authorization.split(' ')[1]
            const authorPost = JWT.verify(token, process.env.JWT_SECRET)
            const user = await User.findOne({_id:authorPost.id})
            const authorIs = await Product.findOne({author_id: user.id})
            if (!id) {
                return res.status(400).json({message: "id не указан"})
            }
            if (!authorIs){
                return res.status(400).json({message: 'Не твой пост, дядя'})
            }
            const product = await Product.findByIdAndDelete(id);
            return res.json(product)
        } catch(e){
            res.status(500).json(e)
        }
    }
}

export default new ProductController();
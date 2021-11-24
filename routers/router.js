import Router from "express"
import ProductController from "../controllers/ProductController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = new Router()

router.post('/product', authMiddleware(),ProductController.create)
router.get('/products', authMiddleware(),ProductController.getAll)
router.get('/product/:id', authMiddleware(),ProductController.getOne)
router.put('/product/:id', authMiddleware(),ProductController.update)
router.delete('/product/:id', authMiddleware(),ProductController.delete)

export default router;
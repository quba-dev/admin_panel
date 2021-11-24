import Router from "express";
import authController from "../controllers/authController.js";
const authRouter = new Router()
import {check} from "express-validator"
import {roleMiddleware} from '../middleware/roleMiddleware.js'
import {roleModerMiddleware} from '../middleware/roleModerMiddleWare.js'


authRouter.post('/registration', [
    check('username', 'Логин пользователя не может быть пустым').notEmpty(),
    check('first_name', 'Имя пользователя не может быть пустым').notEmpty(),
    check('last_name', 'Фамилия пользователя не может быть пустым').notEmpty(),
    check('email', 'Почта не может быть пустым').notEmpty(),
    check('password', 'Пароль должен быть больше 4 и меньше 10 symbols').isLength({min: 4, max:10})
    ],
    authController.registration)
authRouter.get('/activate/:link', authController.activate)
authRouter.get('/reset_password', authController.resetPassword)
authRouter.post('/change_password/:link', authController.changePassword)
authRouter.post('/login', authController.login)
authRouter.post('/logout', authController.logout)
authRouter.get('/users', roleMiddleware(), authController.getUsers)
authRouter.delete('/delete_user', roleMiddleware(), authController.delete)
authRouter.post('/ban_user', roleModerMiddleware(), roleMiddleware(), authController.toBan)
authRouter.post('/create_role', roleMiddleware(), authController.createRole)
authRouter.put('/change_user_role', roleMiddleware(), authController.changeUserRole)


export default authRouter;
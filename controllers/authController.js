import User from "../models/user.js";
import UserRoles from "../models/user-roles.js";
import Role from "../models/role.js";
import bcryptjs from 'bcryptjs';
import {validationResult} from "express-validator";
import SendMail from '../service/sendMail.js';
import {v4 as uuidv4} from 'uuid';
import TokenService from '../service/token-service.js';


class authController {
    async registration (req,res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                return res.status(400).json({message: `Ошибка!`, errors})
            }
            const {username, email, first_name, last_name, password, password_confirmation} = req.body
            const userExist = await User.findOne({username})
            const emailExist = await User.findOne({email})
            if(password_confirmation !== password){
                return res.status(400).json('bad password')
            }
            if(userExist){
                return res.status(400).json('Такой пользователь уже существует')
            }
            if(emailExist){
                return res.status(400).json('Пользователь с такой почтой уже существует!')
            }
            const passwordHash = bcryptjs.hashSync(password, 10)
            const role = await Role.findOne({value: "user"})
            const activation_code = uuidv4()
            await SendMail.sendActivationLink(email,
                `http://127.0.0.1:5000/auth/activate/${activation_code}`)
            const user = await new User({username, password: passwordHash,email, first_name, last_name,
                activation_code})
            const token = TokenService.generateAccessToken(user._id, user.isBanned, role.value)
            await TokenService.saveToken(user._id, token.refreshToken);
            const createRole = await new UserRoles({user_id: user._id, role_id: role._id})
            createRole.save()
            user.save()
            return res.json({message: 'Вы успешно зарегестрировались'})

        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Ошибка регистрации'})
        }
    }

    async activate(req, res) {
        const activationLink = req.params.link;
        const user = await User.findOne({activation_code: activationLink})
        if (user) {
            user.isActivated = true;
            res.status(200).json({message: 'Ваш аккаунт успешно активирован'})
            await user.save();
        } else {
            res.status(400).json({message: 'Неккоректная ссылка активации'})
        }


    }

    async resetPassword(req,res) {
        try {
            const {username, email} = req.body
            console.log(username, email)
            const user = await User.findOne({username})
            const mail = await User.findOne({email})

            if (!user || !mail){
                return res.status(400).json({message: 'Нет такого пользователя'})
            }
            const accessCode = uuidv4()
            user.password_code = accessCode
            user.save()
            await SendMail.sendResetPassword(email, `${process.env.API_URL}auth/change_password/${accessCode}`)
            return res.status(200).json({message: 'Мы успено отправили ссылку на изменения пароля'})


        } catch (e){
            console.log(e)
        }
    }


    async changePassword (req,res) {
        try {
            const access_code = req.params.link
            console.log(access_code)
            const user = await User.findOne({password_code:access_code})
            if (!user){
                return res.status(400).json({message: 'не верная ссылка'})
            }
            const {password, password_confirmation} = req.body
            if (password_confirmation !== password) {
                return res.status(400).json({message: 'пароли не совпадают'})
            }
            user.password = bcryptjs.hashSync(password, 10)
            user.save()
            res.status(200).json({message: 'пароль успешно изменен'})
        } catch(e){
            console.log(e)
        }
    }

    async login (req,res) {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})
            if (!user) {
                return res.status(404).json({message: `Пользователь ${username} не найден`})
            }
            if (!user.isActivated){
                return res.status(401).json({message: 'Активируйте аккаунт'})
            }
            if (user.isBanned) {
                return res.status(403).json({message: 'К сожалению вы были забанены, отправьте на карту 100 сом для разбана'})
            }
            if (user.isDeleted) {
                return res.status(410).json({message: 'К сожалению ваш аккаунт удален.'})
            }
            const validPassword = bcryptjs.compareSync(password, user.password)
            if (!validPassword){
                return res.status(400).json({message: 'Введен неверный пароль'})
            }
            const findRole = await UserRoles.findOne({user_id: user._id})
            const role = await Role.findOne({_id: findRole.role_id})
            const token = TokenService.generateAccessToken(user._id, user.isBanned, role.value)
            await TokenService.saveToken(user._id, token.refreshToken);
            res.cookie('refreshToken', token);
            return res.json({token: token.accessToken})

        } catch (e) {
            console.log(e)
            res.status(400).json({message: ' Ошибка входа'})
        }
    }

    async logout (req,res){
        try {
            if (req.headers.cookie === undefined){
                return res.status(400).json({message: 'Вы не авторизованы'})
            }
            const refreshToken = req.headers.cookie.replace('refreshToken=', '');
            await TokenService.removeToken(refreshToken)
            res.clearCookie('refreshToken');
            return res.status(200).json({message: 'Disconnected'})

        } catch (e) {
            console.log(e)
        }
    }

    async getUsers (req,res) {
        try {
            const users = await User.find()
            const data = []
            for (let user of users){
                const findRole = await UserRoles.findOne({user_id: user._id})
                const role = await Role.findOne({_id: findRole.role_id})
                let users2 = {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    isDeleted: user.isDeleted,
                    isActivated: user.isActivated,
                    isBanned: user.isBanned,
                    role: role.value,
                    created_at: user.created_at,
                    updated_at: user.updated_at
                }
                data.push(users2)
            }

            res.json(data)
        } catch (e) {

        }
    }

    async createRole (req, res) {
        try {
            const {role} = req.body
            if (!role) {
                return res.status(400).json({message: "Роль отсутствует"})
            }
            const roleExist = await Role.findOne({value: role})
            if (roleExist) {
                return res.status(400).json({message: 'Такая роль уже существует'})
            }
            const newRole = await new Role({value: role})
            newRole.save()
            return res.json({message: `Роль ${newRole.value} создана`})
        } catch (e){
            console.log(e)
        }
    }

    async changeUserRole (req, res){
        try {
            const {username, role} = req.body
            const user = await User.findOne({username: username})
            const roleSet = await Role.findOne({value: role})
            if (!user){
                return res.status(400).json({message: "Такого пользователя не существует"})
            }
            if (!roleSet){
                return res.status(400).json({message: "Такой роли нет!"})
            }
            const findRole = await UserRoles.findOne({user_id: user._id})
            await findRole.updateOne({role_id: roleSet._id})
            return res.json({message: `Роль успешна изменена у ${username} на ${role}`})
        } catch (e){
            return console.log(e);
        }
    }

    async delete(req, res){
        try {
            const {username} = req.body
            if (!username) {
                res.status(400).json({message: "Имя пользователя не указано"})
            }
            const user = await User.findOne({username: username});
            if (!user) {
                res.status(404).json({message: "Такой пользователь не найден"})
            }
            user.isDeleted = true
            user.save()
            return res.status(202).json({message: `Пользователь ${user.username} удален.`})
        } catch(e){
            res.status(500).json(e)
        }
    }

    async toBan(req, res){
        try {
            const {username} = req.body
            if (!username){
                res.status(400).json({message: "Имя пользователя не указано"})
            }
            const user = await User.findOne({username: username})
            if (!user) {
                res.status(404).json({message: "Такой пользователь не найден"})
            }
            const userRoles = await UserRoles.findOne({user_id: user._id})
            const roles = await Role.findOne({_id: userRoles.role_id})
            if (user.isBanned){
                return res.status(400).json({message: "Данный персонаж уже находится в бане"})
            }
            if (roles.value === 'admin' || roles.value === 'moderator'){
                return res.status(400).json({message: `Вы не можете забанить ${user.username},
                потому что он является ${roles.value}`})}
            user.isBanned = true
            user.save()
            return res.status(201).json({message: `Вы забанили ${user.username}.`})

        } catch (e){
            res.status(500).json(e)
        }
    }
}


export default new authController();
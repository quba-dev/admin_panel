import JWT from 'jsonwebtoken'

export const roleModerMiddleware= function (){

    return function (req, res, next){
        if (req.method === 'OPTIONS'){
            next()
        }
        try {
            const {authorization} = req.headers;

            if(authorization) {
                const token = authorization.split(' ')[1]
                if (!token){
                    return res.status(403).json({message: "Пользователь не авторизован 1"})
                }
                const {roles: userRoles} = JWT.verify(token, process.env.JWT_SECRET);
                if(userRoles === 'moderator' || userRoles ==='admin'){
                    next()
                } else {
                    return res.status(403).json({message: "У вас нет доступа"})
                }
            } else {
                res.json({message: 'Нет токена'})
            }
        } catch (e){
            console.log(e)
            return res.status(403).json({message: "Пользователь не авторизован 2"})
        }
    }
}

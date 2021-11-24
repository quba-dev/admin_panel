import colors from 'colors'


export function requestTime(req, res, next) {
    req.requestTime = Date.now()
    req.url
    next()
}


export function logger(req, res, next) {

    if (req.url === '/auth/registration/') {
        console.log(colors.bgGreen.black(`Request method: ${req.method} time: ${req.requestTime}: ${req.url}`))
    }

    if (req.url === '/auth/login/'){
        console.log(colors.bgBlack.white(`Login: ${req.body.username}, request method: ${req.method}, Time: ${req.requestTime}: ${req.url}`))
        res.on('finish', () => {
            if (res.statusCode === 400){
                console.log(colors.bgRed.white(`${req.body.username} введен не верный пароль`))
            }
            if (res.statusCode === 401){
                console.log(colors.bgRed.white(`${req.body.username} не активировал аккаунт`))
            }
            if (res.statusCode === 403){
                console.log(colors.bgRed.white(`${req.body.username} вечный бан`))
            }
            if (res.statusCode === 404){
                console.log(colors.bgRed.white(`${req.body.username} такого пользователя нет в базе данных`))
            }
            if (res.statusCode === 410){
                console.log(colors.bgRed.white(`${req.body.username} аккаунт удален`))
            }
        });
    }
    if (req.url === '/auth/logout/'){
        console.log(colors.bgBlack.red(`${req.body.username} Disconnected.`))
    }
    if (req.url === '/api/posts/') {
        console.log(colors.bgRed.green(`Request method: ${req.method} time: ${req.requestTime}: ${req.url}`))
    }
    if (req.url === '/auth/registration/') {
        console.log(colors.bgYellow.white(`Request method: ${req.method} time: ${req.requestTime}: ${req.url}`))
    }
    next()
}
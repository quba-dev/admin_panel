import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import router from "./routers/router.js";
import authRouter from "./routers/authRouter.js";
import {requestTime, logger} from './middleware/loggerMiddleware.js'

dotenv.config()
const PORT = process.env.PORT || 5000;

const DB_URL = process.env.DB_URL

const app = express()

app.use(express.json())
// app.use(requestTime)
// app.use(logger)
app.use('/api', router)
app.use('/auth', authRouter)


async function startApp(){
    try {
        await mongoose.connect(DB_URL)
        app.listen(PORT, () => console.log(`Server working at http://127.0.0.1:${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

startApp()
import nodemailer from 'nodemailer';

class SendMail {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            service: 'gmail',
            auth:{
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS

            }

        })
    }
    async sendActivationLink (to, link){
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: `Активация аккаунта на ${process.env.API_URL}`,
            text: '',
            html:
            `
            <div><h1><a href="${link}">${link}</a></h1></div>
            `

        })
    }

    async sendResetPassword(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: `Активация аккаунта на ${process.env.API_URL}`,
            text: '',
            html:
                `
            <div><h1><a href="${link}">${link}</a></h1></div>
            `
        })
    }
}

export default new SendMail();

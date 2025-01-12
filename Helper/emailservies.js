const { error } = require('console');
const http = require('http');
const nodemailer = require('nodemailer');


const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    }

});

async function sendEmail(to,subject,text,html) {
    try{
        const info= await transport.sendMail({
            from:process.env.EMAIL,
            to,
            subject,
            text,
            html
        });
        return {success:true,messageId:info.messageId};
    }
    catch(err){
        return {success:false,error:err.message};
    }
}

module.exports={sendEmail};
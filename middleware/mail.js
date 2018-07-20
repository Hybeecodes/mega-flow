const nodemailer = require('nodemailer');
var app = require('../app');
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
      user: app.Email_User,
      pass: app.Email_Password
    }
  });



 const sendEmail = (subject, text,to)=>{
     return new Promise((resolve,reject)=>{
        const mailOptions = {
            from: 'Mega Flow',
            to: to,
            subject:subject,
            text:text
        };
        transporter.sendMail(mailOptions,(err,info)=>{
            if(err){
                reject(err);
            }else{
                resolve(info);
            }
        });
     })
    
}

module.exports = sendEmail;
const nodemailer = require('nodemailer');
const cred = {MAIL_USER:'',MAIL_PASS:''};
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
      user: cred.MAIL_USER,
      pass: cred.MAIL_PASS
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

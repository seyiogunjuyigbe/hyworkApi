import {Token} from '../models/Token';
const nodemailer = require('nodemailer');
import {MAIL_SERVICE, MAIL_SENDER, MAIL_PASS, MAIL_USER} from '../config/constants'
export const sendTokenMail = (user,req,res)=>{
    const token = user.generateVerificationToken();
    token.save(function (err,token) {
        if (err) {
            return res.status(500).json({ message: err.message })
                }
            else{
                let link=`http://${req.headers.host}/user/verify/${token.token}`;
                var transporter = nodemailer.createTransport({
                service: MAIL_SERVICE,
                auth: {
                user: MAIL_USER,
                pass: MAIL_PASS
                    },
                });  
                var mailOptions = {
                from: MAIL_SENDER,
                to: user.email,
                subject: 'Verify your email',
                text: `Hi ${user.username} \n 
                Please click on the following link ${link} to verify your account. \n\n 
                If you did not request this, please ignore this email.\n`,
            };
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                console.log(error);
                } else {
                res.status(200).json({message: 'A verification email has been sent to ' + user.email + '.'});
                }
            });                
    }
    })
}

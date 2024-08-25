const nodemailer=require('nodemailer');
const user = require('../model/user');
const { use } = require('passport');
const passport = require('passport');
require('dotenv').config()
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD // Use App Password if 2-Step Verification is enabled
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.log("user= ",transporter," pass ",transporter);


        console.error('Error verifying transporter:', error);
    } else {
        console.log('Transporter is ready to send emails.');
        // Perform additional logging if needed, but avoid logging sensitive information
    }
});
    
const sendVerficationMail=  (user,verificationToken)=>{
    const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: 'Account Verification Token',
        html: `
    <html>
    <body>
      <h2>Welcome to Campus TradeHub!</h2>
      <p>Please verify your account by clicking the link below:</p>
      <a href="${process.env.SITE_URL}/verify/${verificationToken}" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: bold; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Verify Account</a>
      <p>If you did not create an account, no further action is required.</p>
      <p>Thank you,</p>
      <p>The Team</p>
    </body>
    </html>
    `
    };
    console.log(
     `http://${process.env.SITE_URL}/verify/${verificationToken}` );
    console.log("from ",mailOptions.from," to ",mailOptions.to);
    
    transporter.sendMail(mailOptions, function (error) {
        if (error) {
            console.log('Error sending email:', error);}
            else{
            console.log('A verification email has been sent to ' + user.email + '.');
        }
    });
}
module.exports=sendVerficationMail;

const mongoose=require('mongoose');
const nodemailer=require('nodemailer');
require('dotenv').config();

const fileSchema=new mongoose.Schema({
     name:{
      type:String,
      required:true
     },

     url:{
        type:String
     },

     tags:{
        type:String
     },

     email:{
        type:String
     }
});

//post-middleware
fileSchema.post('save',async function (doc) {
        try{
            let transporter=nodemailer.createTransport({
               host:process.env.MAIL_HOST,
               auth:{
                  user:process.env.MAIL_USER,
                  pass:process.env.MAIL_PASSWORD,
               },
            });

            //send-mail
            let info=await transporter.sendMail({
               from:"Devang",
               to:doc.email,
               subject:"Testing",
               html:`<h1>Hello<h1> <p>View Here : <a href="${doc.url}">{Image}<a><p>`
            });
        }catch(err){
           return res.status(200).json({
            error:err.message,
            success:false,
            message:"Error while sending a mail"
        });
      }
})

module.exports = mongoose.model("File",fileSchema);
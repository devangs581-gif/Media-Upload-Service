
const dns = require("dns");
dns.setServers(['1.1.1.1','8.8.8.8']);

//In this block first we Initiate the express(factory function),then app is instance of express function
//we intiate file_upload because nodeJs does't able to read the file so we need to add middleware 
const express=require('express');
const app=express();
const file_upload=require('express-fileupload');


//Middle-Ware
app.use(express.json());
app.use(file_upload({
    useTempFiles:true,
    tempFileDir:'/tmp'
}));//Express can't able to read file so we use middleware 

require('dotenv').config();
const PORT=process.env.PORT || 3000;

//Intiate database and cloudinary
const { dbConnect }=require('./Config/database');
dbConnect();

const { cloudinaryConnect } =require('./Config/cloudinary');
cloudinaryConnect();

//mount the routes
const upload=require('./Routes/fileUpload');
app.use("/api/v1",upload);

//Activate the server
app.listen(PORT,()=>{
    console.log(`App is listening at ${PORT}`);
});

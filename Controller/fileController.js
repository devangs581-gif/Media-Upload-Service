const File=require('../Models/fileModel');
const cloudinary=require('cloudinary').v2;

exports.localFileUpload = async (req,res) => {
     try{
        //fetch
        const file=req.files.file
        //console.log("File => ",file);

        //Date.now() because I  want unique path for each file
        //__dirname because of current directory name
        const path=__dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`;
        //console.log("Path => ",path);


        file.mv(path,(err)=>{
            console.log(err);
        });
        
        res.status(200).json({
            success:true,
            message:"File uploaded successfully on server"
        });

     }catch(err){
        console.log(err);
        return res.status(200).json({
          sucess:false,
          message:"Error in localFileUpload controller"
        });
     }
}

function isFileSupported(type){
    const supported=["jpg","jpeg","png"];
    return supported.includes(type);
}

async function uploadCloudinary(file,folder,resourceType="auto"){
    const fileName=file.name.split('.')[0];
    
    return await cloudinary.uploader.upload(file.tempFilePath,{
        folder:folder,
        public_id:fileName,
        resource_type:resourceType
    });
}

exports.imageUpload = async(req,res) => {
    try{
       
       //Retrive
       const {name,tags,email}=req.body;

       const file=req.files.imageFile;
       
       //Validation
       const type=file.name.split('.')[1].toLowerCase();

       if(!isFileSupported(type)){
          return res.status(200).json({
             message:"This File is not supported at Cloudinary"
          });
       }
       
       //Upload on Cloudinary
       const response=await uploadCloudinary(file,"ImageProcessing");
       //console.log(response);

       //DB-Entry
       const fileData=await File.create({
        name,
        tags,
        email,
        url:response.secure_url
       });

       res.json({
          sucess:true,
          message:"File successfully uploaded on Cloudinary"
       });

    }catch(err){
        console.log(err);
        return res.status(200).json({
           error:err.message,
           sucess:false,
           message:"Error while uploading the file on cloudinary"
        });
    }
}


function isVideoInLimit (size){
     //size is in bytes we convert into MB
     const sizeMB=size/(1024 * 1024);

     console.log("size of video => ",sizeMB);

     return (sizeMB <= 5);
}

exports.videoUpload = async(req,res) =>{
     try{
        //fetch from request body
        const {name,tags,email}=req.body;
        const video=req.files.video;
        
        //Checking the size video is less than 5MB or not
        if(!isVideoInLimit(video.size)){
            return res.status(200).json({
                message:"You need to compress the video, you only can upload upto 5MB"
            });
        }

        //upload onto the cloudinary
        const response=await uploadCloudinary(video,"ImageProcessing");
        //console.log(response);

        //Create entry in DB
        const videoEntry =  await File.create({
            name,
            tags,
            email,
            url:response.secure_url
        });

        res.status(200).json({
            success:true,
            message:"Video uploaded on cloudinary successfully"
        });

     }catch(err){
        return res.status(200).json({
            error:err.message,
            success:false,
            message:"Error while uploading a video on cloudinary"
        });
     }
}

exports.reduceImageUpload = async(req,res) =>{
    try{
       
       //Retrive
       const {name,tags,email}=req.body;

       const file=req.files.imageFile;
       
       //Validation
       const type=file.name.split('.')[1].toLowerCase();

       if(!isFileSupported(type)){
          return res.status(200).json({
             message:"This File is not supported at Cloudinary"
          });
       }
       
       const fileName=file.name.split('.')[0].toLowerCase();
       //Upload on Cloudinary

       const response = await cloudinary.uploader.upload(file.tempFilePath,{
          folder:"ImageProcessing",
          public_id:fileName,
          quality:30
       });
        

       //DB-Entry
       const fileData=await File.create({
        name,
        tags,
        email,
        url:response.secure_url
       });

       res.json({
          sucess:true,
          message:"Reduce file successfully uploaded on Cloudinary"
       });

    }catch(err){
         return res.status(200).json({
            error:err.message,
            success:false,
            message:"Error while uploading a video on cloudinary"
        });
    }
}
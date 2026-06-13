const mongoose=require('mongoose');
require('dotenv').config();

exports.dbConnect = async() => {

      const URL=process.env.URL;
      mongoose.connect(URL).then(()=>{
         console.log("Database Connected Successfully");
      }).catch((err) => {
        console.log(err);
        console.log("Error while connecting to Database");
        process.exit(1);
    })
}

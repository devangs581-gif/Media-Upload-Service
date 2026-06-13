//Intiate the express and intitalize application instance
const express=require('express');
const router=express.Router();

//we retrive the controller 
const {localFileUpload,imageUpload,videoUpload,reduceImageUpload}=require('../Controller/fileController');

//we define a route
router.post('/localFileUpload',localFileUpload);
router.post('/imageUpload',imageUpload);
router.post('/videoUpload',videoUpload);
router.post('/reduce/ImageUpload',reduceImageUpload);

module.exports=router;
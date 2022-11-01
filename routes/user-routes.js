const express = require('express');
const User = require('../models/users');
const multer = require('multer');
const mongoose = require('mongoose');
const uuid = require('uuid').v4;
const fs = require('fs');
const router = express.Router();

var storage = multer.diskStorage({
   destination:function (req,file,cb){
      cb(null,'./uploads')
   },
   filename:function(req,file,cb){
      //cb(null,file.fieldname + '_' +Date.now()+'_'+file.originalname);
      cb(null,uuid()+'-'+file.originalname);
   },
})
const fileFilter = (req, file, cb) => {
   if(file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/jpg") {
       cb(null, true)
   } else {
       cb(null, false)
   }
}

var upload = multer({storage:storage,fileFilter:fileFilter,dest:'./uploads'}).single('image')


router.get('/users',async (req,res)=>{
   const users = await User.find();
   res.render('index',{title:'Home Page',users})
})


router.get('/users/add',(req,res)=>{
   res.render('add',{title:'Add Page'})
})

router.post('/add',upload,async(req,res)=>{
const user = new User({
   name:req.body.name,
   email:req.body.email,
   phone:req.body.phone,
   image:req.file.filename
});
await user.save((err)=>{
   if(err){
      res.json({message:'Error'});
   }
   else {
   res.redirect('/users')
   }
})
})

router.get('/users/details/:id',async(req, res)=>{
   //const id = mongoose.Types.ObjectId(req.params.id.trim());
   const id = req.params.id;
   const user = await User.findById({_id:id});
   //res.json(user)
   res.render('details',{title:'Details Page',user})
})

router.get('/users/edit/:id',async(req, res)=>{
   const id = req.params.id;
   const user = await User.findById({_id:id});
   //res.json(user)
   res.render('edit',{title:'Edit Page',user})
});

router.put('/users/update/:id',upload,async(req, res)=>{
   const id = req.params.id;
   let newIamge =''
   if(req.file){
      newIamge = req.file.filename
      try{
         fs.unlinkSync('./uploads/'+req.body.oldImage)
      }
      catch(err){
         console.log(err);
      }
   }
   else{
      newIamge = req.body.oldImage
   }
   
   const user = await User.findByIdAndUpdate(id,{
      name:req.body.name,
      phone:req.body.phone,
      email:req.body.email,
      image:newIamge
   ,runValidators:true,new:true})
   res.redirect('/users')
})


router.delete('/users/delete/:id', async (req, res) => {
   const id = req.params.id;
   const user = await User.findByIdAndDelete(id);
   res.redirect('/users');
})

module.exports = router;
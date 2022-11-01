const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI,(err)=>{
   if(err){
      console.log('Connection error: ' + err);
   }
   else {
      console.log('Mongodb Connceted Successfully');
   }
   })
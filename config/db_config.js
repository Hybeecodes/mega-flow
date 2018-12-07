const mongoose = require('mongoose');

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds147034.mlab.com:47034/mega-flow`).then(()=>{
    console.log('Connected to database');
}).catch((err)=>{
    console.log(err);
});

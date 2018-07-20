const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/megaflow').then(()=>{
    console.log('Connected to database');
}).catch((err)=>{
    console.log(err);
});

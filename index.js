const express=require('express');
const app=express();
const port=3000;
const path=require('path');

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.get('/home',(req,res)=>{
    res.render('index.ejs');
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
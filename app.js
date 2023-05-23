const  express =require('express')
require('dotenv').config()
const encrypt=require('mongoose-encryption')
const app=express()
const path=require('path')
const bodyParser=require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('view engine','hbs')
app.set('views',path.join(__dirname,'/views'));
const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost:27017/userDB').then(()=>{
    console.log('mongodb connected')
})
let userSchema=new mongoose.Schema({
    email:String,
    password:String
       
})

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']})

let User=mongoose.model('users',userSchema)


app.get('/',function(req,res){
  res.render('home')
})
app.get('/login',function(req,res){

    res.render('login')
})
app.get('/register',function(req,res){
    res.render('register')
  
})

  

app.get('/submit',function(req,res){
    res.render('submit')
})

// /register post 
app.post('/register',function(req,res){

    const newUser= new User({
        email:req.body.username,
        password:req.body.password
    })
    newUser.save().then((data,err)=>{
        if(err){
            console.log(err)
        }
        else{
                res.render('secrets')
        }
    })
    // User.insertMany(newUser).then((data,error)=>{
    //     if(error){
    //         console.log(error)
    //     }
    //     else{
    //         res.render('secrets')
    //     }
    // })
})

// login post

app.post('/login',function(req,res){
let username=req.body.username
let password=req.body.password
User.findOne({email:username}).then((data,error)=>{
   if(data){
    if(data.password===password){
        res.render('secrets',{username:data.email})
    }
   }
})
})




app.listen(3000,function(){
    console.log('server started')
})



// app.set("views", path.join(__dirname, "/view"));
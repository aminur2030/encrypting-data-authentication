require("dotenv").config();
const express=require("express");
const cors=require("cors");
const mongoose=require("mongoose");
const User=require("./models/user.model ");

const app=express();

const PORT=process.env.PORT || 6000;
const dbURL=process.env.MONGO_URL
mongoose
.connect(dbURL)
.then(()=>{
  console.log("Mongodb Atlas is originally cunnected.")
})
.catch((error)=>{
  console.log("Mongodb Atlas is Not cunnected")
})



app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.get("/",(req,res)=>{
res.sendFile(__dirname+"/./views/index.html")
});

app.post("/register",async(req,res)=>{  
 try {
  const newUser=new User(req.body);
  await newUser.save();
  res.status(201).json(newUser)
 } catch (error) {
  res.status(500).json(error.message)
 }
});

app.post("/login",async(req,res)=>{
  try {
    const{email,password}=req.body
    const user=await User.findOne({email:email})
    if(user && user.password===password){
      res.status(200).json({status:"valid user"})
    } else{
      res.status(404).json({status:" Not valid user"})
      
    }
  } catch (error) {
    res.status(500).json(error.message)
  } 
});

//route not found error
app.use((req,res,next)=>{
  res.status(404).json({
    message:"route not found."
  })
});

//handling server error
app.use((err,req,res,next)=>{
  res.status(500).json({
    message:"Something broke."
  })
});


app.listen(PORT,()=>{
  console.log(`Server is running at http://localhost:${PORT}`);
})
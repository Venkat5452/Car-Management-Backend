const express=require('express')
const cors=require('cors')
const mongoose=require('mongoose')
require('dotenv').config();
const nodemailer=require('nodemailer');
const bcrypt=require('bcryptjs');


//Initializing server
const server=express();
server.use(cors())
server.use(express.json({limit: '50mb'}));
server.use(express.urlencoded({limit: '50mb'}));

//connection to Database
mongoose.connect(process.env.MYURL).then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
})

//Schema
const otpSchema=new mongoose.Schema({
    otp:String,
    email:String,
});
const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    hpassword:String
})
const carSchema = new mongoose.Schema({
    userId: { type: String, required: true },  // Email of the user
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [String],  // Array of tags
    images: {
        type: [String],  // Array of image URLs
        validate: [arrayLimit, '{PATH} exceeds the limit of 10 images']
    }
}, { timestamps: true });

// Custom validation function to limit the number of images
function arrayLimit(val) {
  return val.length <= 10;  // Allow a maximum of 10 images
}


//models
const otpdata=new mongoose.model('otpdata',otpSchema);
const User=new mongoose.model("users",userSchema);
const Car = mongoose.model("cars", carSchema);

//Login End Point
server.post("/login",async(req,res)=>{
    const  {email , password}=req.body;
    const hpassword=await bcrypt.hash(password,6);
    User.findOne({email:email}).then((user)=>{
        if(user && user.hpassword) {
          bcrypt.compare(password,user.hpassword).then(result => {
            if(result===true) {
              res.send({message : "Log in successFull",user:user});
            }
            else {
              res.send({message:"Incorrect Password"});
            }
         })
         .catch(err => {
             console.log(err)
         })
        }
        else {
            res.send({message:"User not Found"})
        }
    }).catch((err) => console.log(err));
  })

//endpoint to Signup
server.post("/signup",async(req,res)=>{
    const  {name , email, password,otp}=req.body;
    const hpassword=await bcrypt.hash(password,6)
    otpdata.findOne({email:email}).then((user)=> {
     if(user.otp!==otp) {
        res.send("Invalid OTP");
     }
     else {
         const user=new User({
             name,
             email,
             hpassword,
         })
         user.save().then(res.send("SuccessFully Registered"));
     }})
  })  

server.post("/verify-otp",async(req,res)=>{
  const {email,password,otp}=req.body;
  otpdata.findOne({email:email}).then((user)=>{
    if(user.otp!==otp) {
      res.send("Invalid OTP");
   }
   else {
       res.send("OTP Verified");
   }})
})

server.post("/updatepassword",async(req,res)=>{
  const {email,password}=req.body;
  const hpassword=await bcrypt.hash(password,6);
  User.findOne({email:email}).then((user)=>{
    if(user) {
      user.hpassword=hpassword;
      user.save().then(res.send("Password Updated"));
   }
   else {
       res.send("User Not Found");
   }})
})


//Endpoint to Send OTP
server.post("/makemail",async(req, res) => {
    const {email,name}=req.body;
    User.findOne({email:email}).then((user)=> {
        if(user) {
            res.send("Email Already Registered");
        }
        else {
        try{
        const otp=Math.floor(100000 + Math.random()*900000);
        const transport=nodemailer.createTransport({
            service:'gmail',
            host: 'smtp.gmail.com',
            port:'587',
            auth:{
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            },
            secureConnection: 'true',
            tls: {
                ciphers: 'SSLv3',
                rejectUnauthorized: false
            }
        });
        let matter = `
    <h2>Hello ${name},</h2>
    <p>Welcome to the Car Management Application! We're thrilled to have you onboard.</p>
    <p><strong>Your One-Time Password (OTP) is: <span style="color: #007bff; font-size: 1.2em;">${otp}</span></strong></p>
    <p>Please use this OTP to complete your signup and start managing your car collection. Remember, for your security, do not share this OTP with anyone.</p>
    <br>
    <p>Happy Driving!</p>
    <p>Best Regards,<br>Car Management Application Team</p>
`;
        const mailOptions ={
         from:process.env.EMAIL,
         to :email,
         subject:"Welcome to Car Management App! Here’s Your OTP to Get Started",
         html:matter
        }
        otpdata.findOne({email:email}).then((user)=>{
           if(user) {
             user.otp=otp;
             user.save();
           }
           else {
            const newuser= new otpdata({
                email,
                otp
            })
            newuser.save();
           }
        })
        transport.sendMail(mailOptions,(err,info)=>{
         if(err) {
            res.send("Error in sending Mail");
         }
         else {
            res.send("OTP SENT Succesfully");
         }
        })
     }catch(err) {
       res.send(err);
     }
    }
})
})

server.post("/send-otp",(req,res)=>{
  const {email}=req.body;
  User.findOne({email:email}).then((user)=>{
    if(user) {
      const name=user.name;
      try{
        const otp=Math.floor(100000 + Math.random()*900000);
        const transport=nodemailer.createTransport({
            service:'gmail',
            host: 'smtp.gmail.com',
            port:'587',
            auth:{
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            },
            secureConnection: 'true',
            tls: {
                ciphers: 'SSLv3',
                rejectUnauthorized: false
            }
        });
        let matter = `
        <h2>Hello ${name},</h2>
        <p>We received a request to reset your password for your Car Management Application account.</p>
        <p><strong>Your One-Time Password (OTP) for password reset is: <span style="color: #007bff; font-size: 1.2em;">${otp}</span></strong></p>
        <p>Please enter this OTP on the password reset page to proceed. For your security, do not share this OTP with anyone.</p>
        <br>
        <p>If you did not request a password reset, please ignore this email or contact our support team.</p>
        <p>Best Regards,<br>Car Management Application Team</p>
    `;    
        const mailOptions ={
         from:process.env.EMAIL,
         to :email,
         subject:"Password Reset OTP for Your Car Management Application Account",
         html:matter
        }
        otpdata.findOne({email:email}).then((user)=>{
           if(user) {
             user.otp=otp;
             user.save();
           }
           else {
            const newuser= new otpdata({
                email,
                otp
            })
            newuser.save();
           }
        })
        transport.sendMail(mailOptions,(err,info)=>{
         if(err) {
            res.send("Error in sending Mail");
         }
         else {
            res.send("OTP SENT Succesfully");
         }
        })
     }catch(err) {
       res.send(err);
     }
    }
    else {
      res.send("No user Found");
    }
  })
})
server.post("/addcar", async (req, res) => {
    try {
        const { userId, title, description, tags, images } = req.body;
        if (!userId || !title || !description || !images || images.length > 10) {
          return res.status(400).json({ message: 'Invalid data' });
        }
        const newCar = new Car({
          userId: userId,  // This will be the email of the user
          title,
          description,
          tags,
          images,
        });
    
        // Save the car to the database
        await newCar.save();
    
        res.status(201).json({ message: 'Car added successfully', car: newCar });
      } catch (error) {
        res.status(500).json({ message: 'Server error', error });
      }
});
server.get("/getallcars",async(req,res)=>{
    try {
        const cars = await Car.find();
        res.json(cars);
    }catch (err) {
        res.status(500).json({ message: err.message });
    }
})

server.get('/api/car/:id', async (req, res) => {
    try {
      const car = await Car.findById(req.params.id);
      if (!car) return res.status(404).json({ message: 'Car not found' });
      res.json(car);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

server.delete('/deletecar/:id',async (req, res) => {
    const { id } = req.params; // Extract the car ID from the URL
    try {
      await Car.deleteOne({_id:id});
      res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
      console.error('Error deleting car:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

server.put('/update-car/:id' , async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, images, tags } = req.body;
      
      // Find the car by its ID
      const car = await Car.findById(id);
      if (!car) {
        return res.status(404).json({ message: 'Car not found' });
      }
  
      // Update the car details
      car.title = title || car.title;
      car.description = description || car.description;
      car.images = images || car.images;
      car.tags = tags || car.tags;
      const updatedCar = await car.save();
      res.status(200).json(updatedCar);
    } catch (error) {
      console.error('Error updating car:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
//port assigning
server.listen((9040),()=>{
    console.log("Server Running in port 9040");
})
const express = require('express');
const bodyParser = require('body-Parser');
const path = require('path');
const user=require('./Models/userdb');
const validator = require("email-validator");

const mongoose=require('mongoose');
const CORS=require('cors');
// const userInfo=require('./userInfo');

let app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));

app.get('/',(req , res)=>{
    res.sendFile(__dirname + "/public/index.html");
});

//Setup database entities
const DB_LINK=`mongodb+srv://Alankar_99:Yogapassword123@user.sz8wtcx.mongodb.net/test`

//Middleware
app.use(CORS())
app.use(express.json())

//Setup database
mongoose.connect(DB_LINK,{useUnifiedTopology:true,useNewUrlParser:true})
.then(()=>{
    console.log('Database connection successfull.')
}).catch((err)=>{
    console.log(err)
})

function completePayment(upi)
{
    return true;
}

app.post('/' , (req,res)=>{
    let name = req.body.name;
    let email = req.body.email;
    let age = req.body.age;
    let date = req.body.date;
    let batch = req.body.batch;
    let upi = req.body.upi;

    
    if(!name||!age||!email||!date||!batch||!upi||name==""||email==""||date=="NaN/undefinedundefined/"){
        
        res.send("Please fill all the fields");

        return false;
    }
    else
    {
        let today = new Date();
        let day = String(today.getDate()).padStart(2, '0');
        let month = String(today.getMonth() + 1).padStart(2, '0');
        let year = today.getFullYear();

        const currentDate=month+'/'+day+'/'+year

       
        const isEmailValid=validator.validate(email)
       
        if(date<currentDate){
           
            res.send("Joining date should be of today or later");
            return false;
        }
        if(isEmailValid==false){
           
            res.send("Invalid Email");
            return false;
        }
        
        if(age<18||age>65){
           
            res.send("Your age should be between 18 to 65");
            return false ;
        }

        user.findOne({email:email})
        .then((savedUser)=>{
              
              if(savedUser){
                  
                    const startDate=String(savedUser.date)
                    
                    const Time_difference=Number(new Date(currentDate).getTime())-Number(new Date(startDate).getTime())

                    const Days_difference=Time_difference/(1000* 60 * 60 * 24)
                    if(Days_difference>30){
                        user.updateOne({email:email},{$set:{date:currentDate}})
                        .then((updatedUser)=>{
                           
                             return true;
                        }).catch((err)=>{
                                console.log(`Error in updation of new start date is ${err}`)
                                return false;
                        })
                    }
                    
                    
                    else{
                      
                        res.send("You have already paid for this month");
                        return false;
                    }
              }
              
              else{

                    const userData=new user({
                        "name":name,
                        "age":age,
                        "email":email,
                        "date":date,
                        "plan":"active",
                        "batch":batch,
        
                    })
                    
                   
                    userData.save()
                    .then((data)=>{
                        completePayment(upi);
                        
                        res.send("Successful");
                        return true ;
                    }).catch((err)=>{
                        
                        res.send("1. Something is wrong, please try again later");
                        console.log(err);
                    })
              }
        }).catch((err)=>{
                res.send("2. Something is wrong, please try again later");
        })
    }



    // if(userInfo.addInfo(name,age,email,date,batch,upi))
    // {
    //     res.send(
    //         `Name: ${name}
    //         Email: ${email}
    //         age: ${age}
    //         date: ${date}
    //         batch: ${batch}`)
    // }
    // else
    // {
    //     res.sendFile(__dirname + '/public/index.html');
    // }


});

app.listen(3000, ()=>
{
    console.log('listening on port 3000');
})
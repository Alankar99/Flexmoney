const user=require('./Models/userdb');
const validator = require("email-validator");
// const popup = require('popups');

function completePayment(upi)
{
    return true;
}

function addInfo(name,age, email, date, batch,upi)
{
    const msg = document.querySelector('#msg');
    if(!name||!age||!email||!date||!batch||!upi||name==""||email==""||date=="NaN/undefinedundefined/"){
        // res.status(400).json({'message':'Information insufficient',"message_id":"0"})
        msg.innerHTML = "Please fill all the fields";

        return false;
    }
    else
    {
        let today = new Date();
        let day = String(today.getDate()).padStart(2, '0');
        let month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let year = today.getFullYear();

        const currentDate=month+'/'+day+'/'+year //month//day//year format

        //Perform validation check for age,email & date
        const isEmailValid=validator.validate(email)
        //You can start a batch from today's date only
        if(date<currentDate){
            // res.status(401).json({"message":"Joining date should be of today or later","message_id":"InStDa"})
            msg.innerHTML ="Joining date should be of today or later";
            return false;
        }
        if(isEmailValid==false){
            // res.status(401).json({"message":"Invalid email address","message_id":"InEm"})
            msg.innerHTML ="Invalid Email";
            
            return false;
        }
        //If age is invalid
        if(age<18||age>65){
            // res.status(401).json({"message":"Age must be between 18 & 65","message_id":"InAg"})
            msg.innerHTML ="Your age should be between 18 to 65";
            return false ;
        }

        user.findOne({email:email})
        .then((savedUser)=>{
              //If user already have an active plan 
              if(savedUser){
                    //Get total days between start date and current date
                    const startDate=String(savedUser.date)
                    
                    const Time_difference=Number(new Date(currentDate).getTime())-Number(new Date(startDate).getTime())

                    const Days_difference=Time_difference/(1000* 60 * 60 * 24)
                    
                    //If one month is complete then update current date of existing user 
                    if(Days_difference>30){
                        user.updateOne({email:email},{$set:{date:currentDate}})
                        .then((updatedUser)=>{
                            //  res.status(200).json({"message":"successfull","data":updatedUser,"message_id":"1"})
                             return true;
                        }).catch((err)=>{
                                console.log(`Error in updation of new start date is ${err}`)
                                return false;
                        })
                    }
                    
                    //Else if one month is not complete
                    else{
                        // res.status(403).json({"message":"User exist and plan is active","message_id":"2"})
                        msg.innerHTML ="You have already paid for this month";
                        return false;
                    }
              }
              //Else store information of user
              else{
                    //Make a new document with the user information
                    const userData=new user({
                        "name":name,
                        "age":age,
                        "email":email,
                        "date":date,
                        "plan":"active",
                        "batch":batch
                    })
                    
                    //Save the document to the database
                    userData.save()
                    .then((data)=>{
                        completePayment(upi);
                        //If user stored successfully
                        // res.status(401).json({"message":"successfull","data":data,"message_id":"3"})
                        msg.innerHTML ="Successful";
                        return true ;
                    }).catch((err)=>{
                        //If any error comes in storing 
                        msg.innerHTML = `Error in inserting new user is`;
                        window.alert("Something is wrong, please try again later");
                    })
              }
        }).catch((err)=>{
                msg.innerHTML =`Error in finding existing user is`;
                popup.alert("Something is wrong, please try again later");
        })
    }

}
module.exports={addInfo};
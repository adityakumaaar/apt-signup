require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');
const mongoose = require('mongoose');

const app = express();

app.use(express.static(path.join(__dirname + '/public')));
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGOURI,{ useNewUrlParser: true ,useUnifiedTopology: true})


app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname + '/index.html'));
})

const Item = require('./models/items.js')
const Sub = require('./models/sub.js')

app.post("/", async (req,res)=>{

    const userName = req.body.name;
    const userEmail = req.body.email;
    const userTargetPrice = req.body.price;
    var productURL = req.body.url;

    //clean product URL

    productURL = productURL.split("/");
    const idx = productURL.indexOf("dp")+2;
    productURL = productURL.slice(0,idx);
    productURL = productURL.join("/");

    console.log(userName);
    console.log(userEmail);
    console.log(userTargetPrice);
    console.log(productURL);
       
        //find a document with that product url
        
        try {
            const foundItem = await Item.find({ url: productURL });
            
            //no such product exists
            if(foundItem.length==0){
                
                //creating a new object to be saved in db
                const item = new Item({
                    url : productURL,
                    price : [0],
                    subscription: [{
                        email: userEmail,
                        name: userName,
                        targetPrice: userTargetPrice
                    }]
                })

                savedItem = await item.save();
                console.log(savedItem);
            }

            //that product exists in db and now we will just add the email id and target price to subscription list
            else{
                // console.log('Else condition');
                
                const newUser = new Sub ({
                    email : userEmail,
                    name : userName,
                    targetPrice : userTargetPrice
                })

                const updateSubList = await Item.updateOne(
                    {_id: foundItem[0]._id}, 
                    { $push: {subscription: newUser} }
                ).exec()

                console.log(updateSubList);

            }
            console.log(foundItem);
        } catch (err) {
            res.send("The provided value wasn't correct, please try again!");
            console.log(err);
        }
    res.send("Thank You for Registering!");
})


app.listen(process.env.PORT || 5000,()=>{
    console.log(`Server started`);
})
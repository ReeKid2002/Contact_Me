const express = require("express");
const bodyParser = require('body-parser');
const request = require("request");
const { json } = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));

const PORT = process.env.PORT | 5000;

app.get('/',function(req,res){
    res.sendFile(__dirname+"/public/template/")
});

app.post('/',function(req,res){
    var fname = req.body.fname;
    var lname = req.body.lname;
    var lname = req.body.lname;
    var email = req.body.email;
    var comment = req.body.comment;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname,
                    MSG: comment
                }
            }
        ]
    };
    var jsonData = JSON.stringify(data);
    const object = {
        url: "https://us1.api.mailchimp.com/3.0/lists/<List ID from Mailchimp>",
        method: "POST",
        headers: {
            "Authorization": "authorization <API Key From Mailchimp>"
        },
        body: jsonData
    };
    request(object,function(error,response,body){
        if(error){
            res.sendFile(__dirname+"/public/template/failure.html");
        }
        else{
            if(response.statusCode==200){
                res.sendFile(__dirname + "/public/template/success.html");
            }
            else{
                res.sendFile(__dirname + "/public/template/failure.html");
            }
        }
    });
});
app.post('/failure',function(req,res){
    res.redirect('/');
}); 
app.listen(PORT,function(){
    console.log(`Server Started at Port: ${PORT}`);
});

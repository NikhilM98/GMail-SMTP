var nodemailer = require('nodemailer');
var csvjson = require("csvjson");
var fs = require('fs');
require('dotenv').config()

var options = {
    delimiter : ',' ,
    quote     : '"'
};

var file_data = fs.readFileSync('./list.csv', { encoding : 'utf8'});

var result = csvjson.toObject(file_data, options);

if (process.env.clientId && process.env.clientSecret && process.env.refreshToken && process.env.email) {
    var clientId = process.env.clientId;
    var clientSecret = process.env.clientSecret;
    var refreshToken = process.env.refreshToken;

    var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        auth: {
            type: "OAuth2",
            user: process.env.email,
            clientId: clientId,
            clientSecret: clientSecret,
            refreshToken: refreshToken
        }
    });

    var thisMailer = function(emails, index) {
        if (emails[index] && emails[index].email) {
            console.log('Sending to ' + emails[index].email + ' ID: ' + index);
            var mailOptions = {
                from: process.env.email,
                to: emails[index].email,
                subject: "Subject",
                html: "<b>Testing</b>"
            };
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    // console.log(error);
                    console.log('Fail');
                    thisMailer(emails, index + 1);
                } else {
                    // console.log(info);
                    console.log('Success');
                    thisMailer(emails, index + 1);
                }
            });
        } else {
            console.log('Invalid Email');
            thisMailer(emails, index + 1);
        }
    };

    if (result.length > 0) {
        console.log(result.length + ' Emails Found');
        thisMailer(result, 0);
    } else {
        console.log('CSV Not Found');
    }
} else {
    console.log('Credentials Missing');
}

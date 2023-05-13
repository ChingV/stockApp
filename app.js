const express = require('express');
const {engine} = require('express-handlebars');
const request = require('request')
const bodyParser= require('body-parser')
//const { get } = require('http');
const path = require('path');
//path returns the path app.use it is looking for the public folder
const app = express();

const PORT = process.env.PORT || 5500;

//call the API
function call_api(finishedAPI, ticker='aapl'){
    request('https://cloud.iexapis.com/stable/stock/'+ticker+'/quote?token=sk_d438a1d5e89441329a6d7f8c4e0cd4a4', {json:true},(err,res,body)=>{
        if(err){return console.log(err);}
        if(res.statusCode === 200){finishedAPI(body)}
    });
}
//secret token = sk_d438a1d5e89441329a6d7f8c4e0cd4a4


//set middleware
app.engine('handlebars',engine())
app.set('view engine', 'handlebars')
app.set('views','./views')

//sets middleware for body parser
app.use(bodyParser.urlencoded({extended:false}))

app.get('/',function(req,res){
    call_api(function(doneAPI){
        res.render('home', {
            stock: doneAPI
        })
    })
})


//crate post route
app.post('/',function(req,res){
    call_api(function(doneAPI){
        //grabbing name attribute
        posted_stuff=req.body.stock_ticker
        res.render('home', {
            stock: doneAPI
        })
    },req.body.stock_ticker)//adding stock_ticker as a parameter
})

app.get('/info',function(req,res){
    res.render('info')
})

app.post('/info',function(req,res){
    call_api(function(doneAPI){
        //grabbing name attribute
        posted_stuff=req.body.stock_ticker
        res.render('info', {
            stock: doneAPI
        })
    },req.body.stock_ticker)//adding stock_ticker as a parameter
})

//sets a static path
app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => 
console.log('listening on ' + PORT)) 
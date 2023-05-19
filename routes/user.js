let express = require('express');
const userHelpers = require('../helpers/userHelpers');
let router = express.Router();
let nocache = require('nocache')

/* GET home page. */
router.get('/home',nocache(), function(req, res, next) {
    user=req.session.user
    if(user){
        let images=[
            {
                img:"/images/background-removed.png"
            },
            {
                img:"/images/second-image.png"
            },
            {
                img:"/images/Tthird-image.jpg"
            }
        ]
    res.render('index', {user,images});
    }
    else{
        res.redirect('/login')
    }
});

router.get('/',(req,res)=>{
    res.render('home')
})

router.get('/login',nocache(),(req,res)=>{
    let user=req.session.user
    if(user){
    res.redirect('/home')
    }else{
        error=req.session.err
        logdata=req.session.logdata
        res.render('users/user-login',{error,logdata})
        req.session.err=null
        req.session.logdata=null
    }
    
    })

router.get('/signup',nocache(),(req,res)=>{
    if(req.session.user){
        res.redirect('/home')
    }
    else{
    signerr=req.session.signerr
    signdata=req.session.signdata
    res.render('users/user-signup',{signerr,signdata})
    req.session.signerr=null
    req.session.signdata=null
    }
})

router.post('/signup',(req,res)=>{
    userHelpers.createUser(req.body).then((data)=>{
        if(data.status){
            req.session.user=req.body
            res.redirect('/home')
        }
        else{
            req.session.signdata=req.body
            req.session.signerr=data.msg
            res.redirect('/signup')
        }
    })
})

router.post('/login',nocache(),(req,res)=>{
    console.log(req.body);
    userHelpers.loginUser(req.body).then((response)=>{
        if(response.status){
            console.log("Login success")
            req.session.user=response.user
            res.redirect('/home')
        }
        else{
            req.session.logdata=req.body
            console.log(response.msg)
            req.session.err=response.msg
            res.redirect('/login')
        }
    })
})

router.get('/logout',(req,res)=>{
    req.session.user = null
    res.redirect('/login')
    })

module.exports = router;

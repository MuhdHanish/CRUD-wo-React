
let express = require('express');
let router = express.Router();
let nocache = require('nocache');
let adminHelpers = require('../helpers/adminHelpers')



router.get('/',nocache(),(req,res)=>{
  let admin = req.session.admin
  if(admin){
    adminHelpers.getUsers().then((users)=>{
        res.render('admin/user-list',{admin,users})
    })
  }
  else{
    res.redirect('/admin/login')
  }
});

router.get('/login',nocache(),(req,res)=>{
  if(req.session.admin){
    res.redirect('/')
  }
  else{
    let admerr=req.session.admerr
    admdata=req.session.admdata
    res.render('admin/admin-login',{admerr,admdata})
    req.session.admerr = null
    req.session.admdata=null
  }
})

router.post('/login',(req,res)=>{
  adminHelpers.adminLogin(req.body).then((response)=>{
    if(response.status){
      req.session.admin = response.admin
      res.redirect('/admin')
    }
    else{
      req.session.admerr=response.addmsg
      req.session.admdata=req.body
      res.redirect('/admin/login')
    }
  })
})

router.get('/logout',(req,res)=>{
  req.session.admin = null
  res.redirect('/admin/login')
})

router.get('/delete-user/:id',(req,res)=>{
  console.log(req.params.id)
    adminHelpers.deleteUser(req.params.id).then((response)=>{
          console.log(response)
    })
    res.redirect('/admin')
})

router.get("/edit-user/:id",(req,res)=>{
  if(req.session.admin){
  adminHelpers.editUser(req.params.id).then((response)=>{
    console.log(response)
    res.render('admin/user-edit',{response})
  })
}else{
  res.redirect('/admin/login')
}
})

router.post('/edit-user/:id',(req,res)=>{
  if(req.session.admin){
      adminHelpers.updateUser(req.params.id,req.body).then(()=>{
          res.redirect('/admin')
      })
    }else{
      res.redirect('/admin/login')
    }
})

router.get('/add-user',nocache(),(req,res)=>{
  if(req.session.admin){
  addsererr=req.session.addingerr
  adddata=req.session.adddata
  res.render('admin/user-add',{addsererr,adddata})
  req.session.addingerr = null
  }
  else{
      res.redirect('/admin/login')
  }
})

router.post('/add-user',(req,res)=>{
    adminHelpers.createUser(req.body).then((data)=>{
      if(data.msg){
      req.session.addingerr=data.msg
      req.session.adddata=req.body
      res.redirect('/admin/add-user')
      }
      else{
        res.redirect('/admin')
      }
    })
})

module.exports = router;

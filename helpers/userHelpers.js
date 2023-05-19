
let db=require('../config/connection')
let bcrypt=require('bcrypt')
module.exports={
  createUser:(userData)=>{
    let signupmsg={}
    console.log(userData)
    return new Promise(async(resolve,reject)=>{
      let user=await db.get().collection("user").findOne({username:userData.username})
      console.log(user);
      if(userData.name==""){
        signupmsg.msg="Name is empty"
        signupmsg.status=false
        resolve(signupmsg)
      }
      else if(userData.username==""){
        signupmsg.msg="User Name is empty"
        signupmsg.status=false
        resolve(signupmsg)
      }
      else if(userData.password==""){
        signupmsg.msg="Password is empty"
        signupmsg.status=false
        resolve(signupmsg)
      }
      else if(userData.password.length<8){
        signupmsg.msg="Password should contain 8 characters"
        signupmsg.status=false
        resolve(signupmsg)
      }
      else if(user){
        signupmsg.msg="This is username already exist"
        signupmsg.status=false
        resolve(signupmsg)
      }
      else{
        userData.password=await bcrypt.hash(userData.password,10)
      db.get().collection("user").insertOne(userData).then((data)=>{
        signupmsg.id=data.insertedId
        signupmsg.status=true
        resolve(signupmsg)
      })
    }
    })
  },
  loginUser:(userData)=>{
    let response={}
    return new Promise(async(resolve,reject)=>{
      let user=await db.get().collection("user").findOne({username:userData.username})
      if(user){
        bcrypt.compare(userData.password,user.password).then((status)=>{
          if(status){
            response.user=user
            response.status=true
            resolve(response)
          }else{
            response.msg="Invalid Password"
            resolve(response)
          }
        })
      }else{
        response.msg="Invalid Username"
        resolve(response)
      }
    })
  }
}
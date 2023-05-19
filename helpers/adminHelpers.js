const {response} = require('express')
let objectId = require('mongodb').ObjectId
let db = require('../config/connection')
let bcrypt=require('bcrypt')

module.exports={
        adminLogin:((adminData)=>{
        let response={}
        return new Promise(async(resolve,reject)=>{
          let admin = await db.get().collection("admin").findOne({username:adminData.adminname})
          if(admin){
            if(admin.password == adminData.adminpassword){
              response.admin = admin
              response.status = true
              resolve(response)
            }
            else{
              response.addmsg = "invalid password"
              resolve(response)
            }
          }
          else{
            response.addmsg = "ivalid username"
            resolve(response)
          }
          console.log(admin)
        })
        }),
        getUsers:()=>{
        return new Promise(async(resolve,reject)=>{
          let users=await db.get().collection("user").find().toArray()
          resolve(users)
        })
        },
        deleteUser:(userId)=>{
          return new Promise(async(resolve,reject)=>{
            db.get().collection("user").deleteOne({_id:new objectId(userId)}).then((response)=>{
              resolve(response)
            })
          })
        },
        editUser:((userId)=>{
        return new Promise(async(resolve,reject)=>{
          user = await db.get().collection("user").findOne({_id:new objectId(userId)})
          resolve(user)
        })
        }),
        updateUser:(userId,userData)=>{
        return new Promise(async(resolve,reject)=>{
          db.get().collection("user").updateOne({_id:new objectId(userId)},{
            $set:{
              username:userData.editusername,
              name:userData.editname
            }
          }).then((response)=>{
            resolve()
          })
        })
      },
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
            userData.password= await bcrypt.hash(userData.password,10)
          db.get().collection("user").insertOne(userData).then((data)=>{
            signupmsg.id=data.insertedId
            signupmsg.status=true
            resolve(signupmsg)
          })
        }
        })
      }
}
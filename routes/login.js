
const express = require('express')
const router = express.Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const bcrypt = require('bcrypt');
const adminModel = require("../models").Admin
const {redirectHome,redirectLogin }= require("../middleware/redirect") 

router.route("/admin/login").get(redirectHome,(req,res,next)=>{
  res.render("login")
}).post((req,res,next)=>{
  adminModel.findOne({
    where:{
      email:{
        [Op.eq]:req.body.email
      }
    }
  }).then((user)=>{
    if(user){
        bcrypt.compare(req.body.password,user.password,(error,result)=>{
          if(result){
            req.session.isLoggedIn = true;
            req.session.userId = user.id;
            console.log(req.session)
            res.redirect("/admin")
          }else{
            req.flash("error","Invalid Login details.")
            res.redirect("/admin/login")
          }
        })
    }else{
      req.flash("error","User not found")
      res.redirect("/admin/login")
    }
  })
})


router.route("/admin/register").get((req,res,next)=>{
  
    adminModel.create({
      name:"gaurav shinde",
      email:"gaurav.shinde592@gmail.com",
      password:bcrypt.hashSync("iamwinner",10)
    }).then((data)=>{
      if(data){
        res.json({
          status:1,
          message:"admin created!"
        })
      }else{
        res.json({
          status:0,
          message:"failed to create admin!"
        })
      }
    })
  
}).post((req,res,next)=>{

  adminModel.findOne({
    where:{
      email:{
        [Op.eq]:req.body.email
      }
    }
  }).then((user)=>{
    if(user){
      //user exist already
      req.flash("error","Email already exists.")
    }else{
      adminModel.create({
        name:req.body.name,
        email:req.body.email,
        password:bcrypt.hashSync(req.body.password,10)
      }).then((data)=>{
        if(data){
          res.json({
            status:1,
            message:"admin created!"
          })
        }else{
          res.json({
            status:0,
            message:"failed to create admin!"
          })
        }
      })
    }
  })
  
})

router.get("/admin/logout",redirectLogin,(req,res,next)=>{
  req.session.destroy((error)=>{
    if(error){
      res.redirect("/admin")
    }else{
      res.redirect("/admin/login")
    }
  })
})

module.exports = router;













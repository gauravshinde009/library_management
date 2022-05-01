
const express = require('express')
const router = express.Router();

const Sequelize = require('sequelize');

const Op = Sequelize.Op;

const userModel = require("../models").User

router.route("/admin/add-user").get((req,res,next)=>{
  res.render("admin/add-user",{
    title:"Add User"
  })
}).post((req,res,next)=>{

  //email address check
  userModel.findOne({
    where:{
      email:{
        [Op.eq]:req.body.email
      }
    }
  }).then((data)=>{
    if(data){
      //email already exists
      req.flash("error","Email address already exists.")
          res.redirect("/admin/add-user",{
            title:"Add User"
          })
    }else{
      userModel.create({
        name:req.body.name,
        email:req.body.email,
        mobile:req.body.mobile,
        gender:req.body.dd_gender,
        address:req.body.address,
        status:req.body.status
      }).then((data)=>{
        if(data){
          req.flash("success","User Saved successfully")
          res.redirect("/admin/add-user",{
            title:"Add User"
          })
        }else{
          req.flash("error","failed to save user.")
          res.redirect("/admin/add-user",{
            title:"Add User"
          })
        }
      })
    }
  })

  
})

router.get("/admin/list-user",async(req,res,next)=>{

  const user_data = await userModel.findAll();

  res.render("admin/list-user",{
    users:user_data,
    title:"List Users"
  })
})


router.route("/admin/edit-user/:userId").get(async(req,res,next)=>{

  const user_data = await userModel.findOne({
    where:{
      id:{
        [Op.eq]:req.params.userId
      }
    }
  })

  res.render("admin/edit-user",{
    user:user_data,
    title:"Edit User"
  })
}).post((req,res,next)=>{
  userModel.update({
    name:req.body.name,
    mobile:req.body.mobile,
    gender:req.body.dd_gender,
    address:req.body.address,
    status:req.body.status
  },{
    where:{
      id:{
        [Op.eq]:req.params.userId
      }
    }
  }).then((data)=>{
    if(data){
      req.flash("success","User has been updated successfully")
      res.redirect("/admin/edit-user/"+req.params.userId,{
        title:"Edit User"
      })
    }else{
      req.flash("error","Failed to update user")
      res.redirect("/admin/edit-user/"+req.params.userId,{
        title:"Edit User"
      })
    }
  })
})


router.post("/admin/delete-user",(req,res,next)=>{
  userModel.destroy({
    where:{
      id:{
        [Op.eq]:req.body.user_id
      }
    }
  }).then((data)=>{
    if(data){
      req.flash("success","User deleted successfully")
    }else{
      req.flash("error","Failed to delete user")
    }

    res.redirect("/admin/list-user",{
      title:"List User"
    })
  })
})

module.exports = router;














const express = require('express')
const router = express.Router();

const Sequelize = require("sequelize")
const Op = Sequelize.Op;

const optionModel = require("../models").Option 
const daysModel = require("../models").DaySetting

router.route("/admin/currency-settings").get(async(req,res,next)=>{

  const curreny_data = await optionModel.findOne({
    where:{
      option_name:{
        [Op.eq]:"active_currency"
      }
    }
  })
  res.render("admin/currency-settings",{
    currency_data:curreny_data,
    title:"Currency Settings"
  })

}).post((req,res,next)=>{
  console.log("---------------------")
  console.log(req.body)
  optionModel.findOne({
    where:{
      option_name:{
        [Op.eq]:"active_currency"
      }
    }
  }).then((data)=>{
    if(data){
      //already we have that key
      optionModel.update({
        option_value:req.body.dd_currency
      },{
        where:{
          option_name:{
            [Op.eq]:"active_currency"
          }
        }
      }).then((data)=>{
        if(data){
          req.flash("success","Currency settings updated.")
        }else{
          req.flash("error","Failed to update currency.")
        }
        res.redirect("/admin/currency-settings",{
          title:"Currency Settings"
        })
      })
    }else{
      //we dont have
      optionModel.create({
        option_name:"active_currency",
        option_value:req.body.dd_currency
      }).then((data)=>{
        if(data){
          req.flash("success","Currency settings saved.")
        }else{
          req.flash("error","Failed to save currency.")
        }
        res.redirect("/admin/currency-settings",{
          title:"Currency Settings"
        })

      })
    }
  })
})

router.route("/admin/day-settings").get(async(req,res,next)=>{
  
  var days = await daysModel.findAll();

  res.render("admin/day-settings",{
    days:days,
    title:"Day Settings"
  })

}).post((req,res,next)=>{
  daysModel.findOne({
    where:{
      total_days:{
        [Op.eq]:req.body.day_count
      }
    }
  }).then((data)=>{
    if(data){
      req.flash("error","Day already exist")
      res.redirect("/admin/day-settings",{
        title:"Day Settings"
      })
    }else{
      daysModel.create({
        total_days:req.body.day_count
      }).then((status)=>{
        if(status){
          //data has been saved
          req.flash("success","Data has been saved.")
        }else{
          req.flash("error","Failed to save data.")
        }
        res.redirect("/admin/day-settings",{
          title:"Day Settings"
        })
      })
    }
  })
})


router.post("/admin/delete-days/:dayId",(req,res,next)=>{
  daysModel.destroy({
    where:{
      id:{
        [Op.eq]:req.params.dayId
      }
    }
  }).then((data)=>{
    if(data){
      //data has been deleted
      req.flash("success","Day has been deleted.")
    }else{
      //some error
      req.flash("error","Failed to delete data.")
    }
    res.redirect("/admin/day-settings",{
      title:"Day Settings"
    })
  })
})


module.exports = router;













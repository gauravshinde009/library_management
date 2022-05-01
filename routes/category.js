
const express = require('express');
var Sequelize = require("sequelize");
const {redirectHome,redirectLogin }= require("../middleware/redirect") 

const router = express.Router();

var categoryModel = require("../models").Category;
var Op = Sequelize.Op;


router.route("/admin/add-category")
.get(redirectLogin,(req,res,next)=>{
  res.render("admin/add-category",{
    title:"Add category"
  })
})
.post((req,res,next)=>{
  console.log(req.body)

  categoryModel.findOne({
    where:{
      name:{
        [Op.eq]:req.body.name
      }
    }
  }).then((data)=>{
    if(data){
      // existed
      req.flash("error","Category already exist")
      res.redirect("/admin/add-category",{
        title:"Add category"
      })

    }else{
      //not exist

      categoryModel.create({
        name:req.body.name,
        status:req.body.dd_status
      }).then((category)=>{
    
        if(category){
          req.flash("success","Category Created Successfully")
          res.redirect("/admin/add-category",{
            title:"Add category"
          })
        }else{
          req.flash("error","Failed to create category")
          res.redirect("/admin/add-category",{
            title:"Add category"
          })
        }
      })
    }
  })
})


router.get("/admin/list-category",async(req,res,next)=>{

  var all_categories = await categoryModel.findAll();

  res.render("admin/list-category",{
    categories:all_categories,
    title:"List category"
  })
})


router.route("/admin/edit-category/:categoryId").get(async(req,res,next)=>{

  categoryModel.findOne({
    where:{
      id:{
        [Op.eq]:req.params.categoryId
      }
    }
  }).then((data)=>{
    res.render("admin/edit-category",{
      category:data,
      title:"Edit category"
    })
  })
}).post(async(req,res,next)=>{
  categoryModel.findOne({
    where:{
      [Op.and]:[
        {
          id:{
            [Op.ne]:req.params.categoryId
          },
          name:{
            [Op.eq]:req.body.name
          }
        }
      ]
    }
  }).then((data)=>{
    if(data){
      //category already exists
      req.flash("error","Category already exist")
      res.redirect("/admin/edit-category/"+req.params.categoryId,{
        title:"Edit category"
      })

    }else{
      //category does not exist
      categoryModel.update({
        name:req.body.name,
        status:req.body.status
      },{
        where:{
          id:req.params.categoryId
        }
      }).then((data)=>{
        if(data){
          req.flash("success","Category has been updated")
        }else{
          req.flash("error","Failed to update category")
        }

        res.redirect("/admin/edit-category/"+req.params.categoryId,{
          title:"Edit category"
        })
      })
    }
  })
})

router.post("/admin/delete-category",(req,res,next)=>{
  console.log("inside delete")
  categoryModel.findOne({
    where:{
      id:{
        [Op.eq]:req.body.category_id
      }
    }
  }).then((data)=>{
    if(data){
      //we have data on basis of given id

      categoryModel.destroy({
        where:{
          id:{
            [Op.eq]:req.body.category_id
          }
        }
      }).then((status)=>{
        if(status){
          //data deleted
          req.flash("success","category has been deleted successfully.")
        }else{
          req.flash("error","Failed to delete category.")
        }

        res.redirect("/admin/list-category",{
          title:"List category"
        })
      })
    }else{

    }
  })
})

module.exports = router;













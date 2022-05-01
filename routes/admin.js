
const express = require('express')
const router = express.Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const {redirectHome,redirectLogin }= require("../middleware/redirect") 

var categoryModel = require("../models").Category;
const bookModel = require("../models").Book;
const userModel = require("../models").User


router.get("/admin",redirectLogin,async(req,res,next)=>{
  
  const total_categories = await categoryModel.count()
  const total_users = await userModel.count();
  const total_books = await bookModel.count();

  res.render("admin/dashboard",{
    users:total_users,
    books:total_books,
    categories:total_categories,
    title:"Dashboard"
  })

})

module.exports = router;













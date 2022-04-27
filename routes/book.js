
const express = require('express')
const router = express.Router();

const categoryModel = require("../models").Category;
const optionModel = require("../models").Option ;

const bookModel = require("../models").Book;
var Sequelize = require("sequelize")

var Op = Sequelize.Op

router.route("/admin/add-book").get(async(req,res,next)=>{

  var categories = await categoryModel.findAll({
    where:{
      status:{
        [Op.eq]:"1"
      }
    }
  })

  const curreny_data = await optionModel.findOne({
    where:{
      option_name:{
        [Op.eq]:"active_currency"
      }
    }
  })
  
  res.render("admin/add-book",{
    categories:categories,
    curreny_data:curreny_data
  })
}).post((req,res,next)=>{
  if(!req.files){
    req.flash("error","Please upload some files")
  }else{
    var image_attr = req.files.cover_image;

    var validImageExtensions = ["image/png","image/jpg","image/jpeg"];

    if(validImageExtensions.includes(image_attr.mimetype)){
      image_attr.mv("./public/uploads/"+image_attr.name);

    bookModel.create({
      name:req.body.name,
      categoryId:req.body.dd_category,
      description:req.body.description,
      amount:req.body.amount,
      cover_image:"/uploads/"+image_attr.name,
      author:req.body.author,
      status:req.body.dd_status
    }).then((data)=>{

      if(data){
        req.flash("success","Book has been created")
      }else{
        req.flash("error","Failed to create book.")
      }

      res.redirect("/admin/add-book")
    })
    }else{
      req.flash("error","Invalid filetype selected")
      res.redirect("/admin/add-book")
    }
  }
})

router.get("/admin/list-book",async(req,res,next)=>{

  var books = await bookModel.findAll({
    include:{
      model:categoryModel,
      attributes:["name"]
    }
  });

  const curreny_data = await optionModel.findOne({
    where:{
      option_name:{
        [Op.eq]:"active_currency"
      }
    }
  })

  res.render("admin/list-book",{
    books:books,
    curreny_data:curreny_data
  })
})

router.route("/admin/edit-book/:bookId").get(async(req,res,next)=>{
  var book_data = await bookModel.findOne({
    where:{
      id:{
        [Op.eq]:req.params.bookId
      }
    }
  });

  var categories = await categoryModel.findAll({
    where:{
      status:{
        [Op.eq]:"1"
      }
    }
  })


  const curreny_data = await optionModel.findOne({
    where:{
      option_name:{
        [Op.eq]:"active_currency"
      }
    }
  })

  res.render("admin/edit-book",{
    book:book_data,
    categories:categories,
    curreny_data:curreny_data
  })
}).post((req,res,next)=>{
  
  if(!req.files){
    //not going to update cover image
    bookModel.update({
      name:req.body.name,
      categoryId:req.body.dd_category,
      description:req.body.description,
      amount:req.body.amount,
      author:req.body.author,
      status:req.body.dd_status
    },{
      where:{
        id:{
          [Op.eq]:req.params.bookId
        }
      }
    }).then((data)=>{
      if(data){
        req.flash("success","Book has been updated successfully.")
      }else{
        req.flash("error","Failed to update book.")
      }

      res.redirect("/admin/edit-book/"+req.params.bookId)
    })
  }else{
    //going to update cover image

    var image_attr = req.files.cover_image;

    var validImageExtensions = ["image/png","image/jpg","image/jpeg"];

    if(validImageExtensions.includes(image_attr.mimetype)){
      image_attr.mv("./public/uploads/"+image_attr.name);

    bookModel.update({
      name:req.body.name,
      categoryId:req.body.dd_category,
      description:req.body.description,
      amount:req.body.amount,
      cover_image:"/uploads/"+image_attr.name,
      author:req.body.author,
      status:req.body.dd_status
    },{
      where:{
        id:{
          [Op.eq]:req.params.bookId
        }
      }
    }).then((data)=>{

      if(data){
        req.flash("success","Book has been updated")
      }else{
        req.flash("error","Failed to update book.")
      }
      res.redirect("/admin/edit-book/"+req.params.bookId)
    })
    }else{
      req.flash("error","Invalid filetype selected")
      res.redirect("/admin/edit-book/"+req.params.bookId)

    }
  }
})


router.post("/admin/delete-book",(req,res,next)=>{
  
  bookModel.findOne({
    where:{
      id:{
        [Op.eq]:req.body.book_id
      }
    }
  }).then((data)=>{
    if(data){
      bookModel.destroy({
        where:{
          id:{
            [Op.eq]:req.body.book_id
          }
        }
      }).then((status)=>{
        if(status){
          req.flash("success","Book has been deleted")
          res.redirect("/admin/list-book")

        }else{
      req.flash("error","Failed to delete book")
      res.redirect("/admin/list-book")

        }
      })
    }else{
      req.flash("error","Invalid Book id")
      res.redirect("/admin/list-book")
    }
  })
})


module.exports = router;














const express = require('express')
const router = express.Router();
const Sequelize = require("sequelize")
const Op = Sequelize.Op;

const userModel = require("../models").User;
const issueBookModel = require("../models").IssueBook;
const bookModel = require("../models").Book;
const categoryModel = require("../models").Category

router.route("/admin/return-a-book").get(async(req,res,next)=>{

  const all_users = await userModel.findAll({
    where:{
      status:{
        [Op.eq]:"1"
      }
    }
  })

  res.render("admin/return-a-book",{
    users:all_users
  })
}).post((req,res,next)=>{

  issueBookModel.update({
    is_returned:'1',
    returned_date:Sequelize.fn("NOW")
  },{
    where:{
      userId:{
        [Op.eq]:req.body.dd_user
      },
      bookId:{
        [Op.eq]:req.body.dd_book
      },
      is_returned:'0'
    }
  }).then((data)=>{
    if(data){
      req.flash("success","Book has been returned successfully.")
    }else{
      req.flash("error","Failed to return book.")
    }

    res.redirect("/admin/return-a-book")
  })
})

router.get("/admin/return-list-book",async(req,res,next)=>{

  var return_list = await issueBookModel.findAll({
    include:[
      {
        model:categoryModel,
        attributes:["name"]
      },
      {
        model:bookModel,
        attributes:["name"]
      },
      {
        model:userModel,
        attributes:["name","email"]
      }
    ],
    attributes:["days_issued","returned_date"],
    where:{
      is_returned:{
        [Op.eq]:'1'
      }
    }
  })

  res.render("admin/return-list",{
    list:return_list
  })
})


router.post("/admin/user-list-book",async(req,res,next)=>{
  const user_id = req.body.user_id;

  const all_books = await issueBookModel.findAll({
    include:[
      {
        model:bookModel,
        attributes:["name"]
      }
    ],
    where:{
      userId:{
        [Op.eq]:user_id
      },
      is_returned:{
        [Op.eq]:'0'
      }
    },
    attributes:["bookId"]
  })

  return res.json({
    status:1,
    books:all_books
  })
})


module.exports = router;













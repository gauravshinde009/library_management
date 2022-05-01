
const express = require('express')
const router = express.Router();

const Sequelize = require("sequelize");

const Op = Sequelize.Op;

const categoryModel = require("../models").Category
const userModel = require("../models").User
const bookModel = require("../models").Book
const issueBookModel = require("../models").IssueBook
const daysModel = require("../models").DaySetting

router.route("/admin/issue-book").get(async(req,res,next)=>{

  const categories = await categoryModel.findAll({
    where:{
      status:{
        [Op.eq]:"1"
      }
    }
  })

  var days = await daysModel.findAll();

  const users = await userModel.findAll({
    where:{
      status:{
        [Op.eq]:"1"
      }
    }
  })

  res.render("admin/issue-a-book",{
    categories:categories,
    users:users,
    days:days,
    title:"Issue Book"
  })
}).post(async(req,res,next)=>{

  var is_book_issued = await issueBookModel.count({
    where:{
      userId:{
        [Op.eq]:req.body.dd_user
      },
      bookId:{
        [Op.eq]:req.body.dd_book
      },
      is_returned:{
        [Op.eq]:"0"
      }
    }
  })

  if(is_book_issued>0){
    req.flash("error","Book has been already issued to this user.")
    return res.redirect("/admin/list-issue-book",{
      title:"Issue Book"
    })

  }else{
    var count_books = await issueBookModel.count({
      where:{
        userId:{
          [Op.eq]:req.body.dd_user
        },
        is_returned:{
          [Op.eq]:"0"
        }
      }
    })
  
    if(count_books>=2){
      req.flash("error","Maximum books allowed for each user equals to 2")
      return res.redirect("/admin/list-issue-book",{
        title:"Issue Book"
      })
  
  
    }else{
      issueBookModel.create({
        categoryId:req.body.dd_category,
        bookId:req.body.dd_book,
        userId:req.body.dd_user,
        days_issued:req.body.dd_days,
      }).then((data)=>{
        if(data){
          req.flash("success","Book has been issued successfully.")
    
        }else{
          req.flash("error","Failed to issue book.")
        }
    
        return res.redirect("/admin/list-issue-book",{
          title:"List Issue Book"
        })
      })
    }
  }
})

router.get("/admin/list-issue-book",async(req,res,next)=>{

  var issue_list = await issueBookModel.findAll({
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
    attributes:["days_issued","issued_date"],
    where:{
      is_returned:{
        [Op.eq]:'0'
      }
    }
  })

  res.render("admin/issue-history",{
    list:issue_list,
    title:"Issue History"
  })
})

router.post("/admin/category-list-book",async(req,res,next)=>{
  var category_id = req.body.cat_id;
console.log(category_id)
  var books = await bookModel.findAll({
    where:{
      categoryId:{
        [Op.eq]:category_id
      }
    }
  });

  return res.json({status:1,books:books});
})


module.exports = router;













const redirectHome =(req,res,next)=>{
  //check session variables
  if(req.session.userId){
    res.redirect("/admin");
  }else{
    next();
  }
}


const redirectLogin = (req,res,next)=>{
  if(!req.session.userId){
    res.redirect("/admin/login")
  }else{
    next();
  }
}

module.exports = {
  redirectHome,
  redirectLogin
}
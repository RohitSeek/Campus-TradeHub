function isLoggedIn(req,res,next)
{
    if(!req.isAuthenticated()){
        //requestedUrl need to be save
        // so for access to any route store it in session
        req.session.requestedUrl=req.originalUrl;
        console.log(req.session.requestedUrl);
         
        req.flash("error","Must Be logged In first");
       return res.redirect("/login");
    }
    next();
}
function savedRequestedUrl(req,res,next)
{
    console.log("requested url ",req.session.requestedUrl);
    console.log("method:- ",req.method);
    if(req.session.requestedUrl)
        {
            console.log(
                "saved middleware called"
            );
            res.locals.requestedUrl=req.session.requestedUrl;
            res.locals.requestedMethod = req.method;
        }
        next();
}
module.exports = {
    isLoggedIn,
    savedRequestedUrl
};
// module.exports.savedRequestedUrl=(req,res,next)=>
// {
//     if(req.session.requestedUrl)
//     {
//         res.locals.requestedUrl=req.session.requestedUrl;
//     }
//     next();
// }
export function serverFiles(req, res, next){
    console.log(req.params[0])
    res.render("login-success")
}
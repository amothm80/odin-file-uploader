export function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res
      .status(401)
      .send(
        '<h1>You are not authorized to view this resource</h1><p><a href="/login">Login</a></p>'
      );
  }
}

export function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.admin){
        next();
    }else{
        res
        .status(401)
        .send(
          '<h1>You are not authorized to view this admin resource</h1><p><a href="/logout">Logout and reload</a></p>'
        );
    }
}

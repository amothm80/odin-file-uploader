import passport from "passport";

export function getLogin(req, res, next) {
  console.log("login route");

  if (req.isAuthenticated()) {
    return res.redirect("/login-success");
  }
  if (req.session.loginError) {
    res.locals.error = "Wrong email/password provided";
    req.session.loginError = "";
  }
  if (req.session.RegistrationSuccess) {
    res.locals.success = "Registration successful. Please login.";
    req.session.RegistrationSuccess = "";
  }
  res.render("login");
}

export function postLogin(req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.locals.fields = req.body;
      res.locals.error = info.message;
      return res.render("login");
    }

    // // NEED TO CALL req.login()!!!

    req.login(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/login-success");
    });
  })(req, res, next);
}

export function loginFailure(req, res, next) {
  // req.session.loginError = true;
  res.render("login-failure");
}

export function loginSuccess(req, res, next) {
  if (req.isAuthenticated()) {
    res.render("login-success");
  } else {
    res.redirect("/login");
  }
}

export function getLogout(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      res.redirect("/login");
    }
  });
}

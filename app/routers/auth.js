import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import config from "../config";
import User from "../schema/User";
const router = express.Router();

router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user)
      res.status.json({
        message: info
          ? info.message
          : "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง !"
      });

    req.login(user, { session: false }, err => {
      if (err) res.send(err);
      const token = jwt.sign(user, config.jwt.APP_SECRET, {
        expiresIn: config.jwt.EXPIRE_IN
      });
      return res.json({ user, token });
    });
  });
});

router.post("/register", (req, res, next) => {
  const { email, name, username, password, confirmPassword } = req.body;
  if (password != confirmPassword)
    return res
      .status(422)
      .json({ message: "ท่านกรอกช่องรหัสผ่าน กับ ยืนยันรหัสผ่านไม่ตรงกัน" });

  let user = new User();
  user.name = name;
  user.username = username;
  user.email = email;
  try {
    user.save();
    return res.json({ user, message: "ทำการสมัครผู้ใช้งานเรียบร้อยแล้ว !" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

router.post("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

export default router;

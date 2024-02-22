import { Response , Request, NextFunction } from "express";
const Yup = require("yup")


const formSchema = Yup.object({
    username: Yup.string().required("Username required").min(6, "Username too short").max(28, "Username too long"),
    password: Yup.string().required("Password required").min(6, "Password too short").max(28, "Password too long"),
  });
  

 const validateform = (req:Request , res:Response , next : NextFunction)=>{
const formData = req.body;
formSchema
  .validate(formData)
  .then(() => {
    console.log("Form is good");
    next();
  })
  .catch((err: any) => {
    console.log(err.errors);
    res.status(422).send()
  });
};
module.exports = validateform
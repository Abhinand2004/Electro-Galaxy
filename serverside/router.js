import { Router } from "express";
import Auth from "./authentication/Auth.js";
import * as rh from "./reqhandler.js"; 

const router = Router();
router.route("/register").post(rh.register)
router.route("/login").post(rh.login)
router.route("/verifyemail").post(rh.verifyEmail)
router.route("/passchange").put(rh.passchange)
router.route("/home").get(rh.homepage)
router.route("/addproduct").post(Auth,rh.addproduct)
router.route("/navdata").get(Auth,rh.navdata)
router.route("/seller").post(Auth,rh.sellerdata)
router.route("/categories").get(Auth,rh.categories)
router.route("/buyer").get(Auth,rh.buyerdetails)
router.route("/editbuyer").put(Auth,rh.editbuyer)




export default router; 

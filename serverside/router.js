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
router.route("/companyadd").post(Auth,rh.sellerdata)
router.route("/companydetails").get(Auth,rh.displaycompany)
router.route("/editcompany").put(Auth,rh.editcompany)
router.route("/categories").get(Auth,rh.categories)
router.route("/buyer").get(Auth,rh.buyerdetails)
router.route("/editbuyer").put(Auth,rh.editbuyer)
router.route("/address").post(Auth,rh.addAddress)
router.route("/displayaddress").get(Auth,rh.displayaddress)
router.route("/deleteaddress/:id").delete(rh.deleteAddress)
router.route("/editaddress/:id").put(rh.editaddress)
router.route("/category/:id").get(Auth,rh.forsale)
router.route("/editproduct/:id").put(Auth,rh.editproduct)
router.route("/findproduct/:id").get(Auth,rh.findsingleproduct)
router.route("/deletproduct/:id").delete(Auth,rh.deleteproduct)
router.route("/displayproduct/:id").get(rh.displayproductdata)
router.route("/displaywishlist").get(Auth,rh.displaywishlist)
router.route("/addwishlist").post(Auth,rh.addtowishlist)
router.route("/deletewishlist/:id").delete(rh.deletewishlist)
router.route("/addtocart").post(Auth,rh.addtocart)
router.route("/displaycart").get(Auth,rh.displaycart)
router.route("/deletecart/:id").delete(rh.deletefromcart)
router.route("/quantity/:id").post(Auth,rh.quantity)

export default router; 

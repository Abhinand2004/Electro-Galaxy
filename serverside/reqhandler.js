import userSchema from "./models/user.js";
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import pkg from 'jsonwebtoken'
import productSchema from "./models/product.js";
import sellerData from "./models/sellerdata.js";
import addressSchema from "./models/address.js"
import wishlist from "./models/wishlist.js";
import { data } from "react-router-dom";
import user from "./models/user.js";
import cartSchema from "./models/cart.js"
import product from "./models/product.js";
const { sign } = pkg



export async function register(req, res) {
    // console.log(req.body);
    const { username, email, pwd, cpwd,phone,acctype} = req.body
    const user = await userSchema.findOne({ email })
    if (!user) {
        if (!(username && email && pwd && cpwd))
            return res.status(500).send({ msg: "fields are empty" })
        if (pwd != cpwd)
            return res.status(500).send({ msg: "pass not match" })
        bcrypt.hash(pwd, 10).then((hpwd) => {
            userSchema.create({ username, email,phone, pass: hpwd ,acctype,location:[]})
            res.status(200).send({ msg: "Successfull" })
        }).catch((error) => {
            console.log(error);
        })
    } else {
        res.status(200).send({ msg: "email already used " })
    }
}


export async function login(req, res) {
    // console.log(req.body);
    const { email, pass } = req.body
    if (!(email && pass))
        return res.status(500).send({ msg: "fields are empty" })
    const user = await userSchema.findOne({ email })
    if (!user)
        return res.status(500).send({ msg: "email donot exist" })
    const success = await bcrypt.compare(pass, user.pass)
    // console.log(success);
    if (success !== true)
        return res.status(500).send({ msg: "email or password not exist" })
    const token = await sign({ UserID: user._id }, process.env.JWT_KEY, { expiresIn: "24h" })
    // console.log(token);
    res.status(200).send({ token })
}


const transporter = nodemailer.createTransport({
    service: "gmail",
    // host: "sandbox.smtp.mailtrap.io",
    // port: 2525,
    // secure: false, // true for port 465, false for other ports
    auth: {
        user: "abhinandc293@gmail.com",
        pass: "xfrk uoxu ipfs lhjj",
    },
});

export async function verifyEmail(req, res) {
    const { email } = req.body;
    console.log(email);
    
    if (!(email)) {
        return res.status(500).send({ msg: "fields are empty" });
    }

    try {
        const user = await userSchema.findOne({ email });

        if (user) {
            const info = await transporter.sendMail({
                from: 'abhinandc293@gmail.com', 
                to: email, 
                subject: "Verify Your Email", 
                text: "VERIFY! your email", 
                html: `
                    <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 40px;">
                        <div style="background-color: #fff; border-radius: 8px; padding: 30px; max-width: 500px; margin: auto; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
                            <h1 style="color: #333;">Email Verification</h1>
                            <p style="font-size: 16px; color: #555;">Hello ${user.username},</p>
                            <p style="font-size: 16px; color: #555;">Please verify your email address by clicking the button below:</p>
                            <a href="http://localhost:5173/changepass" 
                               style="display: inline-block; padding: 12px 25px; color: #fff; background-color: #4CAF50; text-decoration: none; font-size: 16px; border-radius: 5px; margin-top: 20px;">
                               Verify Email
                            </a>
                            <p style="font-size: 14px; color: #888; margin-top: 20px;">If you did not request this, please ignore this email.</p>
                        </div>
                    </div>
                `,
            });
            console.log("Message sent: %s", info.messageId);
            res.status(200).send({ msg: "Verification email sent" });
        } else {
            return res.status(500).send({ msg: "Email doesn't exist" });
        }
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send({ msg: "Error sending email" });
    }
}




export async function passchange(req, res) {
    const { email, pwd, cpwd } = req.body; 
    if (!email || !pwd || !cpwd) {
        return res.status(400).send({ msg: "Email and both passwords are required" });
    }
    if (pwd !== cpwd) {
        return res.status(400).send({ msg: "Passwords do not match" });
    }

    try {
        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(404).send({ msg: "User not found" });
        }
        const hashedPassword = await bcrypt.hash(pwd, 10);
        const result = await userSchema.updateOne(
            { email: email },
            { $set: { pass: hashedPassword } }
        );
        if (result.modifiedCount === 0) {
            return res.status(500).send({ msg: "Password update failed" });
        }
        res.status(200).send({ msg: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).send({ msg: "Something went wrong" });
    }
}


export async function homepage(req, res) {
    try {
        const products = await productSchema.find();
        if (products.length > 0) {
            res.status(200).send(products);
        } else {
            res.status(404).send({ msg: "No data found" });
        }
    } catch (error) {
        res.status(500).send({ msg: "Error retrieving data" });
    }
}


export async function addproduct(req, res) {
    const { ...data } = req.body;
    try {
        if (Object.keys(data).length === 0) {
            return res.status(400).send({ msg: "Fields are empty" });
        }
        
        data.user_id = req.user.UserID;
        const post = await productSchema.create(data);
        res.status(200).send({ msg: "Product created successfully" });
    } catch (error) {
        res.status(500).send({ msg: "Error creating product" });
    }
}

export async function navdata(req, res) {
    try {
        const user = await userSchema.findOne({ _id: req.user.UserID });
        if (user) {
            return res.status(200).send({ user });
        }
        res.status(404).send({ msg: "User not found" }); 
    } catch (error) {
        res.status(500).send({ msg: "Error retrieving user", error: error.message });
    }
}

export async function sellerdata(req, res) {
    const { ...data } = req.body;
    try {
        const user = await userSchema.findOne({ _id: req.user.UserID });
        if (user && user.acctype === "seller") {
            data.seller_id = req.user.UserID;
            const companyData = await sellerData.create(data);
            if (companyData) {
                return res.status(200).send({ msg: "Company data added successfully" });
            }
            return res.status(500).send({ msg: "Failed to add company data" });
        } else {
            return res.status(403).send({ msg: "You are not a seller" });
        }
    } catch (error) {
        return res.status(500).send({ msg: "Error processing request"});
    }
}
export async function displaycompany(req,res) {
    try {
        const company = await sellerData.findOne({ seller_id: req.user.UserID });
        if (company) {
            return res.status(200).send({ company });
        }
        res.status(404).send({ msg: "Company data not found" });
    } catch (error) {
        res.status(500).send({ msg: "Error retrieving company data" });
    }
}

export async function editcompany(req, res) {
    const data = req.body;
    try {
        const company = await sellerData.updateOne(
            { seller_id: req.user.UserID },
            { $set: data }
        );

        if (company.modifiedCount > 0) {
            res.status(200).send({ msg: "Company details updated successfully." });
        } else {
            res.status(404).send({ msg: "No company found with the provided seller ID." });
        }
    } catch (error) {
        console.error("Error updating company details:", error);
        res.status(500).send({ msg: "Internal server error." });
    }
}


export async function categories(req, res) {
    try {
        const categories = await productSchema.distinct("category", { user_id: req.user.UserID });
        
        if (categories.length > 0) {
            return res.status(200).send({ categories });
        }
        
        res.status(404).send({ msg: "No categories found" });
    } catch (error) {
        res.status(500).send({ msg: "Error retrieving categories" });
    }
}


export async function buyerdetails(req, res) {
    try {
        const buyer = await userSchema.findOne({ _id: req.user.UserID });
        
        if (buyer && buyer.acctype === "buyer") {
            return res.status(200).send({ buyer });
        } else {
            return res.status(500).send({ msg: "You are not a buyer" });
        }
    } catch (error) {
        return res.status(500).send({ msg: "Error retrieving buyer details" });
    }
}

export async function editbuyer(req, res) {
    const { ...data } = req.body;
    try {
        const update = await userSchema.updateOne(  { _id: req.user.UserID }, { $set: data } );

        if (update) {
            res.status(200).send({ msg: 'Buyer information updated successfully.' });
        } else {
            res.status(200).send({ msg: 'No changes were made.' });
        }
    } catch (error) {
        console.error("Error updating buyer information:");
        res.status(500).send({ msg: 'Internal server error. Please try again later.' });
    }
}



export async function addAddress(req, res) {
  const { ...data } = req.body;
  try {
    data.user_id=req.user.UserID
    const newAddress = await addressSchema.create(data);
    
    res.status(200).send({ msg: 'Address added successfully' });
  } catch (error) {
    res.status(500).send({ msg: 'Error adding address'});
  }
}



export async function displayaddress(req, res) {
    try {
        const addresses = await addressSchema.find({ user_id: req.user.UserID });
        if (!addresses.length) {
            return res.status(200).json({ msg: 'No addresses found', addresses: [] });
        }
        return res.status(200).json(addresses);
    } catch (error) {
        console.error("Error fetching addresses:", error);
        return res.status(500).json({ msg: 'Error fetching addresses' });
    }
}




export async function deleteAddress(req, res) {
    const { id } = req.params;
    try {
        const deletedData = await addressSchema.deleteOne({ _id: id });
        if (deletedData) {
         return   res.status(200).send({ msg: "Address deleted successfully" });
        }else{
            return res.status(200).send({msg:"no data for delete"})
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Server error" });
    }
}

export async function editaddress(req, res) {
    const { id } = req.params;
    const data = req.body;
    try {
        const edit = await addressSchema.updateOne({ _id: id }, { $set: data });

        if (edit) {
            return res.status(200).send({ msg: "Address updated successfully" });
        } else {
            return res.status(404).send({ msg: "Address not found " });
        }
    } catch (error) {
        console.error("Error editing address:", error);
        return res.status(500).send({ msg: "Server error" });
    }
}


export async function forsale(req, res) {
    const { id } = req.params;
    // console.log(id);
    
    try {
        const products = await productSchema.find({ user_id: req.user.UserID, category: id  });
        res.status(200).send(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send({ error: "An error occurred while fetching products." });
    }
}


export async function editproduct(req, res) {
    const data = req.body;
    const { id } = req.params;

    try {
        const update = await productSchema.updateOne({ user_id: req.user.UserID, _id: id },{ $set: data } );

        if (update) {
            res.status(200).send({ msg: "Product updated successfully" });
        } else {
            res.status(404).send({ msg: "Product not found or no changes made" });
        }
    } catch (error) {
        console.error("Error updating product:");
        res.status(500).send({ msg: "Internal server error" });
    }
}

export async function findsingleproduct(req, res) {
    const { id } = req.params;

    try {
        
        const productData = await productSchema.findOne({ user_id: req.user.UserID, _id: id });

        if (productData) {
            
            res.status(200).send({ msg: "Product fetched successfully", product: productData });
        } else {
            
            res.status(404).send({ msg: "No product found" });
        }
    } catch (error) {
        
        console.error("Error fetching product:", error);
        res.status(500).send({ msg: "Internal server error" });
    }
}


export async function deleteproduct(req, res) {
    const { id } = req.params;

    try {
        
        const productData = await productSchema.deleteOne({ user_id: req.user.UserID, _id: id });

        if (productData) {
            
            res.status(200).send({ msg: "Product deleted successfully", product: productData });
        } else {
            
            res.status(404).send({ msg: "error deleting data" });
        }
    } catch (error) {
        
        res.status(500).send({ msg: "Internal server error" });
    }
}

export async function displayproductdata(req, res) {
    const { id } = req.params;

    const data=await productSchema.findOne({_id:id})
    if (data) {
        return res.status(200).send(data)
    }
    else{
        return res.status(500).send({msg:"product didint find"})
    }
}

export async function addtowishlist(req, res) {
    const { id } = req.body;
    if (!id) {
        return res.status(400).send({ msg: "Missing product_id" });
    }  
    try {
        const existingWishlistItem = await wishlist.findOne({ buyer_id: req.user.UserID,  product_id: id  });
        if (existingWishlistItem) {
            return res.status(400).send({ msg: "Product is already in your wishlist" });
        }
        const data = await wishlist.create({ buyer_id: req.user.UserID, product_id: id });

        if (data) {
            return res.status(200).send({ msg: "Added to wishlist" });
        } else {
            return res.status(500).send({ msg: "Unable to add data" });
        }
    } catch (error) {
        return res.status(500).send({ msg: "Something went wrong" });
    }
}

export async function displaywishlist(req, res) {
    try {
        const wishlistItems = await wishlist.find({ buyer_id: req.user.UserID });

        if (wishlistItems.length === 0) {
            return res.status(404).send({ msg: "No items in wishlist" });
        }

        const productIds = wishlistItems.map(item => item.product_id);

        const products = await productSchema.find({ _id: { $in: productIds } });

        if (products.length === 0) {
            return res.status(404).send({ msg: "No products found" });
        }

        return res.status(200).send({ products });
    } catch (error) {
        return res.status(500).send({ msg: "Something went wrong" });
    }
}


export async function deletewishlist(req, res) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send({ msg: "Product ID is required" });
    }
    try {
        const deletedData = await wishlist.deleteOne({ product_id: id });

        if (deletedData) {
            return res.status(200).send({ msg: "Product deleted from wishlist" });
        } else {
            return res.status(404).send({ msg: "Product not found in wishlist" });
        }
    } catch (error) {
        return res.status(500).send({ msg: "Something went wrong" });
    }
}





export async function addtocart(req, res) {
    const { id } = req.body;
    if (!id) {
        return res.status(400).send({ msg: "Missing product_id" });
    }  
    try {
        const existingcart = await  cartSchema.findOne({ buyer_id: req.user.UserID,  product_id: id  });
        if (existingcart) {
            return res.status(400).send({ msg: "Product is already in your cart" });
        }
        const productdata=await productSchema.findOne({_id:id})
        const data = await cartSchema.create({ buyer_id: req.user.UserID, quantity:1 ,product:productdata});

        if (data) {
            return res.status(200).send({ msg: "Added to cart" });
        } else {
            return res.status(500).send({ msg: "Unable to add data" });
        }
    } catch (error) {
        return res.status(500).send({ msg: "Something went wrong" });
    }
}



export async function displaycart(req, res) {
    try {
        const cartItems = await cartSchema.find({ buyer_id: req.user.UserID });
        if (cartItems) {
        return res.status(200).send({ cartItems });
            
        }else{
            return res.status(200).send({msg:"error while creating"})
        }
    } catch (error) {
        return res.status(500).send({ msg: "Something went wrong" });
    }
}


export async function deletefromcart(req, res) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send({ msg: "Product ID is required" });
    }
    try {
        
        const deletedData = await cartSchema.deleteOne({ _id: id });

        if (deletedData) {
            return res.status(200).send({ msg: "Product deleted from cart" });
        } else {
            return res.status(404).send({ msg: "Product not found in cart" });
        }
    } catch (error) {
        return res.status(500).send({ msg: "Something went wrong" });
    }
}



export async function quantity(req, res) {
    const { id } = req.params;
    const { input } = req.body; 
    if (!id || input === undefined) {
        return res.status(400).send({ msg: "Product ID and input value are required" });
    }
    try {
        if (input) {
            await cartSchema.updateOne({ _id: id }, { $inc: { quantity: 1 } });
        } else {
            const cartItem = await cartSchema.findOne({ _id: id });
            if (cartItem.quantity <= 1) {
                return res.status(400).send({ msg: "Minimum quantity is 1" });
            }
            await cartSchema.updateOne({ _id: id }, { $inc: { quantity: -1 } });
        }
        return res.status(200).send({ msg: "Quantity updated" });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ msg: "Something went wrong" });
    }
}




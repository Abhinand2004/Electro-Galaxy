import userSchema from "./models/user.js";
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import pkg from 'jsonwebtoken'
import productSchema from "./models/product.js";
import sellerData from "./models/sellerdata.js";
import { data } from "react-router-dom";
import user from "./models/user.js";
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
                            <a href="http://your-app-domain.com/verify?email=${email}" 
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

        if (update.nModified > 0) {
            res.status(200).json({ message: 'Buyer information updated successfully.' });
        } else {
            res.status(400).json({ message: 'No changes were made.' });
        }
    } catch (error) {
        console.error("Error updating buyer information:");
        res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
}


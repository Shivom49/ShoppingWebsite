require("dotenv").config()
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const app = express();
const { spawn } = require("child_process");
const PORT = process.env.PORT || 5000
const mongoURL = process.env.MONGO_URL
const secretKey = process.env.JWT_SECRET

app.use(cors());
app.use(express.json());


mongoose.connect(mongoURL)
    .then(() => { console.log("MongoDB connected successfully") })
    .catch((error) => console.log("MongoDB connection failed : ", error))

const ProductSchema = new mongoose.Schema({

     id: {
        type: Number,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    brand: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    category: {
        type: String,
        required: true
    }

});

const productModel = mongoose.model("products", ProductSchema)




function verifyToken(req, res, next)
{
    const header = req.headers['authorization']

    if(!header)
        {
        return res.send("Token not found")
    }

    const token = header.split(" ")[1]

    jwt.verify(token, "ShivomParashari", (err, decoded)=>{

        if(err)
            {
            return res.send("Invalid token")
        }

        req.user = decoded

        next()

    })

}







app.get("/products/:userId", async (req, res) => {

    try {

        const userId = req.params.userId

        const products = await productModel.find();

        let cartItems = [];

       if (userId && userId !== "null" && userId !== "undefined"  && userId.trim() !== "") {
     cartItems = await CartModel.find({ userId });
}

        function shuffleArray(array) {

            const shuffled = [...array];

            for (let i = shuffled.length - 1; i > 0; i--) {

                const j = Math.floor(Math.random() * (i + 1));

                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];

            }

            return shuffled;

        }

        const smartphones = products.filter(product => product.category === "smartphone");

        const laptops = products.filter(product => product.category === "laptop");

        const audio = products.filter(product => product.category === "audio");

        const smartwatches = products.filter(product => product.category === "smartwatch");

        const accessories = products.filter(product => product.category === "accessory");

        const shuffledProducts = [

            ...shuffleArray(smartphones),

            ...shuffleArray(laptops),

            ...shuffleArray(audio),

            ...shuffleArray(smartwatches),

            ...shuffleArray(accessories)

        ];

        let recommendProducts = [];

        if (cartItems.length === 0) {

            recommendProducts = shuffleArray(products).slice(0, 6);

        }
        else {

            const cartProductIds = cartItems.map(item => item.productId.toString());

            const cartProducts = products.filter(product =>
                cartProductIds.includes(product._id.toString())
            );

            const categoryCounts = {

                smartphone: 0,

                laptop: 0,

                audio: 0,

                smartwatch: 0,

                accessory: 0

            };

            cartProducts.forEach(product => {

                categoryCounts[product.category]++;

            });

            const probabilities = await new Promise((resolve, reject) => {

                const python = spawn("python", [

                    "./recommendation/recommend.py",

                    JSON.stringify(categoryCounts)

                ]);

                let output = "";

                python.stdout.on("data", (data) => {

                    output += data.toString();

                });

                python.stderr.on("data", (data) => {

                    console.log(data.toString());

                });

                python.on("close", () => {

                    resolve(JSON.parse(output));

                });

                python.on("error", (err) => {

                    reject(err);

                });

            });

            const sortedCategories = Object.entries(probabilities)

                .sort((a, b) => b[1] - a[1]);

            const recommendationCount = {};

            const totalRecommendations = 6;

            let allocated = 0;

            for (const [category, probability] of sortedCategories) {

                recommendationCount[category] = Math.floor(

                    probability * totalRecommendations

                );

                allocated += recommendationCount[category];

            }

            let remaining = totalRecommendations - allocated;

            let index = 0;

            while (remaining > 0) {

                const category = sortedCategories[index][0];

                recommendationCount[category]++;

                remaining--;

                index++;

                if (index >= sortedCategories.length) {

                    index = 0;

                }

            }

            recommendProducts = [];

            for (const category in recommendationCount) {

                const count = recommendationCount[category];

                const categoryProducts = shuffleArray(

                    products.filter(product =>

                        product.category === category &&

                        !cartProductIds.includes(product._id.toString())

                    )

                );

                recommendProducts.push(

                    ...categoryProducts.slice(0, count)

                );

            }

            if (recommendProducts.length < 6) {

                const recommendIds = recommendProducts.map(product =>
                    product._id.toString()
                );

                const remainingProducts = shuffleArray(

                    products.filter(product =>

                        !recommendIds.includes(product._id.toString()) &&

                        !cartProductIds.includes(product._id.toString())

                    )

                );

                recommendProducts = [

                    ...recommendProducts,

                    ...remainingProducts.slice(0, 6 - recommendProducts.length)

                ];

            }

        }

        const trending = await CartModel.aggregate([

            {

                $group: {

                    _id: "$productId",

                    total: {

                        $sum: 1

                    }

                }

            },

            {

                $sort: {

                    total: -1

                }

            },

            {

                $limit: 6

            }

        ]);

        const trendingIds = trending.map(item => item._id.toString());

        let trendingProducts = products.filter(product =>
            trendingIds.includes(product._id.toString())
        );

        if (trendingProducts.length < 6) {

            const remainingProducts = shuffleArray(

                products.filter(product =>
                    !trendingIds.includes(product._id.toString())
                )

            );

            trendingProducts = [

                ...trendingProducts,

                ...remainingProducts.slice(0, 6 - trendingProducts.length)

            ];

        }

        res.status(200).json({

            recommendProducts,

            trendingProducts,

            products: shuffledProducts

        });

    }
    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Internal Server Error"

        });

    }

});







const userSchema = mongoose.Schema({

name : {
    type : String, required : true,
},
email : {
     type : String, required : true, unique: true,
    },
password : {
     type : String, required : true, minlength : 5,
}

})

//Model
const userModel = mongoose.model('users', userSchema)

app.post("/signup", async (req, res)=>{

console.log("User hit signup api")

try{
const {name, email, password} = req.body

if(!name || !email || !password){

    return res.status(400).json({
         message: "All fields are required."
    })
}
if(name.trim().length < 3){
    return res.status(400).json({
        message: "Name must be at least 3 characters long."
    });
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(!emailRegex.test(email)){
    return res.status(400).json({
        message: "Invalid email address."
    });
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

if(!passwordRegex.test(password)){
    return res.status(400).json({
        message: "Weak password."
    });
}


const existingUser = await userModel.findOne({email})

if(existingUser){

return res.status(409).json({message: "Email already exists."})
}



const hashedPassword = await bcrypt.hash(password, 10)

const doc = new userModel({name, email, password : hashedPassword})

await doc.save()

return res.status(201).json({
    message: "User registered successfully."
})

}
catch(err){
    console.log(err)
    return res.status(500).json({
        message: "Internal Server Error"
    })
}

}
)





//login
app.post("/login", async (req, res)=>{

try{

const { userEmail, password } = req.body


if (!userEmail || !password) {
    return res.status(400).json({
        message: "All fields are required."
    });
}


if(userEmail.trim() === "" || password.trim() === "")
{
    return res.status(400).json({
        message: "All fields are required."
    });
}


const user = await userModel.findOne({
    email: userEmail
})

if(!user){
    return res.status(404).json({
    message: "User not found."
})
}

const isMatch = await bcrypt.compare(password, user.password)

if(!isMatch)
{
return res.status(401).json({
    message: "Invalid password."
})
}

const token = jwt.sign( {userId: user._id , name : user.name}, secretKey, {expiresIn : "7d"})


return res.status(200).json({ token, 
    user : {id : user._id, name : user.name }
})

}
catch(err){
     console.log(err)

return res.status(500).json({
            message: "Internal Server Error"
        })

}

})




const CartSchema = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },

    productId: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true }

});

const CartModel = mongoose.model("cart", CartSchema);






app.post("/addCart", verifyToken, async (req, res) => {

// console.log("User hit addCArt api")
// console.log(req.headers["content-type"]);
// console.log(req.body);
const { productId } = req.body
const userId = req.user.userId
 console.log(userId);
if (!productId) {
    return res.status(400).json({message: "Product id is required."})
}


await CartModel.create({userId, productId})
return res.status(201).json({message: "Added to cart."})



});

app.delete("/deleteCart/:productId", verifyToken, async (req, res) => { 

try{
const userId = req.user.userId
const productId = req.params.productId
if (!productId) {
    return res.status(400).json({message: "Product id is required."})
}


const cartItem = await CartModel.findOne({userId, productId})
if (!cartItem) {
    return res.status(404).json({message: "Product not found in cart." })
}

await CartModel.deleteOne({userId, productId})
return res.status(200).json({message: "Removed from cart."})
}

catch(err){
 return res.status(500).json({message: "Internal server error."});
}
})


app.get("/cartItems", verifyToken, async (req, res)=>{
try{
const userId = req.user.userId
const cartItems = await CartModel.find({ userId });

const productIds = cartItems.map(item => item.productId);

res.json({ cartItems: productIds });
}
catch(err){
    res.status(500).json({message : "Something went wrong"})
}


})





app.get("/cartPage", verifyToken, async (req, res) => {
    try {

        const userId = req.user.userId;

        const cartItems = await CartModel.find({ userId });

        const products = [];

        for (const item of cartItems) {

            const product = await productModel.findById(item.productId);

            if (product) {
                products.push(product);
            }
        }

        res.json({ products });

    } catch (err) {

        res.status(500).json({ message: "Something went wrong" });

    }
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
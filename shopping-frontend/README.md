Why finally?
✅ Runs after a successful login.
✅ Runs if the request throws an error.
✅ Prevents your button from staying disabled if something goes wrong.

The only exception is the validation checks (return before the try block). Since finally won't execute in those cases, you should call setLoading(false) just before each return, as shown above.







i think one logic is missing there suppose if user has not login user, default products logic

app.get("/products/\:userId", async (req, res) => {

```
try {

    const userId = req.params.userId

    const products = await productModel.find();

    const cartItems = await CartModel.find({ userId });

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
```

});
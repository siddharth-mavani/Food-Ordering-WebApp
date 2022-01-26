var express = require("express");
var router = express.Router();

// Load User model
const Food = require("../models/Food");

// URL is of this format: ../food/..

// GET request 
// Getting all the Food Items
router.get("/", function(req, res) {
    Food.find(function(err, food_item) {
		if (err) {
			console.log(err);
		} else {
			res.status(200).json(food_item);
		}
	})
});


// POST request 
// Add a food item to the database
router.post("/add", (req, res) => {

    const shop_name = req.body.shop_name;
    const vendor_email = req.body.vendor_email;
    const item_name = req.body.item_name;
    const item_type = req.body.item_type;
    const price = req.body.price;
    const rating = 0;
    const num_ratings = 0;
    const addons = req.body.addons;
    const addon_price = req.body.addon_price;
    const tags = req.body.tags;

    const newUser = new Food({shop_name, vendor_email, item_name, item_type, price, rating, num_ratings, addons, addon_price, tags});

    newUser.save()
        .then(food_item => {
            res.status(200).json(food_item);
        })
        .catch(err => {
            res.status(400).send("Error: " + err);
        });
});

// POST request 
// Find food item based on email and item_name
router.post("/getfood", (req, res) => {

    const shop_name = req.body.shop_name;
    const item_name = req.body.item_name;

    Food.findOne({shop_name, item_name})
    .then(food_item => {
        return res.status(200).json(food_item);
    })
    .catch(err => {
        return res.status(400).send("Error: " + err);
    });

    
});

// Post request
// Update the rating of a food item
router.post("/updateRating", (req, res) => {

    const shop_name = req.body.shop_name;
    const item_name = req.body.item_name;
    const rating = req.body.rating;

    Food.findOne({shop_name: shop_name, item_name: item_name})
    .then(food_item => {
        let temp_rating = food_item.rating;
        temp_rating = (temp_rating * food_item.num_ratings + rating) / (food_item.num_ratings + 1);
        food_item.rating = temp_rating;
        food_item.num_ratings++;

        food_item.save()
        .then(() => res.status(200).json("Rating Updated"))
        .catch(err => res.status(400).json(err))
        
    })
    .catch(err => {
        return res.status(400).send("Error: " + err);
    });

});



module.exports = router;


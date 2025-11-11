// Create a new router
const express = require("express")
const router = express.Router()

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

// Handle the search request
router.get('/search-result', function (req, res, next) {
    let keyword = req.query.keyword;

    // Change the SQL to use 'LIKE' instead of '='
    let sqlquery = "SELECT * FROM books WHERE name LIKE ?";

    let search_term = '%' + keyword + '%';

    // Execute the query, passing in the NEW search_term
    db.query(sqlquery, [search_term], (err, result) => {
        if (err) {
            next(err);
        }
        
        // This part stays the same
        res.render("search-result.ejs", { availableBooks: result, keyword: keyword });
     });
});

router.get('/list', function(req, res, next) {
        let sqlquery = "SELECT * FROM books"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                next(err)
            }
            res.render("list.ejs", {availableBooks:result})
         });
    });

// Add a new book - display the form
router.get('/addbook', function (req, res, next) {
    res.render("addbook.ejs")
});

router.post('/bookadded', function (req, res, next) {
    // saving data in database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)"
    // execute sql query
    let newrecord = [req.body.name, req.body.price]
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err)
        }
        else
            res.send(' This book is added to database, name: '+ req.body.name + ' price '+ req.body.price)
    })
});

router.get('/bargainbooks', function(req, res, next) {
    // This SQL query is the only part that's really different!
    let sqlquery = "SELECT * FROM books WHERE price < 20"; 

    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        }
        // We will create a new EJS file to show these results
        res.render("bargainbooks.ejs", { availableBooks: result });
     });
});

// Export the router object so index.js can access it
module.exports = router
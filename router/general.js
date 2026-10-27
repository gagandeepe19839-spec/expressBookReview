const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 7: Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Task 2 & Task 10 (Async): Get the book list available in the shop
public_users.get('/', function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
        resolve(books);
    });

    getBooks.then((bookList) => {
        res.status(200).send(JSON.stringify(bookList, null, 4));
    }).catch((err) => {
        res.status(500).json({ message: "Error retrieving books" });
    });
});

// Task 3 & Task 11 (Async): Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const getBookByIsbn = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not found");
        }
    });

    getBookByIsbn.then((book) => {
        res.status(200).send(JSON.stringify(book, null, 4));
    }).catch((err) => {
        res.status(404).json({ message: err });
    });
});

// Task 4 & Task 12 (Async): Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const getBooksByAuthor = new Promise((resolve, reject) => {
        let matchingBooks = {};
        for (let key in books) {
            if (books[key].author.toLowerCase() === author.toLowerCase()) {
                matchingBooks[key] = books[key];
            }
        }
        resolve(matchingBooks);
    });

    getBooksByAuthor.then((matchingBooks) => {
        if (Object.keys(matchingBooks).length > 0) {
            res.status(200).send(JSON.stringify(matchingBooks, null, 4));
        } else {
            res.status(404).json({ message: "No books found for this author" });
        }
    });
});

// Task 5 & Task 13 (Async): Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const getBooksByTitle = new Promise((resolve, reject) => {
        let matchingBooks = {};
        for (let key in books) {
            if (books[key].title.toLowerCase() === title.toLowerCase()) {
                matchingBooks[key] = books[key];
            }
        }
        resolve(matchingBooks);
    });

    getBooksByTitle.then((matchingBooks) => {
        if (Object.keys(matchingBooks).length > 0) {
            res.status(200).send(JSON.stringify(matchingBooks, null, 4));
        } else {
            res.status(404).json({ message: "No books found with this title" });
        }
    });
});

// Task 6: Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

module.general = public_users;

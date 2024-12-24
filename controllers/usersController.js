// This just shows the new stuff we're adding to the existing contents
const { body, validationResult } = require("express-validator");
const usersStorage = require("../storages/usersStorage")

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";

const validateUser = [
  body("firstName").trim()
    .isAlpha().withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`),
  body("lastName").trim()
    .isAlpha().withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`),
    body('email').trim()
    .isEmail().withMessage('Invalid email format')
];

exports.usersListGet = (req, res) => {
  res.render("index", {
    title: "User list",
    users: usersStorage.getUsers(),
  });
};

exports.usersCreateGet = (req, res) => {
  res.render("createUser", {
    title: "Create user",
  });
};
// We can pass an entire array of middleware validations to our controller.
exports.usersCreatePost = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createUser", {
        title: "Create user",
        errors: errors.array(),
      });
    }
    const { firstName, lastName, email, age, bio } = req.body;
    usersStorage.addUser({ firstName, lastName, email, age, bio });
    res.redirect("/");
  }
];

exports.usersUpdateGet = (req, res) => {
  const user = usersStorage.getUser(req.params.id)
  res.render('updateUser', {
    title: 'Update user',
    user: user
  })
}

exports.usersUpdatePost = [
  validateUser,
  (req, res) => {
    const user = usersStorage.getUser(req.params.id)
    const error = validationResult(req);

    if(!error.isEmpty()){
      return res.status(400).render('updateUser', {
        title: ' Update user',
        user: user,
        errors: error.array()
      })
    }
    const {firstName, lastName, email, age, bio} = req.body
    usersStorage.updateUser(req.params.id, {firstName, lastName, email, age, bio})
    res.redirect('/')
  }
]

exports.usersDeletePost = (req,res) => {
  usersStorage.deleteUser(req.params.id)
  res.redirect('/')
}

exports.searchUser = (req, res) => {
  const searchResults = usersStorage.searchUser(req.query.search)
  res.render("search", {
    title: "Search list",
    users: searchResults,
  });
}



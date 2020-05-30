let mongoose = require("mongoose");
let bcrypt = require("bcryptjs");
let blog = require("./history");
let Schema = mongoose.Schema;

let userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    unique: true,
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  blogs: [{
    type: Schema.Types.ObjectId,
    ref: "blog"
  }]
}, {
  timestamps: true
});


userSchema.statics.findByEmailAndPassword = function (email, password) {
  let userObj = null;
  return new Promise(function (resolve, reject) {
    user.findOne({
        email: email
      })
      .then(function (user) {
        if (!user) reject("Incorrect credentials");
        userObj = user;
        return bcrypt.compare(password, user.password);
      })
      .then(function (isMatched) {
        if (!isMatched) reject("Incorrect credentials");
        resolve(userObj);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};


// I should avoid rehashing the password twice.
userSchema.pre("save", function (next) {
  let user = this;
  // Check whether password field is modified
  if (user.isModified("password")) {
    bcrypt
      .hash(user.password, 10)
      .then(function (hashedPassword) {
        user.password = hashedPassword;
        next();
      })
      .catch(function (err) {
        next(err);
      });
  }

});

userSchema.pre("remove", function (next) {
  blog.deleteMany({
      user: this._id
    })
    .then(function () {
      next();
    })
    .catch(function (err) {
      next(err);
    });
});

let user = mongoose.model("user", userSchema);

module.exports = user;
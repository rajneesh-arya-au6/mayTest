let express = require("express");
let hbs = require("hbs");
let path = require("path");
let session = require("express-session");
require("./db");
let employeeRoutes = require("./routes/employeeRoutes");

let app = express();


app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views", "pages"));
app.set("view options", {
  layout: "layout"
});
const publicPath = path.join(__dirname, "statics");
app.use(express.static(publicPath));
hbs.registerPartials(path.join(__dirname, "views", "partials"));
app.use(
  express.urlencoded({
    extended: false
  })
);


// Adding the session capabilities
app.use(
  session({
    secret: "expressappsecret",
    resave: false,
    name: "MayTestSession",
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 30,
      httpOnly: true,
      secure: false,
      sameSite: "strict"
    }
  })
);

app.use(require("./routes/employeeRoutes"))
app.use(require("./routes/companyRoutes"))

app.get("/", function (req, res) {
  return res.render("index", {
    title: "Home page",
    userId: req.session.userId
  });
});

const port = process.env.PORT || 1234
app.listen(port, function () {
  console.log("Server started");
});
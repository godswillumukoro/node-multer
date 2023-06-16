const express = require("express");
const multer = require("multer");
const ejs = require("ejs");
const path = require("path");

const app = express();
const port = 7777;
app.set("view engine", "ejs");
app.use(express.static("./public"));

// set storage engine
const storage = multer.diskStorage({
  destination: "./public/uploadFiles/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    ); //err, name of file,
  },
});

// Initialize upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("document");

// check file type
function checkFileType(file, cb) {
  // allow file extensions
  const filetypes = /jpeg|jpg|png|gif|pdf/;
  // check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // check mimetype
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images or PDFs only");
  }
}

app.get("/", (req, res) => res.render("index"));
app.post("/", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.render("index", {
        msg: err,
      });
    } else {
      if (req.file == undefined) {
        res.render("index", {
          msg: "Error: No file selected",
        });
      } else {
        res.render("index", {
          msg: "File uploaded",
          file: `uploadFiles/${req.file.filename}`,
        });
      }
    }
    // console.log(req.file);
    // res.send("testing");
  });
});
app.listen(port, () => console.log(`Server running on ${port}`));

const express = require("express");
const router = express.Router();
const { Users, Posts } = require("../models");
const { validateToken, validateOptionalToken } = require("../Middlewares/UserToken");
const { response } = require("express");
const multer = require("multer");
const uuid = require('uuid');


const fs = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey,
  region: process.env.REGION,
})

const uploadParams = {
  Bucket: process.env.BUCKET, 
  Key: '', 
  Body: null,
  ACL:'public-read'
};

var storage = multer.memoryStorage()
// var postStorage = multer.diskStorage({
//   destination: function(req, file, callback) {
//       callback(null, './uploads');
//   },
//   filename: function(req, file, callback) {
//       let fileName = '', postName;
//       if(typeof req.body.postName !== "undefined") {
//           postName = req.body.postName.toLowerCase().replace(/ /g, '-');
//           filename += postName;
//       }
//       fileName += new Date().getTime();
//       var idxDot = file.originalname.lastIndexOf(".");
//       fileName += file.originalname.substr(idxDot, file.originalname.length).toLowerCase();
//       console.log(file.originalname.substr(idxDot, file.originalname.length).toLowerCase())
//       callback(null, fileName);
//   }
// });

const upload = multer({ storage: storage })
require('dotenv').config();
const { NONE } = require("sequelize");
const e = require("express");

router.get("/", async (req, res) => {
  const posts = await Posts.findAll();
  res.send(posts);
})

router.get("/account-posts", validateToken, async (req, res) => {
  const user = await Users.findOne({ where: { username: req.user.validToken.username } });
  user.getPosts()
    .then(async (userPosts) => {
      res.json(userPosts);
    }).catch((e) => {
      res.json({error: e});
    })
})

router.put("/edit/:id", validateOptionalToken, upload.array('file'), async (req,res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id);
  
  if (!req.user) {
    res.json({ error: "Not Signed in" });
  } else {
    if (post.user_id == req.user.validToken.id) {
      post.name = req.body.name;
      post.about = req.body.about;
      post.location = req.body.location;
      post.admission = req.body.admission;
      if (req.files[0]) {
        let filename = uuid.v4();
        var idxDot = req.files[0].originalname.lastIndexOf(".");
        filename+= req.files[0].originalname.substr(idxDot, req.files[0].originalname.length).toLowerCase();
        post.image = filename;
        await post.save();
        const s3Client = s3;
        const params = uploadParams;
    
        params.Key = filename;
        params.Body = req.files[0].buffer;
        s3Client.upload(params, (err, data) => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: err });
          } else {
            res.json({ message: "successfully uploaded" })
          }
          
        })
      } else {
        await post.save();
        res.json("updated no change in img");
      }
      
      
      
    } else {
      res.json({error: "User and Post Creator are different"});
    }
  }
})

router.get("/:id", validateOptionalToken, async (req,res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id);
  if (!req.user) {
    res.json({post: post, edit: false});
  } else {
    if (post.user_id == req.user.validToken.id) {
      res.json({post: post, edit: true});
    } else {
      res.json({post: post, edit: false});
    }
  }
})

router.post("/create", validateToken, upload.array('file'), async (req, res) => {
  const user = await Users.findOne({ where: { username: req.user.validToken.username } });
  let filename = uuid.v4();
  var idxDot = req.files[0].originalname.lastIndexOf(".");
  filename+= req.files[0].originalname.substr(idxDot, req.files[0].originalname.length).toLowerCase();
  user.createPost({
    name: req.body.name,
    about: req.body.about,
    location: req.body.location,
    admission: req.body.admission,
    image: filename
  }).then(() => {
    
    const s3Client = s3;
    const params = uploadParams;

    params.Key = filename;
    params.Body = req.files[0].buffer;
    s3Client.upload(params, (err, data) => {
      if (err) {
        res.status(500).json({ error: err });
      } else (
        res.json({ message: "successfully uploaded" })
      )
      
    })
  }).catch((err)=> {
    console.log(err);
    if (err) {
      res.json({ error: err });
    }
  })
  
});


module.exports = router;
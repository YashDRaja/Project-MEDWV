const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require('path');
require('dotenv').config();
//const path = require('path');
app.use('/images', express.static('uploads'))

app.use(express.static(path.join(__dirname, '../client/build')));
app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true, origin: "https://project-medwv.yashr.me"}));

const db = require("./models");

// Routers
const userRouter = require("./routes/Users");
app.use("/api/users", userRouter);

const postRouter = require("./routes/Posts");
app.use("/api/posts", postRouter);

//const gameRouter = require("./routes/Games");
//app.use("/game", gameRouter);

app.get('*', (req, res)=>{  res.sendFile(path.join(__dirname, '../client/build/index.html'));})

db.sequelize.sync()
.then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log("Server running on port 5000");
  });
}).catch((err) => {
  console.log(err);  
});
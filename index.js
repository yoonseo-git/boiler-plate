const express = require("express");
const app = express();
const port = 5000;

// Mongoose : 간단하게 몽고DB를 편하게 쓸 수 있는 Object Modeling Tool
// npm install mongoose --save
const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://admin:chduddnd12@youtubeclone.p97xspl.mongodb.net/?retryWrites=true&w=majority&appName=YouTubeClone"
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World! 안녕하세요!!");
});

// listen()함수는 Express.js 서버를 시작하는 핵심 함수로, HTTP 서버를 특정 포트에서 실행시켜 클라이언트의 요청을 받을 준비를 하는 함수
// listen(port, callback)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

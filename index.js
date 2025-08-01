// 필요한 모듈 불러오기
const express = require("express");
// Mongoose : 간단하게 몽고DB를 편하게 쓸 수 있는 Object Modeling Tool
// npm install mongoose --save
const mongoose = require("mongoose");
const { User } = require("./models/User");

// 서버 앱 초기화
const app = express();
const port = 5000;

// 미들웨어 설정 (요청 바디 파싱을 위해 필요)
app.use(express.json()); // application/json 형식 파싱
app.use(express.urlencoded({ extended: true })); // application/x-www-form-urlencoded 파싱

// MongoDB 연결 (mongoose 사용)
mongoose
  .connect(
    "mongodb+srv://admin:chduddnd12@youtubeclone.p97xspl.mongodb.net/?retryWrites=true&w=majority&appName=YouTubeClone"
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// 기본 라우터 (테스트용)
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 회원가입 라우터 (POST /register)
app.post("/register", async (req, res) => {
  try {
    // 클라이언트에서 전송된 JSON 데이터를 기반으로 User 인스턴스 생성
    const user = new User(req.body);

    // 데이터베이스에 저장 (await + try/catch로 에러 처리)
    await user.save();

    // 성공 응답 반환
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// listen()함수는 Express.js 서버를 시작하는 핵심 함수로, HTTP 서버를 특정 포트에서 실행시켜 클라이언트의 요청을 받을 준비를 하는 함수
// listen(port, callback) 서버 실행
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

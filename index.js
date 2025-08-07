// 필요한 모듈 불러오기
const express = require("express");
// Mongoose : 간단하게 몽고DB를 편하게 쓸 수 있는 Object Modeling Tool
// npm install mongoose --save
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { User } = require("./models/User");

// 서버 앱 초기화
const app = express();
const port = 5000;

// 미들웨어 설정 (요청 바디 파싱을 위해 필요)
app.use(express.json()); // application/json 형식 파싱
app.use(express.urlencoded({ extended: true })); // application/x-www-form-urlencoded 파싱

app.use(cookieParser());

// MongoDB 연결 (mongoose 사용)
mongoose
  .connect(config.mongoURI)
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

// 로그인 라우터 (POST /login)
app.post("/login", async (req, res) => {
  try {
    // 요청된 이메일을 데이터베이스에서 있는지 찾는다
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }

    // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인
    const isMatch = await user.comparePassword(req.body.password);

    if (!isMatch) {
      return res.status(401).json({
        loginSuccess: false,
        message: "비밀번호가 틀렸습니다.",
      });
    }

    // 비밀번호 까지 맞다면 토큰을 생성하기
    const loggedInUser = await user.generateToken();

    // 토큰을 쿠키에 저장
    res
      .cookie("x_auth", loggedInUser.token, {
        httpOnly: true, // JS에서 접근 못 하게
        secure: false, // 배포 시엔 true (https 환경)
        maxAge: 1000 * 60 * 60, // 1시간
      })
      .status(200)
      .json({
        loginSuccess: true,
        userId: loggedInUser._id,
      });
  } catch (err) {
    console.error("로그인 중 에러:", err);
    res.status(500).json({ loginSuccess: false, error: err.message });
  }
});

// listen()함수는 Express.js 서버를 시작하는 핵심 함수로, HTTP 서버를 특정 포트에서 실행시켜 클라이언트의 요청을 받을 준비를 하는 함수
// listen(port, callback) 서버 실행
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

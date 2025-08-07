// mongoose 모듈 불러오기
const mongoose = require("mongoose");
// bcrypt 모듈 (비밀번호 암호화 라이브러리)
const bcrypt = require("bcrypt");
// saltRounds는 암호화 강도 (10이면 충분)
const saltRounds = 10;
// jsonwebtoken 불러오기
const jwt = require("jsonwebtoken");

// 사용자 정보를 정의할 스키마 생성
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

// 비밀번호 암호화 로직 (저장 전에 실행됨)
userSchema.pre("save", function (next) {
  const user = this;

  // 비밀번호 필드가 수정될 때만 암호화
  if (user.isModified("password")) {
    // 비밀번호를 암호화 시킨다
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      // 비밀번호 + salt -> 암호화 해시 생성
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);

        // 암호화된 해시로 비밀번호 대체
        user.password = hash;
        next(); // 다음 미들웨어 또는 저장으로 진행
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword) {
  // plainPassword 1234567    암호화된 password
  return bcrypt.compare(plainPassword, this.password);
};

userSchema.methods.generateToken = async function () {
  const user = this;

  // jsonwebtoken을 이용해서 토큰을 생성하기
  const token = jwt.sign({ _id: user._id.toHexString() }, "secretToken");

  user.token = token;
  await user.save();
  return user;
};

// 위에서 정의한 스키마를 바탕으로 'User' 모델 생성
// => 실제 DB 컬렉션은 'users'로 자동 생성됨(소문자 + 복수형)
const User = mongoose.model("User", userSchema);

// 다른 파일에서 사용할 수 있도록 exports
module.exports = { User };

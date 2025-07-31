// mongoose 모듈 불러오기
const mongoose = require("mongoose");

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

// 위에서 정의한 스키마를 바탕으로 'User' 모델 생성
// => 실제 DB 컬렉션은 'users'로 자동 생성됨(소문자 + 복수형)
const User = mongoose.model("User", userSchema);

// 다른 파일에서 사용할 수 있도록 exports
module.exports = { User };

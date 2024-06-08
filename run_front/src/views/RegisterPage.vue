<template>
  <div class="materialContainer">
    <div class="box">
      <div class="title">REGISTER</div>

      <!-- 회원가입할 때 정보 기입 -->
      <div class="input">
        <input
          type="text"
          name="regname"
          id="regname"
          v-model="regUsername"
          placeholder="Username"
          @input="clearErrors"
        />
        <span class="spin"></span>
      </div>
      <div class="input">
        <input
          type="password"
          name="regpass"
          id="regpass"
          v-model="regPassword"
          placeholder="Password"
          @input="clearErrors"
        />
        <span class="spin"></span>
      </div>
      <div class="input">
        <input
          type="password"
          name="reregpass"
          id="reregpass"
          v-model="regRepeatPassword"
          placeholder="Repeat Password"
          @input="clearErrors"
        />
        <span class="spin"></span>
      </div>
      <div class="input">
        <input
          type="email"
          name="regemail"
          id="regemail"
          v-model="regEmail"
          placeholder="Email"
          @input="clearErrors"
        />
        <span class="spin"></span>
      </div>
      <div class="input">
        <input
          type="number"
          name="regskill"
          id="regskill"
          v-model="regSkill"
          min="1"
          max="10"
          placeholder="Skill Level (1-10)"
          @input="clearErrors"
        />
        <span class="spin"></span>
      </div>

      <div class="button">
        <button @click="register">REGISTER</button>
      </div>

      <div class="error" v-if="errorMessage">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      regUsername: "",
      regPassword: "",
      regRepeatPassword: "",
      regEmail: "",
      regSkill: "", // skill 레벨 데이터를 저장할 변수
      errorMessage: ""
    };
  },
  methods: {
    clearErrors() {
      this.errorMessage = "";
    },
    async register() {
      if (this.regPassword !== this.regRepeatPassword) {
        this.errorMessage = "비밀번호가 일치하지 않습니다.";
        return;
      }
      if (this.regSkill < 1 || this.regSkill > 10) {
        this.errorMessage = "Skill 레벨은 1에서 10 사이의 숫자여야 합니다.";
        return;
      }
      try {
        const response = await axios.post(
          "https://destiny-back-63f6h32ypq-de.a.run.app/blue/account/create_account",
          {
            email: this.regEmail,
            password: this.regPassword,
            skill: this.regSkill
          }
        );
        console.log("회원가입 성공:", response.data);
        this.$router.push("/"); // 홈페이지로 리디렉션
      } catch (error) {
        this.errorMessage =
          "회원가입 실패: " + (error.response?.data?.detail || "알 수 없는 오류");
      }
    }
  }
};
</script>


<style scoped>
.box {
  position: relative;
  top: 0;
  opacity: 1;
  float: left;
  padding: 60px 50px 40px;
  width: 100%; /* 크기 조정 필요 시 수정 */
  max-width: 500px; /* 적절한 최대 너비 설정 */
  background: #f2f2f2;
  border-radius: 10px;
  border: 1px solid #ccc; /* 테두리 추가 */
  transform: scale(1);
  z-index: 5;
}

.title {
  width: 100%;
  float: left;
  line-height: 46px;
  font-size: 34px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #003a9a;
  position: relative;
}

.input {
  margin-top: 30px;
  position: relative;
  width: 100%;
}

.input input {
  position: relative;
  height: 60px;
  top: 10px;
  border: none;
  background: transparent;
  font-family: "Roboto", sans-serif;
  font-size: 24px;
  color: rgba(0, 0, 0, 0.8);
  font-weight: 300;
}

.input span.spin {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: #003a9a;
  z-index: 4;
  width: 0;
}

.button {
  margin-top: 30px;
}

.button button {
  width: 100%;
  line-height: 64px;
  background-color: transparent;
  border: 3px solid rgba(0, 0, 0, 0.1);
  font-weight: 900;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s, color 0.3s, transform 0.1s;
  cursor: pointer;
}

.button button:hover {
  background-color: #003a9a;
  color: #fff;
}

.button button:active {
  transform: scale(0.95);
}

.material-button,
.alt-2 {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: #003a9a;
  position: absolute;
  top: 40px;
  right: -70px;
  cursor: pointer;
  z-index: 100;
  transform: translate(0%, 0%);
}

.material-button .shape,
.alt-2 .shape {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
}

.materialContainer {
  width: 100%;
  max-width: 460px;
  position: absolute;
  top: calc(50% + 85px);
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>

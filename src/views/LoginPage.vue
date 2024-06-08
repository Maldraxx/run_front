<template>
  <div class="materialContainer">
    <div class="box">
      <div class="title">LOGIN</div>

      <!-- Login Inputs -->
      <div class="input">
        <input
          type="email"
          name="email"
          id="email"
          v-model="email"
          placeholder="Email"
          @input="clearErrors"
        />
        <span class="spin"></span>
      </div>
      <div class="input">
        <input
          type="password"
          name="pass"
          id="pass"
          v-model="password"
          placeholder="Password"
          @input="clearErrors"
        />
        <span class="spin"></span>
      </div>

      <!-- Action Buttons -->
      <div class="button">
        <button @click="handleLogin">LOGIN</button>
      </div>
      <div class="button">
        <button @click="$router.push({ name: 'Register' })">Register</button>
      </div>

      <!-- Error Message Display -->
      <div class="error" v-if="errorMessage">{{ errorMessage }}</div>

      <a href="#" class="pass-forgot">Forgot your password?</a>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    ...mapActions(["login"]),
    clearErrors() {
      this.errorMessage = "";
    },
    async handleLogin() {
      try {
        const response = await axios.post(
          "https://destiny-back-63f6h32ypq-de.a.run.app/blue/account/login",
          {
            email: this.email,
            password: this.password,
          }
        );
        if (response.data.access_token) {
          localStorage.setItem("authToken", response.data.access_token);
          localStorage.setItem("userEmail", this.email);
          this.login({
            user: this.email,
            token: response.data.access_token,
            skill: response.data.skill,
          });
          this.$router.push("/");
        } else {
          this.errorMessage =
            "Login succeeded but no access token was returned.";
        }
      } catch (error) {
        this.errorMessage =
          "Login failed: " + (error.response?.data?.detail || "Unknown error");
      }
    },
  },
};
</script>

<style scoped>
.box {
  position: relative;
  top: 0;
  opacity: 1;
  float: left;
  padding: 60px 50px 40px;
  width: 100%;
  max-width: 500px;
  background: #f2f2f2;
  border-radius: 10px;
  border: 1px solid #ccc;
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

  &:before {
    content: "";
    width: 5px;
    height: 100%;
    position: absolute;
    top: 0;
    left: -50px;
    background: #003a9a;
  }
}

.input {
  margin-top: 30px;
  position: relative;
  width: 100%;

  input {
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

  span.spin {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: #003a9a;
    z-index: 4;
    width: 0;
  }
}

.button {
  margin-top: 30px;

  button {
    width: 100%;
    line-height: 64px;
    background-color: transparent;
    border: 3px solid rgba(0, 0, 0, 0.1);
    font-weight: 900;
    font-size: 18px;
    color: rgba(0, 0, 0, 0.2);
  }
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
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>

<template>
  <div class="login-container">
    <h2> {{ existingUser  ? 'Login to your account' : 'Create an account' }} </h2>

    <form>
      <input
        type="text"
        name="userName"
        placeholder="User Name"
        v-model="authForm.userName"
        v-if="!existingUser"
        required
      />

      <p v-if="errors.userName && errors.userName.length">
        <ul class="flex justify-start align-start flex-column">
          <li v-for="(error, index) in errors.userName" :key="index" class="error">
            {{ error }}
          </li>
        </ul>
      </p>

      <input
        type="text"
        name="email"
        placeholder="Email"
        v-model="authForm.email"
        required
      />

      <p v-if="errors.email && errors.email.length">
        <ul class="flex justify-start align-start flex-column">
          <li v-for="(error, index) in errors.email" :key="index" class="error">
            {{ error }}
          </li>
        </ul>
      </p>

      <input
        type="password"
        name="password"
        placeholder="Password"
        v-model="authForm.password"
        required
      />

      <p v-if="errors.password && errors.password.length">
        <ul class="flex justify-start align-start flex-column">
          <li v-for="(error, index) in errors.password" :key="index" class="error">
            {{ error }}
          </li>
        </ul>
      </p>
    
      <input type="button" value="Login" @click="loginUser()" v-if="existingUser" />
      <input type="button" value="Signup" @click="signupUser()" v-if="!existingUser" />
    </form>

    <div class="checkbox-container flex align-center">
      <input type="checkbox" @change="switchFormType($event)" checked/>
      <span class="checkbox-text"> already existing user? </span>
    </div>
  </div>
</template>

<script>
import HttpService from "@/services/httpService.js";
import { PASSWORD_VALIDATOR, EMAIL_VALIDATOR } from "@/services/utilService.js";

export default {
  name: "Login",
  components: {},
  data() {
    return {
      authForm: {
        userName: "",
        email: "",
        password: "",
      },
      existingUser: true,
      errors: { userName: [], email: [], password: [] },
    };
  },

  methods: {
    allEmpty(obj) {
      return Object.keys(obj).every((key) => {
        return obj[key].length === 0;
      });
    },
    checkForm() {
      this.errors = { userName: [], email: [], password: [] };

      if (!this.existingUser && !this.authForm.userName) {
        this.errors.userName.push("User name is required.");
      }

      if (!this.authForm.email) {
        this.errors.email.push("Email is required.");
      }

      if (!this.authForm.password) {
        this.errors.password.push("Password is required.");
      }

      if (this.authForm.password &&
        !PASSWORD_VALIDATOR.test(this.authForm.password)) {
        this.errors.password.push(
          "The password should contain at least 8 characters, at least one capital letter, at least one number and at least one lowercase letter."
        );
      }

      if (this.authForm.email && !EMAIL_VALIDATOR.test(this.authForm.email)) {
        this.errors.email.push("The email is not valid.");
      }

      return this.allEmpty(this.errors) ? true : false;
    },
    loginUser() {
      const isFormValid = this.checkForm();

      if (!isFormValid) {
        return;
      }

      const email = this.authForm.email;
      const password = this.authForm.password;
      
      this.$store.dispatch({ type: "login", email, password }).then(() => {
        this.$router.replace("/");

      }).catch((error) => {
        console.log('error', error);
      })
    },
    signupUser() {
      const isFormValid = this.checkForm();

      if (!isFormValid) {
        return;
      }

      HttpService.signup(
        this.authForm.userName,
        this.authForm.email,
        this.authForm.password
      )
        .then((res) => {
          this.loginUser();
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    switchFormType(event) {
      const isCheckboxChecked = event.target.checked;
      this.existingUser = isCheckboxChecked ? true : false;
      this.errors = { userName: [], email: [], password: [] };
    },
  },
};
</script>

<style lang="scss" scoped>
.login-container {
  font-family: "Open Sans Condensed", arial, sans;
  width: 500px;
  padding: 30px;
  background: #ffffff;
  margin: 50px auto;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.22);
  border-radius: 15px;
}

.login-container h2 {
  background: #4d4d4d;
  text-transform: uppercase;
  font-family: "Open Sans Condensed", sans-serif;
  color: #797979;
  font-size: 18px;
  font-weight: 100;
  padding: 20px;
  margin: -30px -30px 30px -30px;
  border-radius: 15px 15px 0 0;
  font: 16px sweetCheeks, Helvetica, sans-serif;
}

.login-container input[type="text"],
.login-container input[type="date"],
.login-container input[type="datetime"],
.login-container input[type="email"],
.login-container input[type="number"],
.login-container input[type="search"],
.login-container input[type="time"],
.login-container input[type="url"],
.login-container input[type="password"],
.login-container textarea,
.login-container select {
  box-sizing: border-box;
  outline: none;
  display: block;
  width: 100%;
  padding: 7px;
  border: none;
  border-bottom: 1px solid #ddd;
  background: transparent;
  margin-bottom: 10px;
  font: 14px sweetCheeks, Helvetica, sans-serif;
  height: 45px;
}

.login-container textarea {
  resize: none;
  overflow: hidden;
}

.login-container input[type="button"],
.login-container input[type="submit"] {
  -moz-box-shadow: inset 0px 1px 0px 0px #45d6d6;
  -webkit-box-shadow: inset 0px 1px 0px 0px #45d6d6;
  box-shadow: inset 0px 1px 0px 0px #45d6d6;
  background-color: #2cbbbb;
  border: 1px solid #27a0a0;
  display: inline-block;
  cursor: pointer;
  color: #ffffff;
  padding: 8px 18px;
  text-decoration: none;
  text-transform: uppercase;
  font: 14px sweetCheeks, Helvetica, sans-serif;
  border-radius: 15px;
  outline: none;
}

.login-container input[type="button"]:hover,
.login-container input[type="submit"]:hover {
  background: linear-gradient(to bottom, #34caca 5%, #30c9c9 100%);
  background-color: #34caca;
}

.checkbox-container {
  .checkbox-text {
    font: 12px sweetCheeks, Helvetica, sans-serif;
  }

  input[type="checkbox"] {
    margin-right: 1vw;
    cursor: pointer;
  }
}

.error {
  font: 12px sweetCheeks, Helvetica, sans-serif;
  color: #f87171;
}

@media (max-width: 580px) {
  .login-container {
    width: 85%;
  }
}
</style>
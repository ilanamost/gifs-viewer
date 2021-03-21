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

      // if all the object keys are empty arrays, return true
      return Object.keys(obj).every((key) => {
        return obj[key].length === 0;
      });
    },
    checkForm() {
      // reset the form errors
      this.errors = { userName: [], email: [], password: [] };

      // validate the form controls
      this.validateUserName();
      this.validateEmail();
      this.validatePassword();

      // if the errors object is empty in all the keys, return true
      return this.allEmpty(this.errors) ? true : false;
    },
    validateUserName() {
      // if there is no value in the user name control 
      // and the user is NOT an existing user of the application
      if (!this.existingUser && !this.authForm.userName) {

        // add error for the user name control
        this.errors.userName.push("User name is required.");
      }
    },
    validatePassword() {
      // if there is no value in the password control 
      if (!this.authForm.password) {

        // add error for the password control
        this.errors.password.push("Password is required.");
      } else if (!PASSWORD_VALIDATOR.test(this.authForm.password)) {

        // if there is value but it's NOT valid, add error for the password control
        this.errors.password.push(
          "The password is not valid: it should contain at least 8 characters, at least one capital letter, at least one number and at least one lowercase letter."
        );
      }
    },
    validateEmail() {
      // if there is no value in the email control 
      if (!this.authForm.email) {

        // add error for the email control
        this.errors.email.push("Email is required.");
      } else if (!EMAIL_VALIDATOR.test(this.authForm.email)) {

        // if there is value but it's NOT valid, add error for the email control
        this.errors.email.push("The email is not valid: It can contain any characters devided by a '@' and a '.' afterwards");
      }
    },
    loginUser() {
      // check if the form has is valid (has no errors)
      const isFormValid = this.checkForm();

      // if it is NOT valid, return from the function
      if (!isFormValid) {
        return;
      }

      const email = this.authForm.email;
      const password = this.authForm.password;

      // dispatch an action to login the user
      this.$store
        .dispatch({ type: "login", email, password })
        .then(() => {

          // navigate to the main page of the application
          this.$router.replace("/");
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    signupUser() {
      // check if the form has is valid (has no errors)
      const isFormValid = this.checkForm();

      // if it is NOT valid, return from the function
      if (!isFormValid) {
        return;
      }

      // signup the user with the form data
      HttpService.signup(
        this.authForm.userName,
        this.authForm.email,
        this.authForm.password)  
        // the signup was successfull
        .then((res) => {

          // login the user 
          this.loginUser();
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    switchFormType(event) {
      // check whether the checkbox is checked or not
      const isCheckboxChecked = event.target.checked;

      // according to it, decide if the user is an existing user in an application or a new one
      // use this to switch between login and signup forms display
      this.existingUser = isCheckboxChecked ? true : false;

      // reset the form errors
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
  background: $loginBackgroundColor;
  margin: 50px auto;
  box-shadow: 0px 0px 15px $loginBoxShadowColor;
  border-radius: 15px;
}

.login-container h2 {
  background: $loginTitleBackgroundColor;
  text-transform: uppercase;
  font-family: "Open Sans Condensed", sans-serif;
  color: $loginTitleColor;
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
  border-bottom: 1px solid $loginControlBorderColor;
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
  -moz-box-shadow: inset 0px 1px 0px 0px $loginButtonBoxShadowColor;
  -webkit-box-shadow: inset 0px 1px 0px 0px $loginButtonBoxShadowColor;
  box-shadow: inset 0px 1px 0px 0px $loginButtonBoxShadowColor;
  background-color: $loginButtonBackgroundColor;
  border: 1px solid $loginButtonBorderColor;
  display: inline-block;
  cursor: pointer;
  color: $loginBackgroundColor;
  padding: 8px 18px;
  text-decoration: none;
  text-transform: uppercase;
  font: 14px sweetCheeks, Helvetica, sans-serif;
  border-radius: 15px;
  outline: none;
}

.login-container input[type="button"]:hover,
.login-container input[type="submit"]:hover {
  background-color: $loginButtonHoverBackgroundColor;
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
  color: $loginErrorColor;
  text-align: start;
}

@media (max-width: 580px) {
  .login-container {
    width: 85%;
  }
}
</style>
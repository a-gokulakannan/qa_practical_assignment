import cypressActions from '../helper/cypressActions';

/**
 * Login Page Object Model
 * Contains all selectors and methods for the OrangeHRM Login page
 */
class LoginPage {
  // XPath selector variables
  usernameInputXpath = "//input[@name='username']";
  passwordInputXpath = "//input[@name='password']";
  loginButtonXpath = "//button[@type='submit']";
  errorMessageXpath = "//div[contains(@class, 'oxd-alert-content-text')]";
  loginFormXpath = "//form[contains(@class, 'orangehrm-login-form')]";

  // Page elements/selectors
  get usernameInput() {
    return cypressActions.getElement(this.usernameInputXpath);
  }

  get passwordInput() {
    return cypressActions.getElement(this.passwordInputXpath);
  }

  get loginButton() {
    return cypressActions.getElement(this.loginButtonXpath);
  }

  get errorMessage() {
    return cypressActions.getElement(this.errorMessageXpath);
  }

  get loginForm() {
    return cypressActions.getElement(this.loginFormXpath);
  }

  // Page methods/actions
  visit() {
    cypressActions.visitPage('https://opensource-demo.orangehrmlive.com/');
  }

  enterUsername(username) {
    cypressActions.clearAndType(this.usernameInputXpath, username);
  }

  enterPassword(password) {
    cypressActions.clearAndType(this.passwordInputXpath, password);
  }

  clickLogin() {
    cypressActions.clickElement(this.loginButtonXpath);
  }


  
  login(username, password) {
    this.enterUsername(username);
    this.enterPassword(password);
    this.clickLogin();
  }

  assertLoginPageVisible() {
    cypressActions.assertElementVisible(this.usernameInputXpath);
    cypressActions.assertElementVisible(this.passwordInputXpath);
    cypressActions.assertElementVisible(this.loginButtonXpath);
  }
}

export default new LoginPage();


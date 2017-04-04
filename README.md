# Signup, Login, and Password Recovery forms

Just as the title suggests. Forms and workflows for user account creation, authentication, and password recovery using vanilla javascript, vanilla CSS, and handlebars templating.

## Installation

1. Install node.js.
2. `git clone` the repo and run `npm install`.
3. Create file `nodemailerConfig.json` in `<userHomeDir>/.config/` with the following contents:

```javascript
{
  "service": <email service e.g. 'gmail'>,
  "user": <email account>,
  "pass": <password of the email account>,
  "name": <name of email sender>
}
```

Please refer to the [nodemailer config](https://nodemailer.com/smtp/) for more information.

4. Create a directory `<userHomeDir>/.config/localhost-ssl` with SSL private key `key.pem` and signed certificate `certificate.pem` inside.

## Views
### Signup
<p align="center">
  <img src="images/signup.png">
</p>

### Login
<p align="center">
  <img src="images/login.png">
</p>

### Password Recovery
<p align="center">
  <img src="images/pwrecovery.gif">
</p>

## License

MIT

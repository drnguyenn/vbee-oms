const getAccountRegistrationEmailTemplate = (email, password) => `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office"
  >
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="x-apple-disable-message-reformatting" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <link
        href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap"
        rel="stylesheet"
      />
      <title>Vbee OMS Account Registration</title>

      <style>
        #body {
          font-family: 'Ubuntu', sans-serif;
          margin: 0 20%;
          color: rgba(0, 0, 0, 0.65);
        }

        .header {
          width: 100%;
          height: 120px;
          background-color: #121212;
          display: flex;
        }

        .header > a {
          color: #f6c90e;
          margin: auto;
        }

        .content {
          padding: 25px 15px 0;
        }

        .title {
          font-size: 1.6rem;
          color: #fab300;
        }

        .text {
          padding: 15px 0;
          line-height: 1.5rem;
        }

        .account-container {
          border: solid rgba(0, 0, 0, 0.2) 2px;
          border-radius: 10px;
          text-align: -webkit-center;
          padding: 1rem;
        }

        .account-credentials {
          height: 50px;
          margin: 20px 0;
        }

        .account-credentials > tbody > tr > td {
          min-width: 90px;
        }

        .login-button {
          display: inline-block;
          text-decoration: none;
          color: #121212 !important;
          background-color: #f6c90e;
          border-radius: 24px;
          padding: 0.8rem 1.4rem;
        }

        a.login-button:hover {
          background-color: #fab300;
        }

        .footer {
          width: 100%;
          margin-top: 25px;
          padding: 0.5rem;
          background-color: #121212;
          font-size: 14px;
        }

        .footer > tbody > tr > td {
          width: 50%;
        }

        .footer-content {
          color: #fafafa;
          text-align: right;
        }

        .footer-content > a {
          color: #f6c90e;
        }

        @media only screen and (max-width: 650px) {
          #body {
            margin: 0;
          }

          .header > a > img {
            width: 250px;
          }
        }
      </style>
    </head>

    <body>
      <div id="body">
        <div class="header">
          <a href="https://oms.vbee.vn/" target="_blank">
            <img
              src="https://oms.vbee.vn/static/media/vbee-oms-logo-landscape-dark.72f9267f.svg"
              alt="Vbee OMS"
              title="Vbee OMS"
              width="300"
            />
          </a>
        </div>

        <div class="content">
          <span class="title">Welcome to Vbee OMS</span>
          <p class="text">
            Hi there.<br /><br />
            A new account has just been created for you. Use it to log in to Vbee
            OMS and begin to use the system.<br />By the way, you should change
            your password immediately right after logging in for the first
            time.<br />
            <br />Sincerely,<br />Vbee OMS Team
          </p>
        </div>

        <div class="account-container">
          <strong>Your account information</strong>
          <table class="account-credentials">
            <tr>
              <td>Email:</td>
              <td>${email}</td>
            </tr>
            <tr>
              <td>Password:</td>
              <td>${password}</td>
            </tr>
          </table>
          <a href="https://oms.vbee.vn/" target="_blank" class="login-button">
            <strong>Log in now</strong>
          </a>
        </div>

        <table class="footer">
          <tr>
            <td>
              <img
                src="https://oms.vbee.vn/static/media/vbee-oms-logo-landscape-dark.72f9267f.svg"
                alt="Vbee OMS"
                title="Vbee OMS"
                width="150"
              />
            </td>
            <td>
              <p class="footer-content">
                <strong>Contact for support</strong>
                <br />
                <a
                  href="mailto:longnguyen25111998@gmail.com"
                  target="_blank"
                  rel="noopener"
                  >longnguyen25111998@gmail.com</a
                >
              </p>
            </td>
          </tr>
        </table>
      </div>
    </body>
  </html>
`;

module.exports = { getAccountRegistrationEmailTemplate };

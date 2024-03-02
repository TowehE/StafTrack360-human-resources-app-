// const generateDynamicEmail = (businessName, link) => {
//   return `
//     <html>
//     <head>
//       <style>
//         body, html {
//           margin: 0;
//           padding: 0;
//           height: 100%;
//         }
//         body {
//           display: flex;
//           align-items: center; /* Vertical centering */
//           justify-content: center; /* Horizontal centering */
//           background-color: #f1f1f1;
//           font-family: Arial, sans-serif;
//         }
//         .container {
//           max-width: 600px;
//           padding: 20px;
//           background-color: #ffffff;
//           border-radius: 10px;
//           box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
//           text-align: center;
//         }
//         h1, h2, p {
//           margin: 10px 0;
//         }
//         .verify-button {
//           display: inline-block;
//           padding: 15px 35px;
//           border-radius: 5px;
//           background-color: #007bff;
//           color: #ffffff;
//           text-decoration: none;
//           font-size: 18px;
//           transition: background-color 0.3s;
//         }
//         .verify-button:hover {
//           background-color: #00756a
//         }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <h1>STAFFTRACK360</h1>
//         <h2>Please verify your email</h2>
//         <p>Welcome to StaffTrack360, ${businessName}!</p>
//         <a href="${link}" class="verify-button">Verify Your Email</a>
//         <p>This link expires in 5 minutes.</p>
//       </div>
//     </body>
//     </html>`;
// };

// module.exports = { generateDynamicEmail };


const generateDynamicEmail = (businessName, link) => {
  return `
    <html>
    <head>
      <style>
        body, html {
          margin: 0;
          padding: 0;
          height: 100%;
        }
        body {
          display: flex;
          align-items: center; /* Vertical centering */
          justify-content: center; /* Horizontal centering */
          background-color: #f1f1f1;
          font-family: Arial, sans-serif;
        }
        .container {
          max-width: 600px;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        h1, h2, p {
          margin: 10px 0;
        }
        .verify-button {
          display: inline-block;
          padding: 15px 35px;
          border-radius: 5px;
          background-color: #00756a; /* Green color */
          color: #ffffff;
          text-decoration: none;
          font-size: 18px;
          transition: background-color 0.3s;
        }
        .verify-button:hover {
          background-color: #005c53; /* Darker shade of green */
        }
        .highlight {
          color: #ffa500; /* Orange color */
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>STAFFTRACK360</h1>
        <h2>Please verify your email</h2>
        <p>Welcome to <span class="highlight">${businessName}</span>!</p>
        <a href="${link}" class="verify-button">Verify Your Email</a>
        <p>This link expires in 5 minutes.</p>
      </div>
    </body>
    </html>`;
};

module.exports = { generateDynamicEmail };


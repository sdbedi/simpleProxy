const https = require('https');

var appRouter = (app) => {
  app.get("/", (req, res) => {
    res.status(200).send("Welcome to our restful API");
  });
  app.post("/relay", async (req, res) => {
  	let url = req.body.url;
  	let dataForResponse = await makeGetRequest(url);
  	console.log("response data: ", dataForResponse);
  	res.send(dataForResponse);
  });
}



function makeGetRequest(options) {
  return new Promise ((resolve, reject) => {
    let req = https.get(options);
    req.on('response', res => {
      res.setEncoding("utf8");
  	  let body = "";
      res.on("data", data => {
         body += data;
      });
      res.on("end", () => {
         body = JSON.parse(body);
         console.log("body: ", body);
         resolve(body);
      });
    });

    req.on('error', err => {
      reject(err);
    });
  }); 
}
module.exports = appRouter;
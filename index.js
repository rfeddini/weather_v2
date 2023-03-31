require("dotenv").config();
const axios = require("axios");
const express = require("express");
const app = express();

//const sgMail = require("@sendgrid/mail");
//sgMail.setApiKey(process.env.SENDGRID_API_KEY);
apiKey = process.env.WEATHER_API_KEY;
const port = 4040;
const userMap = new Map();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", function (req, res, next) {
  //console.log(req.headers);
  //const status = req.headers.isconnected;
  //console.log(status);
  console.log("in the middle");
  if (req.headers.isconnected === "true") {
    next();
  } else {
    res.status(401).send("unauthorized");
  }
});

app.post("/signup", async function (req, res) {
  try {
    const user = req.body;
    if (!userMap.has(user.email, user.password)) {
      userMap.set(user.email, user.password);
      console.log(userMap);
      res.send("Weclome");
      return;
    } else {
      res.send("Already exist");
    }
  } catch (error) {
    res.status(404).send("There is an issue");
  }
});

app.get("/signin", async function (req, res) {
  try {
    const user = req.body;
  
    if ((userMap.get(user.email) && (userMap.get(user.email) === user.password))) {
      res.send("you are connected");
      return;
    }
    else{
      res.send("Verify your credentials");
    }
    
  } catch (error) {
    res.send("Connection issues");
  }
});


app.get("/api/weather", async function (req, res) {
  try {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/current.json?q=${req.query.name}&key=${apiKey}`
    );
    res.status(200).send(response.data);
  } catch (error) {
    res.status(404).send("City not Found");
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

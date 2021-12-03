var express = require("express");
var app = express();
app.use(express.json());
app.use(express.urlencoded()); //Parse URL-encoded bodies
const path = require("path");

var db = require("./connect/connection");
const geolib = require("geolib"); //To perform geo operations

app.get("/", function (req, res) {
  console.log(path.join(__dirname + "/pages/hospital.html"));
  res.sendFile(path.join(__dirname + "/pages/hospital.html"));
});

//Handle to recieve HTTPS POST Request from hardware device
app.post("/patient", (req, res) => {
  console.log(req.body);
  console.log("Hospital end point");
  console.log(req.body["patientname"]); // got the josn
  //next we need to get the funciton to find nearest hostpital from patients GPS location
  const patientLat = req.body["lat"];
  const patientLon = req.body["lon"];
  //Get all lat and lon of hospitals

  //Funciton to find minimum distance

  res.send("You r in hospital handle");
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected DB");
    //insertDummyData();
    //compareDisatance(11.2722, 77.8372);
  }
});

//insert some dummy data to DB
async function insertDummyData() {
  var member = {
    Name: "MCC Calicut",
    pincode: "673008",
    lat: "11.2722° N",
    lon: "75.8372° E",
    Numberofbed: 100,
    vacantbed: 50,
  };
  const insertResult = await db.get().collection("hospital").insertOne(member);
  console.log(insertResult);
}

async function findDistance(lat1, lon1, lat2, lon2) {
  const dist = await geolib.getDistance(
    { latitude: lat1, longitude: lon1 },
    { latitude: lat2, longitude: lon2 },
    (accuracy = 1)
  );
  return dist;
}

async function compareDisatance(patLat, patLon) {
  //get all data from DB
  const findResult = await db.get().collection("hospital").find({}).toArray();

  //make a array with object ID and distance
  const dist = {};
  console.log(dist);
  for (let i = 0; i < findResult.length; i++) {
    //console.log(findResult[i]["lat"]);
    var latOne = findResult[i]["lat"];
    var lonOne = findResult[i]["lon"];
    var distance = await findDistance(patLat, patLon, latOne, lonOne);
    console.log(distance);
    console.log("------next----");
  }
}
app.listen(3000);

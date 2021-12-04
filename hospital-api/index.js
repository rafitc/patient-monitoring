var express = require("express");
var ObjectId = require("mongodb").ObjectId;
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const exphbs = require("express-handlebars");

var db = require("./connect/connection"); //to connect with DB
const geolib = require("geolib"); //To perform geo operations

//view engine
app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/add", (req, res) => {
  res.render("form");
});
//send hospital update form
app.get("/hospital", async function (req, res) {
  //get all current hospital details
  const findResult = await db.get().collection("hospital").find({}).toArray();
  //console.log(findResult[0]["Name"]);
  res.render("home", { posts: findResult });
});

app.get("/hospital/:id", async (req, res) => {
  ID = req.params;
  let o_id = new ObjectId(ID); // id as a string is passed
  const filteredDocs = await db
    .get()
    .collection("hospital")
    .find({ _id: o_id })
    .toArray();
  console.log(filteredDocs);

  res.render("loadhospital", { list: filteredDocs[0] });
});

//Handle to recieve HTTPS POST Request from hardware device
app.post("/patient", (req, res) => {
  //console.log(req.body);
  console.log("Hospital end point");
  console.log(req.body["patientname"]); // got the josn
  //next we need to get the funciton to find nearest hostpital from patients GPS location
  const patientLat = req.body["lat"];
  const patientLon = req.body["lon"];
  //Get all lat and lon of hospitals
  compareDisatance(patientLat, patientLon);
  res.send("You are in pateint handle");
});
//handle to update the status of bed
app.post("/update/:id", async (req, res) => {
  const _id = req.params;
  let o_id = new ObjectId(_id); // id as a string is passed
  const updatedbedvalue = parseInt(req.body["updatedbedvalue"]);
  //Got the new value. updte value in DB
  const updateResult = await db
    .get()
    .collection("hospital")
    .updateOne({ _id: o_id }, { $set: { vacantbed: updatedbedvalue } });
  if (updateResult) {
    console.log("Done");
  }
  res.send(updateResult);
});
app.post("/newhospital", async (req, res) => {
  console.log("newhospital");
  //const { address, pincode, lat, lon, totalBed, vacantbed, email } = req.body;
  //putting data into DB
  var newdata = {
    Name: req.body["hospitalname"],
    Address: req.body["address"],
    pincode: parseInt(req.body["pincode"]),
    lat: parseFloat(req.body["lat"]),
    lon: parseFloat(req.body["lon"]),
    Numberofbed: parseInt(req.body["totalBed"]),
    vacantbed: parseInt(req.body["vacant"]),
    email: req.body["email"],
  };
  console.log(newdata);
  const insertResult = await db.get().collection("hospital").insertOne(newdata);
  console.log(insertResult);
  res.send(req.body);
});
db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected DB");
  }
});

//insert data to
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

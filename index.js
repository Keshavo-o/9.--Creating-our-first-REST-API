// console.log("Hello World!");
const express = require("express");
const users = require("./MOCK_DATA.json");
// console.log(users[0]);
const app = express();
app.get("/", (req, res) => {
  res.send("This is the home page");
  //res.send is used to send an html or text(which is html only) response to the client.
});



app.get("/users", (req, res) => {
  // let temp = Math.floor(Math.random() * 1000);
  // res.json(users[temp]);
  res.json(users); // This will send the entire users array as a JSON response
  //res.json is used to send a JSON response to the client
});
app.get("/getrandom", (req, res) => {
  let temp = Math.floor(Math.random() * 1000);
  res.json(users[temp]);
});



app.get("/userID/:Id", (req, res) => {
  let Id = req.params.Id; // Extracting the Id from the URL parameters - without it it wont work
  // Id = Number(Id) - 1;
  // res.json(users[Id]);


  //Here the ID and index number of user objects aligned so it was very easy to retrieve the user data.
  //what if we need to search between the objects - ie if you have to search by numbers or-Id and index numbers dont align
  //we can run a search as -
  //step 1 - get user Id from link - let userId = req.params.Id;
  //step 2 - convert id into number format find the user in the users array
  //step 3 - const user = users.find(u => u.id === userId);
  //step 4 - return res.json(user);
  const id = Number(req.params.Id);
  const user = users.find(u => u.id === id);
  if (!user)
    { 
      return res.status(404).send("User not found");
      //what is res.status ?
      //res.status is a method in Express that sets the HTTP status code for the response
    }
  res.json(user);
});



app.get("/userName/:name", (req, res) => {
  const name = req.params.name;
  const user = users.find(u => u.first_name = name);
  if (!user) {
    return res.status(404).send("User not found");
  }
  res.json(user);
});


app.post("/users",(req,res) => {
  console.log("we will learn about this later");
});


app.patch("/users/:id", (req, res) => {
  console.log("we will learn about this later");
});


app.delete("/users/:id", (req, res) => {
  console.log("we will learn about this later");
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

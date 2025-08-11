// console.log("Hello World!");
// to prevent restarting my server every time i have used nodemon
//To start server purely as node just run "start" script as "npm run start"

//If you are using nodemon - index.js is run as "nodemon index.js" not node "index.js"
// and predefined script is npm run dev



const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");

// console.log(users[0]);
const app = express();
app.use(express.urlencoded({ extended: false }));//middleware -  just for now understand it as a plugin - will help us parse form data

//how can i set a common callback that will run everytime a new request is recieved 


app.get("/", (req, res) => {
  res.send("This is the home page");
  //res.send is used to send an html or text(which is html only) response to the client.
  console.log("Home page accessed");
});



app.get("/api/users", (req, res) => {
  // let temp = Math.floor(Math.random() * 1000);
  // res.json(users[temp]);
  res.json(users); // This will send the entire users array as a JSON response
  //res.json is used to send a JSON response to the client
  console.log("API users accessed");
});
app.get("/api/getrandom", (req, res) => {
  let temp = Math.floor(Math.random() * 1000);
  res.json(users[temp]);
  console.log("API getrandom accessed");
});



app.get("/api/userID/:Id", (req, res) => {
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
  console.log("API userID accessed");
});



//in a real world application .get(/) works on a mobile and returns html response 
//.get(/api/) is used to retrieve data in a structured format (usually JSON) for use in web applications (ie APIs)
//This is just a general guideline and can vary but it is general practice

app.get("/api/userName/:name", (req, res) => {
  const name = req.params.name;
  const user = users.find(u => u.first_name = name);
  if (!user) {
    return res.status(404).send("User not found");
  }
  res.json(user);
  console.log("API userName accessed");
});//These all above get requests works as API ie returns a JSON response - can be used in multiple ways




//Now creating same get requests that returns HTML response - only for browsers
app.get("/users", (req, res) => {
  let html = "<h1>Users List</h1><ul>";
  for(i = 0; i < users.length; i++) {
    html += `<li>${users[i].first_name} ${users[i].last_name}</li>`;
  }
  html += "</ul>";
  res.send(html);//res.send is used to send a HTML response to the client
  console.log("Users accessed");
});



app.get("/userID/:Id", (req, res) => {
  let Id = req.params.Id; 
  const id = Number(req.params.Id);
  let html = `<h1>User Details</h1>`;
  const user = users.find(u => u.id === id);
  if (!user) {
    html += "<p>User not found</p>";
  } else {
    html += `<p>ID: ${user.id}</p>`;
    html += `<p>Name: ${user.first_name} ${user.last_name}</p>`;
  }
  res.send(html);
  console.log("User ID accessed");
});



app.get("/userName/:name", (req, res) => {
  const name = req.params.name;
  let html = "<h1>Users List</h1><ul>";
  const user = users.find(u => u.first_name === name);
  if (!user) {
    html += "<p>User not found</p>";
  } else {
    html += `<p>ID: ${user.id}</p>`;
    html += `<p>Name: ${user.first_name} ${user.last_name}</p>`;
  }
  res.send(html);
  console.log("User Name accessed");
});







//nOW we will understand handling post requests- 
//although they work when something is sent from post on browser
//we will understand their working through POSTMAN




app.post("/users",(req,res) => {
  const newUser = req.body; // Assuming the new user data is sent in the request body
  console.log(newUser);
  //we can even add this user to the users array
  users.push({...newUser,id: users.length + 1});//users was an array of objects so easy pizy
//what is this (...object_name , id:)
//this is using the spread operator to create a new object that includes all properties of newUser
//and adds a new property id with a value of users.length + 1



  //But this only adds it in users array temporarily - ie primary memory
  //You have to use fs module to append data in a file

  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err,data) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log("Data appended to file successfully");
    }
  } );
  //what is write file and append
  //writeFile - replaces the entire content of the file
  //appendFile - adds content to the end of the file

  console.log("New user added");
  res.status(201).json({
    message: "User added successfully",
    user: newUser
  });//res.json used to return json response
});




app.patch("/users/:id", (req, res) => {
  let user_id = Number(req.params.id);
  let my_user = users.find(u => u.id === user_id);
  let new_users_list = users.filter(u => u.id !== user_id);
  console.log("Request recieved for user: " + user_id + " to change details :" + JSON.stringify(req.body));
  //why we used json .stringify here - as it converts the JavaScript object into a JSON string, making it easier to log and inspect the data being sent in the request body.
  //console .log(req.body) prints [object Object] as it does not stringify the object 
  //console can print objects directly though but only when passed to it directly not when referenced
if(req.body.first_name) {
  my_user.first_name = req.body.first_name;
}
if(req.body.last_name) {
  my_user.last_name = req.body.last_name;
}
if(req.body.email) {
  my_user.email = req.body.email;
}
if(req.body.gender) {
  my_user.gender = req.body.gender;
}
if(req.body.ip_address) {
  my_user.ip_address = req.body.ip_address;
}
if(req.body.id)
{
  res.json({ message: "User ID cannot be updated" });
}
new_users_list.push(my_user);
fs.writeFile("./MOCK_DATA.json", JSON.stringify(new_users_list), (err) => {
  if (err) {
    console.error("Error writing to file:", err);
  } else {
    console.log("Data updated successfully");
  }
});
  return res.status(200).json({ message: "User details updated successfully for", user: my_user });
  
});


app.delete("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  let users_new = users.filter(u => u.id !== id);
  //// NOTE: .filter() returns a NEW array (doesn't modify original).
  //users is imported directly from another file as a module as const - we cant reassign value to it
//whereas push directly modifies the original array.used in above methods
  //
// Assign to a new variable(users_new) to avoid const/import reassignment errors.'

// Reassign to 'users' only if it's mutable (let/var).



  //users is a dynamic array of objects as JSON format that can be modified according to our needs but it is stored in temporary memory - you need to modify the file to persist permanent changes
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users_new), (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log("Data updated successfully " + id);
    }
  });
  res.status(204).json({ message: "User deleted successfully" });
  //why this json did not appear in postman
  // Because the status code 204 No Content indicates that the server successfully processed the request, but is not returning any content.
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});


//sample text
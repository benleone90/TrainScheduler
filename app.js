// Initialize Firebase
var config = {
  apiKey: "AIzaSyDT7RW8W3LEXCMG7iKK-YjaEfXzEQWS_x4",
  authDomain: "train-time-8fc70.firebaseapp.com",
  databaseURL: "https://train-time-8fc70.firebaseio.com",
  projectId: "train-time-8fc70",
  storageBucket: "train-time-8fc70.appspot.com",
  messagingSenderId: "480391539691"
};

firebase.initializeApp(config);

var database = firebase.database();

// Button for adding train times
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Get user inputs from textboxes
  var trainName = $("#train-name-input")
    .val()
    .trim();
  var destName = $("#destination-input")
    .val()
    .trim();
  var firstTrain = moment(
    $("#time-input")
      .val()
      .trim(),
    "HH:mm"
  ).format("HH:mm");
  var freqInput = $("#freq-input")
    .val()
    .trim();

  // Create local object to hold train data
  var trainObject = {
    train: trainName,
    destination: destName,
    first: firstTrain,
    frequency: freqInput
  };

  // Uploads train data to Firebase database
  database.ref().push(trainObject);

  // Logs everything to the console
  console.log(trainObject.train);
  console.log(trainObject.destination);
  console.log(trainObject.first);
  console.log(trainObject.frequency);

  alert("New Train Successfully Added!");

  // Clear all text boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#time-input").val("");
  $("#freq-input").val("");
});

// Creating Firebase event to add train time to database and a row in the html when user submits time
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store all info into a variable
  var trainName = childSnapshot.val().train;
  var destName = childSnapshot.val().destination;
  var firstTrain = childSnapshot.val().first;
  var freqInput = childSnapshot.val().frequency;

  // Console log train info
  console.log(trainName);
  console.log(destName);
  console.log(firstTrain);
  console.log(freqInput);

  // Convert First Train to earlier than current time
  var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
  console.log(firstTrainConverted);

  // Log Current Time
  var currentTime = moment();
  console.log("Current Time: " + currentTime.format("hh:mm"));

  //Difference between Current Time and First Train
  var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
  console.log("Difference in Time: " + diffTime);

  // Time Apart (remainder)
  var timeRemaind = diffTime % freqInput;
  console.log(timeRemaind);

  // Minutes Until Next Train
  var minAway = freqInput - timeRemaind;
  console.log("Minutes Until Next Train: " + minAway);

  var nextArrival = moment().add(minAway, "minutes");
  console.log("Arrival Time: " + moment(nextArrival).format("hh:mm"));

  // Create new row to be appended to the table
  var newRow = $("<tr>").append(
    $('<td class="text-center">').text(trainName),
    $('<td class="text-center">').text(destName),
    $('<td class="text-center">').text(firstTrain),
    $('<td class="text-center">').text(freqInput + " minutes"),
    $('<td class="text-center">').text(moment(nextArrival).format("hh:mm A")),
    $('<td class="text-center">').text(minAway)
  );

  // Append new row to table body
  $("#train-table > tbody").append(newRow);
});

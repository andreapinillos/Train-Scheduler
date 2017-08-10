$(document).ready(function() {
});

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDPVog1qtvEMZ3brrv9gcWB9ZF4_c-hIkM",
    authDomain: "train-schedule-3a9ec.firebaseapp.com",
    databaseURL: "https://train-schedule-3a9ec.firebaseio.com",
    projectId: "train-schedule-3a9ec",
    storageBucket: "train-schedule-3a9ec.appspot.com",
    messagingSenderId: "541908491312"
  };
  firebase.initializeApp(config);

var dataRef = firebase.database();

//initial values
var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = "";
var nextTrain = "";
var nextTrainFormatted = "";
var firstTimeConverted = "";
var currentTime = "";
var diffTime = "";
var tRemainder = "";
var minutesTillTrain = "";


$(document).ready(function() {

     $("#add-train").on("click", function() {
     	event.preventDefault();

     	trainName = $('#name-input').val().trim();
     	destination = $('#destination-input').val().trim();
     	firstTrainTime = $('#first-train-time-input').val().trim();
     	frequency = $('#frequency-input').val().trim();
        firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
         currentTime = moment();
         diffTime = moment().diff(moment(firstTimeConverted), "minutes");
         tRemainder = diffTime % frequency;
         minutesTillTrain = frequency - tRemainder;
         nextTrain = moment().add(minutesTillTrain, "minutes");
         nextTrainFormatted = moment(nextTrain).format("hh:mm");

     	// Code for the push
     	dataRef.ref().push({
     	trainName: trainName,
     	destination: destination,
     	firstTrainTime: firstTrainTime,  
     	frequency: frequency,
        nextTrainFormatted: nextTrainFormatted,
        minutesTillTrain: minutesTillTrain
             // dateAdded: firebase.database.ServerValue.TIMESTAMP
     	});

        trainName = $('#name-input').val().trim();
     	destination = $('#destination-input').val().trim();
     	firstTrainTime = $('#first-train-time-input').val().trim();
     	frequency = $('#frequency-input').val().trim();

     	return false;
     });
     dataRef.ref().on("child_added", function(childSnapshot) {

     // Log everything that's coming out of snapshot
      console.log(childSnapshot.val().trainName);
      console.log(childSnapshot.val().destination);
      console.log(childSnapshot.val().frequency);
      console.log(childSnapshot.val().nextTrainFormatted);
      console.log(childSnapshot.val().minutesTillTrain);

	// full list of items to the well
		$('.train-schedule').append("<tr class='table-row' id=" + "'" + childSnapshot.val() + "'" + ">" +
               "<td class='col-xs-3'>" + childSnapshot.val().trainName +
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().destination +
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().frequency +
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().nextTrainFormatted + // Next Arrival Formula ()
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().minutesTillTrain + // Minutes Away Formula
               "</td>" +
               "<td class='col-xs-1'>" + "<input type='submit' value='remove train' class='remove-train btn btn-primary btn-sm'>" + "</td>" +
          "</tr>");

// Handles the errors
}, function(errorObject){
	console.log("Errors handled: " + errorObject.code)
});

//removes train
 $("body").on("click", ".remove-train", function(){
 $(this).closest ('tr').remove();
  var getKey = $(this).parent().parent().attr('id');
  dataRef.child(getKey).remove();
});

}); // Closes jQuery wrapper


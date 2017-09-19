// Array that holds gifs.
var topics = [];

// Event listeners
//____________________________________________________________________________________
// Add click event listener to all elements with a class of "topic".
function addTopicClickEventListener() {
	$(".topic").on("click", function() {

		// Set topic to selected item.
		var topic = $(this).attr("data-name");

		// Retrieve gifs for selected topic.
		retrieveGifs(topic);
	});
};

// Add click event listener to all elements with a class of "gif".
function addGifClickEventListener() {
	$(".gif").on("click", function() {
	  var state = $(this).attr("data-state");
	  // If the clicked image's state is still, update its src attribute to what its data-animate value is then set the image's data-state to animate.
	  // Else set src to the data-still value.
	  if (state === "still") {
	    $(this).attr("src", $(this).attr("data-animate"));
	    $(this).attr("data-state", "animate");
	  } else {
	    $(this).attr("src", $(this).attr("data-still"));
	    $(this).attr("data-state", "still");
	  }
	});
};

// Add click event listener to all elements with "add-animal" ID.
function addNewTopicClickEventListener() {
	$("#add-animal").on("click", function() {

	  event.preventDefault();

	  // Create new topic from input value.
	  var newTopic = $("#topic-input").val().trim();

	  var alreadyTopicCheck = jQuery.inArray(newTopic, topics);

	  // Don't create a new topic for an empty string.
	  if (newTopic === "") {
	  	return;
	  } else if (alreadyTopicCheck !== -1){
	  	// Clear out input text as a courtesy to your user.
	  	$("#topic-input").val("");
	  	return;
	  } else {

	  	// Check if topic exists first then retrieve data
	  	checkTopicExists(newTopic);

	  }

	});
};


function checkTopicExists(newTopic) {
	var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + newTopic  + "&limit=10&api_key=dc6zaTOxFJmzC";  

	// Create AJAX call for the specific topic.
	$.ajax({
	url: queryURL,
	method: "GET"
	}).done(function(response) {

	  console.log(response);

	

	  if (response.data.length === 0) {

	  	// Let user know that no data exists.
	  	alert("No gifs found for that animal!");
	  	// Clear out input text 
	  	$("#topic-input").val("");

	  	return;

	  } else {

	  	// Display retrieved gifs.
	  	retrieveGifs(newTopic);

	  	topics.push(newTopic);

	  	renderButtons();

	  	$("#topic-input").val("");
	  }

	});

};


function renderButtons() {

	// Delete the topics prior to adding new topics.
	$(".buttons-container").empty();

	for (var i = 0; i < topics.length; i++) {

	  // Generate buttons for each topic in the array.
	  var a = $("<button>");
	  
	  // Add a class of topic to button.
	  a.addClass("topic btn btn-default navbar-btn");
	  
	  // Add a data-attribute needed for gif search.
	  a.attr("data-name", topics[i]);
	  
	  // Provide initial button text.
	  a.text(topics[i]);
	  
	  // Add button to the buttons-container div.
	  $(".buttons-container").append(a);
	}

	addTopicClickEventListener();
};

// Retrieve gifs for selected topic.
function retrieveGifs(topic) {

	// Query giphy API to retrieve 10 gifs matching the topic.
	var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + topic  + "&limit=10&api_key=dc6zaTOxFJmzC";  

	// Create AJAX call for the specific topic.
	$.ajax({
	url: queryURL,
	method: "GET"
	}).done(function(response) {

	  console.log(response);

	  displayGifs(response);

	});
};

// Display gifs in DOM.
function displayGifs(response) {

	// Delete existing gifs to make room for new gifs. 
	$("#display-gifs").empty();

	// Loop through array of gif responses... 
	for (var i = 0; i < response.data.length; i++) {

		// Dynamically generate divs for each gif.
		var gifDiv = $("<div class='gif pull-left'>");

		// Store the rating data for a gif.
		var rating = response.data[i].rating;

		// Create an element to store the rating info.
		var ratingInfo = $("<div class='rating'>").text("Rating: " + rating);

		// Display rating.
		gifDiv.append(ratingInfo);

		// Store original gif for animations.
		var originalGif = response.data[i].images.original.url;

		// Store still version of gif for still state.
		var stillGif = response.data[i].images.original_still.url;

		// Append src to image.
		var gifImage = $("<img>").attr("src", stillGif);

		gifImage.addClass("gif");

		gifImage.attr("data-still", stillGif);

		gifImage.attr("data-animate", originalGif);

		// Default src displayed is still gif.
		gifImage.attr("data-state", "still");

		gifDiv.append(gifImage);

		// Add gif div to gif section.
		$("#display-gifs").append(gifDiv);

	}

	// Add listeners to dynamic gifs.
	addGifClickEventListener();
};

$(document).ready(function() {
	
	renderButtons();
	
	addNewTopicClickEventListener();
});
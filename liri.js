// Modules & API KEYS
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require('axios');
var fs = require('fs');
var moment = require('moment');

// grab & join search command line arguments
var command = process.argv[2];
var input = process.argv.splice(3).join(" ");

// Command Function
function commandInput(command, input) {

    // spotify-this-song command
    if (command == 'spotify-this-song') {

        // Default Input
        var input;
        if (input === '') {
            input = 'The Sign Ace Of Base';
        } else {
            input = song;
        }
        spotify
            .search({ type: 'track', query: input })

            // console.log response
            .then(function (response) {
                console.log(`Artist: ${response.tracks.items[0].artists[0].name}`)
                console.log(`Song: ${response.tracks.items[0].name}`)
                console.log(`Link: ${response.tracks.items[0].preview_url}`)
                console.log(`Album: ${response.tracks.items[0].album.name}`)
            })

        // movie-this command
    } else if (command == "movie-this") {
        if (input == "") {
            input = "Mr.Nobody"
        }
        axios.get("https://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy").then(
            function (response) {
                console.log(`Movie: ${response.data.Title}`);
                console.log(`Year: ${response.data.Year}`);
                console.log(`IMDb Rating: ${response.data.imdbRating}`);
                console.log(`Rotten Tomoatoes Rating: ${response.data.Ratings[1].Value}`);
                console.log(`Country: ${response.data.Country}`);
                console.log(`Language: ${response.data.Language}`);
                console.log(`Plot: ${response.data.Plot}`);
                console.log(`Actors: ${response.data.Actors}`);
            })

        // concert-this command
    } else if (command == "concert-this") {

        axios.get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp").then(
            function (response) {
                for (i = 0; i < response.data.length; i++) {
                    console.log(`Artist: ${response.data[i].lineup.join(", ")}`)
                    console.log(`Venue: ${response.data[i].venue.name}`)
                    console.log(`Location: ${response.data[i].venue.city}, ${response.data[i].venue.region}, ${response.data[i].venue.country}`);
                    console.log("Date: " + moment(response.data[i].datetime).format("MM/DD/YYYY"))
                }

            })
        // do-what-it-says command
    } else if (command == "do-what-it-says") {
        fs.readFile("random.txt", "utf8", function (error, data) {
            if (error) {
                return console.log(error);
            }
            else {

                // create random text array
                var randomText = data.split(",");

                // set command to first item in array
                command = randomText[0];

                // set input to second item in array
                input = randomText[1];

                // call commandInput function
                commandInput(command, input)
            }

        })
    }
}
// Call commandInput Function
commandInput(command, input)
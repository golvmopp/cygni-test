/*
  A model of an artist, containing its ID, a description and a list of albums.
  Also contains the important method fillArtist
*/

const Album = require('./album.js');
const request = require('request-promise');

function Artist(id) {
  // The MBID taken as input
  this.id = id;
  this.name = "notfound"
  this.description = "notfound"
  this.albums = []
  // The Method. Called after constructor creation, returns a
  // Promise which fills the artist with correct property values
  this.fillArtist = fillArtist;
};

// GET request object
var reqObj = {
  url: "",
  getData: function() {
    return request({
      "method":"GET",
      "uri": reqObj.url,
      "headers": {
        'User-Agent': 'AlbumImageApp/1.0.0 ( mail@golvmopp.it )'
      }
    });
  }
}

function fillArtist(artist) {
  // Make the request to music brainz
  reqObj.url = "https://musicbrainz.org/ws/2/artist/" + artist.id
                + "?&fmt=json&inc=url-rels+release-groups";
  return reqObj.getData().then((result) => {
    var MBObject = JSON.parse(result);
    artist.name = MBObject.name;

    // Find the wikipedia name from the MB data
    var wikiLink;
    for (r in MBObject["relations"]) {
      var t = MBObject["relations"][r]["type"]
      if (t === "wikipedia") {
        wikiLink = MBObject["relations"][r]["url"]["resource"]
        break;
      }
    }
    var wikiName = wikiLink.split("/").pop();

    // Build the album list with IDs and names
    for (a in MBObject["release-groups"]) {
      if(MBObject["release-groups"][a]["primary-type"] === "Album") {
        var albumId = MBObject["release-groups"][a]["id"];
        var albumName = MBObject["release-groups"][a]["title"];
        var release = MBObject["release-groups"][a]["first-release-date"];
        var album = new Album(albumId, albumName, release);
        artist.albums.push(album);
      }
    }

    // Make the call to Wikipedia
    reqObj.url = "https://en.wikipedia.org/w/api.php?action=query&format=jso" +
          "n&prop=extracts&exintro=true&redirects=true&titles=" + wikiName;
    return reqObj.getData().then((result) => {
      var wikiObject = JSON.parse(result)
      // The page number is found in the JSON object
      // If called correctly, there should only be one page number
      for (p in wikiObject["query"]["pages"]) {
        artist.description = wikiObject["query"]["pages"][p]["extract"];
        break;
      }

      // Start the recursive album image function
      // return getAlbumImage(artist.albums.length - 1, artist);

      // Create promises for album images
      var albumPromises = [];
      for (currentAlbum in artist.albums) {
        reqObj.url = "http://coverartarchive.org/release-group/"
            + artist.albums[currentAlbum].ID;
        var newPromise = reqObj.getData();
        albumPromises.push(newPromise);
      }

      // Failsafe for concurrency
      // From https://nmaggioni.xyz/2016/10/13/Avoiding-Promise-all-fail-fast-behavior/
      const toResultObject = (promise) => {
          return promise
          .then(result => ({ success: true, result }))
          .catch(error => ({ success: false, error }));
      };

      // Running all album lookups simultaneously
      return Promise.all(albumPromises.map(toResultObject)).then((results) => {
        for (var i = 0; i < results.length; i++) {
          if (results[i].success) {
            var imageObj = JSON.parse(results[i].result)
            var imgUrl = imageObj["images"][0]["image"];
            artist.albums[i].imageURL = imgUrl;
          } else {
            artist.albums[i].imageURL = "no image";
          }
        }
      }, (error) => {
        console.log("Error in toResultObject " + error);
      })

    }, (err) => {
      console.error("Could not find Wiki page with name " + wikiName);
      return;
    });
  }, (err) => {
    console.error("Could not find artist with ID " + artist.id);
    return;
  });
}

module.exports = Artist;

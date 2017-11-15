/*
  A model of an artist, containing its ID, a description and a list of albums.
  Also contains the important method fillArtist
*/

const Album = require('./album.js');
const request = require('request-promise');

function Artist(id) {
  // The MBID taken as input
  this.id = id;
  this.name = ""
  this.description = ""
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
        artist.description = wikiObject["query"]["pages"][p]["extract"]
        break;
      }

      // Start the recursive album image function
      return getAlbumImage(artist.albums.length - 1, artist);

    }, (err) => {
      console.error("Could not find Wiki page with name " + wikiName);
      return
    })
  }, (err) => {
    console.error("Could not find artist with ID " + artist.id);
    return
  })
}

// Recursively going through the list of albums, getting images from
// the Cover Art Archive
function getAlbumImage(currentAlbum, artist) {
  if (currentAlbum < 0) return;

  reqObj.url = "http://coverartarchive.org/release-group/"
      + artist.albums[currentAlbum].ID;

  return reqObj.getData().then((result) => {
    var imageObj = JSON.parse(result);
    var imgUrl = imageObj["images"][0]["image"];
    artist.albums[currentAlbum].imageURL = imgUrl;
    return getAlbumImage(currentAlbum - 1, artist);
  }, (error) => {
    console.log("No image for album " + artist.albums[currentAlbum].name);
    artist.albums[currentAlbum].imageURL = "no image"
    return getAlbumImage(currentAlbum - 1, artist);
  })
}

// This function may be unecessary
function getName(artistobject) {
  var name = "placeholder name";
  name = artistobject.name;
  return name;
}

function fetchDescription(id) {
  var description = "placeholder description";

  return description;
}

function getAlbums(json) {
  var albums = [];
  return albums;
}

module.exports = Artist;

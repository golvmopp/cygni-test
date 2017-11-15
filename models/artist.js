/*
  A model of an artist, containing its ID, a description and a list of albums.
*/

const Album = require('./album.js');
const request = require('request-promise');

function Artist(id) {
  // The MBID taken as input
  this.id = id;
  // Name of the artist
  this.name = "placeholder name"
  // Fetch the artist description from Wikipedia, based on their name
  this.description = "placeholder description"
  // A list of Album objects, each being a released album of the artist
  this.albums = []
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
  var MBObject;

  return reqObj.getData().then((result) => {
    MBObject = JSON.parse(result);
    artist.name = MBObject.name;

    // Find the wikipedia name from the MB data
    var wikiLink;
    for (r in MBObject["relations"]) {
      var t = MBObject["relations"][r]["type"]
      if (t === "wikipedia") {
        wikiLink = MBObject.relations[r]["url"]["resource"]
        break;
      }
    }
    var wikiName = wikiLink.split("/").pop();

    // Build the album list with IDs and names
    for (a in MBObject["release-groups"]) {
      if(MBObject["release-groups"][a]["primary-type"] === "Album") {
        var albumId = MBObject["release-groups"][a]["id"];
        var albumName = MBObject["release-groups"][a]["title"];
        var year = MBObject["release-groups"][a]["first-release-date"];
        var album = new Album(albumId, albumName, year);
        artist.albums.push(album);
      }
    }

    // Make the call to Wikipedia
    reqObj.url = "https://en.wikipedia.org/w/api.php?action=query&format=jso" +
          "n&prop=extracts&exintro=true&redirects=true&titles=" + wikiName;
    return reqObj.getData().then((result) => {
      var wikiObject = JSON.parse(result)

      // The page number is found in the JSON object
      for (p in wikiObject["query"]["pages"]) {
        artist.description = wikiObject["query"]["pages"][p]["extract"]
        break;
      }


    })
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

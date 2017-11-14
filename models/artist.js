/*
  A model of an artist, containing its ID, a description and a list of albums.
*/

const Album = require('./album.js');

function Artist(id) {
  this.ID = id
  this.description = ""
  this.albums = []
};

Artist.prototype.fetchDescription = function () {
  this.description = "Description of " + this.ID
};

Artist.prototype.fetchAlbums = function () {

};

module.exports = Artist;

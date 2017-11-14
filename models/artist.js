/*
  A model of an artist, containing its ID, a description and a list of albums.
*/

const Album = require('./album.js')

function Artist(id) {
  this.ID = id
  this.description = ""
  this.albums = []
}

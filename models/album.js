/*
  An album, containing ID, release year, link to image, etc.
*/

function Album(id, name, date) {
  this.ID = id
  this.name = name
  this.release = date
  this.imageURL = ""
};



module.exports = Album;

/*
  An album, containing ID, release year, link to image, etc.
*/

function Album(id, name, year) {
  this.ID = id
  this.name = name
  this.year = year
  this.imageURL = ""
};



module.exports = Album;

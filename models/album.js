/*
  An album, containing ID, release year, link to image, etc.
*/

function Album() {
  this.ID = ""
  this.year = 0
  this.imageURL = ""
}

Album.prototype.fetchImageURL = function () {
  this.imageURL = "Url for " + this.ID
};


module.exports = Album;

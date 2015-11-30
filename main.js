var mainCanvas = document.getElementById("MyCanvas1");
var mainContext = mainCanvas.getContext('2d');

var names = [];

mainCanvas.width  = window.innerWidth;
mainCanvas.height = window.innerHeight;

mainContext.fillStyle = '#666666';
mainContext.font = '40px Verdana';
mainContext.textAlign = 'center';
mainContext.textBaseline = 'middle';

var fontHeight = 40;
var totalRows = Math.floor(window.innerHeight / fontHeight);

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

getJSON('names.json').then(function(data) {
  console.log(data.length, 'names loaded.');
  init(data.slice(0, 100));
}, function(status) {
  console.log('Something went wrong.', status);
});

function Text(name, age, speed, xPos, yPos, index) {
  this.name  = name;
  this.age   = age;
  this.speed = speed;
  this.xPos  = xPos;
  this.yPos  = yPos;
  this.sign  = ( index % 2 === 0 ) ? -1 : 1;

  this.step = (index % 2 === 0 ) ? -window.innerWidth : 0;

}

Text.prototype.update = function () {
  this.step += this.sign * this.speed;

  console.log(this.name, this.xPos);
  mainContext.fillStyle = colorByAge(this.age);
  mainContext.fillText(this.name, this.xPos + this.step, this.yPos);

};

function init( data ) {
  var rows = splitArr(data, totalRows);

  for( var index = 0; index < totalRows; index++ ) {
    createRow(rows[index], fontHeight += 40, index);
  }

  drawAndUpdate();

}

function createRow( data, yPos, index ) {
  var name = null;
  var xPos = 0;
  var speed = 0.1 + Math.random() * 0.5;

  for(var i = 0; i < data.length; i++) {
    xPos += Math.floor(mainContext.measureText(data[i].name).width + 20);
    name = new Text(data[i].name, data[i].age, speed, xPos, yPos, index);
    names.push(name);
  }
}

function drawAndUpdate() {
  mainContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    name.update();
  }

  requestAnimationFrame(drawAndUpdate);
}

function colorByAge( age ) {
  if ( age > 5 && age < 10 ) {
    return '#666666'
  }

  if ( age >= 10 ) {
    return '#FFFFFF'
  }

  if ( age < 5 ) {
    return '#333333';
  }
}

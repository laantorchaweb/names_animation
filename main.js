(function() {
  var fps_element = document.getElementById('fps');
  var mainCanvas  = document.getElementById("MyCanvas1");
  var mainContext = mainCanvas.getContext('2d');

  var names = [];

  mainCanvas.width  = window.innerWidth;
  mainCanvas.height = window.innerHeight;

  mainContext.fillStyle = '#666666';
  mainContext.font = 'normal normal lighter 45px Helvetica';
  mainContext.textAlign = 'center';
  mainContext.textBaseline = 'bottom';

  var rowHeight  = 50;
  var fontHeight = 0;
  var totalRows = Math.floor(window.innerHeight / rowHeight);

  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  getJSON('names.json').then(function(data) {
    console.log(data.length, 'names loaded.');

    init(data);
  }, function(status) {
    console.log('Something went wrong.', status);
  });

  var FPS = {
    startTime: 0,
    frameNumber: 0,
    getFPS: function(){
      this.frameNumber++;
      var d = new Date().getTime(),
        currentTime = ( d - this.startTime ) / 1000,
          result = Math.floor( ( this.frameNumber / currentTime ) );
          if (currentTime > 1) {
            this.startTime = new Date().getTime();
            this.frameNumber = 0;
          }
          return result;
    }
  };

  function Text(name, age, speed, xPos, yPos, index) {
    this.name  = name.toUpperCase();
    this.age   = age;
    this.speed = speed;
    this.xPos  = xPos;
    this.yPos  = yPos;
    this.sign  = ( index % 2 === 0 ) ? -1 : 1;

    this.counter = 0;

  }

  Text.prototype.update = function () {
    this.counter += this.sign * this.speed;

    mainContext.fillStyle = colorByAge(this.age);
    mainContext.fillText(this.name, this.xPos + this.counter, this.yPos);

  };

  function init( data ) {
    var rows = splitArr(data, totalRows);

    for( var index = 0; index < totalRows; index++ ) {
      createRow(rows[index], fontHeight += rowHeight, index);
    }

    drawAndUpdate();

  }

  function createRow( data, yPos, index ) {
    var name  = null;
    var xPos  = ( index % 2 === 0 ) ? 0 : -window.innerWidth * 5;
    var speed = 0.5 + Math.random() * 1.5;

    for(var i = 0; i < data.length; i++) {
      xPos += Math.floor( mainContext.measureText(data[i].name).width + 200);
      name = new Text(data[i].name, data[i].age, speed, xPos, yPos, index);
      names.push(name);
    }
  }


  function drawAndUpdate() {
    requestAnimationFrame(drawAndUpdate);

    fps_element.innerText = FPS.getFPS() + ' fps';

    mainContext.fillStyle = '#000000';
    mainContext.fillRect(0, 0, window.innerWidth, window.innerHeight);

    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      name.update();
    }


  }

  function colorByAge( age ) {
    if ( age > 8 && age < 12 ) {
      return '#666666'
    }

    if ( age >= 12 ) {
      return '#FFFFFF'
    }

    if ( age < 8 ) {
      return '#333333';
    }
  }
})();

(function() {
  var fps_element = document.getElementById('fps');
  var mainCanvas  = document.createElement('canvas');
  var mainContext = mainCanvas.getContext('2d');

  document.getElementById('container').appendChild(mainCanvas);
  var names = [];

  mainCanvas.width  = 1920 * 3;
  mainCanvas.height = ( mainCanvas.width >= 1920 ) ? 900 : window.innerHeight;
  var isMultiple = mainCanvas.height === 900 ? true : false;
  var canvas2 = null;
  var canvas3 = null;
  var ctx2 = null;
  var ctx3 = null;
  isMultiple = true;

  if ( isMultiple ) {
    canvas2 = document.createElement('canvas');
    canvas3 = document.createElement('canvas');
    ctx2 = canvas2.getContext('2d');
    ctx3 = canvas3.getContext('2d');

    canvas2.width = 1920 * 3;
    canvas2.height = 900;
    canvas3.width = 1920 * 3;
    canvas3.height = 900;

    document.getElementById('container').appendChild(canvas2);
    document.getElementById('container').appendChild(canvas3);

    ctx2.fillStyle = '#666666';
    ctx2.font = 'normal normal lighter 45px Helvetica';
    ctx2.textAlign = 'center';
    ctx2.textBaseline = 'bottom';

    ctx3.fillStyle = '#666666';
    ctx3.font = 'normal normal lighter 45px Helvetica';
    ctx3.textAlign = 'center';
    ctx3.textBaseline = 'bottom';
  }

  var screens = [mainContext, ctx2, ctx3];

  mainContext.fillStyle = '#666666';
  mainContext.font = 'normal normal lighter 45px Helvetica';
  mainContext.textAlign = 'center';
  mainContext.textBaseline = 'bottom';

  var rowHeight  = 50;
  var fontHeight = 0;
  var totalRows = Math.floor(900 / rowHeight);

  getJSON('names.json').then(function(data) {
    console.log(data.length, 'names loaded.');

    init(data);
  }, function(status) {
    console.log('Something went wrong.', status);
  });

  function Text(name, age, speed, xPos, yPos, index, ctx) {
    this.name  = name.toUpperCase();
    this.age   = age;
    this.speed = speed;
    this.xPos  = xPos;
    this.yPos  = yPos;
    this.sign  = ( index % 2 === 0 ) ? -1 : 1;
    this.startX = xPos;
    this.ctx = ctx;


    this.step = 0;
    this.steps = mainCanvas.width * 5;
    this.counter = 0;

  }

  Text.prototype.update = function () {
    this.counter += this.sign * this.speed;
    this.step += 1;

    if ( ( this.sign === -1 && this.counter <= this.steps * this.sign ) || ( this.sign === 1 && this.counter >= this.steps ) ) {
      this.step = 0;
      this.counter = 0;
    }

      this.ctx.fillStyle = colorByAge(this.age);
      this.ctx.fillText(this.name, this.xPos + this.counter, this.yPos);

  };

  function init( data ) {
    var rows = splitArr(data, screens.length);
    var screen = screens[0];
    var data_row = [];

    for( var e = 0; e < rows.length; e++ ) {
      data_row = splitArr(rows[e], totalRows);
      fontHeight = 0;

      for( var index = 0; index < data_row.length; index++ ) {
        createRow(data_row[index], fontHeight += rowHeight, index, screens[e]);
      }

    }

    drawAndUpdate();

  }

  function createRow( data, yPos, index, screen ) {
    var name  = null;
    var xPos  = ( index % 2 === 0 ) ? 0 : -window.innerWidth * 5;
    var speed = 0.5 + Math.random() * 0.9;

    for(var i = 0; i < data.length; i++) {
      xPos += Math.floor( mainContext.measureText(data[i].name).width + 200);
      name = new Text(data[i].name, data[i].age, speed, xPos, yPos, index, screen);
      names.push(name);
    }
  }


  function drawAndUpdate() {
    requestAnimationFrame(drawAndUpdate);

    fps_element.innerText = 'v2 / ' + FPS.getFPS() + ' fps';

    for (var s = 0; s < screens.length; s++) {
      screens[s].fillStyle = '#000000';
      screens[s].fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

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

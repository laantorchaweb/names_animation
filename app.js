(function() {

  var app = {
    rows: [],
    names: [],

    config: {
      endpoint: 'names.json',

      screen_width: 1920,
      screen_height: 900,

      row_height: 50,
      font_height: 0,
      total_rows: function() {
        var screens = app.getCanvas();

        return Math.floor( (900 * screens.length) / this.row_height);
      },

      fill_style: '#666666',
      font: 'normal normal lighter 45px Helvetica',
      text_align: 'center',
      text_baseline: 'middle'
    },

    init: function() {
      var _this = this;

      this.fps_element = document.getElementById('fps');

      this.setCanvas();
      this.fetch(this.config.endpoint);
    },

    setCanvas: function() {
      this.shouldWrap = true; //( window.innerWidth >= this.config.screen_width * 6 );

      this.screen_1 = this.createCanvasAndContext();

      if ( this.shouldWrap ) {

        this.screen_2 = this.createCanvasAndContext();
        this.screen_3 = this.createCanvasAndContext();

      }

    },

    createCanvasAndContext: function() {
      var canvas  = document.createElement('canvas');
      var context = canvas.getContext('2d');

      canvas.width  = ( this.shouldWrap ) ? this.config.screen_width * 3 : window.innerWidth;
      canvas.height = this.config.screen_height;

      document.getElementById('container').appendChild(canvas);

      return {
        canvas: canvas,
        context: context
      };
    },

    getCanvas: function() {
      return ( this.shouldWrap ) ? [ this.screen_1, this.screen_2, this.screen_3 ] : [this.screen_1];
    },

    fetch: function( url ) {
      var _this = this;

      getJSON( url ).then(function(data) {
        console.log(data.length, 'names loaded.');
        var names = data.sort(function (a, b) { return Math.random() > 0.3; });

        _this.splitData(names);

      }, function(status) {
        console.log('Something went wrong.', status);
      });

    },

    splitData: function( data ) {
      var rows        = splitArr(data, this.config.total_rows());
      var screens     = this.getCanvas();
      var rows_screen = rows.length / screens.length;
      var screen = screens[0];

      for( var index = 0; index < rows.length; index++ ) {
        if ( index === rows_screen ) {
          this.config.font_height = 0;
          screen = screens[1];
        }

        if ( index === rows_screen * 2 ) {
          this.config.font_height = 0;
          screen = screens[2];
        }

        this.createRow(screen, rows[index], index);
      }

      drawAndUpdate();
    },


    createRow: function( screen, data, index ) {
      var name  = null;
      var xPos  = ( index % 2 === 0 ) ? 0 : 0;
      var yPos = 0;
      var speed = 0.5 + Math.random() * 0.5;
      var row   = [];

      yPos += 50 * index;

      console.log(yPos);
      for(var i = 0; i < data.length; i++) {
        xPos += Math.floor( screen.context.measureText(data[i].name).width + 400);
        name = new Name(screen, data[i].name, data[i].age, speed, xPos, yPos, index);
        row.push(name);
      }

      screen.rows = row;
    },

  };

  function drawAndUpdate() {
    var _this   = app,
      screens   = _this.getCanvas(),
      screen    = null,
      name      = null;

      //requestAnimationFrame(drawAndUpdate);

      _this.fps_element.innerText = FPS.getFPS() + ' fps';

      for( var s = 0; s < screens.length; s++) {
        screen = screens[s];
        screen.context.fillStyle = '#000000';
        screen.context.fillRect(0, 0, window.innerWidth, window.innerHeight);

        for (var i = 0; i < screen.rows.length; i++) {
          name = screen.rows[i];
          console.log(screen.rows[i].yPos)
          name.update(screen.context);
        }
      }
  }

  function Name(screen, name, age, speed, xPos, yPos, index) {
    this.name  = name.toUpperCase();
    this.age   = age;
    this.speed = speed;
    this.xPos  = xPos;
    this.yPos  = Math.floor( index * Math.random() + 50 );
    this.sign  = ( index % 2 === 0 ) ? -1 : 1;
    this.startX = xPos;
    this.screen = screen;

    this.step = 0;
    this.counter = 0;

    this.steps = this.screen.canvas.width * 5;
  };

  Name.prototype.update = function() {
    var ctx = this.screen.context;

    console.log('ypos inside name: ', this.yPos);
    this.counter += this.sign * this.speed;
    this.step += 1;

    if ( ( this.sign === -1 && this.counter <= this.steps * this.sign ) || ( this.sign === 1 && this.counter >= this.steps ) ) {
      this.step = 0;
      this.counter = 0;
    }

    this.screen.context.fillStyle = this.colorByAge(this.age);
    this.screen.context.font = app.config.font;
    this.screen.context.textAlign = app.config.text_align;
    this.screen.context.textBaseline = app.config.text_baseline;
    this.screen.context.fillText(this.name, this.xPos + this.counter, this.yPos / 2);

  };


  Name.prototype.colorByAge = function() {
    var age = this.age;

    if ( age > 8 && age < 12 ) {
      return '#666666'
    }

    if ( age >= 12 ) {
      return '#FFFFFF'
    }

    if ( age < 8 ) {
      return '#333333';
    }
  };

  app.init();

})();

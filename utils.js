var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var getJSON = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();

    xhr.open('get', url, true);
    xhr.responseType = 'json';

    xhr.onload = function() {
      var status = xhr.status;

      if ( status == 200 ) {

        resolve(xhr.response);

      } else {

        reject(status);

      }
    };

    xhr.send();

  });
};


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

function splitArr(a, n) {
  var len  = a.length,
    out  = [],
      i    = 0,
        size = 0;

        while (i < len) {
          size = Math.ceil((len - i) / n--);
          out.push(a.slice(i, i += size));
        }

        return out;
}

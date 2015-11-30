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

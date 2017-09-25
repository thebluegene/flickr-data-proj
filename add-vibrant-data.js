var fs = require('fs');
var Vibrant = require('node-vibrant');
var converter = require('json2csv');
var csv = require('csv-parser');
var AsyncLib = require('async');
var getColors = require('get-image-colors');

var dataArray = [];
var count = 0;
var myReadStream = fs.createReadStream('flickr-data-final.csv');

var worker = function(payload, cb) {
  var url = "https://farm" + payload.farm + ".staticflickr.com/" + payload.server + "/" + payload.id + "_" + payload.secret + "_n.jpg";
  // Vibrant.from(url).getPalette(function(err, palette) {
  //   if(!err && palette.Vibrant) {
  //     console.log(palette.Vibrant.getHex());
  //     payload.color = palette.Vibrant.getHex();
  //     dataArray.push(payload);
  //   }
  //   else {
  //     console.log("null");
  //     payload.color = 'null';
  //     dataArray.push(payload);
  //   }
  //   return cb();
  // });
  getColors(url, function(err, colors) {
    if(!err) {
      console.log(colors[1].hex());
      payload.color2 = colors[1].hex();
      dataArray.push(payload);
    } else {
      console.log("null");
      payload.color2 = colors[1].hex();
      dataArray.push(payload);
    }
    return cb();
  })
};
//
var concurrency = 10;
var streamQueue = AsyncLib.queue(worker, concurrency);

myReadStream.pipe(csv()).on('data', function(data) {
    var payload = data;
    streamQueue.push(payload);
  })
  .on('end', function() {
    streamQueue.drain = function() {
      console.log("Queue drained!");
      var result = converter({
        data: dataArray, fields: Object.keys(dataArray[0])
      });
      fs.writeFileSync('flickr-data-final-with-colors.csv', result);
    };
  });

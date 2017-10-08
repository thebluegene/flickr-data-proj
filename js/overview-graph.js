const absoluteWidth = 960;
const absoluteHeight = 500;
const margin = {top: 20, right: 20, bottom: 30, left: 40},
  width = absoluteWidth - margin.left - margin.right,
  height = absoluteHeight - margin.top - margin.bottom;


function createMainGraph (data){
  let svg = d3.select('.post-container--main-graph').append('svg')
      .attr("width", absoluteWidth)
      .attr("height", absoluteHeight)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const x = d3.scaleTime()
              .range([0, width]);
  const y = d3.scaleLinear()
              .range([height, 0]);
  const line = d3.line()
              .x(function(d) { return x(d.date); })
              .y(function(d) { return y(d.total); });
  const area = d3.area()
              .x(function(d) {return x(d.date); })
              .y0(height)
              .y1(function(d) {return y(d.total); });

  const parseDate = d3.timeParse("%Y-%m");
  const formatMonth = d3.timeFormat("%B");
  const formatYear = d3.timeFormat("%Y");

  let total = 0;
  let dataForCumulative = [];
  let shotsPerMonth = dataFormatter.getChronologicalShotsPerMonth(data.reverse());

  for (let subArray of shotsPerMonth) {
    let obj = {};
    obj.date = parseDate(subArray[0]);
    total = total + subArray[1];
    obj.total = +total;
    dataForCumulative.push(obj);
  }

  x.domain(d3.extent(dataForCumulative, function(d){ return d.date }));
  y.domain([0, d3.max(dataForCumulative, function(d) { return d.total })]);

  //Add tooltip
  var tooltip = d3.select("body").append("div").attr("class", "tooltip");

  //Add specific points on line graph
  var manuallyInputDates = {
    pod_1_start: dataForCumulative[5],
    pod_1_end: dataForCumulative[9],
    pod_2_start: dataForCumulative[13],
    pod_2_end: dataForCumulative[15],
    pod_3_start: dataForCumulative[21],
    pod_3_end: dataForCumulative[28],
    pod_4_start: dataForCumulative[49],
    pod_4_end: dataForCumulative[61]
  }

  // Color in sections when I did a 365
  svg.append("path")
    .data([dataForCumulative.slice(5,10)])
    .attr("class", "setOne")
    .attr("d", area)
    .on("mousemove", function(d) {
      var totalPhotos = d[d.length-1].total - d[0].total;
      tooltip.style("left", d3.event.pageX + "px")
              .style("top", d3.event.pageY - 85 + "px")
              .style("display", "inline-block")
              .html('Total photos: ' + totalPhotos + '<br />' +  (d[0].date.getMonth()+1) + '/' +  d[0].date.getFullYear() + ' to ' + (d[d.length-1].date.getMonth()+1) + '/' + d[d.length-1].date.getFullYear());
    })
    .on("mouseout", function(d) {
      tooltip.style("display", "none");
    });

  svg.append("path")
    .data([dataForCumulative.slice(13,16)])
    .attr("class", "setTwo")
    .attr("d", area)
    .on("mousemove", function(d) {
      var totalPhotos = d[d.length-1].total - d[0].total;
      tooltip.style("left", d3.event.pageX + "px")
              .style("top", d3.event.pageY - 85 + "px")
              .style("display", "inline-block")
              .html('Total photos: ' + totalPhotos + '<br />' +  (d[0].date.getMonth()+1) + '/' +  d[0].date.getFullYear() + ' to ' + (d[d.length-1].date.getMonth()+1) + '/' + d[d.length-1].date.getFullYear());
    })
    .on("mouseout", function(d) {
      tooltip.style("display", "none");
    });

  svg.append("path")
    .data([dataForCumulative.slice(21,29)])
    .attr("class", "setThree")
    .attr("d", area)
    .on("mousemove", function(d) {
      var totalPhotos = d[d.length-1].total - d[0].total;
      tooltip.style("left", d3.event.pageX + "px")
              .style("top", d3.event.pageY - 85 + "px")
              .style("display", "inline-block")
              .html('Total photos: ' + totalPhotos + '<br />' +  (d[0].date.getMonth()+1) + '/' +  d[0].date.getFullYear() + ' to ' + (d[d.length-1].date.getMonth()+1) + '/' + d[d.length-1].date.getFullYear());
    })
    .on("mouseout", function(d) {
      tooltip.style("display", "none");
    });

  svg.append("path")
    .data([dataForCumulative.slice(49,62)])
    .attr("class", "setFour")
    .attr("d", area)
    .on("mousemove", function(d) {
      var totalPhotos = d[d.length-1].total - d[0].total;
      tooltip.style("left", d3.event.pageX + "px")
              .style("top", d3.event.pageY - 85 + "px")
              .style("display", "inline-block")
              .html('Total photos: ' + totalPhotos + '<br />' +  (d[0].date.getMonth()+1) + '/' +  d[0].date.getFullYear() + ' to ' + (d[d.length-1].date.getMonth()+1) + '/' + d[d.length-1].date.getFullYear());
    })
    .on("mouseout", function(d) {
      tooltip.style("display", "none");
    });

  //Draw line graph
  svg.append("path")
    .data([dataForCumulative])
    .attr("class", "line")
    .attr("d", line);


  svg.selectAll("dot")
    .data([manuallyInputDates.pod_1_start, manuallyInputDates.pod_1_end, manuallyInputDates.pod_2_start,
      manuallyInputDates.pod_2_end, manuallyInputDates.pod_3_start, manuallyInputDates.pod_3_end, manuallyInputDates.pod_4_start,
      manuallyInputDates.pod_4_end])
    .enter().append("circle")
    .attr("class","data-point")
    .attr("r", 3)
    .attr("cx", function(d) { return x(d.date)})
    .attr("cy", function(d) { return y(d.total)});

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
}

function create365Graph(data) {
  var url;
  for (var i = 0; i < data.length; i++) {
    if(data[i]['daily-project-active']) {
      url = dataFormatter.getUrl(data[i]);
      $(".post-container--365_" + data[i]['daily-project-active'] + " .color-grid")
      .append("<div class='swatch js-" + data[i]['daily-project-active'] + "' data-flickrpage='https://www.flickr.com/photos/thebluegene/" + data[i]['id'] + "' data-url='" + url  + "' style='background:" + data[i].color2 + "'></div>")
    }
  }
}

function createRadialGraph(data, dateType) {
  const barHeight = absoluteHeight/2 - 40;
  const formatNumber = d3.format('s');
  let shotsPerDate;
  let color = d3.scaleOrdinal().range(["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]);
  let svg = d3.select('.post-container--radial-graph').append('svg')
    .attr('width', absoluteWidth)
    .attr('height', absoluteHeight)
    .append('g')
    .attr('transform', 'translate(' + absoluteWidth/2 + ','+ absoluteHeight/2 +')');

  if(dateType == 'hour') {
    shotsPerDate = dataFormatter.getShotsPerHour(data);
  }
  else if(dateType == 'day') {
    shotsPerDate = dataFormatter.getShotsPerDay(data);
  }
  else if(dateType == 'month') {
    shotsPerDate = dataFormatter.getShotsPerMonth(data);
  }

  let extent = d3.extent(shotsPerDate, function(d) { return d.count; });
  let scale = d3.scaleLinear()
    .domain(extent)
    .range([0, barHeight]);

  let keys = shotsPerDate.map(function(d,i) { return d.type });

  if(dateType == 'hour') {
  keys = keys.map(function(key) {
      if(key == 11) {
        return '12 PM';
      }
      else if(key == 23) {
        return '12 AM';
      }
      else if(key+1 > 12) {
        return ((key+1)-12)+' PM';
      }
      return key+1+' AM';
    });
  }

  let numBars = keys.length;

  let x = d3.scaleLinear()
    .domain(extent)
    .range([0, -barHeight]);

  let xAxis = d3.axisLeft(x)
    .ticks(3)
    .tickFormat(formatNumber);

  let arc = d3.arc()
    .startAngle(function(d,i){ return (i*2*Math.PI) / numBars })
    .endAngle(function(d,i){ return ((i+1)*2*Math.PI) / numBars })
    .innerRadius(0);

  let segments = svg.selectAll("path")
    .data(shotsPerDate)
    .enter().append("path")
    .attr("class", "bar")
    .each(function(d) { d.outerRadius = 0; })
    .style("fill", function(d) { return color(d.type) })
    .attr("d", arc)
    .on('mouseover', function(d) {
      console.log(d);
    });

  segments.transition().duration(500).delay(function(d,i) {return (25-i)*100;})
    .attrTween("d", function(d,index) {
      let i = d3.interpolate(d.outerRadius, scale(+d.count));;
      return function(t) { d.outerRadius = i(t); return arc(d,index); };
    });

  svg.append("circle")
    .attr("r", barHeight)
    .classed("outer", true)
    .style("fill", "none")
    .style("stroke", "black")
    .style("stroke-width", "1.5px");

  let lines = svg.selectAll("line")
    .data(keys)
    .enter().append("line")
    .attr("y2", -barHeight - 20)
    .style("stroke", "black")
    .style("stroke-width", ".5px")
    .attr("transform", function(d, i) { return "rotate(" + (i * 360 / numBars) + ")"; });

  // Labels
  let labelRadius = barHeight * 1.025;

  let labels = svg.append("g")
      .classed("labels", true);
  labels.append("def")
          .append("path")
          .attr("id", "label-path")
          .attr("d", "m0 " + -labelRadius + " a" + labelRadius + " " + labelRadius + " 0 1,1 -0.01 0");
  labels.selectAll("text")
      .data(keys)
    .enter().append("text")
      .style("text-anchor", "middle")
      .style("font-weight","regular")
      .style("fill", function(d, i) {return "#3e3e3e";})
      .append("textPath")
      .attr("xlink:href", "#label-path")
      .attr("startOffset", function(d, i) {return i * 100 / numBars + 50 / numBars + '%';})
      .text(function(d) {return d; });
}

function createExifGraph(data, dataType) {
  let svg = d3.select(".post-container--exif-graph").append("svg")
            .attr("width", absoluteWidth)
            .attr("height", absoluteHeight)
            .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

  let x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);
  let y = d3.scaleLinear()
            .range([height, 0]);

  let xAxis = d3.axisBottom(x);

  let cameraDataArray = dataFormatter.getDataArray(data, dataType);

  if(dataType == 'exposure' || dataType == "aperture") {
    x.domain(d3.entries(cameraDataArray)
      .sort(function(a,b) { return eval(a.key) - eval(b.key) })
      .map(function(d) { return d.key; }));
  } else {
    x.domain(d3.entries(cameraDataArray)
      .map(function(d) { return d.key; }));
  }
  y.domain([0, d3.max(d3.entries(cameraDataArray), function(d) { return d.value; })]);

  svg.selectAll(".bar")
      .data(d3.entries(cameraDataArray))
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
        return x(d.key);
      })
      .attr("width", x.bandwidth())
      .attr("y", function(d) {
        return y(d.value);
      })
      .attr("height", function(d) {
        return height - y(d.value);
      });

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height +")")
    .call(xAxis);
  svg.append("g")
    .call(d3.axisLeft(y));




  // var sortTimeout = setTimeout(function() {
      // d3.select("input").property("checked", true).each(change);
    // }, 2000);

  $(".js-sort-exif").off().on("click", function() {
    console.log("Hello?");
    $(this).toggleClass('active');

    if ($(this).hasClass('active')) {
      var x0 = x.domain(d3.entries(cameraDataArray)
        .sort(function(a,b) { return b.value - a.value })
        .map(function(d) { return d.key; }));
    } else {
      if(dataType == 'exposure' || dataType == "aperture" || dataType == "iso") {
        var x0 = x.domain(d3.entries(cameraDataArray)
          .sort(function(a,b) { return eval(a.key) - eval(b.key) })
          .map(function(d) { return d.key; }));
      } else {
        var x0 = x.domain(d3.entries(cameraDataArray)
          .sort(function(a,b) { return b.key - a.key })
          .map(function(d) { return d.key; }));
      }
    }

    svg.selectAll(".post-container--exif-graph .bar")
      .sort(function(a, b) { return x0(a.key) - x0(b.key); });

    var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".post-container--exif-graph .bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.key); });

    transition.select(".post-container--exif-graph .x.axis")
        .call(xAxis)
      .selectAll(".post-container--exif-graph g")
        .delay(delay);
  });
}

d3.csv("flickr-data-final-with-colors.csv", function(error, data) {
  if (error) {
    throw error;
  }
  createMainGraph(data);
  create365Graph(data);
  createRadialGraph(data, 'hour');
  createExifGraph(data, 'iso');

  $('body').on('click',".radial-graph__button", function() {
    if($(this).hasClass('js-radial-hour') && !$(this).hasClass('active')) {
      d3.select('.post-container--radial-graph svg').remove();
      createRadialGraph(data, 'hour');
    }
    else if($(this).hasClass('js-radial-day') && !$(this).hasClass('active')) {
      d3.select('.post-container--radial-graph svg').remove();
      createRadialGraph(data, 'day');
    }
    else if($(this).hasClass('js-radial-month') && !$(this).hasClass('active')) {
      d3.select('.post-container--radial-graph svg').remove();
      createRadialGraph(data, 'month');
    }

    $('.radial-graph__button').removeClass('active');
    $(this).addClass('active');
  });

  $('body ').on('click', ".exif-graph__button", function() {
    if($(this).hasClass('js-exif-iso') && !$(this).hasClass('active')) {
      d3.select('.post-container--exif-graph svg').remove();
      createExifGraph(data, 'iso');
    }
    else if($(this).hasClass('js-exif-aperture') && !$(this).hasClass('active')) {
      d3.select('.post-container--exif-graph svg').remove();
      createExifGraph(data, 'aperture');
    }
    else if($(this).hasClass('js-exif-exposure') && !$(this).hasClass('active')) {
      d3.select('.post-container--exif-graph svg').remove();
      createExifGraph(data, 'exposure');
    }
    else if($(this).hasClass('js-exif-camera') && !$(this).hasClass('active')) {
      d3.select('.post-container--exif-graph svg').remove();
      createExifGraph(data, 'camera');
    }

    $('.exif-graph__button').removeClass('active');
    $(this).addClass('active');

  });

});

$("body").on("click", ".swatch", function() {
  var flickrPage = $(this).data('flickrpage');
  $(".js-photo-compare ." + $(this).attr('class').split(' ')[1]).html("<a target='_blank' href='"+flickrPage+"'><img src='" + $(this).data('url') + "' /></a>");
});

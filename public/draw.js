function drawLine() {
  console.log("==> drawLine()");

  xPos = width / 2;
  // draw vertical timeline
  mainSVG
    .append("line")
    .attr("transform", "translate(" + CONFIG.margin.left + "," + CONFIG.margin.top + ")")
    .classed("timeline", true)

    .attr("stroke", CONFIG.colors["dark-blue"])
    .attr("stroke-width", 4)

    .attr("x1", xPos)
    .attr("y1", 0)
    .attr("x2", xPos)
    .attr("y2", 0)

    .transition()
    .attr("y2", height)
    .duration(2000)
    .ease(d3.easeBackOut)
    .on("end", () => {
      addEarthquakes();
      showEarthquake(0);
    });
}


function addEarthquakes() {
  console.log("==> addDataPoints()");


  let elem = mainSVG
    .append("g")
    .attr("id", "earthquakes")
    .attr("transform", "translate(" + CONFIG.margin.left + "," + CONFIG.margin.top + ")")

    .selectAll("g")
    .data(data);

  // Init Groups
  earthquakes = elem.enter()
    .append("g")
    .attr("id", (d) => "e" + d.eventid)
    .classed("hide", true)


  // Add circles
  earthquakes
    .append("circle")
    .attr("cy", height / 5 * 4)
    .attr("cx", width / 2)
    .attr("r", 0)
    .attr("fill", CONFIG.colors["green"])

    .transition()
    .attr("r", CONFIG.circleRadius)
    .duration(500)
    .ease(d3.easeBackOut);


  // Add Country
  earthquakes
    .append("text")
    .classed("label", true)
    .attr("y", (height / 5 * 4) + 15)
    .attr("x", width / 2)
    .style("text-anchor", "middle")
    .text((d) => d.country);

  // Add date
  earthquakes
    .append("text")
    .classed("date", true)
    .attr("y", (height / 4 * 3) + 25)
    .attr("x", (width / 2))
    .style("text-anchor", "middle")
    .text((d) => d.datetime);

  // Add Magnitude
  earthquakes
    .append("text")
    .classed("mag", true)
    .attr("y", (height / 4 * 3) + 5)
    .attr("x", (width / 2) + 40)
    .style("text-anchor", "left")
    .text((d) => d.magnitude + " unit?!!");

  // Add Magnitude line
  earthquakes
    .append("line")
    .classed("mag", true)
    .attr("y1", (height / 4 * 3) + 15)
    .attr("x1", (width / 2) + 40)
    .attr("y2", (height / 4 * 3) + 15)
    .attr("x2", (width / 2) + 40)
    .attr("stroke", CONFIG.colors["pinkish"])
    .attr("stroke-width", 4)

  // Add Deaths
  earthquakes
    .append("text")
    .classed("deaths", true)
    .attr("y", (height / 4 * 3) + 5)
    .attr("x", (width / 2) - 80)
    .style("text-anchor", "left")
    .text((d) => d.magnitude + " ppl died :(");

  // Add Deaths line
  earthquakes
    .append("line")
    .classed("deaths", true)
    .attr("y1", (height / 4 * 3) + 15)
    .attr("x1", (width / 2) - 40)
    .attr("y2", (height / 4 * 3) + 15)
    .attr("x2", (width / 2) - 40)
    .attr("stroke", CONFIG.colors["pinkish"])
    .attr("stroke-width", 4)

}

function showEarthquake(i) {
  if (data[i]) {
    console.log("==> showEarthquake()", i);
    d3.select("#e" + data[i].eventid)
      .classed("hide", false);

    d3.select("#e" + data[i].eventid + " line.mag")
      .transition()
      .attr("x2", (d) => (width / 2) + xMagScale(d.magnitude))
      .duration(CONFIG.delays.stackDelay)
      .ease();

    d3.select("#e" + data[i].eventid + " text.mag")
      .transition()
      .attr("x", (d) => (width / 2) + 200)
      .duration(CONFIG.delays.stackDelay)
      .ease();

    d3.select("#e" + data[i].eventid + " line.deaths")
      .transition()
      .attr("x2", (d) => (width / 2) - xMagScale(d.magnitude))
      .duration(CONFIG.delays.stackDelay)
      .ease();

    d3.select("#e" + data[i].eventid + " text.deaths")
      .transition()
      .attr("x", (d) => (width / 2) - 200)
      .duration(CONFIG.delays.stackDelay)
      .ease();
  }

}

function hideEarthquake(i) {
  if (data[i]) {
    console.log("==> hideEarthquake()", i);
    d3.select("#e" + data[i].eventid)
      .classed("hide", true);
  }
}

function stackEarthquake(i) {
  if (data[i]) {
    console.log("==> stackEarthquake()", i);
    d3.select("#e" + data[i].eventid + " circle")
      .transition()
      .attr("cy", yPositionScale(i))
      .attr("r", 20)
      .duration(CONFIG.delays.stackDelay)
      .ease();

    d3.selectAll("#e" + data[i].eventid + " text:not(.date)")
      .transition()
      .attr("y", yPositionScale(i) + 5)
      .style("font-size", 10)
      .duration(CONFIG.delays.stackDelay)
      .ease();

    d3.selectAll("#e" + data[i].eventid + " .date")
      .transition()
      .attr("y", yPositionScale(i) + 25)
      .style("font-size", 10)
      .duration(CONFIG.delays.stackDelay)
      .ease();

    d3.selectAll("#e" + data[i].eventid + " line.mag")
      .transition()
      .attr("y1", yPositionScale(i) + 15)
      .attr("y2", yPositionScale(i) + 15)
      .style("font-size", 10)
      .duration(CONFIG.delays.stackDelay)
      .ease();

    d3.selectAll("#e" + data[i].eventid + " line.deaths")
      .transition()
      .attr("y1", yPositionScale(i) + 15)
      .attr("y2", yPositionScale(i) + 15)
      .style("font-size", 10)
      .duration(CONFIG.delays.stackDelay)
      .ease();
    if (i === data.length - 1) {
      spreadTimeline();
    }
  }

}


function unstackEarthquake(i) {
  if (data[i]) {
    console.log("==> unstackEarthquake()", i);
    d3.select("#e" + data[i].eventid + " circle")
      .transition()
      .attr("cy", height / 4 * 3)
      .attr("r", CONFIG.circleRadius)
      .duration(CONFIG.delays.stackDelay)
      .ease();

    d3.selectAll("#e" + data[i].eventid + " text:not(.date)")
      .transition()
      .attr("y", (height / 4 * 3) + 5)
      .style("font-size", 10)
      .duration(CONFIG.delays.stackDelay)
      .ease();

    d3.selectAll("#e" + data[i].eventid + " .date")
      .transition()
      .attr("y", (height / 4 * 3) + 25)
      .style("font-size", 10)
      .duration(CONFIG.delays.stackDelay)
      .ease();

    d3.selectAll("#e" + data[i].eventid + " line.mag")
      .transition()
      .attr("y1", (height / 4 * 3) + 15)
      .attr("y2", (height / 4 * 3) + 15)
      .style("font-size", 10)
      .duration(CONFIG.delays.stackDelay)
      .ease();

    d3.selectAll("#e" + data[i].eventid + " line.deaths")
      .transition()
      .attr("y1", (height / 4 * 3) + 15)
      .attr("y2", (height / 4 * 3) + 15)
      .style("font-size", 10)
      .duration(CONFIG.delays.stackDelay)
      .ease();
  }
}

function spreadTimeline() {
  console.log("==> spreadTimeline()");

  yPositionScale = d3.scaleLinear()
    .domain([0, data.length - 1])
    .range([0, height - CONFIG.margin.bottom]);

  d3.selectAll("#earthquakes circle")
    .transition()
    .attr("cy", (d, i) => yPositionScale(i))
    .attr("r", 20)
    .duration(CONFIG.delays.stackDelay)
    .ease();

  d3.selectAll("#earthquakes .label")
    .transition()
    .attr("y", (d, i) => yPositionScale(i) + 5)
    .duration(CONFIG.delays.stackDelay)
    .ease();

  d3.selectAll("#earthquakes text.mag")
    .transition()
    .attr("y", (d, i) => yPositionScale(i) + 5)
    .duration(CONFIG.delays.stackDelay)
    .ease();

  d3.selectAll("#earthquakes text.deaths")
    .transition()
    .attr("y", (d, i) => yPositionScale(i) + 5)
    .duration(CONFIG.delays.stackDelay)
    .ease();

  d3.selectAll("#earthquakes .date")
    .transition()
    .attr("y", (d, i) => yPositionScale(i) + 25)
    .style("font-size", 10)
    .duration(CONFIG.delays.stackDelay)
    .ease();

  d3.selectAll("#earthquakes line.mag")
    .transition()
    .attr("y1", (d, i) => yPositionScale(i) + 15)
    .attr("y2", (d, i) => yPositionScale(i) + 15)
    .style("font-size", 10)
    .duration(CONFIG.delays.stackDelay)
    .ease();

  d3.selectAll("#earthquakes line.deaths")
    .transition()
    .attr("y1", (d, i) => yPositionScale(i) + 15)
    .attr("y2", (d, i) => yPositionScale(i) + 15)
    .style("font-size", 10)
    .duration(CONFIG.delays.stackDelay)
    .ease();
}

function foldTimeline() {
  d3.selectAll("#earthquakes text.mag")
    .transition()
    .attr("x", (width / 2))
    .duration(CONFIG.delays.stackDelay)
    .ease(d3.easeBackOut);

  d3.selectAll("#earthquakes text.deaths")
    .transition()
    .attr("x", (width / 2))
    .duration(CONFIG.delays.stackDelay)
    .ease(d3.easeBackOut);

  d3.selectAll("#earthquakes text.date")
    .transition()
    .duration(CONFIG.delays.stackDelay)
    .ease(d3.easeBackOut);

  d3.selectAll("#earthquakes line.mag")
    .transition()
    .attr("x2", width / 2)
    .style("font-size", 10)
    .duration(CONFIG.delays.stackDelay)
    .ease(d3.easeBackOut);

  d3.selectAll("#earthquakes line.deaths")
    .transition()
    .attr("x2", width / 2)
    .style("font-size", 10)
    .duration(CONFIG.delays.stackDelay)
    .ease(d3.easeBackOut)
    .on("end", () => hideTimeline());

  d3.selectAll(".timeline")
    .transition()
    .attr("y2", 0)
    .style("font-size", 10)
    .duration(CONFIG.delays.stackDelay)
    .ease(d3.easeBackOut);
  
 
}

function hideTimeline() {
  d3.selectAll("#earthquakes line")
    .transition()
    .attr("opacity", 0)
    .duration(CONFIG.delays.stackDelay/2)
    .ease();
  
   d3.selectAll("#earthquakes text:not(.label")
     .transition()
     .attr("opacity", 0)
     .duration(CONFIG.delays.stackDelay / 2)
     .ease();
  
  drawOnMap()
}

function drawOnMap() {
  d3.selectAll("circle")
        .transition()
    .attr("cx", function (d) {
        return projection([d.longitude, d.latitude])[0] - 100;
      })
      .attr("cy", function (d) {
        return projection([d.longitude, d.latitude])[1] +70;
      })
   .duration(CONFIG.delays.stackDelay)
    .ease();
  
   d3.selectAll("text")
     .transition()
     .attr("x", function (d) {
       return projection([d.longitude, d.latitude])[0] - 100;
     })
     .attr("y", function (d) {
       return projection([d.longitude, d.latitude])[1] + 70;
     })
     .duration(CONFIG.delays.stackDelay)
     .ease();
  
   d3.selectAll("#map")
     .transition()
     .style("opacity", 0.7)
     .duration(CONFIG.delays.stackDelay*2)
     .ease();
  
  
}


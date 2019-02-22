function drawLine() {
  console.log("==> drawLine()");

  xPos = width / 2;
  // draw vertical timeline
  mainSVG
    .append("line")
    .attr("transform", "translate(" + CONFIG.margin.left + ",0)")
    .classed("timeline", true)

    .attr("stroke", CONFIG.colors["dark-blue"])
    .attr("stroke-width", 4)

    .attr("x1", xPos)
    .attr("y1", 0)
    .attr("x2", xPos)
    .attr("y2", 0)

    .transition()
    .attr("y2", CONFIG.mainSVGheight)
    .duration(CONFIG.delays.timelineDelay)
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
    .on("click", (d) => {
      if (showTooltip) {

        d3.select(".emoji.center.pulse")
          .classed("hide", true);

        let hidden = d3.select("#tooltip")
          .classed("hidden");
        if (hidden) {
          d3.select("#tooltip")
            .classed("hidden", false);
          d3.select("#tooltip h1")
            .text(d.title);
          d3.select("#tooltip p")
            .text(d.text);
          d3.select("#tooltip a")
            .attr("href", d.link);
          d3.select("#tooltip img")
            .attr("src", d.img);
        } else {
          d3.select("#tooltip")
            .classed("hidden", true);
        }
      }
    });

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
    .attr("font-size", 13)
    .style("text-anchor", "middle")
    .text((d) => d.country);

  // Add date
  earthquakes
    .append("text")
    .classed("date", true)
    .attr("y", (height / 4 * 3) + 25)
    .attr("x", (width / 2))
    .style("text-anchor", "middle")
    .text((d) => d.datetime.split("/")[2]);

  // Add Magnitude
  earthquakes
    .append("text")
    .classed("mag", true)
    .classed("legend", true)
    .attr("y", (height / 4 * 3) + 37)
    .attr("x", (width / 2) + 40)
    .attr("fill", CONFIG.colors["pinkish"])
    .style("text-anchor", "left")
    .text((d) => d.magnitude + " M");

  // Add Magnitude line
  earthquakes
    .append("line")
    .classed("mag", true)
    .attr("y1", (height / 4 * 3) + 30)
    .attr("x1", (width / 2) + 40)
    .attr("y2", (height / 4 * 3) + 30)
    .attr("x2", (width / 2) + 40)
    .attr("stroke", CONFIG.colors["pinkish"])
    .attr("stroke-width", 10)

  // Add Deaths
  earthquakes
    .append("text")
    .classed("deaths", true)
    .classed("legend", true)
    .attr("y", (height / 4 * 3) + 20)
    .attr("x", (width / 2) - 80)
    .style("text-anchor", "left")
    .attr("font-size", 14)
    .attr("fill", CONFIG.colors["red"])
    .text((d) => d.deaths + " deaths");

  // Add Deaths line
  earthquakes
    .append("line")
    .classed("deaths", true)
    .attr("y1", (height / 4 * 3) + 25)
    .attr("x1", (width / 2) - 40)
    .attr("y2", (height / 4 * 3) + 25)
    .attr("x2", (width / 2) - 40)
    .attr("stroke", CONFIG.colors["red"])
    .attr("stroke-width", 5)

  // Add Injured
  earthquakes
    .append("text")
    .classed("injured", true)
    .classed("legend", true)
    .attr("y", (height / 4 * 3) + 55)
    .attr("x", (width / 2) - 80)
    .style("text-anchor", "left")
    .attr("font-size", 14)
    .attr("fill", CONFIG.colors["dark-blue"])
    .text((d) => d.injured + " injured");

  // Add Injured line
  earthquakes
    .append("line")
    .classed("injured", true)
    .attr("y1", (height / 4 * 3) + 35)
    .attr("x1", (width / 2) - 40)
    .attr("y2", (height / 4 * 3) + 35)
    .attr("x2", (width / 2) - 40)
    .attr("stroke", CONFIG.colors["dark-blue"])
    .attr("stroke-width", 5)

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
      .attr("x", (d) => (width / 2) + xMagScale(d.magnitude) + 10)
      .duration(CONFIG.delays.stackDelay)
      .ease();

    d3.select("#e" + data[i].eventid + " line.deaths")
      .transition()
      .attr("x2", (d) => (width / 2) - xDeathsScale(d.deaths))
      .duration(CONFIG.delays.stackDelay)
      .ease();

    d3.select("#e" + data[i].eventid + " text.deaths")
      .transition()
      .attr("x", (d) => d3.min([(width / 2) - xDeathsScale(d.deaths), 345]))
      .duration(CONFIG.delays.stackDelay)
      .ease();

    d3.select("#e" + data[i].eventid + " line.injured")
      .transition()
      .attr("x2", (d) => (width / 2) - xDeathsScale(d.injured))
      .duration(CONFIG.delays.stackDelay)
      .ease();

    d3.select("#e" + data[i].eventid + " text.injured")
      .transition()
      .attr("x", (d) => d3.min([(width / 2) - xDeathsScale(d.injured), 345]))
      .duration(CONFIG.delays.stackDelay)
      .ease();

    setTimeout(() => {
      next()
    }, CONFIG.delays.stackDelay * 2.2);
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
      .attr("cy", yPositionScale(i) + 15)
      .attr("r", 27)
      .duration(CONFIG.delays.stackDelay)
      .ease();

    d3.selectAll("#e" + data[i].eventid + " text.label")
      .transition()
      .attr("y", yPositionScale(i) + 30)
      .duration(CONFIG.delays.stackDelay)
      .ease();

    d3.selectAll("#e" + data[i].eventid + " text.date")
      .transition()
      .attr("y", yPositionScale(i) + 12)
      .duration(CONFIG.delays.stackDelay)
      .ease();

    d3.selectAll("#e" + data[i].eventid + " text.mag")
      .transition()
      .attr("y", yPositionScale(i) + 21)
      .duration(CONFIG.delays.stackDelay)
      .ease();

    d3.selectAll("#e" + data[i].eventid + " text.deaths")
      .transition()
      .attr("y", yPositionScale(i) + 10)
      .duration(CONFIG.delays.stackDelay)
      .ease();

    d3.selectAll("#e" + data[i].eventid + " text.injured")
      .transition()
      .attr("y", yPositionScale(i) + 45)
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

    d3.selectAll("#e" + data[i].eventid + " line.injured")
      .transition()
      .attr("y1", yPositionScale(i) + 25)
      .attr("y2", yPositionScale(i) + 25)
      .style("font-size", 10)
      .duration(CONFIG.delays.stackDelay)
      .ease();
    if (i === data.length - 1) {
      spreadTimeline();
      d3.selectAll("button.hide")
        .classed("hide", false);
      d3.selectAll(".control-group h2.hide")
        .classed("hide", false);
      d3.selectAll("button.control")
        .classed("hide", true);
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

    d3.selectAll("#e" + data[i].eventid + " line.injured")
      .transition()
      .attr("y1", (height / 4 * 3) + 25)
      .attr("y2", (height / 4 * 3) + 25)
      .style("font-size", 10)
      .duration(CONFIG.delays.stackDelay)
      .ease();
  }
}

function spreadTimeline() {
  console.log("==> spreadTimeline()");

  showTooltip = true;
  if (helper) {
    d3.select(".emoji.center.pulse")
      .classed("hide", false);
  }
  helper = false;

  yPositionScale = d3.scaleLinear()
    .domain([0, data.length - 1])
    .range([0, height - CONFIG.margin.bottom]);

  d3.selectAll("#earthquakes circle")
    .transition()
    .attr("cy", (d, i) => yPositionScale(d.order) + 10)
    .attr("r", 30)
    .duration(CONFIG.delays.stackDelay)
    .ease();

  d3.selectAll("#earthquakes .label")
    .transition()
    .attr("y", (d, i) => yPositionScale(d.order) + 5)
    .duration(CONFIG.delays.stackDelay)
    .ease();

  d3.selectAll("#earthquakes text.mag")
    .transition()
    .attr("y", (d, i) => yPositionScale(d.order) + 21)
    .duration(CONFIG.delays.stackDelay)
    .ease();

  d3.selectAll("#earthquakes text.deaths")
    .transition()
    .attr("y", (d, i) => yPositionScale(d.order) + 5)
    .duration(CONFIG.delays.stackDelay)
    .ease();

  d3.selectAll("#earthquakes text.injured")
    .transition()
    .attr("y", (d, i) => yPositionScale(d.order) + 45)
    .duration(CONFIG.delays.stackDelay)
    .ease();

  d3.selectAll("#earthquakes .date")
    .transition()
    .attr("y", (d, i) => yPositionScale(d.order) + 25)
    .style("font-size", 10)
    .duration(CONFIG.delays.stackDelay)
    .ease();

  d3.selectAll("#earthquakes line.mag")
    .transition()
    .attr("y1", (d, i) => yPositionScale(d.order) + 15)
    .attr("y2", (d, i) => yPositionScale(d.order) + 15)
    .style("font-size", 10)
    .duration(CONFIG.delays.stackDelay)
    .ease();

  d3.selectAll("#earthquakes line.deaths")
    .transition()
    .attr("y1", (d, i) => yPositionScale(d.order) + 15)
    .attr("y2", (d, i) => yPositionScale(d.order) + 15)
    .style("font-size", 10)
    .duration(CONFIG.delays.stackDelay)
    .ease();

  d3.selectAll("#earthquakes line.injured")
    .transition()
    .attr("y1", (d, i) => yPositionScale(d.order) + 25)
    .attr("y2", (d, i) => yPositionScale(d.order) + 25)
    .style("font-size", 10)
    .duration(CONFIG.delays.stackDelay)
    .ease();
}


function sortData(prop, silent) {
  data = data.sort((a, b) => a[prop] - b[prop]);

  data.forEach((d, i) => {
    d.order = i;
  });
  mainSVG
    .selectAll("g")
    .data(data);

  if (!silent) {
    spreadTimeline();
  }


  d3.selectAll(".control-group button")
    .classed("active", false);
  d3.selectAll(".control-group button." + prop)
    .classed("active", true);
}
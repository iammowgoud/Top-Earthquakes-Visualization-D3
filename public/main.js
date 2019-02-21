const CONFIG = {
  circleRadius: 30,
  mainSVGwidth: 900,
  mainSVGheight: 600,
  margin: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  },

  colors: {
    "main": "#F0E5D6",
    "pinkish": "#F28C81",
    "green": "#8AC6BF",
    "teal": "#7C96A8",
    "dark-blue": "#01395C"
  },

  delays: {
    stackDelay: 1000
  }
};

let height = CONFIG.mainSVGheight - CONFIG.margin.top - CONFIG.margin.bottom;
let width = CONFIG.mainSVGwidth - CONFIG.margin.left - CONFIG.margin.right;
let mainSVG, earthquakes = null;

let yPositionScale, xMagScale = null;

let nextElem = 0;


window.onload = () => {
  // Main Viz
  d3.select("#main")
    .style("max-width", `${CONFIG.width}px`)
    .style("margin", "0 auto")
    .append("svg")
    .attr("id", "mainSVG")
    .attr("width", width + CONFIG.margin.left + CONFIG.margin.right)
    .attr("height", height + CONFIG.margin.top + CONFIG.margin.bottom)

  mainSVG = d3.select("#mainSVG");

  console.log("==> Initialized");
  parseData(drawLine);

  document.onkeydown = (event) => {
    if (event.keyCode == '40') {
      next();
    }
    if (event.keyCode == '38') {
      prev();
    }
  };
};


function parseData(drawFn) {
  console.log("==> parseData()");
  d3.json("earthquakes.json").then((d) => {
    data = d;
    console.log("==> imported", data);

    configureScales();
    drawFn();
  });
}

function configureScales() {
  yPositionScale = d3.scaleLinear()
    .domain([0, data.length])
    .range([CONFIG.margin.top, height / 5 * 4]);


  xMagScale = d3.scaleLinear()
    .domain([0, d3.max(getProperty("magnitude"))])
    .range([0, width / 2]);
}



function next() {
  stackEarthquake(nextElem);
  nextElem++;
  setTimeout(() => {
    showEarthquake(nextElem);
  }, CONFIG.delays.stackDelay / 2);

}

function prev() {
  hideEarthquake(nextElem);
  nextElem--;
  setTimeout(() => {
    unstackEarthquake(nextElem);
  }, CONFIG.delays.stackDelay / 2);

}

function getProperty(property) {
  return data.map((dataPoint) => dataPoint[property]);
}

function reset() {
  location.reload();
}
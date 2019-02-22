const CONFIG = {
  circleRadius: 35,
  mainSVGwidth: 950,
  mainSVGheight: 650,
  margin: {
    top: 30,
    right: 40,
    bottom: 30,
    left: 40
  },

  colors: {
    "main": "#F0E5D6",
    "pinkish": "#F28C81",
    "green": "#8AC6BF",
    "teal": "#7C96A8",
    "dark-blue": "#01395C",
    "red": "#DB1C55"
  },

  delays: {
    stackDelay: 600,
    timelineDelay: 1200
  }
};

let height = CONFIG.mainSVGheight - CONFIG.margin.top - CONFIG.margin.bottom;
let width = CONFIG.mainSVGwidth - CONFIG.margin.left - CONFIG.margin.right;
let mainSVG, earthquakes = null;

let yPositionScale, xMagScale, xDeathsScale = null;

let projection = null;

let nextElem = 0;

let showTooltip = false;


window.onload = () => {
  // Main Viz
  d3.select("#main")
    .style("max-width", `${CONFIG.mainSVGwidth}px`)
    .style("margin", "-10px auto 0px auto")
    .append("svg")
    .attr("id", "mainSVG")
    .attr("width", width + CONFIG.margin.left + CONFIG.margin.right)
    .attr("height", height + CONFIG.margin.top + CONFIG.margin.bottom)

  mainSVG = d3.select("#mainSVG");

  loadCarto();

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
    data.forEach((d) => {
      d.jsDate = new Date(d.datetime)
    });
    sortData("jsDate", true)
    // sortData("jdDate", true);
    console.log("==> imported", data);

    configureScales();
    drawFn();
  });
}

function configureScales() {
  projection = d3.geoEquirectangular();


  yPositionScale = d3.scaleLinear()
    .domain([0, data.length])
    .range([0, height / 6 * 5]);


  xMagScale = d3.scalePow()
    .domain([0, d3.max(getProperty("magnitude"))])
    .range([0, width / 2])
    .exponent(3);

  xDeathsScale = d3.scaleLinear()
    .domain([0, d3.max(
      [...getProperty("deaths"), ...getProperty("injured")]
    )])
    .range([125, width / 2]);

}

let animLock = false;

function next() {
  if (!animLock) {
    animLock = true;
    stackEarthquake(nextElem);
    nextElem++;
    setTimeout(() => {
      showEarthquake(nextElem);
    }, CONFIG.delays.stackDelay / 2);
    setInterval(() => {
      animLock = false;
    }, CONFIG.delays.stackDelay / 2 * 3);
  }
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

function loadCarto() {
  d3.select("#f1")
    .attr("src", "https://furqs92.carto.com/builder/4ed9d144-03a8-4360-979e-7b65d5788c55/embed");
  
   d3.select("#f2")
     .attr("src", "https://furqs92.carto.com/builder/4732480d-8661-4af6-ae58-341431ddf2ba/embed");
  
   d3.select("#f3")
     .attr("src", "https://furqs92.carto.com/builder/fd7e168f-640e-45be-9438-13145f3d02a4/embed");
}

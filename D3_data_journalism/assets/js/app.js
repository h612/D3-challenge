 

var svgWidth = 700;
var svgHeight = 500;

var margin = {
  top: 30,
  right: 50,
  bottom: 70,
  left: 40
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(healthData) {
    console.log(healthData)
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    healthData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.obesity = +data.obesity;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([7, d3.max(healthData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([18, d3.max(healthData, d => d.obesity)])
      .range([height, 10]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("r", function(d) { return d; })
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "10")
    .attr("fill", "pink")
    .attr("opacity", ".5");
//  //Append text to circles
    var circlesGroup2 = chartGroup.selectAll()
    .data(healthData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.obesity))
    .style("font-size", "10px")
    .style("text-anchor", "middle")
    .style('fill', 'red')
    .text(d => (d.abbr));
    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}<br>Obesity: ${d.obesity}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
      //Create event listensers to display and hide the tooltip
      circlesGroup2.on("mouseover", function(data){
        toolTip.show(data,this);
    }).on("mouseout", function(data) {
        toolTip.hide(data);
      });// onmouseout event

   //Create axes label
   chartGroup.append("text")
   .attr("transform", "rotate(-90)")
   .attr("y", 0 - margin.left - 5)
   .attr("x", 0 - (height / 2))
   .attr("dy", "1em")
   .attr("class", "axisText")
   .text("Obesity (%)");

chartGroup.append("text")
   .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
   .attr("class", "axisText")
   .text("In Poverty (%)");
  });

const d3 = require('d3');

function renderHeatMap(selector, options) {

  let { xLabels, yLabels, data, elementWidth } = options;

  const maxX = data.reduce((max, c) => c.x > max ? c.x : max, 1);
  const maxY = data.reduce((max, c) => c.y > max ? c.y : max, 1);


  var margin = { top: 50, right: 0, bottom: 100, left: 125 },
        width = elementWidth - margin.left - margin.right,
        gridSize = Math.floor(width / maxX),
        height = 175 + maxY * gridSize - margin.top - margin.bottom,
        buckets = 9,
        legendElementWidth = width / buckets,
        colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"];

    var svg = d3.select(selector).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xAxis = svg.selectAll(".dayLabel")
        .data(xLabels)
        .enter().append("text")
          .text(function (d) { return d; })
          .attr("x", 0)
          .attr("y", function (d, i) { return i * gridSize; })
          .style("text-anchor", "end")
          .style("font-size", `${gridSize / 10}px`)
          .attr("transform", "translate(-6," + gridSize / 1.5 + ")")

    var yAxis = svg.selectAll(".timeLabel")
        .data(yLabels)
        .enter().append("text")
          .text((d) => { return d; })
          .attr("x", function(d, i) { return i * gridSize; })
          .attr("y", 0)
          .style("text-anchor", "middle")
          .style("font-size", `${gridSize / 10}px`)
          .attr("transform", "translate(" + gridSize / 2 + ", -6)")

    var heatmapChart = function() {
      var colorScale = d3.scale.quantile()
          .domain([0, d3.max(data, d => d.value)])
          .range(colors);
      
      var cards = svg.selectAll(".hour")
          .data(data, (d) => d.y+':'+d.x);

      cards.append("title");

      cards.enter().append("rect")
          .attr("x", (d) => { return (d.x - 1) * gridSize; })
          .attr("y", (d) => { return (d.y - 1) * gridSize; })
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("class", "hour bordered")
          .attr("width", gridSize)
          .attr("height", gridSize)
          .style("fill", colors[0]);

      cards.transition().duration(1000)
          .style("fill", (d) => { return colorScale(d.value); });

      cards.select("title").text((d) => { return d.value; });
      
      cards.exit().remove();


      var legend = svg.selectAll(".legend")
          .data([0].concat(colorScale.quantiles()), (d) => { return d; });

      legend.enter().append("g")
          .attr("class", "legend");

      legend.append("rect")
        .attr("x", function(d, i) { return legendElementWidth * i; })
        .attr("y", height)
        .attr("width", legendElementWidth)
        .attr("height", 40)
        .style("fill", function(d, i) { return colors[i]; });

      legend.append("text")
        .attr("class", "mono")
        .text((d) => { return "≥ " + d.toFixed(1); })
        .attr("x", (d, i) => legendElementWidth * i + 20)
        .attr("y", height + 25)
        .style("font-size", '15px');

      legend.exit().remove();
    };

    heatmapChart();
}

export default renderHeatMap;
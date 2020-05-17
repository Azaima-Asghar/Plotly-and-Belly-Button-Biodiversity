function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      Object.entries(result).forEach(([key, value])=> {
        PANEL.append("h6").text(`${key}: ${value}`);
      })
      
    });
  }
  function buildCharts(sample){
      d3.json("samples.json").then((data) => { 
          var samples = data.samples;
          var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
          var result = resultArray[0];
          
          var sampleValues = result.sample_values.slice(0,10).reverse();
          var  otuId = result.otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
          var otuLabels = result.otu_labels.slice(0,10).reverse();
          console.log(sampleValues);
          console.log(otuId);
          console.log(otuLabels);
          var barPlot = {
              x: sampleValues,
              y: otuId,
              text: otuLabels,
              type: "bar",
              orientation: 'h'
          };
          
          var data = [barPlot];

        Plotly.newPlot("bar", data);

        var bub_x = result.otu_ids
        var bub_y = result.sample_values
        var marker_size = result.sample_values
        var marker_colors = result.otu_ids
        var text_values = result.otu_labels

        var trace_bubble = {
            x: bub_x,
            y: bub_y,
            mode: 'markers',
            marker: 
            {
                color: marker_colors,
                size: marker_size,
                colorscale: "Earth"
        },
            text: text_values
    }; 

        var bub_data = [trace_bubble];
        var bub_layout = {
            xaxis: { title: "OTU ID"},
    };
  
    Plotly.newPlot('bubble', bub_data, bub_layout);

      });
  };

  function buildGauge(WFREQ) {
    // Enter the Washing Frequency Between 0 and 180
    let level = parseFloat(WFREQ) * 20;

    // Trigonometry to Calculate Meter Point
    let degrees = 180 - level;
    let radius = 0.5; 
    let radians = (degrees * Math.PI) / 180;
    let x = radius * Math.cos(radians);
    let y = radius * Math.sin(radians);

    // Path May Have to Change to Create a Better Triangle
    let mainPath = "M-.0 -0.05 L  .0 0.05 L";
    let pathX = String(x);
    let space = " ";
    let pathY = String(y);
    let pathEnd = " Z";
    let path = mainPath.concat(pathX, space, pathY, pathEnd);
    console.log(path);
    let data = [
        {
            type: "scatter",
            x:[0],
            y:[0],
            marker: { size: 12, color: "850000" },
            showlegend: false,
            text: level,
            hoverinfo: "text+name"
        },
        {
            values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
            rotation: 90,
            text:["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
            textinfo: "text",
            textposition: "inside",
            marker: {
                colors: [
                    "rgba(0,105,11,.5)",
                    "rgba(10,120,22,.5)",
                    "rgba(14,127,0,.5)",
                    "rgba(110,154,22,.5)",
                    "rgba(170,202,42,.5)",
                    "rgba(202,209,95,.5)",
                    "rgba(210,206,145,.5)",
                    "rgba(232,226,202,.5)",
                    "rgba(240, 230,215,.5)",
                    "rgba(255,255,255,0)"
                ]
            },
            labels:["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
            hoverinfo: "label",
            hole: 0.5,
            type: "pie",
            showlegend: false
        }
    ]

    var layout = {
        shapes: [
            {
                type: "path",
                path: path,
                fillcolor: "850000",
                line: {
                    color: "850000"
                }
            }
        ],
        title: "Belly Button Washing Frequency <br> Scrubs per Week",
        height: 500,
        width: 500,
        xaxis: {
            zeroline:false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1]
        },
        yaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1]
        }
    }
    let GAUGE = document.getElementById("gauge");
    Plotly.newPlot(GAUGE, data, layout);
}
  
  function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });

      // Use the first sample from the list to build the initial plots.
      var firstSample = sampleNames[0];
      buildMetadata(firstSample);
      buildCharts(firstSample);
      buildGauge(firstSample);

  })}
  
  init();
  
  function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
    buildGauge(newSample);
  }
  
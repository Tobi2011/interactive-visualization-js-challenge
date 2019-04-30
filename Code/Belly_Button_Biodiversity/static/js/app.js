function buildMetadata(sample) {
  console.log("building metadata");
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  var panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
  panel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
  console.log(`/metadata/${sample}`);
  
  d3.json(`/metadata/${sample}`).then((sampleInfo) => {
    console.log(sampleInfo);
    
    for (key in sampleInfo) {
      const k = `${key} : ${sampleInfo[key]}`;
      console.log(k);
      panel.append("li")
        .text(k)
        .property("value", k);
    };
  });
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {
  console.log("building charts");
  console.log(`/samples/${sample}`);
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var pie = d3.select("#pie");

  d3.json(`/samples/${sample}`).then((sampleData) => {
    console.log(sampleData); ;

    var values = sampleData.sample_values;
    var labels = sampleData.otu_ids;
    var hovertext = sampleData.otu_labels;
    console.log(values);
    var topValues = [];
    var topLabels = [];
    var topHovertext = [];
    var len = values.length;
    var countr = 0;
    var i = 0;

    while (countr < 10 && i < 1000000){
      // console.log(Math.max(...values));
      if (values[i] === Math.max(...values)) {
        console.log(countr);
        topValues.push(values[i]);
        topLabels.push(labels[i]);
        topHovertext.push(hovertext[i]);
        countr = countr + 1;
        values.splice(i, 1);
        // console.log(values);
        console.log(i);
        i = -1
      }
      i++
    }


    console.log(topValues);
    console.log(topLabels);
    console.log(topHovertext)
    var pieTrace = {
      values: topValues,
      labels: topLabels,
      hovertext: topHovertext,
      type: "pie"
    };
    var pieData = [pieTrace];

    var pieLayout = {
      autosize: true
    };

    Plotly.newPlot('pie',pieData,pieLayout)

    var bubbleTrace = {
      x: labels,
      y: values,
      text: hovertext,
      mode: 'markers',
      marker: {
        size: values,
        color: labels
        
      }
    };

    var bubbleData = [bubbleTrace];

    var bubbleLayout = {
      autosize: true,
      xaxis: {
        title: "OTU ID"
      }
    };

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    
  });

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  
  

  
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  console.log("init function called");
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    console.log(sampleNames);
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
console.log("initizalizing");
init();

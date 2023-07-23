//
// Where to go to aquire the required data
//
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// declare global variables
var a_names    = [];
var a_metadata = [];
var a_samples  = [];
var id         =  0;
var md         = [];
var sp         = [];

// aquire json data from the URL and prepare it to be used in the different graphs.
d3.json(url).then(function(data) { // begin of function
  
  // prepare the dropdown menu contents, Subject IDs
  for (let i=0; i < data.names.length; i++) { 
    a_names[i]    = data.names[i];
    d3.select("#selDataset").append("option").text(data.names[i]);
  }

  // prepare the metadata array
  for (let i=0; i < data.metadata.length; i++){ a_metadata[i] = data.metadata[i] } 
  
  // prepare the samples array
  for (let i=0; i < data.samples.length;  i++){ a_samples[i]  = data.samples[i] } 
}); // end of function

// filter function to get only data referent to the choosen Subject
function selectID(m) { return m.id == id; }

// function to handle the Subject ID selection and process the graphs
function PickID(md){ // begin of function

  // get the data related to the Subject ID choosen
  id = d3.select("#selDataset").property("value");
  md = a_metadata.filter(selectID)[0];
  sp = a_samples.filter(selectID)[0];

  // populate the metadata table
  d3.select("#sample-metadata-1").text(`ID: ${md.id}`);
  d3.select("#sample-metadata-2").text(`ethnicity: ${md.ethnicity}`);
  d3.select("#sample-metadata-3").text(`gender: ${md.gender}`);
  d3.select("#sample-metadata-4").text(`age: ${md.age}`);
  if(md.location == null){ md.location = "unknown"; }
  d3.select("#sample-metadata-5").text(`location: ${md.location}`);
  if(md.bbtype == null) { md.bbtype = 0};
  d3.select("#sample-metadata-6").text(`bbtype: ${md.bbtype}`);
  if(md.wfreq == null) { md.wfreq = 0};
  d3.select("#sample-metadata-7").text(`wfreq: ${md.wfreq}`);
  
  // prepare the elements to be used to plot the graphs
  let l = sp.otu_ids.length
  for (let j=0; j < l; j++) { 
    if (String(sp.otu_ids[j]).slice(0,3) != "OTU") {
      sp.otu_ids[j] = "OTU " + String(sp.otu_ids[j]);
    }
  }

  // lets isolate the 10 top OTUs
  let values = sp.sample_values.slice(0, 10);
  let ids    = sp.otu_ids.slice(0,10);
  let labels = sp.otu_labels.slice(0,10);
  
  // lets setup Graph1
  let trace1 = {
    x: values,
    y: ids,
    text: labels,
    name: "Belly Button Biodiversity",
    type: "bar",
    orientation: "h",
    transforms: [{
      type: 'sort',
      target: 'y',
      order: 'descending'}],
    marker : {
        color: ['rgb(250, 250, 110)', 'rgb(196, 236, 116)', 'rgb(146, 220, 126)', 'rgb(100, 201, 135)', 'rgb(057, 180, 142)' ,
                'rgb(008, 159, 143)', 'rgb(000, 137, 138)', 'rgb(008, 115, 127)', 'rgb(033, 093, 110)', 'rgb(042, 072, 088)']}
  };

  // lets setup Graph2
  let trace2 = {
    x: ids,
    y: values,
    mode: 'markers',
    text: labels,
    name : "Belly Button Biodiversity",
    marker : {
      color: ['rgb(250, 250, 110)', 'rgb(196, 236, 116)', 'rgb(146, 220, 126)', 'rgb(100, 201, 135)', 'rgb(057, 180, 142)',
              'rgb(008, 159, 143)', 'rgb(000, 137, 138)', 'rgb(008, 115, 127)', 'rgb(033, 093, 110)', 'rgb(042, 072, 088)'],
      size: values
    },
    type: "bubble"
  };

  // lets setup Graph3
  let trace3 = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: md.wfreq,
      type: "indicator",
      mode: "gauge+number",
      delta: { reference: 10 },
      gauge: {
        axis: { range: [0, 10] },
        bar: {'color': "darkblue"},
        steps: [
          { range: [0, 1], color: 'rgb(250, 250, 110)' },
          { range: [1, 2], color: 'rgb(196, 236, 116)' },
          { range: [2, 3], color: 'rgb(146, 220, 126)' },
          { range: [3, 4], color: 'rgb(100, 201, 135)' },
          { range: [4, 5], color: 'rgb(57, 180, 142)'  },
          { range: [5, 6], color: 'rgb(8, 159, 143)'   },
          { range: [6, 7], color: 'rgb(0, 137, 138)'   },
          { range: [7, 8], color: 'rgb(8, 115, 127)'   },
          { range: [8, 9], color: 'rgb(33, 93, 110)'   },
          { range: [9,10], color: 'rgb(42, 72, 88)'    } 
        ]
      }
    }
  ];

  // adjust contents and layout for the 3 Graphs
  let traceData1 = [trace1];
  let traceData2 = [trace2];
  let traceData3 = trace3;

  let layout1 = { title: "Top 10 OTUs"              , plot_bgcolor:"Lightskyblue"};
  let layout2 = { title: "Top 10 OTUs" ,              plot_bgcolor:"Lightskyblue"};
  let layout3 = { title: "Weekly washing frequency" , plot_bgcolor:"Lightskyblue"}; 

  // Plot the Graphs
  Plotly.newPlot("bar",    traceData1, layout1);
  Plotly.newPlot("bubble", traceData2, layout2);
  Plotly.newPlot('gauge',  traceData3, layout3);

}; // end of function

d3.selectAll("#selDataset").on("change", PickID);

// let's ensure the first one is shown with a click
d3.selectAll("#selDataset").on("click", PickID);



/* BEGIN OF SOURCE CODE
   Module 14 : belly-button-challenge
   by Jose Eneas S Maria
   07/23/23

   Note: all the console.log entries have been commented out.

*/
// console.log("Execution path - 1.1 - Declare vars and consts");

// declare global variables and constants
const url           = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
var a_names         = []; 
var a_metadata      = [];
var a_samples       = [];
var id              =  0;
var md              = [];
var sp              = [];
const colorGradient = ['rgb(250, 250, 110)', 'rgb(196, 236, 116)', 
                       'rgb(146, 220, 126)', 'rgb(100, 201, 135)', 
                       'rgb(057, 180, 142)', 'rgb(008, 159, 143)',
                       'rgb(000, 137, 138)', 'rgb(008, 115, 127)', 
                       'rgb(033, 093, 110)', 'rgb(042, 072, 088)'];

// aquire json data from the URL and prepare it to be used in the different graphs.
d3.json(url).then(function(data) { // begin of function retrieve data
  
  // console.log("Execution path - 2.1 - Retrieve from URL");
  // prepare the dropdown menu contents, Subject IDs
  for (let i=0; i < data.names.length; i++) { 
    a_names[i]    = data.names[i];
    d3.select("#selDataset").append("option").text(data.names[i]);
  }

  // prepare the metadata array
  for (let i=0; i < data.metadata.length; i++) { a_metadata[i] = data.metadata[i] } 
  
  // prepare the samples array
  for (let i=0; i < data.samples.length;  i++) { a_samples[i]  = data.samples[i] } 
    
  // console.log("Execution path - 2.2 - A trick to auto load the first subject",a_names[0]);
  d3.select("#selDataset").dispatch("change");
}); // end of function retrieve data

// filter function to get only data referent to the choosen Subject
function selectID(m) { // begin of function select subject data
  // console.log("Execution path - 4 - Filter function");
  return m.id == id; 
}; // end of function select subject data

// function to handle the Subject ID selection and process the graphs
function PickID(md){ // begin of function

  // console.log("Execution path - 3.1 - Starts to process one subject");
  // console.log("Execution path - 3.2 - Prepare ID");
  // get the data related to the Subject ID choosen
  id = d3.select("#selDataset").property("value");
  // console.log("Execution path - 3.3 - Prepare Metadata", id);
  md = a_metadata.filter(selectID)[0];

  // console.log("Execution path - 3.4 - Prepare Samples");
  sp = a_samples.filter(selectID)[0];

  // last data cleaning action
  if(md.location == null) { md.location = "unknown"; }
  if(md.bbtype   == null) { md.bbtype   = 0};
  if(md.wfreq    == null) { md.wfreq    = 0};

  // populate the metadata table
  // console.log("Execution path - 3.5 - Prepare Metadata Table");
  d3.select("#sample-metadata-1").text(`ID        : ${md.id}`);
  d3.select("#sample-metadata-2").text(`ethnicity : ${md.ethnicity}`);
  d3.select("#sample-metadata-3").text(`gender    : ${md.gender}`);
  d3.select("#sample-metadata-4").text(`age       : ${md.age}`);
  d3.select("#sample-metadata-5").text(`location  : ${md.location}`);
  d3.select("#sample-metadata-6").text(`bbtype    : ${md.bbtype}`);
  d3.select("#sample-metadata-7").text(`wfreq     : ${md.wfreq}`);
  
  // prepare the elements to be used to plot the graphs
  let l = sp.otu_ids.length;
  for (let j=0; j < l; j++) { 
    if (String(sp.otu_ids[j]).slice(0,3) != "OTU") {
      sp.otu_ids[j] = "OTU " + String(sp.otu_ids[j]);
    }
  }

  // lets isolate the 10 top OTUs

  let values = sp.sample_values.slice(0, 10);
  let ids    = sp.otu_ids.slice(0,10);
  let labels = sp.otu_labels.slice(0,10);
  
  // console.log("Execution path - 3.6 - Filter 10 OTUs");
  // console.log(values);
  // console.log(ids);

  // lets setup Graph1
  // Use sample_values as the values for the bar chart.
  // Use otu_ids       as the labels for the bar chart.
  // Use otu_labels    as the hovertext for the chart.
  // console.log("Execution path - 3.7 - Prepare Bar");
  let barGraph = [{
    x           : values,
    y           : ids,
    text        : labels,
    name        : "Bar-Belly Button Biodiversity",
    type        : "bar",
    orientation : "h",
    transforms  : [{ type : 'sort', target : 'y', order : 'descending'}],
    marker      : { color : colorGradient}}];

  // lets setup Graph2
  // Use otu_ids       for the x values
  // Use sample_values for the y values
  // Use sample_values for the marker size
  // Use otu_ids       for the marker colors --> Instead we are using a gradient of colors for the 3 graphs
  // Use otu_labels    for the text values
  // console.log("Execution path - 3.8 - Prepare Bubble");
  let bubbleGraph = [{
    x           : ids,
    y           : values,
    mode        : 'markers',
    text        : labels,
    name        : "Bubble-Belly Button Biodiversity",
    type        : "bubble",
    marker      : { color : colorGradient, size : values }}];

  // lets setup Graph3
  // console.log("Execution path - 3.9 - Prepare Gauge");
  let gaugeGraph = [{
      domain    : { x: [0, 1], y: [0, 1] },
      value     : md.wfreq,
      type      : "indicator",
      mode      : "gauge+number",
      delta     : { reference: 10 },
      gauge     : {
        axis    : { range: [0, 10] },
        bar     : {'color': "darkblue"},
        steps   : [ { range : [0, 1], color: 'rgb(250, 250, 110)' },
                    { range : [1, 2], color: 'rgb(196, 236, 116)' },
                    { range : [2, 3], color: 'rgb(146, 220, 126)' },
                    { range : [3, 4], color: 'rgb(100, 201, 135)' },
                    { range : [4, 5], color: 'rgb(057, 180, 142)' },
                    { range : [5, 6], color: 'rgb(008, 159, 143)' },
                    { range : [6, 7], color: 'rgb(000, 137, 138)' },
                    { range : [7, 8], color: 'rgb(008, 115, 127)' },
                    { range : [8, 9], color: 'rgb(033, 093, 110)' },
                    { range : [9,10], color: 'rgb(042, 072, 088)' }]}}];

  // adjust contents and layout for the 3 Graphs

  let layout1 = { title: "Top 10 OTUs"              , plot_bgcolor:"Lightskyblue", paper_bgcolor: "Lightskyblue"};
  let layout2 = { title: "Top 10 OTUs"              , plot_bgcolor:"Lightskyblue", paper_bgcolor: "Lightskyblue"};
  let layout3 = { title: "Weekly washing frequency" , plot_bgcolor:"Lightskyblue", paper_bgcolor: "Lightskyblue"}; 

  // Plot the Graphs
  // console.log("Execution path - 3.10 - Plot Bar");
  Plotly.newPlot("bar"   ,    barGraph, layout1);
  // console.log("Execution path - 3.11 - Plot Buble");
  Plotly.newPlot("bubble", bubbleGraph, layout2);
  // console.log("Execution path - 3.12 - Plot Gauge");
  Plotly.newPlot('gauge' ,  gaugeGraph, layout3);

}; // end of function
// console.log("Execution path - 1.2 - Declare Change Handle");
d3.selectAll("#selDataset").on("change", PickID);
// END OF SOURCE CODE
var chart;
var height = 200;
var width = 300;
//DEFINE YOUR VARIABLES UP HERE

//Gets called when the page is loaded.
function init(){
  chart = d3.select('#vis').append('svg');
  vis = chart.append('g');
  //PUT YOUR INIT CODE BELOW
  vis.exit().remove();
}

//Called when the update button is clicked
function updateClicked(){
  d3.csv('data/CoffeeData.csv',update);
}

//Callback for when data is loaded
function update(rawdata){
//PUT YOUR UPDATE CODE BELOW
var reg=[];profReg=[];saleReg=[];cate=[];profCate=[];saleCate=[];    
//Remove previous diagram
var s = d3.selectAll("svg");
s.remove();
    
d3.csv('data/CoffeeData.csv')
                .get(function(error,data){
      
// categorize/nest in category & region
    var OprofCate = d3.nest()
    .key(function(d){return d.category;})
    .rollup(function(leaves) {return {"value":d3.sum(leaves, function(d){return parseFloat(d.profit);})}})
    .entries(data);
    
    var OsaleCate = d3.nest()
    .key(function(d){return d.category;})
    .rollup(function(leaves) {return {"value":d3.sum(leaves, function(d){return parseFloat(d.sales);})}})
    .entries(data);    
    

    for(var p=0; p<OprofCate.length; p++){
        cate.push(OprofCate[p].key);
        profCate.push(OprofCate[p].value.value);
        saleCate.push(OsaleCate[p].value.value);
    }
    
    //
    var OprofReg = d3.nest()
    .key(function(d){return d.region;})
    .rollup(function(leaves) {return {"value":d3.sum(leaves, function(d){return parseFloat(d.profit);})}})
    .entries(data);
    
    var OsaleReg = d3.nest()
    .key(function(d){return d.region;})
    .rollup(function(leaves) {return {"value":d3.sum(leaves, function(d){return parseFloat(d.sales);})}})
    .entries(data);    

    
    for(var p=0; p<OprofReg.length; p++){
        reg.push(OprofReg[p].key);
        profReg.push(OprofReg[p].value.value);
        saleReg.push(OsaleReg[p].value.value);
    }    
    
    console.log(OprofReg[0].value.value);
    console.log(cate,profCate,saleCate);
    console.log(reg,profReg,saleReg);
    
//draw diagram
// Filter x&y
    var xaxis = getXSelectedOption();// default: region, category
    var yaxis = getYSelectedOption();// default: sales, profit
       
    if (xaxis == "region"){
         var xdata = reg;
         
         if(yaxis == "sales") {var max = d3.max(saleReg); var ydata = saleReg;}
         else if(yaxis == "profit") {var max = d3.max(profReg); var ydata = profReg;}
        }
    
    else if(xaxis == "category"){
         var xdata = cate;        
        
         if(yaxis == "sales") {var max = d3.max(saleCate); var ydata = saleCate;}
         else if(yaxis == "profit") {var max = d3.max(profCate); var ydata = profCate;}
    }
    
    console.log(xdata,ydata);
// Set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 50, left: 70},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

    
    var svg = d3.select("#vis").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

//set x&y scale
    var x = d3.scaleBand()
            .domain(xdata)
            .range([0,width]);
    
    var y = d3.scaleLinear()
                .domain([0,max])
                .range([height,0]);
    
//Set color
    var colorArray = ["steelblue","darkorange","mediumseagreen","tomato"];
    
//Add a rectangle
    var barWidth = width/xdata.length;
    
    svg.selectAll("rect")       
        .data(ydata)
        .enter().append("rect")
        .attr("height",function(d,i){return height-y(ydata[i]);}) //!
        .attr("width",barWidth-10)
        .attr("x",function(d,i){return barWidth*i;}) // start point
        .attr("y",function(d,i){return y(ydata[i]);})
        .attr("fill",function(d,i){return colorArray[i];});
    
//Add axis     
    var xAxis = d3.axisBottom(x).ticks(5);
    var yAxis = d3.axisRight(y).ticks(5); 
    
//Add x Axis
    svg.append("g")
        .attr("transform", "translate(0," + (height) + ")")    
        .call(xAxis);

//Add y axis    
    svg.append("g")
        .attr("transform","translate("+ (width) +",0)")
        .call(yAxis);
})

// Returns the selected option in the X-axis dropdown. Use d[getXSelectedOption()] to retrieve value instead of d.getXSelectedOption()
function getXSelectedOption(){
  var node = d3.select('#xdropdown').node();
  var i = node.selectedIndex;
  return node[i].value;
}

// Returns the selected option in the X-axis dropdown. 
function getYSelectedOption(){
  var node = d3.select('#ydropdown').node();
  var i = node.selectedIndex;
  return node[i].value;
}
}
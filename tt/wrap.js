//Adding event listener for database selector
var classifiers = ["vuosi_", "maakunta", "tuotantosuuntaso"]
var data = JSON.parse(data)
var data = reshapeJSON(data, classifiers)
//Extracting categories and options
var categories = Object.keys(data[0])
var categories = categories.filter(i => i !== 'value')
console.log(categories)

var options = []
for(k in categories){
  var a = data.map(i=>i[categories[k]])
  var a = a.filter(onlyUnique)
  options.push(a)
}
console.log(options)

//Generate checkbox inside box
generateCheckBoxes(categories, options, 'boxTop')

//Add function to show checkboxes div
document.getElementById("selectDimensionButton").onclick = function(){showBoxSelector("boxTop")}

//Once data has been fetched and checkboxes created, Select dimension button will receive the following functions
document.getElementById("buttonDimensionSelector").onclick = function(){

  showBoxSelector("boxTop") //Hide box with checkboxes
  
  //Add back function to show checkboxes div
  document.getElementById("selectDimensionButton").onclick = function(){showBoxSelector("boxTop")}
}


//Creates empty object with category keys
var checkedValues = checkedValuesObjectGenerator(categories)
var allCheckBoxes = document.querySelectorAll('input');

//Establishes checkbox verification system. Multiple or single selection
establishInitial(allCheckBoxes, categories, checkedValues) //Value is written inside the global variable checkedValues

//Add function to render graph button. Function shows what variables were selected.
document.getElementById("buttonRender").onclick = function(){

  //Selects categories which will be used as group and xAxis  
  var dropdownCategories;
  pickMultiClassCategories(checkedValues, categories) 
  
  function filterDataByCheckBoxSelector(categories, data, checkedValues){
    for(k in categories){
      var selectedCategories = window.checkedValues[categories[k]]
      var data = data.filter(i => selectedCategories.indexOf(i[categories[k]]) !== -1)
    }
    return(data)
  }
  
  var group1 = window.dropdownCategories[0]
  var group2 = window.dropdownCategories[1]

  var xAxisName1 = window.dropdownCategories[1]
  var xAxisName2 = window.dropdownCategories[0]

  var [yAxis1, labels1] = separateDataInGroups(data, group1, checkedValues)
  var [yAxis2, labels2] = separateDataInGroups(data, group2, checkedValues)
  console.log(yAxis1)
  var xAxis1 = window.checkedValues[xAxisName1]
  var xAxis2 = window.checkedValues[xAxisName2]

  var box = document.getElementById("box")
  var box1 = document.getElementById("box1")
  var box2 = document.getElementById("box2")
  var box3 = document.getElementById("box3")
  var box4 = document.getElementById("box4")
  box.innerHTML = '<canvas id="myChart"></canvas>'
  box1.innerHTML = '<canvas id="myChart1"></canvas>'
  box2.innerHTML = '<canvas id="myChart2"></canvas>'
  box3.innerHTML = '<canvas id="myChart3"></canvas>'
  box4.innerHTML = '<canvas id="myChart4"></canvas>'

  graphCustom(xAxis1, yAxis1, labels1, "myChart", 'line', "Comparing by " + group1)
  graphCustom(xAxis2, yAxis2, labels2, "myChart1", 'bar', "Comparing by " + group2, showLegend = true)

  graphCustomPie(xAxis1, yAxis1[0], "myChart2", "pie", labels1[0])
  graphCustomPie(xAxis1, yAxis1[1], "myChart3", "pie", labels1[1])
  graphCustomPie(xAxis1, yAxis1[2], "myChart4", "pie", labels1[2])


  //document.getElementById("box").innerHTML = JSON.stringify(window.checkedValues);
}

var boxSelector = document.getElementById("boxTop")
var headerSelector = document.getElementById("categorySelectorHeader")
dragElement(boxSelector, headerSelector);

//Initiate map
var mapRegionsCode = ['01' , '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16']
clickableMap(mapRegionsCode, alert)
showMap(mapRegionsCode)





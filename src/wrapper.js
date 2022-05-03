//Renders database selection
var optionNames = ["Green house gass emission",
                   "Vegetables grown in the open",
                   "Agricultural enterprises",
                   "Crop yiealds"]

var options = ['http://statdb.luke.fi/PXWeb/api/v1/en/LUKE/08%20Indikaattorit/02%20Ilmastonmuutos/02%20Maatalouden%20kasvihuonekaasupäästöt/01_Maatal_kasvihuonekaasupaastot.px',
               'http://statdb.luke.fi/PXWeb/api/v1/en/LUKE/02%20Maatalous/04%20Tuotanto/20%20Puutarhatilastot/05_Vihannesviljely_avomaa_kokonaistuotanto.px',
               'http://statdb.luke.fi/PXWeb/api/v1/en/LUKE/02%20Maatalous/02%20Rakenne/02%20Maatalous-%20ja%20puutarhayritysten%20rakenne/01_Maatalous_ja_puutarhayrit_lkm_ELY.px',
               'http://statdb.luke.fi/PXWeb/api/v1/en/LUKE/02%20Maatalous/04%20Tuotanto/14%20Satotilasto/01_Viljelykasvien_sato.px']

//Rendering selector for database
var optionIDS = ['Database']
dropDownSelection('dropdown-btn', options, optionNames, optionIDS, 'statisticsSelector', nRuns = 1)

//Adding event listener for database selector
var dataBaseSelector = document.getElementById('Database')
dataBaseSelector.addEventListener('change', async function() {

  var url = checkSelected('Database')
  console.log(url)

  //Add base data call here, which will determine optionIDS below
  var options = ['a', 'b', 'c']
  var optionNames = ['a', 'b', 'c']
  var optionIDS = ['Year', 'Region', 'Size']

  //Render checkbox selection buttons
  createClassifierButton("displayBoxButton", 'dimensionSelector')
  var dimensionSelectionButtons = document.querySelectorAll(".displayBoxButton")
  for(k in dimensionSelectionButtons){
    dimensionSelectionButtons[k].onclick = function(){showBoxSelector("boxTop")}
  }

  //Adds function to button. Fetches the selected values in the boxes
  document.getElementById("buttonRender").onclick = function(){
    genObjectClassifiers(optionIDS);
  };  
  
  //Generate checkbox inside button
  generateCheckBoxes(optionIDS, optionNames, 'boxTop')

  //Add showBox to the button which shows the category name
  document.getElementById("buttonDimensionSelector").onclick = function(){showBoxSelector("boxTop")}

  //Initiate map
  var mapRegionsCode = ['01', '02', '03', '04', '05', '10']
  clickableMap(mapRegionsCode, alert)
  showMap(mapRegionsCode)

});





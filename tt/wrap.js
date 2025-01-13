//var data = data.filter(i => i.omaluok !== 5)
var textTranslations = {
  selectors: {
    filter: {fin: "Valitse ryhmä", swd: "Välj grupp", eng: "Select Group"},
    previous: {fin: "Edellinen", swd: "Tidigare", eng: "Previous"},
    next: {fin: "Seuraava", swd: "Nästa", eng: "Next"}, 
    shareURL: {fin: "Jaa URL", swd: "Dela URL", eng: "Share URL"}, 
    embedURL: {fin: "Upota URL", swd: "Bädda in URL", eng: "Embed URL"},
    backToTable: {fin: "Takaisin taulukkoon", swd: "Tillbaka till tabel", eng: "Back to table"},
    backToSelection: {fin: "Takaisin valintaan", swd: "Tillbaka till urval", eng: "Back to selection"},
    messageSingle: {fin: ["Yksi valitsin", "Jos haluat valita lisää kohteita tästä luokasta, valitse vain yksi kohde seuraavista luokista: "], 
                    swd: ["Enda väljare", "Om du vill välja fler värden från denna kategori, välj bara ett värde från följande kategorier: "], 
                    eng: ["Single selector", "If you want to select more values from this category, select only one value from the following categories: "]},
  },
  checkboxes: {
    categorySelector: {fin: "Ryhmän valinta", swd: "Gruppval", eng: "Group Selection"},
    renderGraphs: {fin: "Piirrä graafit", swd: "Rita graferna", eng: "Draw graphs"},
    singleSelector: {fin: "Valitse vain yks", swd: "Välja endast en", eng: "Select only one"},
    multipleSelector: {fin: "Voit valita monta", swd: "Du kan välja många", eng: "You can select several"},
    all: {fin: "Vaihda", swd: "Förända", eng: "Change"},
  },
  source: {
    source: {fin: "Lähde: <a href='https://portal.mtt.fi/portal/page/portal/taloustohtori/'>Taloustohtori</a>", 
             swd: "Källa: <a href='https://portal.mtt.fi/portal/page/portal/ekonomidoktorn/'>Ekonomidoktorn</a>",
             eng: "Source: <a href='https://portal.mtt.fi/portal/page/portal/economydoctor/'>Economy Doctor</a>"},
  },
  noGraphs: {
    sorryNoData: {fin: "Anteeksi, valitettavasti tälle valinnalle ei ole tietoja", 
                  swd: "Tyvärr, det finns ingen data för detta val", 
                  eng: "Sorry, there is no data for this selection"},
    pleaseTryDifferent: {fin: "Ole hyvä ja kokeile toista muuttujien yhdistelmää", 
                         swd: "Prova en annan kombination av variabler", 
                         eng: "Please, try a different combination of variables"},
  },
  hajonta: {
    average: {
      fin: "Keskiarvo",
      swd: "Genomsnitt",
      eng: "Average",
    },
    sum: {
      fin: "Summa",
      swd: "Belopp",
      eng: "Summ",
    }
  }
}

if(kieli === 1){
  var language = 'fin'
  var logoURL = 'https://portal.mtt.fi/portal/page/portal/taloustohtori/Kuvat/Luke-taloustohtori-200x150px_1.png'
}
if(kieli === 2){
  var language = 'swd'
  var logoURL = 'https://portal.mtt.fi/portal/page/portal/taloustohtori/Kuvat/Luke-ekonomidoktorn-213x150px.png'
}
if(kieli === 3){
  var language = 'eng'
  var logoURL = 'https://portal.mtt.fi/portal/page/portal/taloustohtori/Kuvat/Luke-economydoctor-213x150px.png'
}


//Initiating global variables
var filteredDataForMap;
var filteredData;
var multiClassClassifiers;
var map;
var reportType = reportType.slice(0, -1) //Remove empty space from report type
var graph1;
var graph2;
var pie1;
var pie2;

//Extracting classifiers from ED file classifierLabels
var initialClassifiers = Object.keys(classifierLabels[0])

//Reshaping json object from wide to long format
var data = reshapeJSON(data, initialClassifiers)

//Merging labels into one object
var allLabels = mergeLabelsObject(initialClassifiers, classifierSubLabels)
allLabels["dependentVariable"] = dependentLabels[0]
classifierLabels[0]['dependentVariable'] = reportType
var labels = [{"dependentVariable": dependentLabels[0], "classifiers": classifierLabels[0], "subLabels": allLabels}]

//Fixing not expanded data frame problem for omaluok
if(false){
  var allMaakuntasSelected = Object.keys(labels[0]['subLabels'].maakunta).filter(i => i !== 'code')
  var problemExpanded = [];

  var exampleRegion = problem[0].maakunta
  for(j in allMaakuntasSelected){
    for(k in problem){
      var pC = JSON.parse(JSON.stringify(problem[k]));
      pC.maakunta = Number(allMaakuntasSelected[j])
      problemExpanded.push(pC)
    }
  }

  function removeNonExample(i){
    if(Number(i.maakunta) !== exampleRegion){
      i.value = null;
    }
    return(i)
  }

  var problem = reshapeJSON(problemExpanded, initialClassifiers)
  var problem = problem.map(i => removeNonExample(i))
  var data = data.concat(problem);
}
//End of fixing not expanded data frame problem for omaluok

//Function to save graphs
function saveChartWithBackground(chart, logoURL) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Load the logo image
    const logoForChart = new Image();
    logoForChart.onload = () => {
        // Set the new canvas size based on the logo size
        const logoWidth = 100;  // Adjust size of the logo
        const logoHeight = 100; // Adjust size of the logo
        canvas.width = chart.chart.canvas.width + logoWidth;  // Increase width
        canvas.height = chart.chart.canvas.height + logoHeight; // Increase height

        // Fill the background with a solid color
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        console.log(chart)
        // Draw the logo in the top-right corner
        context.drawImage(logoForChart, canvas.width - logoWidth, 0, logoWidth, logoHeight);

        // Draw the chart, adjusting its position to avoid overlap with the logo
        context.drawImage(chart.chart.canvas, 50, 50); // Place chart at the top-left corner

        // Add source text underneath the graph
        context.fillStyle = 'black';  // Text color
        context.font = '16px Arial';  // Font style and size
        context.textAlign = 'center';  // Align text to the center
        context.fillText(mTitle, canvas.width / 2, canvas.height - (30 / 2));  // Position text at the bottom center

        // Create a download link
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'chart.png';
        link.click();
    };

    // Set the logo URL source
    logoForChart.src = "data:image/jpeg;base64,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";
}


//Removing last -empty- character from alue
var alue = alue.slice(0, -1)
console.log("Alue variable here:")
console.log(alue)
if(alue == "tukialue"){ //Or empty, no map
  var renderMap = false
} else {
  var regionDivision = alue
  var renderMap = true
}

//Testing different orders
//var initialClassifiers = ['maakunta', 'tuotantosuuntaso', 'vuosi_']
//var initialClassifiers = ['tuotantosuuntaso', 'vuosi_', 'maakunta']
//var initialClassifiers = ['vuosi_', 'maakunta', 'tuotantosuuntaso']

function completeWrap(){
  //Verifies if user chose at least one options for each classifier. If not, random assignment is made
  SmartDasher.verifyAllClassifiersChecked(checkedValues)

  //Selects classifiers which will be used as group and xAxis  
  SmartDasher.pickMultiClassClassifiers(checkedValues, classifiers)

  var nMulticlassClassifiers = window.multiClassClassifiers.length

  //For when there are 2 multiclass classifier
  if(nMulticlassClassifiers == 2){

    SmartDasher.renderGraphBoxes(nMulticlassClassifiers, renderMap)

    var group1 = window.multiClassClassifiers[0]
    var group2 = window.multiClassClassifiers[1]

    var xAxisName1 = window.multiClassClassifiers[1]
    var xAxisName2 = window.multiClassClassifiers[0]

    window.filteredDataForMap = SmartDasher.filterDataByCheckBox(classifiers, data, window.checkedValues)

    var [yAxis1, labels1] = SmartDasher.separateDataInGroups(window.filteredData, group1, checkedValues)
    var [yAxis2, labels2] = SmartDasher.separateDataInGroups(window.filteredData, group2, checkedValues)

    var xAxis1 = window.checkedValues[xAxisName1]
    var xAxis2 = window.checkedValues[xAxisName2]

    //Filtering null and missing values
    var [yAxis1, xAxis1, labels1] = SmartDasher.nullsOut(yAxis1, xAxis1, labels1)
    var [yAxis2, xAxis2, labels2] = SmartDasher.nullsOut(yAxis2, xAxis2, labels2)
    //End of filtering null and missing values

    //Translating subClassifier codes to labels
    var xAxis1 = xAxis1.map(i => labels[0]['subLabels'][xAxisName1][i])
    var xAxis2 = xAxis2.map(i => labels[0]['subLabels'][xAxisName2][i])

    var labels1 = labels1.map(i => labels[0]['subLabels'][group1][i])
    var labels2 = labels2.map(i => labels[0]['subLabels'][group2][i])

    var group1Label = labels[0]['classifiers'][group1]
    var group2Label = labels[0]['classifiers'][group2]

    //Display single variable names
    var singleLabels = SmartDasher.singleLabelExtractor(window.checkedValues, labels)

    var singleClassifiers = Object.keys(singleLabels)
    var singleOptions = Object.values(singleLabels)
    
    var title1 = ''
    for(m in singleClassifiers){
      title1 += singleClassifiers[m] + ': ' + singleOptions[m] + '    '
    }
    var title1 = title1.slice(0, -2)

    //document.getElementById('selectedVariables').innerHTML = title1

    var xAxis1 = xAxis1.map(i=>SmartDasher.shortenLabel(i, 10))
    var xAxis2 = xAxis2.map(i=>SmartDasher.shortenLabel(i, 19))

    console.log(xAxis2)
    console.log(yAxis2)
    console.log(labels2)

    var yAxisTitle = yksikkokieli
    
    console.log(yAxisTitle)
    console.log(yAxis1)
    console.log(yAxis2)

    //Thousand separator
    //yAxis1 = yAxis

    if(kieli == 3){
      var thousandSeparator = "en-US"
    } else {
      var thousandSeparator = "de-DE"
    }

    window.graph1 = SmartDasher.graphCustom(xAxis1, yAxis1, labels1, "myChart", "line", title1, showLegend = true, fill = false, suggestedMin = null, position = 'bottom', yAxisTitle = yAxisTitle, thousandSeparator = thousandSeparator)
    window.graph2 = SmartDasher.graphCustom(xAxis2, yAxis2, labels2, "myChart1", "bar", title1, showLegend = true, fill = false, suggestedMin = null, position = 'bottom', yAxisTitle = yAxisTitle, thousandSeparator = thousandSeparator)

    console.log("Seeing pie charts")
    //Rendering up to 2 pieCharts
    var pieColors = SmartDasher.colorGenerator(xAxis2)

    var nPieCharts = Math.min(yAxis2.length, 2)
    //It is possible that all values of a given classifier are null.
    //In this case, the nPieCharts will be lower than 2. Then we cancel pie charts completelly.
    if(nPieCharts == 2){
      SmartDasher.generatePieChartsContainers(nPieCharts)
    } else {
      SmartDasher.generatePieChartsContainers(0)
      document.getElementById("pieChartsContainer").style.display = "none"
      document.getElementById("mainGraphs").style.maxWidth = "100%"
    }

    if(nPieCharts == 2){
      pie1 = SmartDasher.graphCustomPie(xAxis2, yAxis2[yAxis2.length-1], "myChart" + 2, "doughnut", labels2[yAxis2.length-1], pieColors)
      pie2 = SmartDasher.graphCustomPie(xAxis2, yAxis2[0], "myChart" + 3, "doughnut", labels2[0], pieColors)
    }
    if(nPieCharts == 1){
      //pie1 = SmartDasher.graphCustomPie(xAxis2, yAxis2[yAxis2.length-1], "myChart" + 2, "doughnut", labels2[yAxis2.length-1], pieColors)
    }

    console.log("End of seeing pie charts")

    document.querySelectorAll("#downloadButton")[0].onclick = function(){
      saveChartWithBackground(graph1);
    }
    document.querySelectorAll("#downloadButton")[1].onclick = function(){
      saveChartWithBackground(graph2);
    }
    try{
      document.querySelectorAll("#downloadButton")[2].onclick = function(){
        saveChartWithBackground(pie1);
      }
      document.querySelectorAll("#downloadButton")[3].onclick = function(){
        saveChartWithBackground(pie2);
      }
    } catch(e){
      console.log("No pie charts to download")
    }
  } 
  
  ///////For when there is only 1 milticlass classifier
  if(nMulticlassClassifiers == 1) {

    SmartDasher.renderGraphBoxes(nMulticlassClassifiers, renderMap)

    var group1 = window.multiClassClassifiers[0]
    var xAxisName1 = classifiers.filter(i=>i !== group1)[0]

    window.filteredDataForMap = SmartDasher.filterDataByCheckBox(classifiers, data, window.checkedValues)

    var [yAxis1, labels1] = SmartDasher.separateDataInGroups(window.filteredData, group1, checkedValues)

    var xAxis1 = window.checkedValues[xAxisName1]

    //Filtering null and missing values
    var [yAxis1, xAxis1, labels1] = SmartDasher.nullsOut(yAxis1, xAxis1, labels1)
    //End of filtering null and missing values

    //Translating subClassifier codes to labels
    var xAxis1 = xAxis1.map(i => labels[0]['subLabels'][xAxisName1][i])
    var labels1 = labels1.map(i => labels[0]['subLabels'][group1][i])
    var group1Label = labels[0]['classifiers'][group1]

    //Display single variable names
    var singleLabels = SmartDasher.singleLabelExtractor(window.checkedValues, labels)
    var singleClassifiers = Object.keys(singleLabels)
    var singleOptions = Object.values(singleLabels)

    var title1 = ''
    for(m in singleClassifiers){
      title1 += singleClassifiers[m] + ': ' + singleOptions[m] + '    '
    }
    var title1 = title1.slice(0, -1)

    //document.getElementById('selectedVariables').innerHTML = title1

    var labels1 = labels1.map(i=>SmartDasher.shortenLabel(i, 19))

    window.graph1 = SmartDasher.graphCustom(labels1, [yAxis1.map(i=> i[0])], '', "myChart", 'line', title1, showLegend=false)
    
    //Rendering up to 3 pieCharts
    var pieColors = SmartDasher.colorGenerator(labels1)

    var nPieCharts = Math.min(yAxis1.length, 3)

    SmartDasher.generatePieChartsContainers(2)

    document.getElementById("myChart3").style.width = "100%"
 
    //Define position of legend based on number of classifiers
    if(labels1.length >= 15){
      var position = 'right'
    } else {
      var position = 'bottom'
    }
    graph2 = SmartDasher.graphCustom(xAxis1, yAxis1, labels1, "myChart3", 'bar', '', position=position)
    pie1 = SmartDasher.graphCustomPie(labels1, yAxis1.map(i=>i[0]), "myChart2", "doughnut", '', pieColors, legend=true, position=position)

    if(renderMap){
      //fillMapSelection(checkedValues, 'dropdown-content', labels, textTranslations)
    }

    document.querySelectorAll("#downloadButton")[0].onclick = function(){
      saveChartWithBackground(graph1);
    }
    document.querySelectorAll("#downloadButton")[1].onclick = function(){
      saveChartWithBackground(pie1);
    }
    document.querySelectorAll("#downloadButton")[2].onclick = function(){
      saveChartWithBackground(pie2);
    }

  } if(nMulticlassClassifiers < 1) {
    
    SmartDasher.renderGraphBoxes(nMulticlassClassifiers, renderMap)

    var group1 = classifiers[0]
    var xAxisName1 = classifiers[1]

    window.filteredDataForMap = SmartDasher.filterDataByCheckBox(classifiers, data, window.checkedValues)

    var [yAxis1, labels1] = SmartDasher.separateDataInGroups(window.filteredData, group1, checkedValues)

    var xAxis1 = window.checkedValues[xAxisName1]

    //Filtering null and missing values
    var [yAxis1, xAxis1, labels1] = SmartDasher.nullsOut(yAxis1, xAxis1, labels1)
    //End of filtering null and missing values

    //Translating subClassifier codes to labels
    var xAxis1 = xAxis1.map(i => labels[0]['subLabels'][xAxisName1][i])
    var labels1 = labels1.map(i => labels[0]['subLabels'][group1][i])

    //Display single variable names
    var singleLabels = SmartDasher.singleLabelExtractor(window.checkedValues, labels)
    var singleClassifiers = Object.keys(singleLabels)
    var singleOptions = Object.values(singleLabels)

    var title1 = ''
    for(m in singleClassifiers){
      title1 += singleClassifiers[m] + ': ' + singleOptions[m] + '    '
    }
    var title1 = title1.slice(0, -1)

    //document.getElementById('selectedVariables').innerHTML = title1

    var xAxis1 = xAxis1.map(i=>SmartDasher.shortenLabel(i, 19))
    window.graph1 = SmartDasher.graphCustom(xAxis1, yAxis1, labels1, "myChart", 'bar', title1)

    if(renderMap){
      //fillMapSelection(checkedValues, 'dropdown-content', labels, textTranslations)
    }

  }
  if(renderMap){
    wrapMap(regionDivision, zoom, false)
    //Getting only region codes that exist in data
    //var mrc = renameMapRegions(filteredDataForMap);
    //drawMap(mapURL, mapDivision, mrc, filteredDataForMap, map, zoom = 4.7, centering = [65.3, 25], labels)
  }

  document.querySelectorAll("#downloadButton")[0].onclick = function(){
    saveChartWithBackground(graph1);
  }

  SmartDasher.displayNonGraphs(window.filteredData, whereToAppend = "graphsContainer", textTranslations, language)
}

//Render html structure
SmartDasher.initiateDashboard(title = mTitle, logo = logoURL, renderMap = renderMap, flipperButton = true, textTranslations, language)

//If map is present, set up map properties
if(renderMap){
  var zoom = 1.7
  var centering = [65.0, 25.1]
  var crs = new L.Proj.CRS('EPSG:3067',
    "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    {
      resolutions: [
        8192, 4096, 2048, 1024, 512, 256, 128
      ],
      origin: [0, 0]
    })
  var map = L.map("mapBox", {zoomSnap: 0.1, crs: crs}).setView(centering, zoom);
  var baseTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' })
  map.options.minZoom = 4;
  var tilesLayer; //Define another tile layer (not on use)
  var popup; //Define global popup layer
  var info = L.control(); //Define information box to display name of region
}

var dvKeys = Object.keys(labels[0]['dependentVariable'])
for(k in dvKeys){
  labels[0]['dependentVariable'][dvKeys[k]] = labels[0]['dependentVariable'][dvKeys[k]].replaceAll('Ã¶', 'ö')
  labels[0]['dependentVariable'][dvKeys[k]] = labels[0]['dependentVariable'][dvKeys[k]].replaceAll('Ã¤', 'ä')
  labels[0]['dependentVariable'][dvKeys[k]] = labels[0]['dependentVariable'][dvKeys[k]].replaceAll('Ã¥', 'å')
  labels[0]['dependentVariable'][dvKeys[k]] = labels[0]['dependentVariable'][dvKeys[k]].replaceAll('Ã–', 'Ö')
  labels[0]['dependentVariable'][dvKeys[k]] = labels[0]['dependentVariable'][dvKeys[k]].replaceAll('Ã„', 'Ä')
  labels[0]['dependentVariable'][dvKeys[k]] = labels[0]['dependentVariable'][dvKeys[k]].replaceAll('Ã…', 'Å')
  labels[0]['dependentVariable'][dvKeys[k]] = labels[0]['dependentVariable'][dvKeys[k]].replaceAll("Ästerbotten", 'Österbotten')
}

var listClassifiers = Object.keys(labels[0]['subLabels'])
for(k in listClassifiers){
  var classObject = labels[0]['subLabels'][listClassifiers[k]]
  var listSubClasses = Object.keys(classObject)
  for(m in listSubClasses){
    labels[0]['subLabels'][listClassifiers[k]][listSubClasses[m]] = labels[0]['subLabels'][listClassifiers[k]][listSubClasses[m]].replaceAll('Ã¶', 'ö')
    labels[0]['subLabels'][listClassifiers[k]][listSubClasses[m]] = labels[0]['subLabels'][listClassifiers[k]][listSubClasses[m]].replaceAll('Ã¤', 'ä')
    labels[0]['subLabels'][listClassifiers[k]][listSubClasses[m]] = labels[0]['subLabels'][listClassifiers[k]][listSubClasses[m]].replaceAll('Ã¥', 'å')
    labels[0]['subLabels'][listClassifiers[k]][listSubClasses[m]] = labels[0]['subLabels'][listClassifiers[k]][listSubClasses[m]].replaceAll('Ã–', 'Ö')
    labels[0]['subLabels'][listClassifiers[k]][listSubClasses[m]] = labels[0]['subLabels'][listClassifiers[k]][listSubClasses[m]].replaceAll('Ã„', 'Ä')
    labels[0]['subLabels'][listClassifiers[k]][listSubClasses[m]] = labels[0]['subLabels'][listClassifiers[k]][listSubClasses[m]].replaceAll('Ã…', 'Å')
  }
}

//Extracting classifiers and options
var classifiers = Object.keys(data[0])
var classifiers = classifiers.filter(i => i !== 'value')

var options = []
for(k in classifiers){
  var a = data.map(i=>i[classifiers[k]])
  var a = a.filter(onlyUnique)
  var a = a.filter(i => {return i !== "N" && i !== 'eyelain' && i !== 'otos'});
  options.push(a)
}
var options = options.filter(i=> i[0] !== undefined)

//Manually extracting classifiersAndOptions because I want to remove N, Eyelain, and Otos
var classifiersAndOptions = {}
for(k in classifiers){
  var a = data.map(i=>i[classifiers[k]])
  var a = a.filter(onlyUnique)
  var a = a.filter(i => {return i !== "N" && i !== 'eyelain' && i !== 'otos'});
  classifiersAndOptions[classifiers[k]] = a
}

//Generate checkbox inside hidden div
SmartDasher.generateCheckBoxes(classifiers, options, data, '', labels, textTranslations, language, completeWrap)

//Creates empty object with category keys
var checkedValues = SmartDasher.checkedValuesObjectGenerator(classifiers)


//Establishes functions to be added to "howToButton"
function howToFunction(){
  var multiClassChosen = window.multiClassClassifiers.map(i=>labels[0]['classifiers'][i])
  var messageTitle = textTranslations['selectors']['messageSingle'][language][0]
  var messageBody = textTranslations['selectors']['messageSingle'][language][1]
  messageBody += multiClassChosen[0] + ' / ' + multiClassChosen[1]
  Swal.fire(messageTitle, messageBody);
}
//Establishes checkbox verification system. Multiple or single selection
SmartDasher.checkBoxVerificationSystem(classifiers, checkedValues, data, SmartDasher.filterDataByCheckBox, exception = "", textTranslations = textTranslations, howToFunction = howToFunction) //Value is written inside the global variable checkedValues

//If user is entering for the first time, random selection is done.
//Otherwise, if the page has url parameters, page will render the selection previously made
var urlCheckBoxes = SmartDasher.checkBoxesFromUrl() //Does the url have checkbox parameters?
if(urlCheckBoxes === false){ //If no, run random simulation of elements
  //Selecting two multiclass classifiers
  var lastChosen = initialClassifiers[initialClassifiers.length-1]
  console.log("Last classifier chosen is");
  console.log(lastChosen);
  var multi = [lastChosen]; //Vuosi is always present, so we pick this as one multiclassifier
  var classifiersNoVuosi = classifiers.filter(i=>i !== lastChosen && i !== "dependentVariable")
  var randomElement = classifiersNoVuosi[Math.floor(Math.random() * classifiersNoVuosi.length)];
  multi.push(randomElement)
  
  //Establishing the single classifiers
  var single = classifiers.filter(i => multi.includes(i) == false)
  
  //Running click simulation
  SmartDasher.simulateSelection(multi, single)
  SmartDasher.singleCheck('dependentVariable', 0)
  completeWrap()

} else { //If yes, check checkboxes according to the parameters of the urlCheckBoxes
  SmartDasher.hideSelectors() //If user intends to embed url, there will be a parameter called embed. If embed is true, headers and selectors will be hiden for compactness.
  var checkKeys = Object.keys(urlCheckBoxes)
  for(l in checkKeys){
    SmartDasher.targetCheck(checkKeys[l], urlCheckBoxes[checkKeys[l]])
  }
  completeWrap()
}

//Establishing initial state of dependentVariable click box
var currentCheck = checkedValues['dependentVariable']
var dependentIndex = classifiersAndOptions['dependentVariable'].indexOf(currentCheck[0])

document.getElementById("nextDependent").onclick = function(){
  SmartDasher.nextDependent(classifiersAndOptions, true, window.dependentIndex, "dependentVariable")
  completeWrap()
}
document.getElementById("previousDependent").onclick = function(){
  SmartDasher.nextDependent(classifiersAndOptions, false, window.dependentIndex, "dependentVariable")
  completeWrap()
}
//tulostus=1&dim1paataso=1&dim1alataso=18,19,02,21&nayta=2.dimensio&dim2paataso=13&dim2alataso=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21&nayta=3.dimensio&dim3paataso=79&dim3alataso=1,5,6
document.getElementById("goBackSelection").onclick = function(){
  javascript:history.go(-2);
}

//Changing button displays and functions
var button1 = document.getElementById("shareDashboardButton")
var button2 = document.getElementById("embed")
var button3 = document.getElementById("goBackSelection")

button1.innerHTML = textTranslations['selectors']['backToSelection'][language] + ' <i class="fa fa-hand-o-left" aria-hidden="true"></i>'
button2.style.display = "none"
button3.innerHTML = textTranslations['selectors']['backToTable'][language] + ' <i class="fa fa-hand-o-left" aria-hidden="true"></i>'

button1.onclick = function(){
  javascript:history.go(-2);
}
button3.onclick = function(){
  //javascript:history.go(-1);
  window.close();
}

//try{
  //var buttonHowTo = document.getElementById("howToButton")
  //buttonHowTo.onclick = function(){
    //buttonQuestion()
    //}
  //} catch{
    //console.log("No single selector")
    //}

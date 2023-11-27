/*Just made this change*/
/* Dataset is generated here by ED's system */

/* Generates json file */
filename jsonout1 "json.txt" encoding="utf-16be";
proc json out=jsonout1 pretty;
	export graf_data_ / nosastags;
run;

/* /data/taloustohtoritulosteet/rap/ */

/*labels for variables. Tulvarastonmuutos -> Varaston muutos  */
filename jsonout2 "json_lab.txt" encoding="utf-16be";
proc json out=jsonout2 pretty;
	export graf_label_ / nosastags;
run;

/*labels for names of classifiers (e.g. vuosi_ -> Vuosi, Tuotantosuuntaso -> Tuotantosuunta)*/
filename jsonout3 "json_classifierLabels.txt" encoding="utf-16be";
proc json out=jsonout3 pretty;
	export graf_classlabel_ / nosastags;
run;

/*labels for subclass of classifiers. So, this is subclass labels, like with maakunta: Etelä-Savo, Pohjois-Savo */
filename jsonout4 "json_classSubLab.txt" encoding="utf-16be";
proc json out=jsonout4 pretty;
	export graf_subclasslabel_ / nosastags;
run;

/* Add region divisions for map generation */
filename jsonout5 "regionDivisions.txt" encoding="utf-16be";
proc json out=jsonout5 pretty;
	export maakunta2020b / nosastags;
run;

/* Creates first half of HTML page */
data _null_;
  /* change directory here */
	file "test.txt";

    put '<!DOCTYPE html>';
    put '<html lang="en">';
    put '<meta charset="UTF-8">';

    put '<head>';
    put   '<title>Luke - Economy doctor dashboard</title>';
    put   '<meta charset="UTF-8">';
    put   '<meta name="viewport" content="width=device-width, initial-scale=1">';
    put   '<!--<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">-->';
    put   '<link rel="stylesheet" href="https://unpkg.com/smartdasher@1.1.2/dist/main.css">';
    put   '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css"/>';
    put   '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@10.10.1/dist/sweetalert2.min.css">';
    put   '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">';
    put   '<link rel="stylesheet" href="https://pasoneto.github.io/lukeDashboard/tt/customStyle.css">';

    put '</head>';

    put '<body>';
    put '</body>';

    put '</html>';

	  put '<script>';
    kieli = &kieli;
    put 'var kieli=' kieli;
    alue="%aluetek";
    put 'var alue="' alue '"';
    rClas = &dimpaanro;
    
    yksikkokieli="%yksikko&kieli";
    put 'var yksikkokieli="' yksikkokieli '"';

    harjonta = &hajonta;
    put 'var harjonta="' harjonta '"';
    akajanro = &jakajanro;
    put 'var jakajanro="' akajanro '"';

    put 'var regionalClassifier=' rClas;
    put 'var reportType ="' &rapotsikko '"';
	  put 'var data =';
	
run;

/* Inserts the data in json format into the HTML page */
data _null_;
  /* change directory here */
	infile "json.txt";
	input;
  /* change directory here */
	file "test.txt" mod;
	put _infile_;
run;

data _null_;
  /* change directory here */
	file "test.txt" mod;
	put 'var dependentLabels =';
run;

/* Inserts the labels in json format into the HTML page */
data _null_;
  /* change directory here */
  infile "json_lab.txt";
	input;
  /* change directory here */
	file "test.txt" mod;
	put _infile_;
run;

/* Adding classifier label translator */
data _null_;
  /* change directory here */
	file "test.txt" mod;
	put 'var classifierSubLabels =';
run;

/* Inserts the classlabels in json format into the HTML page */
data _null_;
  /* change directory here */
  infile "json_classSubLab.txt";
	input;
  /* change directory here */
	file "test.txt" mod;
	put _infile_;
run;


/* Adding classifier label translator */
data _null_;
  /* change directory here */
	file "test.txt" mod;
	put 'var classifierLabels =';
run;

/* Inserts the classlabels in json format into the HTML page */
data _null_;
  /* change directory here */
  infile "json_classifierLabels.txt";
	input;
  /* change directory here */
	file "test.txt" mod;
	put _infile_;
run;

/* Adding region divisions */
data _null_;
  file "test.txt" mod;
  put 'var regionsAll =';
run;

%macro executeIfExists(dir);
   	%if %sysfunc(fileexist(&dir)) %then %do;
	/* Inserts the classlabels in json format into the HTML page */
	data _null_;
	  infile "regionDivisions.txt";
		input;
		file "test.txt" mod;
		put _infile_;
	run;
   %end;
   %else %do;
	data _null_;
		file "test.txt" mod;
		put "'null'";
	run;
   %end;
%mend executeIfExists;

%executeIfExists(dir="regionDivisions.txt")

/* Generates the second half of the HTML page */
data _null_;
  /* change directory here */
	file "test.txt" mod;
	  put '</script>';

    put '<script src="https://cdn.jsdelivr.net/npm/sweetalert2@10.10.1/dist/sweetalert2.all.min.js"></script>';
    put '<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js"></script>';
    put '<script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js" integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew==" crossorigin=""></script>';
    put '<script src="https://unpkg.com/proj4@2.8.1/dist/proj4-src.js"></script>';
    put '<script src="https://unpkg.com/proj4leaflet@1.0.2/src/proj4leaflet.js"></script>';
    put '<script src="https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js"></script>';
    put '<script src="https://unpkg.com/smartdasher@1.1.9/dist/bundle.js"></script>';
    put '<script src="https://pasoneto.github.io/lukeDashboard/tt/customFunctions/customFunctions.js"></script>';
    put '<script src="https://pasoneto.github.io/lukeDashboard/tt/customFunctions/customMaps.js"></script>';
    put '<script src="https://pasoneto.github.io/lukeDashboard/tt/dataProcess.js"></script>';
    put '<script src="https://pasoneto.github.io/lukeDashboard/tt/wrap.js"></script>';

    put '</html>';
run;

/* Takes all the text written by previous functions and writes it to an HTML file */
data _null_;
  /* change directory here */
	file "test.html";
  /* change directory here */
	infile "test.txt";
	input;
	put _infile_;
run;

ODS HTML CLOSE;
ODS LISTING;
data _null_;
	infile "test.html" truncover;
	input rivi $2000.;
	file _webout;
	put rivi;
run;
ODS HTML CLOSE;
ODS LISTING;

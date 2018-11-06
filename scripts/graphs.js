var standardTime;
var standardWindow;

function drawAnnotations(jsonData, elementID) {

	var maxi=jsonData.length;
	var indexName = Array();
	var DataSet = Array();
	var dataMap = new Map();
	var key = 'detection_timestamp';

	indexName.push('TIME');
	indexName.push('CAR');
	DataSet.push(indexName);

	standardTime = jsonData[0][key];


	dataMap.set(standardTime, 0);

	for(var i = 0; i < maxi-1; i++){

		if(dataMap.has(jsonData[i][key])){
			dataMap.set(jsonData[i][key], dataMap.get(jsonData[i][key]) + 1);
		}
		else{
			dataMap.set(jsonData[i][key], 1);
		}
	}

	for(let element of dataMap){
		DataSet.push(element);
	}

	var data = google.visualization.arrayToDataTable(DataSet);
    var options = {

		width: '100%',
		height: '95%',
		title: "Graphs test (Time, Car)",
		legend: {poition: 'bottom', maxLines: 3},
		bar: {groupWidth: '20%'},
		vAxis: {
			title :'Count of Type',
			 gridlines: {count: 4},
			 viewWindow: {
				min: 0,
				max: DataSet.size
			}
		},
		hAxis: {
			title :'TIME'
		}
		// colors: ['#1b9e77', '#d95f02', '#7570b3']
	  };

    var chart = new google.visualization.ColumnChart(document.getElementById(elementID));
    chart.draw(data, options);
}
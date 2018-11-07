
var standardTime;
var standardWindow;

function drawingGraphs(jsonData, elementID, graphsType) {

	
	var selectGraphs = graphsType;
	console.log(selectGraphs);
	var indexLength;
	var maxi = jsonData.length;	
	var carMap;
	var cyclistMap;
	var pedestrianMap;
	var indexName = Array();
	var DataSet = Array();
	var keyType = 'object_type';
	var carChecked = $("input:checkbox[id='carCheckbox']").is(":checked");
	var cyclistChecked = $("input:checkbox[id='cyclistCheckbox']").is(":checked");
	var pedestrianChecked = $("input:checkbox[id='pedestrianCheckbox']").is(":checked");

	var data; 
	var chart;
	

	if (selectGraphs === "timeGraphs") {
		var timeMap = new Map();
		var keyTime = 'detection_timestamp';
		
		indexName.push('TIME');
		standardTime = jsonData[0][keyTime];
		
		if (carChecked) {
			indexName.push('car');
			carMap = new Map();
			carMap.set(standardTime, 0);
		}
		if (cyclistChecked) {
			indexName.push('cyclist');
			cyclistMap = new Map();
			cyclistMap.set(standardTime, 0);
		}
		if (pedestrianChecked) {
			indexName.push('pedestrian');
			pedestrianMap = new Map();
			pedestrianMap.set(standardTime, 0);
		}
		timeMap.set(standardTime, 0);
		indexLength = indexName.length;

		DataSet.push(indexName);

		for (var i = 0; i < maxi - 1; i++) {
			for (var j = 1; j < indexLength; j++) {
				if (jsonData[i][keyType] === indexName[j]) {

					if (indexName[j] === 'car') {
						if (carMap.has(jsonData[i][keyTime])) {
							carMap.set(jsonData[i][keyTime], carMap.get(jsonData[i][keyTime]) + 1);
						} else {
							carMap.set(jsonData[i][keyTime], 1);
						}
					}
					else if (indexName[j] === 'cyclist') {
						if (cyclistMap.has(jsonData[i][keyTime])) {
							cyclistMap.set(jsonData[i][keyTime], cyclistMap.get(jsonData[i][keyTime]) + 1);
						} else {
							cyclistMap.set(jsonData[i][keyTime], 1);
						}
					}
					else {
						if (pedestrianMap.has(jsonDatap[i][keyTime])) {
							pedestrianMap.set(jsonData[i][keyTime], pedestrianMap.get(jsonData[i][keyTime]) + 1);
						} else {
							pedestrianMap.set(jsonData[i][keyTime], 1);
						}
					}
				}
			}
			if (!timeMap.has(jsonData[i][keyTime])) {
				timeMap.set(jsonData[i][keyTime], 0);
			}
		}
		for (var timeKey of timeMap.keys()) {

			var indexValue = Array();
			indexValue.push(timeKey);
			if (carChecked) {
				indexValue.push(carMap.get(timeKey));
			}
			if (cyclistChecked) {
				indexValue.push(cyclistMap.get(timeKey));
			}
			if (pedestrianChecked) {
				indexValue.push(pedestrianMap.get(timeKey));
			}
			console.log(indexValue);
			DataSet.push(indexValue);
			// indexValue.length = 0;
		}
		data = google.visualization.arrayToDataTable(DataSet);
		var options = {

			width: '100%',
			height: '95%',
			title: "TIME GRAPH",
			legend: { poition: 'bottom', maxLines: 3 },
			bars: 'vertical',
			bar: { groupWidth: '20%' },
			vAxis: {
				title: 'Count of Type',
				gridlines: { count: 4 },
				viewWindow: {
					min: 0,
					max: DataSet.size
				}
			},
			hAxis: {
				title: 'TIME'
			},
			colors: ['#1b9e77', '#d95f02', '#7570b3']
		};
		chart = new google.charts.Bar(document.getElementById(elementID));
		chart.draw(data, google.charts.Bar.convertOptions(options));
		//chart.draw(data, options);
	}
	else if (selectGraphs === "windowGraphs") {
		var windowMap = new Map();
		var keyWindow = 'window';
	
		indexName.push('WINDOW');

		if (carChecked) {
			indexName.push('car');
			carMap = new Map();
			carMap.set(standardWindow, 0);
		}
		if (cyclistChecked) {
			indexName.push('cyclist');
			cyclistMap = new Map();
			cyclistMap.set(standardWindow, 0);
		}
		if (pedestrianChecked) {
			indexName.push('pedestrian');
			pedestrianMap = new Map();
			pedestrianMap.set(standardWindow, 0);
		}
		standardWindow = jsonData[0][keyWindow].col1;
		windowMap.set(standardWindow, 0);
		indexLength = indexName.length;

		DataSet.push(indexName);

		for (var i = 0; i < maxi - 1; i++) {
			for (var j = 1; j < indexLength; j++) {
				if (jsonData[i][keyType] === indexName[j]) {

					if (indexName[j] === 'car') {
						if (carMap.has(jsonData[i][keyWindow].col1)) {
							carMap.set(jsonData[i][keyWindow].col1, carMap.get(jsonData[i][keyWindow].col1) + 1);
						} else {
							carMap.set(jsonData[i][keyWindow].col1, 1);
						}
					}
					else if (indexName[j] === 'cyclist') {
						if (cyclistMap.has(jsonData[i][keyWindow].col1)) {
							cyclistMap.set(jsonData[i][keyWindow].col1, cyclistMap.get(jsonData[i][keyWindow].col1) + 1);
						} else {
							cyclistMap.set(jsonData[i][keyWindow].col1, 1);
						}
					}
					else {
						if (pedestrianMap.has(jsonDatap[i][keyWindow].col1)) {
							pedestrianMap.set(jsonData[i][keyWindow].col1, pedestrianMap.get(jsonData[i][keyWindow].col1) + 1);
						} else {
							pedestrianMap.set(jsonData[i][keyWindow].col1, 1);
						}
					}
				}
			}
			if (!windowMap.has(jsonData[i][keyWindow].col1)) {
				windowMap.set(jsonData[i][keyWindow].col1, 0);
			}
		}
		for (var windowKey of windowMap.keys()) {

			var indexValue = Array();
			indexValue.push(windowKey);
			if (carChecked) {
				indexValue.push(carMap.get(windowKey));
			}
			if (cyclistChecked) {
				indexValue.push(cyclistMap.get(windowKey));
			}
			if (pedestrianChecked) {
				indexValue.push(pedestrianMap.get(windowKey));
			}

			// console.log(indexValue);
			DataSet.push(indexValue);
			// indexValue.length = 0;
		}
		data = google.visualization.arrayToDataTable(DataSet);
		var options = {
			width: '100%',
			height: '95%',
			title: "WINDOW GRAPH",
			legend: { poition: 'bottom'	},
			bars: 'vertical',
			bar: { groupWidth: '20%' },
			vAxis: {
				title: 'Count of Type',
				//gridlines: { count: 4 },
				viewWindow: {
					min: 0,
					max: DataSet.size
				}
			},
			hAxis: {
				title: 'WINDOW',
				ticks: 10
				
			},
			colors: ['#1b9e77', '#d95f02', '#7570b3']
		};
		chart = new google.charts.Bar(document.getElementById(elementID));
		chart.draw(data, google.charts.Bar.convertOptions(options));
		//window.addEventListener('resize', function() { chart.draw(data, options); }, false);

		//chart.draw(data, options);
	}
	else if (selectGraphs === "pieGraphs") {
		var pieMap = new Map();
		pieMap.set('Type', 'Count');
		//DataSet.push(['Type', 'Count']);
		
		if (carChecked) {
			pieMap.set('car', 0);
		}
		if (cyclistChecked) {
			pieMap.set('cyclist', 0);
		}
		if (pedestrianChecked) {
			pieMap.set('pedestrian', 0);
		}
		for (var i = 0; i < maxi - 1; i++) {
			if(pieMap.has(jsonData[i][keyType])){
				pieMap.set(jsonData[i][keyType], pieMap.get(jsonData[i][keyType])+1);
			}
		}
		for(let element of pieMap){
			DataSet.push(element);
		}
		var options = {

			width: '100%',
			height: '95%',
			title: "PIE GRAPH",
			bar: { groupWidth: '50%' },	
			colors: ['#1b9e77', '#d95f02', '#7570b3']
		};
		data = google.visualization.arrayToDataTable(DataSet);
		chart = new google.visualization.PieChart(document.getElementById(elementID));
		chart.draw(data, options);
	}	
}




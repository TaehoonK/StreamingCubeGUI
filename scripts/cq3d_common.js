
var periodicQueryExecutionID;
var callbackArgumentGlobal;
var queryExecutionInterval = 500; // 1 second = 1000
var isFirstPeriodicExecution = true;
var dimensionNames = new Array();
var latticeNodeDims = new Array();
var latticeNodeIDs = new Array();
var httpPostRequestStatus = new Array();
var jsonResultArray = new Array();
var mmsTrajectory = new Array();
var postURLAndPort = "http://localhost:8080";
var mapOptions;
var map;
var marker;
var windowOpen = null;
var selectGraph;

// add the kafka server connecting
var kafkaServerPort = "http://150.82.218.237:8080/";
var checkConnection = false;
//

function initializeOLAPGUI() {
    document.getElementById("btnStop").disabled = true;
    document.getElementById("divChartButtons").style.visibility = 'hidden';

    //Populating lattice node list (Query list)
    //httpPostRequest("OLAPGetLattice", "NoTextToSend", httpPostRequestCb, "latticeNodeList");
}

function initializeSubmitQuery() {
    initializeOLAPGUI();
    //httpPostRequest("TestQuery", "NoTextToSend", httpPostRequestCb, "JsSpinnerStatus");
}

function executeStop()
{
    document.getElementById("btnSubmit").disabled = false;
    document.getElementById("btnStop").disabled = true;
    //checkConnection = false;
    //httpPostRequest("Stop");
    clearInterval(periodicQueryExecutionID);
}

function executeQuery(queryType)
{
    var requestBody = "";
    document.getElementById("btnSubmit").disabled = true;
    document.getElementById("btnStop").disabled = false;

    if(queryType == "btnSubmit")
    {
        requestBody = "getKafkaResults";
        httpPostRequest("OLAPQuery", requestBody, httpPostRequestCb, "OLAPQueryResult");
    }
    else
    {
        alert("Invalid Query Type.");
    }
}

// function executeQuery(queryType) {
//     document.getElementById("btnSubmit").disabled = false;
//     document.getElementById("btnStop").disabled = true;

//     if (queryType == "btnSubmit") {
//         httpPostRequest("SparkQuery");
       
//     }
//     else {
//         httpPostRequest("ClearKafkaTopic");
//     }
// }

// function httpPostRequest(postCommand) {
   
//     if(postCommand == "SparkQuery") 
//     {
//         // var params = makeQueryJson();
//         var params = JSON.stringify({"dataStream": "0009", "objType": "car", "predAccLow": "0.5", "predAccHigh": "0.8", "winSize": "10", "winSlideStep": "10", "queryDuraion":"2000"});
// 	}
// 	else if(postCommand == "Stop")
// 	{
// 		var params = ""		
// 	}
// 	else if(postCommand == "ClearKafkaTopic")
// 	{
// 		var params = JSON.stringify({"topicName": "test"});
// 	}
    
//     // Generating Post Request	
//     var postURL = kafkaServerPort + postCommand; /*+ postCommand;*/
//     var xhr = new XMLHttpRequest();

//     xhr.open("POST", postURL, true);
//     xhr.setRequestHeader("Content-type", "application/json");

//     xhr.onerror = function () {
//         console.log("Network error: Server not available!");
//         clearInterval(periodicQueryExecutionID);
//         return;
//     };

//     xhr.onreadystatechange = function () {
//         if (xhr.readyState == 4 && xhr.status == 200) {
//             var xhrResponseText = xhr.responseText;
//             checkConnection = true;
//             console.log(xhrResponseText);
//         }
//     };
//     //xhr.send(requestBody.replace(/(\r\n|\n|\r)/gm,""));

//     xhr.send(params);

//     // if (checkConnection) {
//     //     var requestBody = "getKafkaResults";
//     //     httpPostRequest("OLAPQuery", requestBody, httpPostRequestCb, "OLAPQueryResult");
//     // }

// }


function httpPostRequest(postCommand, requestBody, callbackFunction, callbackArgument)
{
    if(postCommand == "SparkQuery") // One-time Execution
    {
        var postURL = postURLAndPort; /*+ postCommand;*/
        var xhr = new XMLHttpRequest();
        xhr.open("POST",postURL,true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        xhr.onerror = function()
        {
            console.log("Network error: Server not available!");
            clearInterval(periodicQueryExecutionID);
            //refresh browser
            //javascript:history.go(0);
            return;
        };

        xhr.onreadystatechange = function()
        {
            if(xhr.readyState == 4 && xhr.status == 200)
            {
                var xhrResponseText = xhr.responseText;
                console.log(xhrResponseText);
                callbackFunction.apply(this,[callbackArgument, xhrResponseText]);
            }
        };
        //xhr.send(requestBody.replace(/(\r\n|\n|\r)/gm,""));
        xhr.send();
    }
    else // Periodic Execution: Only the OLAP query needs to be executed periodically
    {
        // Saving the state of current httpPostRequest
        httpPostRequestStatus[0] = postCommand;
        httpPostRequestStatus[1] = requestBody;
        httpPostRequestStatus[2] = callbackArgument;
        // ~ Saving the state of current httpPostRequest

        clearInterval(periodicQueryExecutionID);
        callbackArgumentGlobal = callbackArgument;
        periodicQueryExecutionID = setInterval(function (){
            var postURL = postURLAndPort;
            var xhr = new XMLHttpRequest();

            xhr.open("POST", postURL, true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            xhr.onerror = function()
            {
                console.log("Network error: Server not available!");
                clearInterval(periodicQueryExecutionID);
                //refresh browser
                javascript:history.go(0);
                return;
            };

            xhr.onreadystatechange = function()
            {
                if(xhr.readyState == 4 && xhr.status == 200)
                {
                    var xhrResponseText = xhr.responseText;
                    callbackFunction.apply(this,[callbackArgumentGlobal, xhrResponseText]);
                }
            };
            //xhr.send(requestBody.replace(/(\r\n|\n|\r)/gm,""));
            xhr.send();
        }, queryExecutionInterval);
    }
}

function httpPostRequestCb(callbackArgument, xhrResponseText)
{
    if(callbackArgument == "OLAPQueryResult")
    {
        /*
        if(isFirstPeriodicExecution)
        {
            if(callbackArgument == "OLAPQueryDrilldown")
            {
                document.getElementById("latticeNodeList").value = document.getElementById("drilldownList").value;
            }
            else if(callbackArgument == "OLAPQueryRollup")
            {
                document.getElementById("latticeNodeList").value = document.getElementById("rollupList").value;
            }
            else if(callbackArgument == "OLAPQueryTimeGrain")
            {
                document.getElementById("OLAPOpTimeGrainList").value = "OLAPOpTimeGrainListDefault";
                clearSummaryWRTTimeChart();
            }
        }
        */
        var JSONObj = JSON.parse(xhrResponseText);
        jsonResultArray.push(JSONObj);
        // Sorting result w.r.t. timestamp
        //JSONObj.queryResult.sort( function(a, b) { return parseFloat(a.timestamp) - parseFloat(b.timestamp); } );

        // Table need to be updated every time, no matter if it isFirstPeriodicExecution
        displayAsTable(jsonResultArray, "divTable");

        // Chart also need to be updated every time (graphs.js)
        //drawChart(jsonResultArray, "divSimpleChart");
        drawChart(jsonResultArray, "divSimpleChart");


        // Draw the trajectory of MMS car info
        drawMapInfo(JSONObj, "divMapLocation");

        // Draw the object detected image
        drawImage(JSONObj.file_name, "divImageDisplay");
        /*
        if(isFirstPeriodicExecution)
        {
            requestBody = "-----------------------------19588288329222{\"nodeID\":" + document.getElementById("latticeNodeList").value + "}-----------------------------19588288329222";
            httpPostRequest("OLAPDrilldown", requestBody, httpPostRequestCb, "drilldownList");

            isFirstPeriodicExecution = false; // Next it will be second periodic execution
            document.getElementById("divChartButtons").style.visibility = 'visible';
        }
        */

    }
}

function displayAsTable(jsonData, elementID)
{
    document.getElementById(elementID).innerHTML = "";
    document.getElementById(elementID).appendChild(buildHtmlTable(jsonData));
    document.getElementById(elementID).style.border = "1px solid black";
}

function drawChart(jsonData, elementID) {
    var btnTime = document.getElementById('btnTime');
    var btnWindow = document.getElementById('btnWindow');
    var btnPie = document.getElementById('btnPie');
    
    google.charts.load('current', { packages: ['corechart', 'bar'] });

    btnTime.onclick = function () {
        selectGraph = btnTime.value;
        google.charts.setOnLoadCallback(drawingGraphs(jsonData, elementID, selectGraph));
    }
    btnWindow.onclick = function () {
        selectGraph = btnWindow.value;
        google.charts.setOnLoadCallback(drawingGraphs(jsonData, elementID, selectGraph));
    }
    btnPie.onclick = function () {
        selectGraph = btnPie.value;
        google.charts.setOnLoadCallback(drawingGraphs(jsonData, elementID, selectGraph));
    }

    google.charts.setOnLoadCallback(drawingGraphs(jsonData, elementID, selectGraph));
}

function drawImage (image_name, elementID)
{
    //var getURLAndPort = postURLAndPort;
    //var imageURL = getURLAndPort + "?id=" + image_name + "_1";
    var imageURL = "images/mms/" + image_name + "_2.jpg";
    var imgElem = document.createElement("img");
    imgElem.setAttribute("src", imageURL);
    imgElem.setAttribute("class", "images");
    imgElem.setAttribute("style", "width: 100%;")
    document.getElementById(elementID).innerHTML = "";
    document.getElementById(elementID).appendChild(imgElem);
}

function drawMapInfo(jsonData, elementID)
{
    var Y_point = jsonData.latitude;
    var X_point = jsonData.longitude;
    var predictionID = jsonData.prediction_id;
    var objectType = jsonData.object_type;
    var lat = Y_point.toString();
    var lon = X_point.toString();
    var myLatlng = new google.maps.LatLng(Y_point, X_point);

    if(contains(mmsTrajectory,myLatlng)) {
        return;
    }
    else {
        // 1. 맵에 마커 찍기
        // 2. mmsTrajectory 배열 내 마지막 좌표와 입력된 좌표 간에 선(Line) 그리기
         mmsTrajectory.push(myLatlng);
         var zoomLevel       = 18;               // 지도의 확대 레벨 : 숫자가 클수록 확대정도가 큼
         var markerTitle     = predictionID.toString();    // 현재 위치 마커에 마우스를 오버을때 나타나는 정보
         var markerMaxWidth  = 200;              // 마커를 클릭했을때 나타나는 말풍선의 최대 크기

         var contentString   = '<div>' +
                 '<p>type : '+objectType+'</p>' +
                 '<p>number : '+markerTitle+'</p>' +
                 '<p>lat : '+lat+'</p>' +
                 '<p>lon : '+lon+'</p>' +
                 '</div>';

        if(isFirstPeriodicExecution) {

            mapOptions = {
                            zoom: zoomLevel,
                            center: myLatlng,
                            disableDefaultUI: true,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
            }

            map = new google.maps.Map(document.getElementById(elementID), mapOptions);

            // marker = new google.maps.Marker({
            //               position: myLatlng,
            //               map: map,
            //               title: markerTitle
            // });
            // var infowindow = new google.maps.InfoWindow(
            // {
            //      content: contentString,
            //      maxWizzzdth: markerMaxWidth
            // });

            isFirstPeriodicExecution = false;
        }

        var infowindow = new google.maps.InfoWindow({
            content: contentString,
            maxWizzzdth: markerMaxWidth
        });

        marker = new google.maps.Marker({
                          position: myLatlng,
                          map: map,
                          title: markerTitle,
                          info: infowindow
        });

        map.setCenter(marker.getPosition());
    }
    google.maps.event.addListener(marker, 'click', function() {
        if(windowOpen != null){
            windowOpen.close();
            windowOpen = null;
        }
        (this.info).open(map, this);
        windowOpen = this.info;
    });
}


function contains(arr, element) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].lat === element.lat && arr[i].long === element.long) {
            return true;
        }
    }
    return false;
}

function makeQueryJson() {
    var dataStreamType = $("#drilldownList option:selected").text();
    var count = 0;
    var objectTypeCar = "car";
    var objectTypeCyclist = "cyclist";
    var objectTypePedestrian = "pedestrian";
    var objType = new Object();
    var carChecked = $("input:checkbox[id='carCheckbox']").is(":checked");
	var cyclistChecked = $("input:checkbox[id='cyclistCheckbox']").is(":checked");
	var pedestrianChecked = $("input:checkbox[id='pedestrianCheckbox']").is(":checked");
    var keyArray = ['Val1', 'Val2', 'Val3'];

    if (carChecked) {
        objType[keyArray[count]] = objectTypeCar;
        count++;
    }   
    if (cyclistChecked) {
        objType[keyArray[count]] = objectTypeCyclist;
        count++;
    }
    if (pedestrianChecked) {
        objType[keyArray[count]] = objectTypePedestrian;
        count++;
    }
    if(!carChecked && !cyclistChecked && !pedestrianChecked){
        objType[keyArray[0]] = objectTypeCar;
    }
    var predAccLow = ($('#accuracySliding').slider("values", 0)).toString();
    var predAccHigh = ($('#accuracySliding').slider("values", 1)).toString();
    var winSlideStep = ($('#windowSliding').slider("values", 0)).toString();
    var winSize = ($('#windowSliding').slider("values", 1)).toString();
    var queryDuration = ($('#queryDuration').slider("value") * 10).toString();

    var params = JSON.stringify(
        {
            "dataStream": dataStreamType,
            "objType": objType,
            "predAccLow": predAccLow,
            "predAccHigh": predAccHigh,
            "winSize": winSize,
            "winSlideStep": winSlideStep,
            "queryDuration": queryDuration
        }
    );
    count = 0;
    return params;
}

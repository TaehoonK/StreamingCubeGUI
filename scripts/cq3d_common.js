
var periodicQueryExecutionID;
var callbackArgumentGlobal;
var queryExecutionInterval = 1000; // 1 second = 1000
var isFirstPeriodicExecution = true;
var dimensionNames = new Array();
var latticeNodeDims = new Array();
var latticeNodeIDs = new Array();
var httpPostRequestStatus = new Array();
var jsonResultArray = new Array();
var postURLAndPort = "http://localhost:8080";


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
        //displayAsTable(jsonResultArray, "divTable");

        // Chart also need to be updated every time (graphs.js)
        //drawChart(jsonResultArray);

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

$(document).ready(function () { //for test, 추후 콜->로딩으로 수정

//function geoMap(lat, long) { //for real-program, 호출할때 lat, long 인자를 json에서 파싱
    var lat = 49.009277193963; //temporal coord for test
    var long = 8.4375064260665; //temporal coord for test

    var myLatlng = new google.maps.LatLng(lat,long); // 위치값 위도 경도
    var Y_point         = lat;        // Y 좌표
    var X_point         = long;       // X 좌표
    var zoomLevel       = 17;               // 지도의 확대 레벨 : 숫자가 클수록 확대정도가 큼
    var markerTitle     = "Position";      // 현재 위치 마커에 마우스를 오버을때 나타나는 정보
    var markerMaxWidth  = 200;              // 마커를 클릭했을때 나타나는 말풍선의 최대 크기

// 말풍선 내용
    var contentString   = '<div>' + //Can input detected object information
        '<p>This is test</p>' +
        '</div>';
    var myLatlng = new google.maps.LatLng(Y_point, X_point);
    var mapOptions = {
        zoom: zoomLevel,
        center: myLatlng,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(document.getElementById('divMapLocation'), mapOptions);
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: markerTitle
    });
    var infowindow = new google.maps.InfoWindow(
        {
            content: contentString,
            maxWizzzdth: markerMaxWidth
        }
    );
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
    });
});
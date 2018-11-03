
var periodicQueryExecutionID;
var callbackArgumentGlobal;
var queryExecutionInterval = 1000; // 1 second = 1000
var isFirstPeriodicExecution = true;
var dimensionNames = new Array();
var latticeNodeDims = new Array();
var latticeNodeIDs = new Array();
var httpPostRequestStatus = new Array();
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
        // Sorting result w.r.t. timestamp
        //JSONObj.queryResult.sort( function(a, b) { return parseFloat(a.timestamp) - parseFloat(b.timestamp); } );

        // Table need to be updated every time, no matter if it isFirstPeriodicExecution
        displayAsTable(JSONObj, "divTable");

        // Chart also need to be updated every time (graphs.js)
        //drawChart(JSONObj);

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
    document.getElementById(elementID).appendChild(addHtmlTable(jsonData));
    document.getElementById(elementID).style.border = "1px solid black";
}
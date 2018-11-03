var _table_ = document.createElement('table');
var _tr_ = document.createElement('tr');
var _th_ = document.createElement('th');
var _td_ = document.createElement('td');

// Builds the HTML Table out of myList json data from Ivy restful service.
 function buildHtmlTable(arr) {
     var table = _table_.cloneNode(false),
         columns = addAllColumnHeaders(arr, table);
     for (var i=0, maxi=arr.length; i < maxi; ++i) 
	 {
         var tr = _tr_.cloneNode(false);
         for (var j=0, maxj=columns.length; j < maxj ; ++j) 
		 {
             var td = _td_.cloneNode(false);
                 cellValue = arr[i][columns[j]];
             td.appendChild(document.createTextNode(arr[i][columns[j]] || ''));
             tr.appendChild(td);
         }
         table.appendChild(tr);
     }
	 
	 table.className = "w3-table-all";	 
	 //table.border = 10;
	 
     return table;
 }

function addHtmlTable(json) {
    var table = _table_.cloneNode(false),
        columns = addAllColumnHeaders(json, table);

    var tr = _tr_.cloneNode(false);
    for (var j=0, maxj=columns.length; j < maxj ; ++j)
    {
        var td = _td_.cloneNode(false);
        cellValue = json[columns[j]];
        td.appendChild(document.createTextNode(json[columns[j]] || ''));
        tr.appendChild(td);
    }
    table.appendChild(tr);

    table.className = "w3-table-all";
    //table.border = 10;

    return table;
}
 
 // Adds a header row to the table and returns the set of columns.
 // Need to do union of keys from all records as some records may not contain
 // all records
 function addAllColumnHeaders(arr, table)
 {
     var columnSet = [],
         tr = _tr_.cloneNode(false);

     for (var key in arr) {
         if (arr.hasOwnProperty(key) && columnSet.indexOf(key)===-1)
         {
             columnSet.push(key);
             var th = _th_.cloneNode(false);
             th.appendChild(document.createTextNode(key));
             tr.appendChild(th);
         }
     }

     table.appendChild(tr);
     return columnSet;
}

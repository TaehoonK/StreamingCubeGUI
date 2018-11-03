var _table_ = document.createElement('table');
var _tr_ = document.createElement('tr');
var _th_ = document.createElement('th');
var _td_ = document.createElement('td');

// Builds the HTML Table out of myList json data from Ivy restful service.

 function buildHtmlTable(arr) {
     var table = _table_.cloneNode(false),
        columns = addAllColumnHeaders(arr, table);
     for (var i=0, maxi=arr.length; i < maxi; i++)
	 {
       var tr = _tr_.cloneNode(false);
      //   for (var j=0, maxj=columns.length; j < maxj ; ++j)
       for (var j=0; j < 4 ; j++)
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
 
 // Adds a header row to the table and returns the set of columns.
 // Need to do union of keys from all records as some records may not contain
 // all records
 //#1:prediction_id #2:detection_timestamp #3:object_type #4:prediction_score
 function addAllColumnHeaders(arr, table)
 {
     var columnSet = [],
         tr = _tr_.cloneNode(false);

       for (var i=0, l=arr.length; i < l; i++) {
         for (var key in arr[i]) {
             if (arr[i].hasOwnProperty(key) && columnSet.indexOf(key)===-1)
             {
                 if(key=='prediction_id'||key=='detection_timestamp'||key=='object_type'||key=='prediction_score')
                 {
                      if(key=="prediction_id"){
                      var temp = "ID";
                      columnSet.push(key);
                      var th = _th_.cloneNode(false);
                      th.appendChild(document.createTextNode(temp));
                      tr.appendChild(th);
                      }
                      else if(key=="detection_timestamp"){
                      var temp = "TIME";
                      columnSet.push(key);
                      var th = _th_.cloneNode(false);
                      th.appendChild(document.createTextNode(temp));
                      tr.appendChild(th);
                      }
                      else if(key=="object_type"){
                      var temp = "TYPE";
                      columnSet.push(key);
                      var th = _th_.cloneNode(false);
                      th.appendChild(document.createTextNode(temp));
                      tr.appendChild(th);
                      }
                      else {
                      var temp = "SCORE";
                      columnSet.push(key);
                      var th = _th_.cloneNode(false);
                      th.appendChild(document.createTextNode(temp));
                      tr.appendChild(th);
                      }
                 }

             }
         }
     }
     table.appendChild(tr);
     return columnSet;
}

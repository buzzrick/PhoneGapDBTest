
function RowData(rowId, data) {
    var self = this;
    self.RowId = rowId;
    self.Data = data;
}


// Wait for Cordova to load
//
document.addEventListener("deviceready", onDeviceReady, false);

// Populate the database 
//
function populateDB(tx) {
    tx.executeSql('DROP TABLE IF EXISTS DEMO');
    tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
    tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "Buzzricks Data")');
    tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "More data")');
}

// Query the database
//
function queryDB(tx) {
    tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
}

// Query the success callback
//
function querySuccess(tx, results) {
    var len = results.rows.length;
    console.log("DEMO table: " + len + " rows found.");
    for (var i = 0; i < len; i++) {
        viewModel.AddRow(new RowData(results.rows.item(i).id, results.rows.item(i).data));
    }

    ko.applyBindings(viewModel);
}

// Transaction error callback
//
function errorCB(err) {
    navigator.notification.alert(
             err.code,  // message
            null,         // callback
            '"Error processing SQL',            // title
            'Done'                  // buttonName
        );
}

// Transaction success callback
//
function successCB() {
    var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(queryDB, errorCB);
}

// Cordova is ready
//
function onDeviceReady() {
    var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(populateDB, errorCB, successCB);
}


function DBViewModel() {
    var self = this;

    self.Rows = ko.observableArray();
    self.AddRow = function (row) {
        self.Rows.push(row);
    };
    
    self.afterViewRender = function() {
        $("#fullPage").trigger("create");
    };
}

var viewModel = new DBViewModel();

$(function () {
    //  force it
    onDeviceReady();
});
    
$(document).bind('pageinit', function () {
    ////  wire up the swipe events
    //$(document).on("swiperight", pageXOffset, function () { viewModel.SwipeRight(); });
    //$(document).on("swipeleft", pageXOffset, function () { viewModel.SwipeLeft(); } );

});




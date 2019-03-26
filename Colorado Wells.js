(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
    var cols = [{
        id: "wellId",
        dataType: tableau.dataTypeEnum.string
    },
	{
		id:"wellName",
		dataType: tableau.dataTypeEnum.string
	},
	{
		id:"wellDepth",
		dataType: tableau.dataTypeEnum.int
	},
	{
		id:"measurementDate",
		dataType: tableau.dataTypeEnum.date
	},
	{
		id: "waterLevelDepth",
		dataType: tableau.dataTypeEnum.float
	},
	{
		id:"aquifers",
		dataType: tableau.dataTypeEnum.string
	},
	{
		id:"county",
		dataType: tableau.dataTypeEnum.string
	}
			];

    var tableSchema = {
        id: "CODNRWater",
        alias: "Groundwater",
        columns: cols
    };

    schemaCallback([tableSchema]);
};
    myConnector.getData = function(table, doneCallback) {
    $.getJSON("http://dnrweb.state.co.us/DWR/DwrApiService/api/v2/groundwater/waterlevels/wells?format=json&county=Denver&apiKey=S5f9bAHWt4%2BpgNGUZBrCxuSqjdPFp8J%2B", function(resp) {
        var feat = resp.features,
            tableData = [];

        // Iterate over the JSON object
        for (var i = 0; i < 50; i++ ) { //use this for full data-> i < feat.length; i++) {
            tableData.push({
                "wellId": feat[i].properties["wellId"],
				"wellName":feat[i].properties["wellName"],
				"wellDepth":feat[i].properties["wellDepth"],
				"measurementDate":feat[i].properties["measurementDate"],
				"waterLevelDepth":feat[i].properties["waterLevelDepth"],
				"aquifers":feat[i].properties["aquifers"],
				"county":feat[i].properties["county"]
            });
        }

        table.appendRows(tableData);
        doneCallback();
    });
};

    tableau.registerConnector(myConnector);
})();

$(document).ready(function () {
    $("#submitButton").click(function () {
        tableau.connectionName = "CODNRWater";
        tableau.submit();
    });
});

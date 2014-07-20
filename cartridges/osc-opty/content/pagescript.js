/* OSC module for Jive Anywhere (page content script)

   PageModuleContext, JCommon and $ are provided by the module manager
*/

this.getPreviewData = function (pageType, sendResponse) {

    var fieldsDic = [];
    var pageDataFieldNamedAccount = [];
    var pageDataFieldNamedOpportunity = ["Opportunity Name", "Sales Account", "Primary Contact", "Opportunity Owner", "Sales Stage", "Close Date", "Revenue", "Win Probability (%)"];
    //var fieldNames = (pageType == "Edit Opportunity" ? pageDataFieldNamedOpportunity : pageDataFieldNamedAccount);
	var fieldNames = pageDataFieldNamedOpportunity;

   
        // add all field values to dictionary
    for (var i = 0; i < fieldNames.length; i++) {
        var fieldName = fieldNames[i];
        var fieldValue = extractField(fieldName);

        if (fieldValue) {
            fieldsDic.push({ name: fieldName, value: fieldValue });
        }
      }


sendResponse({ "fields": fieldsDic }); 

};

var extractField = function (fieldName) {

var value ="";
	switch (fieldName) {
        case "Opportunity Name":
            value = $("[id='pt1:USma:0:MAnt1:1:pt1:AP1:it1::content']").attr("value");
			break;
        case "Sales Account":
            value = $("[id='pt1:USma:0:MAnt1:1:pt1:AP1:r1:0:inputText1::content']").attr("value");
			break;
        case "Primary Contact":
            value = $("[id='pt1:USma:0:MAnt1:1:pt1:AP1:outputText1']").text();
			break;
        case "Sales Stage":
            value = $("[id='pt1:USma:0:MAnt1:1:pt1:AP1:salesStageDropDown::content']").attr("title");
			break;
		case "Close Date":
            value = $("[id='pt1:USma:0:MAnt1:1:pt1:AP1:id1::content']").attr("value");
			break;
        case "Revenue":
            value = ($("[id='pt1:USma:0:MAnt1:1:pt1:AP1:ot4']").text())+" USD";
			break;
		case "Win Probability (%)":
            value = $("[id='pt1:USma:0:MAnt1:1:pt1:AP1:it3']").attr("value");
			break;

    }
return value;
};



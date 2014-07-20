/* OSC module for Jive Anywhere

   ModuleContext, JCommon and $ are provided by the module manager
   Recommended URL filter: isv23-crm-crm-ext.oracle.com
*/

this.minimumRequiredVersion = 2.1;

this.init = function () {
    /* Compile markup as named templates */
    var pageDataTemplate = ModuleContext.getResourceFile("OSCPageDataTemplate.html");

    $.templates({
        oscPageDataTemplate: pageDataTemplate
    });
};



this.onGetUrlSearchResults = function (searchData, callback) {
    var title = extractOptyName();

    // first, search by url
    ModuleContext.connectionContexts.activeConnection.clientFacade.searchUrl(searchData.query, searchData.offset, searchData.limit, searchData.sortBy, searchData.isAscending, function (urlData) {
        // add results by searching page title
        var query = "\"" + title + "\"";
        ModuleContext.connectionContexts.activeConnection.clientFacade.search(query, searchData.offset, searchData.limit, searchData.sortBy, searchData.isAscending, function (titleData) {
            // combine results
            var results = null;
            if (urlData && titleData && !urlData.isError && !titleData.isError) {
                results = unionDiscussions(urlData.items, titleData.items);
                if (searchData.sortBy == "date") {
                    sortDiscussionsByDate(results, searchData.isAscending);
                }
            }
                    
            var packedResults = { items: results, isError: urlData.isError, message: urlData.message, code: urlData.code };
            callback(packedResults);
        });
    });
};


this.onGetModuleUI = function (callback) {
    var moduleUiInfo = { defaultTabId: 0, tabs: [{ title: extractOptyName() }, {}] };
    callback(moduleUiInfo);
};

this.onGetPreviewData = function (openGraphMetadata, isFinal, customValues, callback) {
       // ModuleContext.runPageScript("getPreviewData", _currentPageType, function (pageData) {
		           ModuleContext.runPageScript("getPreviewData", null, function (pageData) {

            var html = $.render.oscPageDataTemplate(pageData);
            callback(html);
        });
};    

// ------------------------- Page Extraction functions -------------------------

var _currentAccountName = null;
var _currentOpportunityName = null;
var _currentPageType = "Edit Opportunity";

// supported page types
var pageTypes = {
    Account: "Edit Account",
    Opportunity: "Edit Opportunity"
};


// get the page type (Account or Opportiunity) from the document's title- Currently using only Opty
var extractPageTypeFromTitle = function (title) {
    var index = title.indexOf(":");
    if (index > -1) {
        var name = title.substr(0, index);
        for (var pageType in pageTypes) {
            if (pageTypes[pageType] == name) {
                return name;
            }
        }
    }

    return null;
};

var extractOptyName = function () {
    // extract the Opty name from the page title
    var title = ModuleContext.pageInfo.title;
    var index = title.indexOf("- Opportunities - Oracle Applications");
    if (index > -1) {
        return $.trim(title.substring(title.indexOf(":")+1, index));
    }

    return "Dummy Name";
};

// ------------------------- Data Manipulation functions -------------------------

var unionDiscussions = function (array1, array2) {
    var union = [];
    var dictionary = new Object();
    if (array1 != null && array2 != null) {
        goOverArrayForUnion(array1, union, dictionary);
        goOverArrayForUnion(array2, union, dictionary);

        return union;
    }
    else {
        if (array1 != null)
            return array1;
        else if (array2 != null)
            return array2;

        return null;
    }
};
    
var sortDiscussionsByDate = function (array, isAscending) {
    var orderMultiplier = isAscending ? -1 : 1;

    array.sort(function (item1, item2) {
        var date1 = JCommon.convertServerDate(item1.creationDate).getTime();
        var date2 = JCommon.convertServerDate(item2.creationDate).getTime();

        if (date1 == date2) {
            return 0;
        }
        else if (date1 > date2) {
            return -1 * orderMultiplier;
        }
        else {
            return 1 * orderMultiplier;
        }
    });

    return array;
};
    
var goOverArrayForUnion = function (array, union, dictionary) {
    for (var i = 0; i < array.length; i++) {
        var key = array[i].id;
        if (dictionary[key] == null) {
            union.push(array[i]);
            dictionary[key] = true;
        }
    }
};

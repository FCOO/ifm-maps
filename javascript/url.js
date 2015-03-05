/**
 * This file contains methods for handling URLs
 */

/**
 * Add or replace a parameter (with value) in the given URL.
 * By Adil Malik, http://stackoverflow.com/questions/1090948/change-url-parameters/10997390#10997390
 * @param String url the URL
 * @param String param the parameter
 * @param String paramVal the value of the parameter
 * @return String the changed URL
 */
function updateURLParameter(url, param, paramVal) {
	var theAnchor = null;
	var newAdditionalURL = "";
	var tempArray = url.split("?");
	var baseURL = tempArray[0];
	var additionalURL = tempArray[1];
	var temp = "";

	if (additionalURL) {
		var tmpAnchor = additionalURL.split("#");
		var theParams = tmpAnchor[0];
		theAnchor = tmpAnchor[1];
		if(theAnchor) {
			additionalURL = theParams;
		}

		tempArray = additionalURL.split("&");

		for (i=0; i<tempArray.length; i++) {
			if(tempArray[i].split('=')[0] != param) {
				newAdditionalURL += temp + tempArray[i];
				temp = "&";
			}
		}        
	} else {
		var tmpAnchor = baseURL.split("#");
		var theParams = tmpAnchor[0];
		theAnchor  = tmpAnchor[1];

		if(theParams) {
			baseURL = theParams;
		}
	}

	if(theAnchor) {
		paramVal += "#" + theAnchor;
	}

	var rows_txt = temp + "" + param + "=" + paramVal;
	return baseURL + "?" + newAdditionalURL + rows_txt;
}

/**
 * Get all parameters out of the URL.
 * @return Array List of URL parameters key-value indexed
 */
function getUrlParameters() {
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i=0; i<hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}

/*
 * Returns tilesize, possibly from url parameter. Default is 512.
 */
function getTilesize() {
    var urlParams = getUrlParameters();
    var tilesize;
    if (typeof urlParams.tilesize != "undefined") {
        tilesize = parseInt(urlParams.tilesize, 10);
        // Allowed values:
        if ([256, 512, 1024].indexOf(tilesize) == -1) {
            tilesize = 512;
            var msg = "Invalid tile size specified (must be 256, 512 or 1024)";
            var n = noty({text: msg, type: "error"});
            throw new Error(msg);
        }
    } else {
        // Default value
        tilesize = 512;
    }
    return tilesize;
};

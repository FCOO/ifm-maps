(function (){
    "use strict";
    /*jslint browser: true*/
    /*global noty*/
    /*exported updateURLParameter, getTilesize*/

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
        var theAnchor = null,
            newAdditionalURL = "",
            tempArray = url.split("?"),
            baseURL = tempArray[0],
            additionalURL = tempArray[1],
            temp = "",
            tmpAnchor,
            theParams,
            i,
            rowsText;

        if (additionalURL) {
            tmpAnchor = additionalURL.split("#");
            theParams = tmpAnchor[0];
            theAnchor = tmpAnchor[1];
            if (theAnchor) {
                additionalURL = theParams;
            }

            tempArray = additionalURL.split("&");

            for (i = 0; i < tempArray.length; i = i + 1) {
                if (tempArray[i].split('=')[0] !== param) {
                    newAdditionalURL += temp + tempArray[i];
                    temp = "&";
                }
            }
        } else {
            tmpAnchor = baseURL.split("#");
            theParams = tmpAnchor[0];
            theAnchor  = tmpAnchor[1];

            if (theParams) {
                baseURL = theParams;
            }
        }

        if (theAnchor) {
            paramVal += "#" + theAnchor;
        }

        rowsText = temp + param + "=" + paramVal;
        return baseURL + "?" + newAdditionalURL + rowsText;
    }
    window.updateURLParameter = updateURLParameter;

    /**
     * Get all parameters out of the URL.
     * @return Array List of URL parameters key-value indexed
     */
    function getUrlParameters() {
        var vars = [],
            hash,
            hashes,
            i;
        i = window.location.href.indexOf('?');
        if (i !== -1) {
            hashes = window.location.href.slice(i + 1).split('&');
            for (i = 0; i < hashes.length; i = i + 1) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
        }
        i = window.location.href.indexOf('#');
        if (i !== -1) {
            hashes = window.location.href.slice(i + 1).split('&');
            for (i = 0; i < hashes.length; i = i + 1) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
        }

        // The app operates in standalone mode when it has a query
        // string parameter "standalone=true" (generic) or 
        // the navigator.standalone property is set (iOS).
        // For standalone apps we use localStorage for persisting
        // state.
        if (vars.standalone != "true" &&
            (("standalone" in window.navigator) &&
             window.navigator.standalone)) {
             vars.push('standalone');
             vars.standalone = 'true';
        }
        if (vars.standalone == "true") {
            var params = window.localStorage.getItem('params');
            if (params !== null) {
                window.localStorage.setItem('paramsTemp', params);
                hashes = params.split('&');
                for (i = 0; i < hashes.length; i = i + 1) {
                    hash = hashes[i].split('=');
                    vars.push(hash[0]);
                    vars[hash[0]] = hash[1];
                }
            }
        } 
        return vars;
    }
    window.getUrlParameters = getUrlParameters;

    /*
     * Returns tilesize, possibly from url parameter. Default is 512.
     */
    function getTilesize() {
        var urlParams = getUrlParameters(),
            tilesize,
            msg;
        if (urlParams.tilesize !== undefined) {
            tilesize = parseInt(urlParams.tilesize, 10);
            // Allowed values:
            if ([256, 512, 1024].indexOf(tilesize) === -1) {
                tilesize = 512;
                msg = "Invalid tile size specified (must be 256, 512 or 1024)";
                noty({text: msg, type: "error"});
                throw new Error(msg);
            }
        } else {
            // Default value
            tilesize = 512;
        }
        return tilesize;
    }
    window.getTilesize = getTilesize;
})();

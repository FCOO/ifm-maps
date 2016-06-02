/* Functioner, methoder og spørgsmål, som Jesper skal kikke på */


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


	/* SKAL FLYTTES TIL fcoo-application eller lign.
			// The app operates in standalone mode when it has a query string parameter "standalone=true" (generic) or the navigator.standalone property is set (iOS).
			// For standalone apps we use localStorage for persisting state.
			if (	vars.standalone != "true" &&
            (("standalone" in window.navigator) &&
             window.navigator.standalone)
					) {
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
*/


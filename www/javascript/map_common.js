/**
 * This file is licensed under Creative Commons Zero (CC0)
 * http://creativecommons.org/publicdomain/zero/1.0/
 *
 * Author: http://www.openstreetmap.org/user/Zartbitter
 */

// Map is a global variable
var map;

/**
 * Internationalization of some texts used by the map.
 * @param String key the key of the text item
 * @param String lang the language id
 * @return String the localized text item or the id if there's no translation found
 */
function getI18n(key, lang) {
	var i18n = {
		en: {
			  maps: 'Maps'
			, layers: 'Forecast Parameters'
			, iceconcentration: 'Sea Ice Concentration'
			, windspeed: 'Wind Speed'
			, winddirection: 'Wind Direction'
			, waveheight: 'Wave Height'
			, wavedirection: 'Wave Direction'
			, currentspeed: 'Current Speed'
			, currentdirection: 'Current Direction'
			, elev: 'Sea Surface Elevation'
			, airtemp: 'Air Temperature (2m)'
			, seatemp: 'Sea Temperature'
                        , salinity: 'Salinity'
			, humidity: 'Specific Humidity'
			, pressure: 'Sea Level Pressure'
			, cloudcover: 'Total Cloud Cover'
			, visibility: 'Visibility'
			, ais: 'AIS Traffic Density'
                        , datetime: 'Select date and time'
		}
		//, gl: {
			  //layers: 'Ilimasaarutinut uuttuutit'
			//, currentspeed: 'Sarfap sukkassusia'
			//, currentdirection: 'Sarfap sammivia'
			//, visibility: 'Erseqqarissuseq'
		//}
		, da: {
			  maps: 'Kort'
			, 'Background Maps': 'Baggrundskort'
			, layers: 'Prognoseparametre'
			, iceconcentration: 'Havis (koncentration)'
			, windspeed: 'Vind (fart)'
			, winddirection: 'Vindretning'
			, waveheight: 'Bølgehøjde'
			, wavedirection: 'Bølgeretning'
			, currentspeed: 'Strøm (fart)'
			, currentdirection: 'Strømretning'
			, elev: 'Vandstand'
			, airtemp: 'Lufttemperatur (2m)'
			, seatemp: 'Havtemperatur'
                        , salinity: 'Salinitet'
			, humidity: 'Specifik Luftfugtighed'
			, pressure: 'Lufttryk (havniveau)'
			, cloudcover: 'Skydække'
			, visibility: 'Sigtbarhed'
			, ais: 'AIS Trafiktæthed'
                        , datetime: 'Vælg tidspunkt'
                        , "Locate": "Find"
                        , "Show me where I am": "Vis mig hvor jeg er"
                        , "You are within {distance} {unit} from this point": "Du er indenfor {distance} {unit} fra dette punkt"
                        , "You seem located outside the boundaries of the map": "Du ser ud til at befinde dig udenfor kortets grænser"
		}
	};

	if (typeof i18n[lang] != 'undefined'
			&& typeof i18n[lang][key] != 'undefined') {
		return  i18n[lang][key];
	} else if (typeof i18n['en'] != 'undefined'
                        && typeof i18n['en'][key] != 'undefined') {
                return  i18n['en'][key];
        }
	return key;
}


/**
 * Initialize base maps
 */
function initBaseMaps(lang) {
    var standard = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        tileSize: 256,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors</a>'
    });

    var mapquestUrl = "http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png",
        mapquestSubDomains = ["otile1","otile2","otile3","otile4"],
        mapquestAttrib = 'Data, imagery and map information provided by '
            + '<a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, '
            + '<a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and '
            + '<a href="http://wiki.openstreetmap.org/wiki/Contributors" target="_blank">contributors</a>. '
            + 'Data: <a href="http://wiki.openstreetmap.org/wiki/Open_Database_License" target="_blank">ODbL</a>, '
            + 'Map: <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>',
        mapquest = new L.TileLayer(mapquestUrl, {maxZoom: 18, tileSize: 256, attribution: mapquestAttrib, subdomains: mapquestSubDomains
    });

    var esri = L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.jpg", {
        maxZoom: 18, tileSize: 256, attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    var bgstring = getI18n("Background Maps", lang);
    var baseMaps = {};
    baseMaps[bgstring] = {
            "OSM Standard": standard,
            "Mapquest Open": mapquest,
            "ESRI Aerial": esri
    };
    return baseMaps
}

var overlayMaps = {};
/**
 * Add or replace the datetime parameter of the URL and reload the page.
 * @param Date date
 */
function changeDatetime(pDate) {
    for (var i in overlayMaps) {
        var layergroup = overlayMaps[i];
        for (var j in layergroup) {
            var layer = layergroup[j];
            var timesteps = layer.getTimesteps();
            if (timesteps !== null && timesteps.length > 1) {
                layer.setParams({time: pDate}, false);
            }
        }
    }
}


/**
 * Try to find a language we shoud use. Look for URL parameter or system settings.
 * Restricts to supported languages ('en', 'fr', 'ru', 'de').
 * @return String language code like 'en', 'fr', 'ru' or 'de'
 */
function getLocalLanguage() {
	var lang = null;

	// 1. try to read URL parameter 'lang'
	var qs = window.location.search;
	if (qs) {
		if (qs.substring(0, 1) == '?') {
			qs = qs.substring(1)
		}
		var params = qs.split('&')
		for(var i = 0; i < params.length; i++) {
			var keyvalue = params[i].split('=');
			if (keyvalue[0] == 'lang') {
				lang = keyvalue[1];
				break;
			}
		}
	}

	// 2. try to get browser or system language
	if (!lang) {
		var tmp = window.navigator.userLanguage || window.navigator.language;
		lang = tmp.split('-')[0];
	}

	// Use only supported languages, defaults to 'en'
	if (lang != 'en' && lang != 'da' && lang != 'gl' && lang != 'fo') {
		lang = 'en';
	}
	return lang;
}

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
 * Add or replace the language parameter of the URL and reload the page.
 * @param String id of the language
 */
function changeLanguage(pLang) {
	window.location.href = updateURLParameter(window.location.href, 'lang', pLang);
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

/**
 * Callback for successful geolocation.
 * @var position Geolocated position
 */
function foundLocation(position) {
	if (typeof map != "undefined") {
		var lat = position.coords.latitude;
		var lon = position.coords.longitude;
		map.setView(new L.LatLng(lat, lon), 8);
	}
}

/**
 * Initialize the map.
 */
function initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, useGeolocation, useGeoMetoc, useIfmChart) {
	var localLang = getLocalLanguage();

        // Initialize basemaps
        var baseMaps = initBaseMaps(localLang);

        // List of languages to select from
	var all_languages = [L.langObject('da', '<button class="flag-icon flag-icon-dk"></button>'),
			     L.langObject('fo', '<button class="flag-icon flag-icon-fo"></button>'),
			     L.langObject('en', '<button class="flag-icon flag-icon-gb"></button>')];

        // Select languages that are specified in langs
        languages = [];
        for (lang in langs) {
            for (lang2 in all_languages) {
                if (langs[lang] == all_languages[lang2].id) {
                    languages[languages.length] = all_languages[lang2];
                }
            }
        }

	var urlParams = getUrlParameters();
	if (typeof urlParams.zoom != "undefined" && typeof urlParams.lat != "undefined" && typeof urlParams.lon != "undefined") {
		zoom = urlParams.zoom;
		lat = urlParams.lat;
		lon = urlParams.lon;
		useGeolocation = false;
	}

	map = L.map('map', {
		center: new L.LatLng(lat, lon), zoom: zoom,
                zoomAnimation: true, // There is a bug with layer hiding when enabled
                minZoom: minZoom,
                maxZoom: maxZoom,
                //crs: L.CRS.EPSG4326,
                crs: L.CRS.EPSG3857,
		layers: [baseMaps[Object.keys(baseMaps)[0]][basemap]]
	});
	map.attributionControl.setPrefix("");

        if (useGeoMetoc) {
            map.on('contextmenu', function(e) {
                var lat = e.latlng.lat;
                var lon = e.latlng.lng;
                var url = 'http://metoc.fcoo.dk/text?x=_X_&y=_Y_&coastline=c';
                var win = window.open(url.replace('_X_', lon).replace('_Y_', lat), '_blank');
                win.focus();
            });
        }

	map.attributionControl.setPrefix("");

        // Add language selector
	map.addControl(L.languageSelector({
		languages: languages,
		callback: changeLanguage,
		initialLanguage: localLang,
		hideSelected: false,
		vertical: false,
                useAnchor: false,
                position: 'topright'
	}));

        if (useIfmChart) {
            var link_template = "http://ifm.fcoo.dk/asp/oceanChart.asp?hindcastPeriod=12&forecastPeriod=24&width=500&height=350&id=__STATION__&paramId=SeaLvl&forecastMode=1";
            $.getJSON("http://api.fcoo.dk/ifm-maps/json/Observations.json", function(data) {
              var geojson = L.geoJson(data, {
                onEachFeature: function (feature, layer) {
                  layer.bindPopup('<img src="' + link_template.replace('__STATION__', feature.properties.id) + '" height="350" width="500" />', {maxWidth: 700, maxHeight: 600});
                },
                pointToLayer: function (feature, latlng) {
                  return L.circleMarker(latlng, {
                          radius: 5,
                          fillColor: "#ff7800",
                          color: "#000",
                          weight: 1,
                          opacity: 1,
                          fillOpacity: 0.8
                         });
                }
              }).addTo(map);
            });
        }

        // Add base layers and overlays to map
        overlayMaps = [];
        for (var key in overlays) {
            var nkey = getI18n(key, localLang);
            overlayMaps[nkey] = {};
            for (var lkey in overlays[key]) {
                 overlayMaps[nkey][getI18n(lkey, localLang)] = overlays[key][lkey];
            }
        }
	//var layerControl = L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(map);
	var layerControl = (new L.Control.CategorizedLayers(baseMaps, overlayMaps, 
                           {collapsed: false, groupsCollapsed: false})).addTo(map);

        // Add locator control
        map.addControl(L.control.locate({
            locateOptions: {maxZoom: maxZoom},
            strings: {
                title: getI18n("Show me where I am", localLang),
                popup: getI18n("You are within {distance} {unit} from this point", localLang),
                outsideMapBoundsMsg: getI18n("You seem located outside the boundaries of the map", localLang)
            }
        }));

        // Add geocoder control
        map.addControl(new L.Control.OSMGeocoder({
            position: 'topleft',
            text: getI18n('Locate', localLang)
        }));

        // Add length scale
        var scaleControl = L.control.scale().addTo(map);

        // Add permanent link
	map.addControl(new L.Control.Permalink({layers: layerControl, useAnchor: false, position: 'bottomright'}));

        // Add position control
        map.addControl(new L.control.mousePosition({emptyString: '', position: 'bottomright'}));

	// patch layerControl to add some titles
	var patch = L.DomUtil.create('div', 'fcoo-layercontrol-header');
	patch.innerHTML = getI18n('layers', localLang); // 'TileLayers';
	layerControl._form.children[2].parentNode.insertBefore(patch, layerControl._form.children[2]);
	patch = L.DomUtil.create('div', 'fcoo-layercontrol-header');
	patch.innerHTML = getI18n('maps', localLang); // 'Maps';
	layerControl._form.children[0].parentNode.insertBefore(patch, layerControl._form.children[0]);

        // Add text input position control
        map.addControl(new L.Control.Position({position: 'topleft', collapsed: true}));
        //$('input, textarea').placeholder();

        // Add print control
        map.addControl(L.Control.print({}));

        // Make sure that these controls are hidden on print
        $(".leaflet-control-layers").addClass("hide-on-print");
        $(".leaflet-control-zoom").addClass("hide-on-print");
        $(".leaflet-control-locate").addClass("hide-on-print");
        $(".leaflet-control-geocoder").addClass("hide-on-print");
        $(".leaflet-control-position").addClass("hide-on-print");
        $(".leaflet-control-print").addClass("hide-on-print");
        $(".leaflet-control-mouseposition").addClass("hide-on-print");
        $(".leaflet-control-permalink").addClass("hide-on-print");

        // Hide all controls if hidecontrols in query string
        if (urlParams.hidecontrols == "true") {
            $(".leaflet-control-layers").css("visibility", "hidden");
            $(".leaflet-control-zoom").css("visibility", "hidden");
            $(".leaflet-control-locate").css("visibility", "hidden");
            $(".leaflet-control-geocoder").css("visibility", "hidden");
            $(".leaflet-control-position").css("visibility", "hidden");
            $(".leaflet-control-print").css("visibility", "hidden");
            $(".leaflet-control-mouseposition").css("visibility", "hidden");
            $(".leaflet-control-permalink").css("visibility", "hidden");
        }
        // Add custom title (unescaped and sanitized)
        if (typeof urlParams.title != "undefined") {
            var title = $("<p>" + unescape(urlParams.title) + "</p>").text();
            title = "<p class='fcoo-title'>" + title + "</p>";
            $('#map').prepend(title);
        }

        var initial_datetime;
        if (typeof urlParams.datetime != "undefined") {
            initial_datetime = new Date(urlParams.datetime);
        } else {
            initial_datetime = null;
        }

        // Add datetime selector when date arrays have been fetched
        var dt_check = 10;
        function checkTimesteps() {
            var k1 = Object.keys(overlayMaps)[0];
            var category = overlayMaps[k1];
            var k2 = Object.keys(category)[0];
            var overlay = category[k2];
            var dates = overlay.getTimesteps();
            if (dates !== null) {
                var visibility = "visible";
                if (urlParams.hidecontrols == "true") {
                    visibility = "hidden";
                }
                var datetimeControl = L.datetimeSelector({
                        title: getI18n('datetime', localLang),
                        datetimes: dates,
                        language: localLang,
                        callback: changeDatetime,
                        visibility: visibility,
                        initialDatetime: initial_datetime,
                        vertical: false,
                        position: 'topright'
                }).addTo(map);
            } else {
                setTimeout(function(){checkTimesteps()}, dt_check);
            }
        }
        setTimeout(function(){checkTimesteps()}, dt_check);
}

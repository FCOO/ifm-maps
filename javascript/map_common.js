/**
 * This file is licensed under Creative Commons Zero (CC0)
 * http://creativecommons.org/publicdomain/zero/1.0/
 *
 * Author: http://www.openstreetmap.org/user/Zartbitter
 */

/**
 * Initialize the map.
 */
function initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, 
                       lon, tilesize, useGeoMetoc) {
	var localLang = getLocalLanguage();

        // Initialize basemaps
        var tmplayers = initBaseMaps(localLang, tilesize);
        var baseMaps = tmplayers.baseMaps;
        var topLayer = tmplayers.topLayer;

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

        // Retrieve URL parameters
	var urlParams = getUrlParameters();
	if (typeof urlParams.zoom != "undefined" && typeof urlParams.lat != "undefined" && typeof urlParams.lon != "undefined") {
		zoom = urlParams.zoom;
		lat = urlParams.lat;
		lon = urlParams.lon;
	}

        // Construct map
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

        // Optionally use FCOO Geolocated METOC service (on right click)
        if (useGeoMetoc) {
            map.on('contextmenu', function(e) {
                var lat = e.latlng.lat;
                var lon = e.latlng.lng;
                var url = location.protocol + '//metoc.fcoo.dk/text?x=_X_&y=_Y_&coastline=c';
                var win = window.open(url.replace('_X_', lon).replace('_Y_', lat), '_blank');
                win.focus();
            });
        }

        // Add link to homepage
        map.addControl(L.control.homeButton({
                text: getI18n('Home', localLang),
                title: getI18n('Navigate to home page', localLang),
                href: location.protocol + '//fcoo.dk'
        }));

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

        // Add base layers and overlays to map
        overlayMaps = [];
        for (var key in overlays) {
            var nkey = getI18n(key, localLang);
            overlayMaps[nkey] = {};
            for (var lkey in overlays[key]) {
                 // Set English name for use in permalink
                 overlays[key][lkey]._category_en = key;
                 overlays[key][lkey]._name_en = lkey;
                 // Make translated overlay dict to be shown in menu
                 overlayMaps[nkey][getI18n(lkey, localLang)] = overlays[key][lkey];
            }
        }

        // Add foreground layer (land contours, names, ...)
        topLayer.addTo(map)

	// Add layer control
        var opts = {collapsed: false,
                    groupsCollapsed: true, 
                    collapseActiveGroups: true, 
                    autoZIndex: false,
                    position: "topright"};
	var layerControl = (new L.Control.CategorizedLayers(baseMaps, overlayMaps, 
                            opts)).addTo(map);

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

        // Add length scale control
        var scaleControl = L.control.scale().addTo(map);

        // Add permanent link control
	map.addControl(new L.Control.Permalink({layers: layerControl, useAnchor: false, position: 'bottomright'}));

        // Add position control
        map.addControl(new L.control.mousePosition({emptyString: '', position: 'bottomright'}));

	// patch layer control to add some titles
	var patch = L.DomUtil.create('div', 'fcoo-layercontrol-header');
	patch.innerHTML = getI18n('layers', localLang); // 'TileLayers';
	layerControl._form.children[2].parentNode.insertBefore(patch, layerControl._form.children[2]);

	patch = L.DomUtil.create('div', 'fcoo-layercontrol-header');
	patch.innerHTML = getI18n('maps', localLang); // 'Maps';
	layerControl._form.children[0].parentNode.insertBefore(patch, layerControl._form.children[0]);

        // Add text input position control
        map.addControl(new L.Control.Position({position: 'topleft', collapsed: true}));

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

        // Add custom title (unescaped and sanitized) - used for print
        if (typeof urlParams.title != "undefined") {
            var title = $("<p>" + unescape(urlParams.title) + "</p>").text();
            title = "<p class='fcoo-title'>" + title + "</p>";
            $('#map').prepend(title);
        }

        // Initialize datetime control with this time if in URL
        var initial_datetime;
        if (typeof urlParams.datetime != "undefined") {
            initial_datetime = new Date(urlParams.datetime);
        } else {
            initial_datetime = null;
        }

        // Add datetime control. This is done when the overlays have been
        // properly initialized (they retrieve the current timesteps in
        // the forecast files asynchronously, so we have to wait until
        // they are ready).
        var dt_check = 10; // How often to check
        var dt_max = 30000; // When to give up
        var dt_current = 0;
        var callback_obj = new DatetimeCallback(overlayMaps);
        var callback = callback_obj.changeDatetime;
        function checkTimesteps() {
            var dates = getTimeSteps(overlayMaps);
            if (dates !== null) {
                var visibility = "visible";
                if (urlParams.hidecontrols == "true") {
                    visibility = "hidden";
                }
                new L.Control.Datetime({
                        title: getI18n('datetime', localLang),
                        datetimes: dates,
                        language: localLang,
                        callback: callback,
                        visibility: visibility,
                        initialDatetime: initial_datetime,
                        vertical: false,
                        position: 'topright'
                }).addTo(map);
                // Make sure that overlays are updated
                map.fire("overlayadd");
            } else {
                if (dt_current <= dt_max) {
                    dt_current += dt_check;
                    setTimeout(function(){checkTimesteps()}, dt_check);
                } else {
                    var msg = "Timeout encountered while getting timesteps";
                    var n = noty({text: msg, type: "error"});
                    throw new Error(msg);
                }
            }
        }
        setTimeout(function(){checkTimesteps()}, dt_check);
        return map;
}

/**
 * Initialize base maps
 */
function initBaseMaps(lang, tilesize) {
    // Construct OpenStreetMaps layer
    var standard = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        tileSize: 256,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors</a>'
    });

    // Construct MapQuest layer
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

    // Construct ESRI World Imagery layer
    var esri = L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.jpg", {
        maxZoom: 18, tileSize: 256, attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    // Construct FCOO background layer
    var fcoo_base = location.protocol + "//{s}.fcoo.dk/tiles/";
    var subdomains = ["media01", "media02", "media03", "media04", "media05"];
    var tile_bckgrnd_date = "201411070000";
    var fcoo = L.tileLayer(fcoo_base + "tiles_bckgrnd_" + tilesize + "_mercator_" + tile_bckgrnd_date + "/{z}/{x}/{y}.png", {
        maxZoom: 10,
        tileSize: tilesize,
        subdomains: subdomains,
        attribution: '<a href="' + location.protocol + '//fcoo.dk">Danish Defence Centre for Operational Oceanography</a>',
        continuousWorld: false
    });

    // Put background layers into hash for easy consumption by layer control
    var bgstring = getI18n("Background Maps", lang);
    var baseMaps = {};
    baseMaps[bgstring] = {
        "FCOO Standard": fcoo,
        //"OSM Standard": standard,
        //"Mapquest Open": mapquest,
        "ESRI Aerial": esri
    };

    // Construct FCOO foreground/top layer
    var tile_top_date = "201411170000";
    var topLayer = L.tileLayer(fcoo_base + "tiles_top_" + tilesize + "_mercator_" + tile_top_date + "/{z}/{x}/{y}.png", {
        maxZoom: 10,
        tileSize: tilesize,
        subdomains: subdomains,
        zIndex: 1001,
        continuousWorld: false,
        errorTileUrl: fcoo_base + "empty_" + tilesize + ".png"
    });

    return {baseMaps: baseMaps, topLayer: topLayer};
}

/*
 * We encapsulate the changeDatetime callback in an object to produce
 * a closure for overlays.
 */
DatetimeCallback = function(overlays) {
    /**
     * Called when something is updated in the datetime selector. If
     * type is 'datetime' all overlays with timesteps will be updated
     * with a new time. If type is 'timezone' all GeoJSON overlays with 
     * popups containing '{t}' in their inner HTML gets that replaced.
     *
     * @param type string
     * @param arg date|boolean
     */
    this.changeDatetime = function(type, arg) {
        var myOverlays = overlays;
        if (type == 'datetime') {
            for (var i in overlays) {
                var layergroup = overlays[i];
                for (var j in layergroup) {
                    var layer = layergroup[j];
                    if (layer.getTimesteps !== undefined) {
                        var timesteps = layer.getTimesteps();
                        if (timesteps !== null && timesteps.length > 1) {
                            layer.setParams({time: arg}, false);
                        }
                    } else if (layer.setTime !== undefined) {
                        // L.Terminator instance has a setTime method
                        layer.setTime(arg);
                    }
                }
            }
        } else if (type == 'timezone') {
            for (var i in overlays) {
                var layergroup = overlays[i];
                for (var j in layergroup) {
                    var layer = layergroup[j];
                    for (var k in layer._layers) {
                        var featuregroup = layer._layers[k];
                        if (featuregroup !== null && featuregroup._popup !== undefined) {
                            if (featuregroup.feature.properties.popup !== undefined) {
                                var popstr = featuregroup.feature.properties.popup;
                                if (arg) {
                                    var t = new Date();
                                    var dt = t.getTimezoneOffset();
                                } else {
                                    var dt = 0;
                                }
                                popstr = popstr.replace('{dt}', dt);
                                featuregroup.setPopupContent(popstr);
                            }
                        }
                    }
                }
            }
        }
    };
}

function dateArrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i].getTime() == a[j].getTime())
                a.splice(j--, 1);
        }
    }
    return a;
};

/**
 * Get time steps from a hash of overlays.
 */
function getTimeSteps(overlayMaps) {
    var date_min = new Date(8640000000000000)
    var date_max = new Date(-8640000000000000)
    var outdates = [];
    for (var i in overlayMaps) {
        var category = overlayMaps[i];
        for (var j in category) {
            overlay = category[j];
            if (overlay.getTimesteps !== undefined) {
                var dates = overlay.getTimesteps();
                if (dates !== null) {
                    // We ignore static fields
                    if (dates.length > 1) {
                        if (dates[0] < date_min || dates[dates.length-1] > date_max) {
                            outdates = dateArrayUnique(outdates.concat(dates));
                            outdates.sort(function(a,b){
                                return a - b;
                            });
                        }
                    }
                } else {
                    return null;
                }
            }
        }
    }
    return outdates;
};

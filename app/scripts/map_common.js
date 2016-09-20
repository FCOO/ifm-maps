(function ($, L, window /*, document, undefined*/){
    "use strict";
 
    /**
     * Initialize base maps
     */
    function initBaseMaps(store, lang) {
        // Construct ESRI World Imagery layer
        var esri = L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.jpg", {
            maxZoom: 18, tileSize: 256, attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        });

        // Construct FCOO background layer
        var fcoo = store.getBackground();

        // Put background layers into hash for easy consumption by layer control
        var bgstring = window.getI18n("Background Maps", lang);
        var baseMaps = {};
        baseMaps[bgstring] = {
            "FCOO Standard": fcoo,
            "ESRI Aerial": esri
        };

        return baseMaps;
    }


    /*
     * We encapsulate the changeDatetime callback in an object to produce
     * a closure for overlays.
     */
    function DatetimeCallback(overlays) {
        /**
         * Called when something is updated in the datetime selector. If
         * type is 'datetime' all overlays with timesteps will be updated
         * with a new time. If type is 'timezone' all GeoJSON overlays with 
         * popups containing '{t}' in their inner HTML gets that replaced.
         *
         * @param type string
         * @param arg date|boolean
         */
        this.changeDatetime = function (type, arg) {
            var i, j, k,
                layergroup,
                layer,
                timesteps,
                featuregroup,
                popstr,
                t,
                dt;
            if (type == 'datetime') {
                for (i in overlays) {
                    layergroup = overlays[i];
                    for (j in layergroup) {
                        layer = layergroup[j];
                        if (layer.timesteps !== undefined) {
                            timesteps = layer.timesteps;
                            if (timesteps !== null && timesteps.length > 1) {
                                layer.setParams({time: arg}, false, true);
                            }
                        } else if (layer.setTime !== undefined) {
                            // L.Terminator instance has a setTime method
                            layer.setTime(arg);
                        }
                    }
                }
            } else if (type == 'timezone') {
                //window.location.href = updateUrlParameter('localtime', arg);
                for (i in overlays) {
                    layergroup = overlays[i];
                    for (j in layergroup) {
                        layer = layergroup[j];
                        for (k in layer._layers) {
                            featuregroup = layer._layers[k];
                            if (featuregroup !== null && featuregroup._popup !== undefined) {
                                if (featuregroup.feature.properties.popup !== undefined) {
                                    popstr = featuregroup.feature.properties.popup;
                                    if (arg) {
                                        t = new Date();
                                        dt = t.getTimezoneOffset();
                                    } else {
                                        dt = 0;
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
    }

    /**
     * Get time steps from a hash of overlays.
     */
    function getTimeSteps(overlayMaps) {
        var overlay;
        var date_min = new Date(8640000000000000);
        var date_max = new Date(-8640000000000000);
        var outdates = [];
        for (var i in overlayMaps) {
            var category = overlayMaps[i];
            for (var j in category) {
                overlay = category[j];
                if (overlay.timesteps !== undefined) {
                    var dates = overlay.timesteps;
                    if (dates !== null) {
                        // We ignore static fields
                        if (dates.length > 1) {
                            if (dates[0] < date_min || dates[dates.length-1] > date_max) {
                                outdates = dateArrayUnique(outdates.concat(dates));
                                outdates.sort(function (a,b){
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
    }

    function levelArrayUnique(array) {
        var a = array.concat();
        for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
                if(a[i] == a[j])
                    a.splice(j--, 1);
            }
        }
        return a;
    }

    /**
     * Get vertical levels from a hash of overlays.
     */
    function getLevels(overlayMaps) {
        var overlay;
        var msg;
        var level_min = 8640000000000000;
        var level_max = -8640000000000000;
        var outlevels = {};
        var outvalues = [];
        for (var i in overlayMaps) {
            var category = overlayMaps[i];
            for (var j in category) {
                overlay = category[j];
                if (overlay.levels !== undefined) {
                    if (overlay.levels.hasOwnProperty('positive')) {
                        if (outlevels.hasOwnProperty('positive') && outlevels.positive != overlay.levels.positive) {
                            msg = 'Internal error getting vertical level direction';
                            window.noty({text: msg, type: 'error'});
                            throw new Error(msg);
                        }
                        outlevels.positive = overlay.levels.positive;
                    }
                    if (overlay.levels.hasOwnProperty('units')) {
                        if (outlevels.hasOwnProperty('units') && outlevels.units != overlay.levels.units) {
                            msg = 'Internal error getting vertical level units';
                            window.noty({text: msg, type: 'error'});
                            throw new Error(msg);
                        }
                        outlevels.units = overlay.levels.units;
                    }
                    var levels = overlay.levels.values;
                    if (levels[0] < level_min || levels[levels.length-1] > level_max) {
                        outvalues = levelArrayUnique(outvalues.concat(levels));
                        outvalues.sort(function (a,b){
                            return a - b;
                        });
                    }
                }
            }
        }
        outlevels.values = outvalues;
        return outlevels;
    }

    function mediaQueriesSupported() {
            return (typeof window.matchMedia != "undefined" || typeof window.msMatchMedia != "undefined");
    }


    /**
     * Initialization after DOM is loaded
     */
    function createCommonMap(store, basemap, maps, minZoom, maxZoom, zoom, lat,
                           lon, enablePrint, useGeoMetoc,
                           mapStore) {
        var localLang,
            urlParams,
            mainMap;
        localLang = window.getLocalLanguage();
        var desktop = false;
        if (mediaQueriesSupported()) {
            var mq = window.matchMedia('screen and (orientation: landscape) and (min-width: 641px) and (min-height: 481px), screen and (orientation: portrait) and (min-width: 481px) and (min-height: 641px)');
            desktop = mq.matches;
            // Special handling of IE8 and below
            if (window.isIE8) {
                desktop = true;
            }
        }

        //Setting title of document
        document.title = 'fcoo.dk - ' + window.getI18n('ifm-name', localLang) + ' - ' + window.getI18n('domain-'+window.domain, localLang);

        // Retrieve URL parameters
        urlParams = window.getParameters();
        if (urlParams.zoom !== undefined && urlParams.lat !== undefined && urlParams.lon !== undefined) {
            zoom = urlParams.zoom;
            lat = urlParams.lat;
            lon = urlParams.lon;
        }

        // Initialize datetime control with this time if in URL
        var initial_datetime;
        if (urlParams.datetime !== undefined) {
            var res = window.unescape(urlParams.datetime).split('T');
            // Colons are not unescaped since they are allowed in URI's
            // but some browsers encode then
            var res1 = res[0].split('-');
            res[1] = res[1].replace(/%253A/g,':');
            res[1] = res[1].replace(/%3A/g,':');
            var res2 = res[1].split(':');
            initial_datetime = moment(new Date(Date.UTC(res1[0], res1[1]-1, res1[2], res2[0], res2[1], res2[2])));
            //initial_datetime = new Date(window.unescape(urlParams.datetime));
        } else {
            initial_datetime = moment();
        }

        var initial_level;
        // Initialize level control with this level if in URL
        if (urlParams.level !== undefined) {
            initial_level = window.unescape(urlParams.level);
        } else {
            initial_level = null;
        }
        
        var datetime_pos = 'bottomleft';
        var level_pos = 'topleft';
        if (desktop) {
            datetime_pos = 'bottomright';
            level_pos = 'bottomright';
        }

        $.each(Object.keys(maps), function(index, mapKey) {
            var map;
            var baseMaps = mapStore.layers.basemaps[mapKey];

            // Construct map
            map = L.map(mapKey, {
                center: new L.LatLng(lat, lon),
                zoomControl: false,
                zoom: zoom,
                //fadeAnimation: false, // Disabled (Leaflet issue #3765)
                //zoomAnimation: true,
                minZoom: minZoom,
                maxZoom: maxZoom,
                //crs: L.CRS.EPSG4326,
                crs: L.CRS.EPSG3857,
                layers: [baseMaps[Object.keys(baseMaps)[0]][basemap]]
            });

            // Temporary fix for Leaflet issue #3765
            //map.on('zoomend', function() {
                //map.fire('viewreset');
            //});

            //map.attributionControl.setPrefix(window.version !== undefined ? "Version: "+window.version : "");
            //if (version !== undefined) {
            //    map.attributionControl.setPrefix("<a href='" + location.protocol + "//fcoo.dk/ifm-maps/'>IFM Maps version: " + version + "</a>");
            //} else {
            //    map.attributionControl.setPrefix("");
            //}

            //$(map.attributionControl._container).addClass("show-on-large");
            //$(".leaflet-control-attribution:not(.leaflet-control-permalink)").addClass("show-on-large");

            if (index === 0) {
                mainMap = map;

                // Add clustering layer for putting layers to be clustered on
                //map.addLayer(mapStore.layers.cluster);

                // Optionally use FCOO Geolocated METOC service (on right click)
                if (useGeoMetoc) {
                    map.on('contextmenu', function (e) {
                        var lat = e.latlng.lat;
                        var lon = e.latlng.lng;
                        var url = window.location.protocol + '//metoc.fcoo.dk/text?x=_X_&y=_Y_&coastline=c';
                        var win = window.open(url.replace('_X_', lon).replace('_Y_', lat), '_blank');
                        win.focus();
                    });
                }

/* Created in fcoo-leaflet
                // Add link to homepage
                map.addControl(mapStore.controls.homeButton);
								$(mapStore.controls.homeButton._container).addClass("hide-for-print show-for-large-up");
*/
                // Add language selector
                map.addControl(mapStore.controls.languageSelector);
								$(mapStore.controls.languageSelector._container).addClass("hide-for-print show-for-large-up");

/* Created in fcoo-leaflet
								// Add zoom control
                map.addControl(mapStore.controls.zoom);
                $(mapStore.controls.zoom._container).addClass("hide-on-print");
                $(mapStore.controls.zoom._container).addClass("show-on-large");
                if (desktop || !L.Browser.touch) {
                    $(mapStore.controls.zoom._container).removeClass("show-on-large");
                }
*/
                // Add bookmark/save icon
                map.addControl(mapStore.controls.bookmark);
                $(mapStore.controls.bookmark._container).addClass("hide-for-print");

/* Created in fcoo-leaflet
                // Add position control
								map.addControl(mapStore.controls.mousePosition);
                $(mapStore.controls.mousePosition._container).addClass("hide-on-print");
                $(mapStore.controls.mousePosition._container).addClass("show-on-large");
*/  
                // We do not support these on IE8
                if (!window.isIE8) {
                    // Only supported over https for security reasons
                    if (window.location.protocol === "https:") {
                        // Add locator control
                        map.addControl(mapStore.controls.locate);
                        $(mapStore.controls.locate._container).addClass("hide-for-print");

                        // Enable geolocation if locate query string parameter is true
                        if (urlParams.locate === "true") {
                            mapStore.controls.locate.start();
                        }
                    }

                    // Add geocoder control
                    map.addControl(mapStore.controls.OSMGeocoder);
                    $(mapStore.controls.OSMGeocoder._container).addClass("hide-for-print show-for-large-up");
                }

/*
                // Add length scale control
                map.addControl(mapStore.controls.doubleScale);
                //$(mapStore.controls.doubleScale.).addClass("show-on-large");
                $(mapStore.controls.doubleScale._container).addClass("show-on-large");
*/
                // Add text input position control
                map.addControl(mapStore.controls.position);
								$(mapStore.controls.position._container).addClass("hide-for-print show-for-large-up");

                // Add print control
                if (enablePrint) {
                    map.addControl(mapStore.controls.print);
										$(mapStore.controls.print._container).addClass("hide-for-print show-for-large-up");
                }
            }
    
            // Enable sync between maps
            if (index !== 0) {
                mainMap.sync(map);
            }

            // Add foreground layer (land contours, names, ...)
            map.addLayer(store.getTopLayer());

            // Add layer control
            var overlayMaps = mapStore.layers.overlays[mapKey];
            var layerControl = mapStore.layers.layerControls[mapKey]; 

            map.addControl(layerControl); 

            // patch layer control to add some titles
            var patch = L.DomUtil.create('div', 'fcoo-layercontrol-header');
            patch.innerHTML = window.getI18n('layers', localLang); // 'TileLayers';
            layerControl._form.children[2].parentNode.insertBefore(patch, layerControl._form.children[2]);
    
            patch = L.DomUtil.create('div', 'fcoo-layercontrol-header');
            patch.innerHTML = window.getI18n('maps', localLang); // 'Maps';
            layerControl._form.children[0].parentNode.insertBefore(patch, layerControl._form.children[0]);
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
                    // Only include datetime selector in first window
                    if (index === 0) {
                        var datetimeControl;
                        // We use the new time slider for desktop and the old
                        // one for mobile. This is a temporary solution.
                        if (desktop && !window.isIE8) {
                            datetimeControl = new L.Control.TimeSlider({
                                lang: localLang,
                                position: datetime_pos,
                                defaultMinimized: false,
                                displayAsLocal: true,
                                minMoment: moment(dates[0]),
                                maxMoment: moment(dates[dates.length-1]), 
                                fromMoment: moment(initial_datetime),
                                step: moment(dates[1]).diff(moment(dates[0]), 'hours', true),
                                callbackLocal: function( displayAsLocal ) {
                                    var tz = displayAsLocal ? 'local' : 'UTC';
                                    map.fire('timezonechange', {timezone: tz});
                                },
                                callback: function( result ) {
                                    map.fire('datetimechange', {datetime: result.fromMoment.toISOString()});
                                } 
                            }).addTo(map);
                            // When an overlay is added to the map we want the 
                            // datetime control to send a signal that the datetime
                            // is updated so that the time setting of the just
                            // added overlay can be set
                            map.addEventListener(
                                'overlayadd',
                                function(/*evt*/) {
                                    map.fire('datetimechange', {datetime: this.timeSlider.result.fromMoment.toISOString()});
                                },
                                datetimeControl
                            );
                            // Let overlays on the map know what time it is
                            map.fire('datetimechange', {datetime: initial_datetime.toISOString()});
                        } else {
                            datetimeControl = (new L.Control.Datetime({
                                title: window.getI18n('datetime', localLang),
                                datetimes: dates,
                                language: localLang,
                                callback: callback,
                                visibility: "visible",
                                initialDatetime: initial_datetime,
                                vertical: false,
                                position: datetime_pos
                            })).addTo(map);
												}

                    }

                    var dt_current_levels = 0;
                    var checkLevels = function() {
                        var levels = getLevels(overlayMaps);
                        if (levels !== null) {
                            var levelControl;
                            if (levels.values.length !== 0) {
                                // Add level control
                                var lvlMsg = 'Select depth';
                                if (levels.positive !== undefined && levels.positive == 'up') {
                                    lvlMsg = 'Select height';
                                }
                                levelControl = (new L.Control.Vertical({
                                    title: window.getI18n(lvlMsg, localLang),
                                    levels: levels.values,
                                    units: levels.units,
                                    language: localLang,
                                    visibility: 'hidden',
                                    initialLevelIndex: initial_level,
                                    position: level_pos
                                })).addTo(map);
                                // Set as first element if on small unit
                                if (! desktop) {
                                    var $verticalElem = $('.leaflet-control-vertical');
                                    $verticalElem.detach();
                                    var $container = $('.leaflet-top.leaflet-left');
                                    $container.prepend($verticalElem);
                                }
                            }
                            if (index === 0) {
                                // Add permanent link control
                                var useLocation = true;
                                var useLocalStorage = false;
                                // Use localStorage in standalone mode
                                if (urlParams.standalone == "true") {
                                    useLocation = false;
                                    useLocalStorage = true;
                                }
                                var permalinkControl = new L.Control.Permalink({
                                    layers: layerControl,
                                    locator: mapStore.controls.locate,
                                    levelControl: levelControl,
                                    useAnchor: true,
                                    useLocation: useLocation,
                                    useLocalStorage: useLocalStorage,
                                    text: '',
                                    position: 'bottomright'
                                });
                                $(permalinkControl).addClass("hide-for-print");
                                map.addControl(permalinkControl);

                                // Modify overlays to include MSI and firing warnings
                                var appendOverlays = 'Safety.MSI%2CSafety.Firing warnings';
                                var overlayNames = permalinkControl.options.layers.overlayNames();
                                if (overlayNames === '') {
                                    //appendOverlays = appendOverlays;
                                } else {
                                    appendOverlays = permalinkControl.options.layers.overlayNames() + '%2C' + appendOverlays;
                                }
                                permalinkControl._update({overlays: appendOverlays});
                                permalinkControl.options.layers.setOverlays(appendOverlays);
                                //map.fire('update');
                            }
                            //$(".leaflet-control-permalink").hide();
                        } else {
                            if (dt_current_levels <= dt_max) {
                                dt_current_levels += dt_check;
                                setTimeout(function (){checkLevels();}, dt_check);
                            } else {
                                var msg = "Timeout encountered while getting timesteps";
                                window.noty({text: msg, type: "error"});
                                throw new Error(msg);
                            }
                        }
                    };
                    checkLevels();

                    // Move legends to above datetime control if they are already 
                    // on map
                    var $legendContainer = $('.fcoo-legend-container');
                    var $container = $('.leaflet-bottom.leaflet-left');
                    $legendContainer.detach();
                    $container = $('.leaflet-bottom.leaflet-left');
                    $container.prepend($legendContainer);

                    // Make sure that overlays are updated
                    map.fire("overlayadd");

                    // Dynamic responsive design
                    if (mediaQueriesSupported()) {
                        mq.addListener(function (){
                            var desktop = mq.matches;
                            // Special handling of IE8 and below
                            if (window.isIE8) {
                                desktop = true;
                            }

                            // Modify layer control
                            // Disabled since the control is not really designed
                            // for such modifications after init
                            //layerControl.options.collapsed = !desktop;
                            //map.removeControl(layerControl);
                            //layerControl.addTo(map);
                            //$(".leaflet-control-layers").addClass("hide-on-print");
    
                            // Move datetime control
                            var $datetimeElem = $('.leaflet-control-datetime');
                            $datetimeElem.detach();
                            var $container = $('.leaflet-bottom.leaflet-left');
                            if (desktop) {
                                $container = $('.leaflet-bottom.leaflet-right');
                            }
                            $container.prepend($datetimeElem);
    
                            // Move vertical control
                            var $verticalElem = $('.leaflet-control-vertical');
                            $verticalElem.detach();
                            $container = $('.leaflet-top.leaflet-left');
                            if (desktop) {
                                $container = $('.leaflet-bottom.leaflet-right');
                            }
                            $container.prepend($verticalElem);
    
                            // Move legends to above datetime control
                            var $legendContainer = $('.fcoo-legend-container');
                            $legendContainer.detach();
                            $container = $('.leaflet-bottom.leaflet-left');
                            $container.prepend($legendContainer);
                        });
                    }
                } else {
                    if (dt_current <= dt_max) {
                        dt_current += dt_check;
                        setTimeout(function (){checkTimesteps();}, dt_check);
                    } else {
                        var msg = "Timeout encountered while getting timesteps";
                        window.noty({text: msg, type: "error"});
                        throw new Error(msg);
                    }
                }
            }
            checkTimesteps();
        });

        // Add custom title (unescaped and sanitized) - used for print
        if (urlParams.title !== undefined) {
            var title = $("<p>" + window.unescape(urlParams.title) + "</p>").text();
            title = "<p class='fcoo-title'>" + title + "</p>";
            $('#map').prepend(title);
        }

        return mainMap;
    }
    window.createCommonMap = createCommonMap;

		
    /**
     * Initialization prior to DOM is loaded. We create most of the map controls
     * here.
     */
    function initCommonMap(store, langs, maps, enablePrint) {
        var urlParams,
            localLang,
            lang,
            lang2,
            all_languages,
            languages,
            controls,
            layers,
            results,
            hash,
            hashes,
            i;

        // Retrieve URL parameters
        urlParams = window.getParameters();

        // The app operates in standalone mode when it has a query string parameter
        // "standalone=true" (generic), the navigator.standalone property is set 
        // (iOS) or the display-mode is standalone (Android).
        // For standalone apps we use localStorage for persisting state.
        if (urlParams.standalone != "true") {
            if ((("standalone" in window.navigator) &&
               window.navigator.standalone) ||
               (mediaQueriesSupported() &&
               window.matchMedia('(display-mode: standalone)').matches)) {
                urlParams.push('standalone');
                urlParams.standalone = 'true';
            }
        }
        if (urlParams.standalone == "true") {
            var params = window.localStorage.getItem('params');
            if (params !== null) {
                window.localStorage.setItem('paramsTemp', params);
                hashes = params.split('&');
                for (i = 0; i < hashes.length; i = i + 1) {
                    hash = hashes[i].split('=');
                    urlParams.push(hash[0]);
                    urlParams[hash[0]] = hash[1];
                }
            }
        }

        localLang = window.getLocalLanguage();

        // Media queries
        var desktop = false;
        if (mediaQueriesSupported()) {
            var mq = window.matchMedia('screen and (orientation: landscape) and (min-width: 641px) and (min-height: 481px), screen and (orientation: portrait) and (min-width: 481px) and (min-height: 641px)');
            desktop = mq.matches;
            // Special handling of IE8 and below
            if (window.isIE8) {
                desktop = true;
            }
        }

        controls = {};
        layers = {};

        // Create clustering layer for putting layers to be clustered on
        //layers.cluster = L.markerClusterGroup({spiderfyDistanceMultiplier: 3});

        // Layer control options
        var collapsed = true;
        if (desktop) {
            collapsed = false;
        }
        var opts = {
            collapsed: collapsed,
            groupsCollapsed: true, 
            collapseActiveGroups: true, 
            autoZIndex: false,
            position: "topright"
        };

        layers.basemaps = {};
        layers.overlays = {};
        layers.layerControls = {};
        $.each(Object.keys(maps), function(index, mapKey) {
            // Initialize basemaps
            var baseMaps = initBaseMaps(store, localLang);
            layers.basemaps[mapKey] = baseMaps;

            // Overlays
            var overlays = maps[mapKey].overlays;

            // Remove Solar Terminator from overlays if on small units
            // to save battery + does not work on all mobiles
            if ((window.isIE8 || !desktop) && overlays.hasOwnProperty("Celestial information")) {
                delete overlays["Celestial information"];
            }

            // Construct layer control
            var overlayMaps = [];
            for (var key in overlays) {
                var nkey = window.getI18n(key, localLang);
                overlayMaps[nkey] = {};
                for (var lkey in overlays[key]) {
                    // Set English name for use in permalink
                    overlays[key][lkey]._category_en = key;
                    overlays[key][lkey]._name_en = lkey;
                    // Make translated overlay dict to be shown in menu
                    overlayMaps[nkey][window.getI18n(lkey, localLang)] = overlays[key][lkey];
                }
            }
            layers.overlays[mapKey] = overlayMaps;

            // Construct layer controls
            layers.layerControls[mapKey] = new L.Control.CategorizedLayers(baseMaps, overlayMaps, opts);
            $(layers.layerControls[mapKey]._container).addClass("hide-for-print");
        });

        // List of languages to select from
        all_languages = [L.langObject('da', '<button class="flag-icon lang-icon-da"></button>'),
                         L.langObject('fo', '<button class="flag-icon lang-icon-fo"></button>'),
                         L.langObject('en', '<button class="flag-icon lang-icon-en"></button>')];

        // Select languages that are specified in langs
        languages = [];
        for (lang in langs) {
            for (lang2 in all_languages) {
                if (langs[lang] === all_languages[lang2].id) {
                    languages[languages.length] = all_languages[lang2];
                }
            }
        }

        // Construct language selector
        controls.languageSelector = L.languageSelector({
            languages: languages,
            callback: window.changeLanguage,
            initialLanguage: localLang,
            hideSelected: false,
            vertical: false,
            useAnchor: false,
            position: 'topleft'
        });

        // Construct text input position control
        controls.position = new L.Control.Position({
            position: 'topleft',
            collapsed: true,
            icon: 'icon-target',
            className: 'leaflet-control-position'
        });

        // Construct print control
        if (enablePrint) {
            controls.print = L.Control.print({
                icon: 'fa fa-print fa-2x',
            });
        }

        // Construct geocoder control
        controls.OSMGeocoder = new L.Control.OSMGeocoder({
            position: 'topleft',
            text: window.getI18n('Locate', localLang),
            callback: function (results) {
                if (results.length === 0) {
                    window.noty({text: "ERROR: didn't find a result", type: 'error'});
                    return;
                }
                var bbox = results[0].boundingbox,
                first = new L.LatLng(bbox[0], bbox[2]),
                second = new L.LatLng(bbox[1], bbox[3]),
                bounds = new L.LatLngBounds([first, second]);
                this._map.fitBounds(bounds);
                // Add marker
                var lat = results[0].lat;
                var lon = results[0].lon;
                var title = results[0].display_name;
                var _remove_marker = function(arg) {
                    this._map.removeLayer(arg.target);
                };
                if (this._marker !== undefined) {
                    this._map.removeLayer(this._marker);
                }
                this._marker = L.circleMarker([lat, lon], {
                    color: '#136AEC',
                    fillColor: '#2A93EE',
                    fillOpacity: 0.7,
                    weight: 2,
                    opacity: 0.9,
                    radius: 5,
                    title: title
                });
                this._marker.on('click', _remove_marker);
                this._marker.addTo(this._map);
            }
        });

        // Construct locator control
        var follow = true;
        if (urlParams.follow === "false") {
            follow = false;
        }
        controls.locate = new L.Control.Locate({
            locateOptions: {maxZoom: 10, enableHighAccuracy: false},
            position: 'topleft',
            follow: follow,
            stopFollowingOnDrag: true,
            strings: {
                title: window.getI18n("Show me where I am", localLang),
                popup: window.getI18n("You are within {distance} {unit} from this point", localLang),
                outsideMapBoundsMsg: window.getI18n("You seem located outside the boundaries of the map", localLang)
            },
            onLocationError: function(err) {
                window.noty({text: err.message, type: 'information', timeout: 1000});
            },
        });

        // Construct home button control
/* Created in fcoo-leaflet
        controls.homeButton = L.control.homeButton({
            text: window.getI18n('Home', localLang),
            title: window.getI18n('Navigate to home page', localLang),
            href: window.location.protocol + '//fcoo.dk',
            className: 'leaflet-control-fcoo hide-for-print show-for-large-up',
            icon: 'leaflet-control-fcoo-logo'
            //icon: 'fa fa-home fa-2x'
        });
*/
        // Construct zoom control
//Created in fcoo-leaflet        controls.zoom = new L.Control.Zoom({ position: 'topleft' });

        // Construct bookmark/save control
        var useLocalStorage = false;
        var msg = window.getI18n('Please create a bookmark in your browser to save current map state', localLang);
        // Use localStorage in standalone mode
        if (urlParams.standalone == "true") {
            useLocalStorage = true;
            msg = window.getI18n('Saved current map state', localLang);
        }
        controls.bookmark = new L.Control.FontAwesomeButton({
            onclick: function (evt) {
                // Prevent link from being processed
                if (evt.preventDefault) {
                    evt.preventDefault();
                } else {
                    evt.returnValue = false;
                }
                var triggerDefault = false;
                if (this.options.useLocalStorage) {
                    var params = window.localStorage.getItem('paramsTemp');
                    window.localStorage.setItem('params', params);
                    window.noty({text: this.options.message, type: 'information', timeout: 10000});
                } else {
                    var bookmarkURL = window.location.href;
                    var bookmarkTitle = document.title;
                    if (window.external && ('AddFavorite' in window.external)) {
                        // IE Favorite
                        window.external.AddFavorite(bookmarkURL, bookmarkTitle);
                    } else {
                        // WebKit - Safari/Chrome - Mozilla Firefox
                        window.noty({text: this.options.message, type: 'information', timeout: 10000});
                    }
                }
                return triggerDefault;
            },
            message: msg,
            title: window.getI18n('Save settings', localLang),
            fontAwesomeIcon: 'fa fa-floppy-o fa-2x',
            useLocalStorage: useLocalStorage,
            className: 'leaflet-control-floppy-button'
        });

        // Collect everything
        results = {
            layers: layers,
            controls: controls
        };

        return results;
    }
    window.initCommonMap = initCommonMap;

    /**
     * Get query string parameters or parameters from localStorage if
     * in standalone mode.
     * @return Array List of URL parameters key-value indexed
     */
    function getParameters() {
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
        if (vars.standalone != "true") {
            if ((("standalone" in window.navigator) &&
               window.navigator.standalone) ||
               (mediaQueriesSupported() &&
               window.matchMedia('(display-mode: standalone)').matches)) {
                 vars.push('standalone');
                 vars.standalone = 'true';
            }
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
    window.getParameters = getParameters;

})(jQuery, L, this, document);

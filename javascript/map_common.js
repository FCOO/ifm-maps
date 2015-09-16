(function (){
    "use strict";
    /*jslint browser: true*/
    /*global $, L, noty, getLocalLanguage, getI18n, getUrlParameters, changeLanguage, updateURLParameter*/
    /*exported initCommonMap*/

    /**
     * Initialize the map.
     */
    function initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat,
                           lon, tilesize, enablePrint, enableWarnings, useGeoMetoc) {
        var localLang,
            tmplayers,
            baseMaps,
            topLayer,
            lang,
            lang2,
            all_languages,
            languages,
            urlParams,
            map;
        localLang = getLocalLanguage();
        var store = new L.Control.FcooLayerStore({language: localLang});
        var large = false;
        if (mediaQueriesSupported()) {
            var mq = window.matchMedia('screen and (min-width: 641px) and (min-height: 641px)');
            large = mq.matches;
        }

        // Initialize basemaps
        tmplayers = initBaseMaps(localLang, tilesize);
        baseMaps = tmplayers.baseMaps;
        topLayer = tmplayers.topLayer;

        // List of languages to select from
        all_languages = [L.langObject('da', '<button class="flag-icon flag-icon-dk"></button>'),
                         L.langObject('fo', '<button class="flag-icon flag-icon-fo"></button>'),
                         L.langObject('en', '<button class="flag-icon flag-icon-gb"></button>')];

        // Select languages that are specified in langs
        languages = [];
        for (lang in langs) {
            for (lang2 in all_languages) {
                if (langs[lang] === all_languages[lang2].id) {
                    languages[languages.length] = all_languages[lang2];
                }
            }
        }

        // Retrieve URL parameters
        urlParams = getUrlParameters();
        if (urlParams.zoom !== undefined && urlParams.lat !== undefined && urlParams.lon !== undefined) {
            zoom = urlParams.zoom;
            lat = urlParams.lat;
            lon = urlParams.lon;
        }

        // Construct map
        map = L.map('map', {
            center: new L.LatLng(lat, lon),
            zoom: zoom,
            zoomAnimation: true, // There is a bug with layer hiding when enabled
            minZoom: minZoom,
            maxZoom: maxZoom,
            //crs: L.CRS.EPSG4326,
            crs: L.CRS.EPSG3857,
            layers: [baseMaps[Object.keys(baseMaps)[0]][basemap]]
        });
        if (version !== undefined) {
            map.attributionControl.setPrefix("<a href='" + location.protocol + "//fcoo.dk/ifm-maps/'>IFM Maps version: " + version + "</a>");
        } else {
            map.attributionControl.setPrefix("");
        }

        // Workaround for https://github.com/Leaflet/Leaflet/issues/3765
        //map.on('zoomend', function (e) {
            //map.fire('dragend');
        //});

        // Optionally use FCOO Geolocated METOC service (on right click)
        if (useGeoMetoc) {
            map.on('contextmenu', function (e) {
                var lat = e.latlng.lat;
                var lon = e.latlng.lng;
                var url = location.protocol + '//metoc.fcoo.dk/text?x=_X_&y=_Y_&coastline=c';
                var win = window.open(url.replace('_X_', lon).replace('_Y_', lat), '_blank');
                win.focus();
            });
        }

        if (enableWarnings) {
            // Add MSI information
            map.addLayer(new L.GeoJSON.MSI({language: localLang}));

            // Add firing warnings
            map.addLayer(store.firingAreas);
            map.addLayer(new L.GeoJSON.Fwarn({language: localLang}));
        }

        // Add link to homepage
        map.addControl(L.control.homeButton({
            text: getI18n('Home', localLang),
            title: getI18n('Navigate to home page', localLang),
            href: location.protocol + '//fcoo.dk',
            icon: 'fa fa-home fa-2x'
        }));

        // Add bookmark/save icon
        map.addControl(new L.Control.FontAwesomeButton({
            onclick: function (evt) {
                evt.preventDefault(); // Prevent link from being processed
                var bookmarkURL = window.location.href;
                var bookmarkTitle = document.title;
                var triggerDefault = false;
                if (window.external && ('AddFavorite' in window.external)) {
                    // IE Favorite
                    window.external.AddFavorite(bookmarkURL, bookmarkTitle);
                } else {
                    // WebKit - Safari/Chrome - Mozilla Firefox
                    noty({text: this.options.message, type: 'information', timeout: 10000});
                }
                return triggerDefault;
            },
            message: getI18n('Please create a bookmark in your browser to save current map state', localLang),

            title: getI18n('Save settings', localLang),
            fontAwesomeIcon: 'fa fa-floppy-o fa-2x',
            className: 'leaflet-control-floppy-button'
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

        // Remove Solar Terminator from overlays if on small units
        // to save battery + does not work on all mobiles
        if (!large && overlays.hasOwnProperty("Celestial information")) {
            delete overlays["Celestial information"];
        }

        // Add base layers and overlays to map
        var overlayMaps = [];
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
        topLayer.addTo(map);

        // Add layer control
        var collapsed = true;
        if (large) {
            collapsed = false;
        }
        var opts = {
            collapsed: collapsed,
            groupsCollapsed: true, 
            collapseActiveGroups: true, 
            autoZIndex: false,
            position: "topright"
        };
        var layerControl = (new L.Control.CategorizedLayers(baseMaps, overlayMaps, 
                            opts)).addTo(map);

        // Add position control
        map.addControl(new L.control.mousePosition({emptyString: '', position: 'bottomleft'}));

        // Add locator control
        var follow = true;
        if (urlParams.follow === "false") {
            follow = false;
        }
        var locator = L.control.locate({
            locateOptions: {maxZoom: 10, enableHighAccuracy: false},
            position: 'topleft',
            follow: follow,
            stopFollowingOnDrag: true,
            strings: {
                title: getI18n("Show me where I am", localLang),
                popup: getI18n("You are within {distance} {unit} from this point", localLang),
                outsideMapBoundsMsg: getI18n("You seem located outside the boundaries of the map", localLang)
            },
            onLocationError: function(err) {
                noty({text: err.message, type: 'information', timeout: 1000});
            },

        });
        map.addControl(locator);
        // Enable geolocation if locate query string parameter is true
        if (urlParams.locate === "true") {
            locator.start();
        }

        // Add geocoder control
        map.addControl(new L.Control.OSMGeocoder({
            position: 'topleft',
            text: getI18n('Locate', localLang),
            callback: function (results) {
                if (results.length === 0) {
                    console.log("ERROR: didn't find a result");
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
        }));

        // Add length scale control
        L.control.graphicScale({
          type         : 'both',
          position     : 'bottomleft',
          backgroundColor: 'white',
          opacity: 0.4,
          maxUnitsWidth: 200,
        }).addTo(map);

        // patch layer control to add some titles
        var patch = L.DomUtil.create('div', 'fcoo-layercontrol-header');
        patch.innerHTML = getI18n('layers', localLang); // 'TileLayers';
        layerControl._form.children[2].parentNode.insertBefore(patch, layerControl._form.children[2]);

        patch = L.DomUtil.create('div', 'fcoo-layercontrol-header');
        patch.innerHTML = getI18n('maps', localLang); // 'Maps';
        layerControl._form.children[0].parentNode.insertBefore(patch, layerControl._form.children[0]);

        // Add text input position control
        map.addControl(new L.Control.Position({
            position: 'topleft',
            collapsed: true,
            icon: 'icon-target',
        }));

        // Add print control
        if (enablePrint) {
            map.addControl(L.Control.print({
                icon: 'fa fa-print fa-2x',
            }));
        }

        // Make sure that these controls are hidden on print
        $(".leaflet-control-layers").addClass("hide-on-print");
        $(".leaflet-control-zoom").addClass("hide-on-print");
        $(".leaflet-control-home").addClass("hide-on-print");
        $(".leaflet-control-locate").addClass("hide-on-print");
        $(".leaflet-control-geocoder").addClass("hide-on-print");
        $(".leaflet-control-position").addClass("hide-on-print");
        if (enablePrint) {
            $(".leaflet-control-print").addClass("hide-on-print");
        }
        $(".leaflet-control-mouseposition").addClass("hide-on-print");
        $(".leaflet-control-permalink").addClass("hide-on-print");

        // Hide all controls if hidecontrols in query string
        if (urlParams.hidecontrols == "true") {
            $(".leaflet-control-layers").css("visibility", "hidden");
            $(".leaflet-control-zoom").css("visibility", "hidden");
            $(".leaflet-control-home").css("visibility", "hidden");
            $(".leaflet-control-locate").css("visibility", "hidden");
            $(".leaflet-control-geocoder").css("visibility", "hidden");
            $(".leaflet-control-position").css("visibility", "hidden");
            if (enablePrint) {
                $(".leaflet-control-print").css("visibility", "hidden");
            }
            $(".leaflet-control-mouseposition").css("visibility", "hidden");
        }

        // Make sure that these controls are hidden on small devices
        $(".leaflet-languageselector-control").addClass("show-on-large");
        $(".leaflet-control-zoom").addClass("show-on-large");
        $(".leaflet-control-home").addClass("show-on-large");
        $(".leaflet-control-attribution:not(.leaflet-control-permalink)").addClass("show-on-large");
        $(".leaflet-control-graphicscale").addClass("show-on-large");
        $(".leaflet-control-geocoder").addClass("show-on-large");
        $(".leaflet-control-position").addClass("show-on-large");
        $(".leaflet-control-print").addClass("show-on-large");
        $(".leaflet-control-mouseposition").addClass("show-on-large");

        // Add custom title (unescaped and sanitized) - used for print
        if (urlParams.title !== undefined) {
            var title = $("<p>" + window.unescape(urlParams.title) + "</p>").text();
            title = "<p class='fcoo-title'>" + title + "</p>";
            $('#map').prepend(title);
        }

        // Initialize datetime control with this time if in URL
        var initial_datetime;
        if (urlParams.datetime !== undefined) {
            var res = window.unescape(urlParams.datetime).split('T');
            var res1 = res[0].split('-');
            var res2 = res[1].split(':');
            initial_datetime = new Date(res1[0], res1[1]-1, res1[2], res2[0], res2[1], res2[2]);
            //initial_datetime = new Date(window.unescape(urlParams.datetime));
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
        var datetime_pos = 'bottomleft';
        if (large) {
            datetime_pos = 'bottomright';
        }
        function checkTimesteps() {
            var dates = getTimeSteps(overlayMaps);
            if (dates !== null) {
                var visibility = "visible";
                if (urlParams.hidecontrols == "true") {
                    visibility = "hidden";
                }
                // Add permanent link control
                map.addControl(new L.Control.Permalink({
                    layers: layerControl,
                    locator: locator,
                    useAnchor: true,
                    useLocation: true,
                    text: '',
                    position: 'bottomright'
                }));
                //$(".leaflet-control-permalink").css("visibility", "hidden");
                var datetimeControl = (new L.Control.Datetime({
                        title: getI18n('datetime', localLang),
                        datetimes: dates,
                        language: localLang,
                        callback: callback,
                        visibility: visibility,
                        initialDatetime: initial_datetime,
                        vertical: false,
                        position: datetime_pos
                })).addTo(map);

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
                        var large = mq.matches;
                        // Modify layer control
                        layerControl.options.collapsed = !large;
                        map.removeControl(layerControl);
                        layerControl.addTo(map);
                        $(".leaflet-control-layers").addClass("hide-on-print");

                        // Move datetime control
                        var $datetimeElem = $('.leaflet-control-datetime');
                        $datetimeElem.detach();
                        var $container = $('.leaflet-bottom.leaflet-left');
                        if (large) {
                            $container = $('.leaflet-bottom.leaflet-right');
                        }
                        $container.prepend($datetimeElem);

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
                    noty({text: msg, type: "error"});
                    throw new Error(msg);
                }
            }
        }
        setTimeout(function (){checkTimesteps();}, dt_check);
        return map;
    }
    window.initCommonMap = initCommonMap;

    /**
     * Initialize base maps
     */
    function initBaseMaps(lang, tilesize) {
        // Construct ESRI World Imagery layer
        var esri = L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.jpg", {
            maxZoom: 18, tileSize: 256, attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        });

        // Construct FCOO background layer
        var store = new L.Control.FcooLayerStore({language: lang});
        var fcoo = store.background;

        // Put background layers into hash for easy consumption by layer control
        var bgstring = getI18n("Background Maps", lang);
        var baseMaps = {};
        baseMaps[bgstring] = {
            "FCOO Standard": fcoo,
            "ESRI Aerial": esri
        };

        // Construct FCOO foreground/top layer
        var topLayer = store.top;

        return {baseMaps: baseMaps, topLayer: topLayer};
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
                myOverlays,
                layergroup,
                layer,
                timesteps,
                featuregroup,
                popstr,
                t,
                dt;
            myOverlays = overlays;
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
                //window.location.href = updateURLParameter(window.location.href, 'localtime', arg);
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

    function mediaQueriesSupported() {
            return (typeof window.matchMedia != "undefined" || typeof window.msMatchMedia != "undefined");
    }

})();

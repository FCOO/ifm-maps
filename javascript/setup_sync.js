(function (){
    "use strict";
    /*jslint browser: true*/
    /*global $, L, initCommonMap, getTilesize, getLocalLanguage */

    /**
     * Initialize the map.
     */
    var urlParams = getUrlParameters();
    // The domain variable is used to determine which setup to use
    if (urlParams.domain !== undefined) {
        domain = urlParams.domain;
    }
    var minZoom;
    var maxZoom;
    var zoom;
    var lat;
    var lon;
    var overlays1;
    var overlays2;
    var overlays3;
    var overlays4;
    var proxy;
    var tilesize = getTilesize();
    var lang = getLocalLanguage();
    var store = new L.Control.FcooLayerStore({language: lang});
    var istore = new L.Control.ImpactLayerStore({language: lang});
    var basemap = "FCOO Standard";
    var langs = ['da', 'en'];
    var useGeoMetoc = false;
    var enablePrint = false;
    var enableWarnings = false;
    var stdOpts;
    var maps;

    // Notify user of outstanding AJAX events
    var numAjaxEvents = 0;
    var notyMessage;
    $(document).ajaxSend(function (evt) {
        numAjaxEvents += 1;
        if (numAjaxEvents === 1) {
            var msg = getI18n('Loading forecast information', lang);
            if (notyMessage === undefined) {
                notyMessage = noty({text: msg, type: 'information'});
            } else {
                notyMessage.setText(msg);
                notyMessage.setTimeout(false);
            }
        }
    }).ajaxComplete(function (evt) {
        numAjaxEvents -= 1;
        if (numAjaxEvents === 0) {
            var msg = getI18n('Finished loading forecast information', lang);
            notyMessage.setText(msg);
            notyMessage.setTimeout(1500);
        }
    });

    if (domain === 'denmark_impact') {
        minZoom = 4;
        maxZoom = 12;
        zoom = 7;
        lat = 55.7;
        lon = 11.1;
        stdOpts = {ajaxProxy: proxy, foreground: store.foreground};
        overlays1 = {
            "Short range impacts - Own Ops": {
                "Helo": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'helo', 'options': stdOpts}),
                "RHIB": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'RHIB', 'options': stdOpts}),
                "LCP": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'LCP', 'options': stdOpts}),
                "RAS": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'RAS', 'options': stdOpts}),
                "Boarding": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'boarding', 'options': stdOpts}),
                "UAV": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'UAV', 'options': stdOpts}),
                "Generic1": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'generic', 'options': stdOpts}),
                "Generic2": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'generic', 'options': stdOpts})
            },
            "Short range impacts - Adversary Ops": {
                "Skiff": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'skiff', 'options': stdOpts}),
                "Dhow": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'dhow', 'options': stdOpts}),
                "Fishing:120GT": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'fishingboat_120', 'options': stdOpts}),
                "Fishing:500GT": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'fishingboat_500', 'options': stdOpts}),
                "Fishing:1000GT": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'fishingboat_1000', 'options': stdOpts}),
                "Fishing:2000GT": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'fishingboat_2000', 'options': stdOpts}),
                "Generic1": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'generic', 'options': {ajaxProxy: proxy}}),
                "Generic2": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'generic', 'options': {ajaxProxy: proxy}})
            },
            "Medium range impacts - Own Ops": {
                "Helo": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'helo', 'options': stdOpts}),
                "RHIB": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'RHIB', 'options': stdOpts}),
                "LCP": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'LCP', 'options': stdOpts}),
                "RAS": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'RAS', 'options': stdOpts}),
                "Boarding": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'boarding', 'options': stdOpts}),
                "UAV": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'UAV', 'options': stdOpts}),
                "Generic1": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'generic', 'options': stdOpts}),
                "Generic2": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'generic', 'options': stdOpts})
            },
            "Medium range impacts - Adversary Ops": {
                "Skiff": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'skiff', 'options': stdOpts}),
                "Dhow": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'dhow', 'options': stdOpts}),
                "Fishing:120GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'fishingboat_120', 'options': stdOpts}),
                "Fishing:500GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'fishingboat_500', 'options': stdOpts}),
                "Fishing:1000GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'fishingboat_1000', 'options': stdOpts}),
                "Fishing:2000GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'fishingboat_2000', 'options': stdOpts}),
                "Generic1": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'generic', 'options': {ajaxProxy: proxy}}),
                "Generic2": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'generic', 'options': {ajaxProxy: proxy}})
            },
            "Celestial information": {
                "Solar Terminator": store.solarTerminator
            },
            "Static layers": {
                "EEZ": store.EEZ,
                "Firing areas": store.firingAreas
            }
        };
        overlays2 = {
        };
        overlays2 = {
            "Short range forecasts": {
                "wind": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection', 'options': {ajaxProxy: proxy}, wmsParams: {styles: 'vector_method=color_quiver1,vector_spacing=80,vector_offset=20'}, legendParams: {show: true}}),
                "windspeed": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windSpeed', 'options': {ajaxProxy: proxy}}),
                "winddirection": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection', 'options': {ajaxProxy: proxy}, wmsParams: {styles: 'vector_method=black_vector,vector_spacing=80,vector_offset=20'}}),
                "windbarbs": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection', 'options': {ajaxProxy: proxy}}),
                "visibility": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'visibility', 'options': {ajaxProxy: proxy}}),
                "pressure": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'seaLevelPressure', 'options': {ajaxProxy: proxy}}),
                "precip": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalPrecipitation', 'options': {ajaxProxy: proxy}}),
                "airtemp": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'airTemperature', 'options': {ajaxProxy: proxy}}),
                "cloudcover": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalCloudCover', 'options': {ajaxProxy: proxy}}),
                "waveperiod": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC_MERGED', 'parameter': 'wavePeriod', 'options': {ajaxProxy: proxy}}),
                "waveheight": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC_MERGED', 'parameter': 'waveHeight', 'options': {ajaxProxy: proxy}}),
                "seastate": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC_MERGED', 'parameter': 'seaState', 'options': {ajaxProxy: proxy}}),
                "wavedirection": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC_MERGED', 'parameter': 'waveDirection', 'options': {ajaxProxy: proxy}}),
                "current": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'currentDirection', 'options': {ajaxProxy: proxy}, wmsParams: {styles: 'vector_method=color_quiver2'}, legendParams: {show: true}}),
                "currentspeed": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'currentSpeed', 'options': {ajaxProxy: proxy}}),
                "currentdirection": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'currentDirection', 'options': {ajaxProxy: proxy}}),
                "elev": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'seaLevel', 'options': {ajaxProxy: proxy}}),
                "seatemp": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'sst', 'options': {ajaxProxy: proxy}}),
                "salinity": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'sss', 'options': {ajaxProxy: proxy}})
            },
            "Medium range forecasts": {
                "wind": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windDirection', 'options': {ajaxProxy: proxy}, wmsParams: {styles: 'vector_method=color_quiver1,vector_spacing=80,vector_offset=20'}, legendParams: {show: true}}),
                "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windSpeed', 'options': {ajaxProxy: proxy}}),
                "winddirection": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windDirection', 'options': {ajaxProxy: proxy}, wmsParams: {styles: 'vector_method=black_vector,vector_spacing=80,vector_offset=20'}}),
                "windbarbs": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windDirection', 'options': {ajaxProxy: proxy}}),
                "pressure": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'seaLevelPressure', 'options': {ajaxProxy: proxy}}),
                "precip": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'totalPrecipitation', 'options': {ajaxProxy: proxy}}),
                "airtemp": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'airTemperature', 'options': {ajaxProxy: proxy}}),
                "cloudcover": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'totalCloudCover', 'options': {ajaxProxy: proxy}}),
                "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'wavePeriod', 'options': {ajaxProxy: proxy}}),
                "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'waveHeight', 'options': {ajaxProxy: proxy}}),
                "seastate": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'seaState', 'options': {ajaxProxy: proxy}}),
                "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'waveDirection', 'options': {ajaxProxy: proxy}})
            },
            "Celestial information": {
                "Solar Terminator": store.solarTerminator
            },
            "Static layers": {
                "EEZ": store.EEZ,
                "Firing areas": store.firingAreas
            }
        };
        // Construct maps
        maps = {
            map1: {
                overlays: overlays1
            },
            map2: {
                overlays: overlays2
            }
        }
    } else {
        throw new Error('Valid domain not specified: ' + domain);
    }

    $(document).ready(function () {
        initCommonMapImpact(langs, basemap, maps, minZoom, maxZoom, zoom, 
                      lat, lon, tilesize, enablePrint, enableWarnings, 
                      useGeoMetoc);
    });

})();

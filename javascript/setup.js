(function (){
    "use strict";
    /*jslint browser: true*/
    /*global $, L, initCommonMap, createCommonMap, 
      getTilesize, getLocalLanguage, getUrlParameters, WmsAjaxProxy,
      getI18n, noty */

    /**
     * Initialize the map.
     */

    //console.profile('init');
    // Retrieve all URL parameters
    var urlParams = getUrlParameters();

    // The domain variable is used to determine which setup to use
    if (urlParams.domain !== undefined) {
        domain = urlParams.domain;
    }

    // Initialize minumum and maximum zoom
    var minZoom = 3;
    var maxZoom = 12;

    // We use a proxy for getting overlay information. The proxy
    // merges requests to the same datafile together to one
    // request
    var proxy = WmsAjaxProxy;

    var zoom;
    var lat;
    var lon;
    var overlays;
    var overlays1; // For impact maps test
    var overlays2; // For impact maps test
    var lang = getLocalLanguage();
    var store = new L.Control.FcooLayerStore({language: lang});
    var istore = new L.Control.ImpactLayerStore({language: lang});
    var basemap = "FCOO Standard";
    var langs = ['da', 'en'];
    var useGeoMetoc = false;
    var enablePrint = false;
    var stdOpts = {ajaxProxy: proxy};
    var seaOpts = {ajaxProxy: proxy, foreground: store.getForeground()};
    var maps;

    // Notify user of outstanding AJAX events and again when everything
    // has loaded
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
        zoom = 7;
        lat = 55.7;
        lon = 11.1;
        overlays = {
            "Short range impacts - Own Ops": {
                "Helo": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'helo', 'options': seaOpts}),
                "RHIB": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'RHIB', 'options': seaOpts}),
                "LCP": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'LCP', 'options': seaOpts}),
                "RAS": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'RAS', 'options': seaOpts}),
                "Boarding": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'boarding', 'options': seaOpts}),
                "UAV": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'UAV', 'options': seaOpts}),
                "Generic1": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'generic', 'options': seaOpts}),
                "Generic2": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'generic', 'options': seaOpts})
            },
            "Short range impacts - Adversary Ops": {
                "Skiff": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'skiff', 'options': seaOpts}),
                "Dhow": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'dhow', 'options': seaOpts}),
                "Fishing:120GT": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'fishingboat_120', 'options': seaOpts}),
                "Fishing:500GT": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'fishingboat_500', 'options': seaOpts}),
                "Fishing:1000GT": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'fishingboat_1000', 'options': seaOpts}),
                "Fishing:2000GT": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'fishingboat_2000', 'options': seaOpts}),
                "Generic1": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'generic', 'options': stdOpts}),
                "Generic2": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'generic', 'options': stdOpts})
            },
            "Short range forecasts": {
                "wind": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver1,vector_spacing=80,vector_offset=20'}, legendParams: {show: true}}),
                "windspeed": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windSpeed', 'options': stdOpts}),
                "winddirection": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=black_vector,vector_spacing=80,vector_offset=20'}}),
                "windbarbs": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection', 'options': stdOpts}),
                "visibility": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'visibility', 'options': stdOpts}),
                "pressure": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'seaLevelPressure', 'options': stdOpts}),
                "precip": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalPrecipitation', 'options': stdOpts}),
                "airtemp": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'airTemperature', 'options': stdOpts}),
                "cloudcover": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalCloudCover', 'options': stdOpts}),
                "waveperiod": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC_MERGED', 'parameter': 'wavePeriod', 'options': stdOpts}),
                "waveheight": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC_MERGED', 'parameter': 'waveHeight', 'options': stdOpts}),
                "seastate": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC_MERGED', 'parameter': 'seaState', 'options': stdOpts}),
                "wavedirection": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC_MERGED', 'parameter': 'waveDirection', 'options': stdOpts}),
                "current": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'currentDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver2'}, legendParams: {show: true}}),
                "currentspeed": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'currentSpeed', 'options': stdOpts}),
                "currentdirection": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'currentDirection', 'options': stdOpts}),
                "elev": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'seaLevel', 'options': stdOpts}),
                "seatemp": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'sst', 'options': stdOpts}),
                "salinity": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'sss', 'options': stdOpts})
            },
            "Medium range impacts - Own Ops": {
                "Helo": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'helo', 'options': seaOpts}),
                "RHIB": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'RHIB', 'options': seaOpts}),
                "LCP": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'LCP', 'options': seaOpts}),
                "RAS": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'RAS', 'options': seaOpts}),
                "Boarding": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'boarding', 'options': seaOpts}),
                "UAV": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'UAV', 'options': seaOpts}),
                "Generic1": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'generic', 'options': seaOpts}),
                "Generic2": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'generic', 'options': seaOpts})
            },
            "Medium range impacts - Adversary Ops": {
                "Skiff": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'skiff', 'options': seaOpts}),
                "Dhow": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'dhow', 'options': seaOpts}),
                "Fishing:120GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'fishingboat_120', 'options': seaOpts}),
                "Fishing:500GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'fishingboat_500', 'options': seaOpts}),
                "Fishing:1000GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'fishingboat_1000', 'options': seaOpts}),
                "Fishing:2000GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'fishingboat_2000', 'options': seaOpts}),
                "Generic1": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'generic', 'options': stdOpts}),
                "Generic2": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'generic', 'options': stdOpts})
            },
            "Medium range forecasts": {
                "wind": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver1,vector_spacing=80,vector_offset=20'}, legendParams: {show: true}}),
                "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windSpeed', 'options': stdOpts}),
                "winddirection": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=black_vector,vector_spacing=80,vector_offset=20'}}),
                "windbarbs": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windDirection', 'options': stdOpts}),
                "pressure": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'seaLevelPressure', 'options': stdOpts}),
                "precip": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'totalPrecipitation', 'options': stdOpts}),
                "airtemp": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'airTemperature', 'options': stdOpts}),
                "cloudcover": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'totalCloudCover', 'options': stdOpts}),
                "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'wavePeriod', 'options': stdOpts}),
                "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'waveHeight', 'options': stdOpts}),
                "seastate": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'seaState', 'options': stdOpts}),
                "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'waveDirection', 'options': stdOpts})
            },
            "Celestial information": {
                "Solar Terminator": store.getSolarTerminator()
            },
            "Static layers": {
                "EEZ": store.getEEZ(),
                "Firing areas": store.getFiringAreas()
            }
        };
    } else if (domain === 'denmark_impact_land') {
        zoom = 7;
        lat = 55.7;
        lon = 11.1;
        overlays = {
            "Impacts": {
                "NBC Smoke": istore.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'nbc_smoke', 'options': stdOpts}),
                "Personnel Land": istore.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'personnel_land', 'options': stdOpts}),
                "Personnel Airborne": istore.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'personnel_airborne', 'options': stdOpts}),
                "Cross Country Manoeuvres": istore.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'cross_country_manoeuvres', 'options': stdOpts}),
                "Bridging": istore.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'bridging', 'options': stdOpts}),
                "Armor Gun Sighting": istore.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'armor_gun_sighting', 'options': stdOpts}),
                "Paradrop": istore.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'paradrop', 'options': stdOpts}),
                "Artillery": istore.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'artillery', 'options': stdOpts}),
                "Air Defence": istore.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'air_defence', 'options': stdOpts}),
            },
            "Forecasts": {
                "wind": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver1,vector_spacing=80,vector_offset=20'}, legendParams: {show: true}}),
                "windspeed": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windSpeed', 'options': stdOpts}),
                "winddirection": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=black_vector,vector_spacing=80,vector_offset=20'}}),
                "windbarbs": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection', 'options': stdOpts}),
                "visibility": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'visibility', 'options': stdOpts}),
                "pressure": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'seaLevelPressure', 'options': stdOpts}),
                "precip": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalPrecipitation', 'options': stdOpts}),
                "airtemp": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'airTemperature', 'options': stdOpts}),
                "cloudcover": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalCloudCover', 'options': stdOpts}),
                "waveperiod": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC_MERGED', 'parameter': 'wavePeriod', 'options': stdOpts}),
                "waveheight": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC_MERGED', 'parameter': 'waveHeight', 'options': stdOpts}),
                "seastate": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC_MERGED', 'parameter': 'seaState', 'options': stdOpts}),
                "wavedirection": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC_MERGED', 'parameter': 'waveDirection', 'options': stdOpts}),
                "current": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'currentDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver2'}, legendParams: {show: true}}),
                "currentspeed": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'currentSpeed', 'options': stdOpts}),
                "currentdirection": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'currentDirection', 'options': stdOpts}),
                "elev": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'seaLevel', 'options': stdOpts}),
                "seatemp": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'sst', 'options': stdOpts}),
                "salinity": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'sss', 'options': stdOpts})
            },
            "Celestial information": {
                "Solar Terminator": store.getSolarTerminator()
            },
            "Static layers": {
                "EEZ": store.getEEZ(),
                "Firing areas": store.getFiringAreas()
            }
        };
    } else if (domain === 'denmark') {
        zoom = 7;
        lat = 55.7;
        lon = 11.1;
        enablePrint = false;

        overlays = {
            "Short range forecasts": {
                "wind": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver1,vector_spacing=80,vector_offset=20'}, legendParams: {show: true}}),
                "windspeed": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windSpeed', 'options': stdOpts}),
                "winddirection": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=black_vector,vector_spacing=80,vector_offset=20'}}),
                "windbarbs": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection', 'options': stdOpts}),
                "visibility": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'visibility', 'options': stdOpts}),
                "pressure": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'seaLevelPressure', 'options': stdOpts}),
                "precip": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalPrecipitation', 'options': stdOpts}),
                "airtemp": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'airTemperature', 'options': stdOpts}),
                "cloudcover": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalCloudCover', 'options': stdOpts}),
                "waveperiod": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC_MERGED', 'parameter': 'wavePeriod', 'options': stdOpts}),
                "waveheight": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC_MERGED', 'parameter': 'waveHeight', 'options': stdOpts}),
                "seastate": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC_MERGED', 'parameter': 'seaState', 'options': stdOpts}),
                "wavedirection": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC_MERGED', 'parameter': 'waveDirection', 'options': stdOpts}),
                "current": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'currentDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver2'}, legendParams: {show: true}}),
                "currentspeed": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'currentSpeed', 'options': stdOpts}),
                "currentdirection": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'currentDirection', 'options': stdOpts}),
                "elev": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'seaLevel', 'options': stdOpts}),
                "seatemp": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'sst', 'options': stdOpts}),
                "salinity": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'sss', 'options': stdOpts})
            },
            "Medium range forecasts": {
                "wind": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver1,vector_spacing=80,vector_offset=20'}, legendParams: {show: true}}),
                "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windSpeed', 'options': stdOpts}),
                "winddirection": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=black_vector,vector_spacing=80,vector_offset=20'}}),
                "windbarbs": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windDirection', 'options': stdOpts}),
                "pressure": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'seaLevelPressure', 'options': stdOpts}),
                "precip": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'totalPrecipitation', 'options': stdOpts}),
                "airtemp": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'airTemperature', 'options': stdOpts}),
                "cloudcover": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'totalCloudCover', 'options': stdOpts}),
                "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'wavePeriod', 'options': stdOpts}),
                "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'waveHeight', 'options': stdOpts}),
                "seastate": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'seaState', 'options': stdOpts}),
                "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'waveDirection', 'options': stdOpts})
            },
            "Underwater forecasts": {
                "current": store.getLayer({'dataset': 'FCOO/GETM/DK_MERGED', 'parameter': 'currentDirection3D', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver2'}, legendParams: {show: true}}),
                "currentspeed": store.getLayer({'dataset': 'FCOO/GETM/DK_MERGED', 'parameter': 'currentSpeed3D', 'options': stdOpts}),
                "currentdirection": store.getLayer({'dataset': 'FCOO/GETM/DK_MERGED', 'parameter': 'currentDirection3D', 'options': stdOpts}),
                "seatemp": store.getLayer({'dataset': 'FCOO/GETM/DK_MERGED', 'parameter': 'temperature3D', 'options': stdOpts}),
                "salinity": store.getLayer({'dataset': 'FCOO/GETM/DK_MERGED', 'parameter': 'salinity3D', 'options': stdOpts})
            },
            "Measurements": {
                "Sea level": new L.GeoJSON.Sealevel()
            },
            "Safety": {
                "MSI": new L.GeoJSON.MSI({language: lang}),
                "Firing warnings": new L.GeoJSON.Fwarn({language: lang})
            },
            "Celestial information": {
                "Solar Terminator": store.getSolarTerminator()
            },
            "Static layers": {
                "EEZ": store.getEEZ(),
                "Firing areas": store.getFiringAreas()

            }
        };
    } else if (domain === 'faroe_islands_impact') {
        overlays = {
            "Medium range impacts - Own Ops": {
                "Helo": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'helo', 'options': seaOpts}),
                "RHIB": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'RHIB', 'options': seaOpts}),
                "LCP": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'LCP', 'options': seaOpts}),
                "RAS": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'RAS', 'options': seaOpts}),
                "Boarding": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'boarding', 'options': seaOpts}),
                "UAV": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'UAV', 'options': seaOpts}),
                "Generic1": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'generic', 'options': seaOpts}),
                "Generic2": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'generic', 'options': seaOpts})
            },
            "Medium range impacts - Adversary Ops": {
                "Skiff": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'skiff', 'options': seaOpts}),
                "Dhow": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'dhow', 'options': seaOpts}),
                "Fishing:120GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'fishingboat_120', 'options': seaOpts}),
                "Fishing:500GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'fishingboat_500', 'options': seaOpts}),
                "Fishing:1000GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'fishingboat_1000', 'options': seaOpts}),
                "Fishing:2000GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'fishingboat_2000', 'options': seaOpts}),
                "Generic1": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'generic', 'options': stdOpts}),
                "Generic2": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'generic', 'options': stdOpts})
            },
            "Medium range forecasts": {
                "wind": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver1,vector_spacing=80,vector_offset=20'}, legendParams: {show: true}}),
                "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windSpeed', 'options': stdOpts}),
                "winddirection": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=black_vector,vector_spacing=80,vector_offset=20'}}),
                "windbarbs": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windDirection', 'options': stdOpts}),
                "pressure": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'seaLevelPressure', 'options': stdOpts}),
                "precip": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'totalPrecipitation', 'options': stdOpts}),
                "airtemp": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'airTemperature', 'options': stdOpts}),
                "cloudcover": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'totalCloudCover', 'options': stdOpts}),
                "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'wavePeriod', 'options': stdOpts}),
                "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'waveHeight', 'options': stdOpts}),
                "seastate": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'seaState', 'options': stdOpts}),
                "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'waveDirection', 'options': stdOpts}),
                "current": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'currentDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver2'}, legendParams: {show: true}}),
                "currentspeed": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'currentSpeed', 'options': stdOpts}),
                "currentdirection": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'currentDirection', 'options': stdOpts}),
                "seatemp": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'sst', 'options': stdOpts}),
                "salinity": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'sss', 'options': stdOpts})
            }, 
            "Celestial information": {
                "Solar Terminator": store.getSolarTerminator()
            },
            "Static layers": {
                "EEZ": store.getEEZ(),
            }
        };
        langs = ['da', 'en'];
        zoom = 7;
        lat = 61.5;
        lon = -6.0;
    } else if (domain === 'faroe_islands') {
        overlays = {
            "Short range forecasts": {
                "wind": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver1,vector_spacing=80,vector_offset=20'}, legendParams: {show: true}}),
                "windspeed": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windSpeed', 'options': stdOpts}),
                "winddirection": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=black_vector,vector_spacing=80,vector_offset=20'}}),
                "windbarbs": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection', 'options': stdOpts}),
                "visibility": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'visibility', 'options': stdOpts}),
                "pressure": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'seaLevelPressure', 'options': stdOpts}),
                "precip": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalPrecipitation', 'options': stdOpts}),
                "airtemp": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'airTemperature', 'options': stdOpts}),
                "cloudcover": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalCloudCover', 'options': stdOpts}),
                "waveperiod": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'wavePeriod', 'options': stdOpts}),
                "waveheight": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'waveHeight', 'options': stdOpts}),
                "seastate": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'seaState', 'options': stdOpts}),
                "wavedirection": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'waveDirection', 'options': stdOpts})
            },
            "Medium range forecasts": {
                "wind": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver1,vector_spacing=80,vector_offset=20'}, legendParams: {show: true}}),
                "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windSpeed', 'options': stdOpts}),
                "winddirection": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=black_vector,vector_spacing=80,vector_offset=20'}}),
                "windbarbs": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windDirection', 'options': stdOpts}),
                "pressure": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'seaLevelPressure', 'options': stdOpts}),
                "precip": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'totalPrecipitation', 'options': stdOpts}),
                "airtemp": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'airTemperature', 'options': stdOpts}),
                "cloudcover": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'totalCloudCover', 'options': stdOpts}),
                "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'wavePeriod', 'options': stdOpts}),
                "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'waveHeight', 'options': stdOpts}),
                "seastate": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'seaState', 'options': stdOpts}),
                "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'waveDirection', 'options': stdOpts}),
                "current": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'currentDirection', wmsParams: {styles: 'vector_method=color_quiver2'}, legendParams: {show: true}}),
                "currentspeed": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'currentSpeed', 'options': stdOpts}),
                "currentdirection": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'currentDirection', 'options': stdOpts}),
                "seatemp": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'sst', 'options': stdOpts}),
                "salinity": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'sss', 'options': stdOpts})
            }, 
            "Celestial information": {
                "Solar Terminator": store.getSolarTerminator()
            },
            "Static layers": {
                "EEZ": store.getEEZ(),
            }
        };
        langs = ['da', 'fo', 'en'];
        zoom = 7;
        lat = 61.5;
        lon = -6.0;
    } else if (domain === 'greenland_impact') {
        overlays = {
            "Short range impacts - Own Ops": {
                "Helo": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'helo', 'options': seaOpts}),
                "RHIB": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'RHIB', 'options': seaOpts}),
                "LCP": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'LCP', 'options': seaOpts}),
                "RAS": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'RAS', 'options': seaOpts}),
                "Boarding": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'boarding', 'options': seaOpts}),
                "UAV": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'UAV', 'options': seaOpts}),
                "Generic1": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'generic', 'options': seaOpts}),
                "Generic2": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'generic', 'options': seaOpts})
            },
            "Short range impacts - Adversary Ops": {
                "Skiff": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'skiff', 'options': seaOpts}),
                "Dhow": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'dhow', 'options': seaOpts}),
                "Fishing:120GT": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'fishingboat_120', 'options': seaOpts}),
                "Fishing:500GT": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'fishingboat_500', 'options': seaOpts}),
                "Fishing:1000GT": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'fishingboat_1000', 'options': seaOpts}),
                "Fishing:2000GT": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'fishingboat_2000', 'options': seaOpts}),
                "Generic1": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'generic', 'options': stdOpts}),
                "Generic2": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'generic', 'options': stdOpts})
            },
            "Short range forecasts": {
                "wind": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver1,vector_spacing=80,vector_offset=20'}, legendParams: {show: true}}),
                "windspeed": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'windSpeed', 'options': stdOpts}),
                "winddirection": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=black_vector,vector_spacing=80,vector_offset=20'}}),
                "windbarbs": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'windDirection', 'options': stdOpts}),
                "visibility": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'visibility', 'options': stdOpts}),
                "pressure": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'seaLevelPressure', 'options': stdOpts}),
                "precip": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'totalPrecipitation', 'options': stdOpts}),
                "airtemp": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'airTemperature', 'options': stdOpts}),
                "cloudcover": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'totalCloudCover', 'options': stdOpts}),
                "iceconcentration": store.getLayer({'dataset': 'DMI/ICECHART/GREENLAND', 'parameter': 'iceConcentration', 'options': stdOpts}),
                "waveperiod": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'wavePeriod', 'options': stdOpts}),
                "waveheight": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'waveHeight', 'options': stdOpts}),
                "seastate": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'seaState', 'options': stdOpts}),
                "wavedirection": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'waveDirection', 'options': stdOpts})
            },
            "Medium range impacts - Own Ops": {
                "Helo": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'helo', 'options': seaOpts}),
                "RHIB": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'RHIB', 'options': seaOpts}),
                "LCP": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'LCP', 'options': seaOpts}),
                "RAS": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'RAS', 'options': seaOpts}),
                "Boarding": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'boarding', 'options': seaOpts}),
                "UAV": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'UAV', 'options': seaOpts}),
                "Generic1": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'generic', 'options': seaOpts}),
                "Generic2": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'generic', 'options': seaOpts})
            },
            "Medium range impacts - Adversary Ops": {
                "Skiff": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'skiff', 'options': seaOpts}),
                "Dhow": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'dhow', 'options': seaOpts}),
                "Fishing:120GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'fishingboat_120', 'options': seaOpts}),
                "Fishing:500GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'fishingboat_500', 'options': seaOpts}),
                "Fishing:1000GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'fishingboat_1000', 'options': seaOpts}),
                "Fishing:2000GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'fishingboat_2000', 'options': seaOpts}),
                "Generic1": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'generic', 'options': stdOpts}),
                "Generic2": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'generic', 'options': stdOpts})
            },
            "Medium range forecasts": {
                "wind": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver1,vector_spacing=80,vector_offset=20'}, legendParams: {show: true}}),
                "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windSpeed', 'options': stdOpts}),
                "winddirection": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=black_vector,vector_spacing=80,vector_offset=20'}}),
                "windbarbs": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windDirection', 'options': stdOpts}),
                "pressure": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'seaLevelPressure', 'options': stdOpts}),
                "precip": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'totalPrecipitation', 'options': stdOpts}),
                "airtemp": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'airTemperature', 'options': stdOpts}),
                "cloudcover": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'totalCloudCover', 'options': stdOpts}),
                "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'wavePeriod', 'options': stdOpts}),
                "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'waveHeight', 'options': stdOpts}),
                "seastate": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'seaState', 'options': stdOpts}),
                "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'waveDirection', 'options': stdOpts}),
                "current": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'currentDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver2'}, legendParams: {show: true}}),
                "currentspeed": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'currentSpeed', 'options': stdOpts}),
                "currentdirection": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'currentDirection', 'options': stdOpts}),
                "seatemp": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'sst', 'options': stdOpts}),
                "salinity": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'sss', 'options': stdOpts})
            }, 
            "Point forecasts": {
                "Tidal predictions": new L.GeoJSON.Tides({'language': lang})
            },
            "Celestial information": {
                "Solar Terminator": store.getSolarTerminator()
            },
            "Static layers": {
                "EEZ": store.getEEZ(),
                "SAR": store.getSAR()
            }
        };
        zoom = 6;
        lat = 62.0;
        lon = -45.0;
    } else if (domain === 'greenland') {
        zoom = 6;
        lat = 62.0;
        lon = -45.0;
        overlays = {
            "Short range forecasts": {
                "wind": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver1,vector_spacing=80,vector_offset=20'}, legendParams: {show: true}}),
                "windspeed": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'windSpeed', 'options': stdOpts}),
                "winddirection": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=black_vector,vector_spacing=80,vector_offset=20'}}),
                "windbarbs": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'windDirection', 'options': stdOpts}),
                "visibility": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'visibility', 'options': stdOpts}),
                "pressure": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'seaLevelPressure', 'options': stdOpts}),
                "precip": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'totalPrecipitation', 'options': stdOpts}),
                "airtemp": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'airTemperature', 'options': stdOpts}),
                "cloudcover": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'totalCloudCover', 'options': stdOpts}),
                "iceconcentration": store.getLayer({'dataset': 'DMI/ICECHART/GREENLAND', 'parameter': 'iceConcentration', 'options': stdOpts}),
                "waveperiod": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'wavePeriod', 'options': stdOpts}),
                "waveheight": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'waveHeight', 'options': stdOpts}),
                "seastate": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'seaState', 'options': stdOpts}),
                "wavedirection": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'waveDirection', 'options': stdOpts})
            },
            "Medium range forecasts": {
                "wind": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver1,vector_spacing=80,vector_offset=20'}, legendParams: {show: true}}),
                "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windSpeed', 'options': stdOpts}),
                "winddirection": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=black_vector,vector_spacing=80,vector_offset=20'}}),
                "windbarbs": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windDirection', 'options': stdOpts}),
                "pressure": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'seaLevelPressure', 'options': stdOpts}),
                "precip": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'totalPrecipitation', 'options': stdOpts}),
                "airtemp": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'airTemperature', 'options': stdOpts}),
                "cloudcover": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'totalCloudCover', 'options': stdOpts}),
                "iceconcentration": store.getLayer({'dataset': 'STENNIS/ACNFS_ICE/GREENLAND', 'parameter': 'iceConcentration', 'options': stdOpts}),
                "icethickness": store.getLayer({'dataset': 'STENNIS/ACNFS_ICE/GREENLAND', 'parameter': 'iceThickness', 'options': stdOpts}),
                //"icespeed": store.getLayer({'dataset': 'STENNIS/ACNFS_ICE/GREENLAND', 'parameter': 'iceSpeed', 'options': stdOpts}),
                //"icedirection": store.getLayer({'dataset': 'STENNIS/ACNFS_ICE/GREENLAND', 'parameter': 'iceDirection', 'options': stdOpts}),
                "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'wavePeriod', 'options': stdOpts}),
                "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'waveHeight', 'options': stdOpts}),
                "seastate": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'seaState', 'options': stdOpts}),
                "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'waveDirection', 'options': stdOpts}),
                "current": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'currentDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver2'}, legendParams: {show: true}}),
                "currentspeed": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'currentSpeed', 'options': stdOpts}),
                "currentdirection": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'currentDirection', 'options': stdOpts}),
                "seatemp": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'sst', 'options': stdOpts}),
                "salinity": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'sss', 'options': stdOpts})
            }, 
            "Point forecasts": {
                "Tidal predictions": new L.GeoJSON.Tides({'language': lang})
            },
            "Celestial information": {
                "Solar Terminator": store.getSolarTerminator()
            },
            "Static layers": {
                "EEZ": store.getEEZ(),
                "SAR": store.getSAR()
            }
        };
    } else if (domain === 'indian_ocean') {
        overlays = {
            "Forecasts": {
                "wind": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver1,vector_spacing=80,vector_offset=20'}, legendParams: {show: true}}),
                "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'windSpeed', 'options': stdOpts}),
                "winddirection": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=black_vector,vector_spacing=80,vector_offset=20'}}),
                "windbarbs": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'windDirection', 'options': stdOpts}),
                "pressure": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'seaLevelPressure', 'options': stdOpts}),
                "precip": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'totalPrecipitation', 'options': stdOpts}),
                "airtemp": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'airTemperature', 'options': stdOpts}),
                "cloudcover": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'totalCloudCover', 'options': stdOpts}),
                "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'wavePeriod', 'options': stdOpts}),
                "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'waveHeight', 'options': stdOpts}),
                "seastate": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'seaState', 'options': stdOpts}),
                "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'waveDirection', 'options': stdOpts}),
                "current": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'currentDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver2'}, legendParams: {show: true}}),
                "currentspeed": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'currentSpeed', 'options': stdOpts}),
                "currentdirection": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'currentDirection', 'options': stdOpts}),
                "seatemp": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'sst', 'options': stdOpts}),
                "salinity": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'sss', 'options': stdOpts})
            }, 
            "Celestial information": {
                "Solar Terminator": store.getSolarTerminator()
            },
            "Static layers": {
                "EEZ": store.getEEZ()
            }
        };
        zoom = 5;
        lat = 0.0;
        lon = 56.0;
    } else if (domain === 'indian_ocean_impact') {
        overlays = {
            "Impacts - Own Ops": {
                "Helo": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'helo', 'options': seaOpts}),
                "RHIB": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'RHIB', 'options': seaOpts}),
                "LCP": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'LCP', 'options': seaOpts}),
                "RAS": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'RAS', 'options': seaOpts}),
                "Boarding": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'boarding', 'options': seaOpts}),
                "UAV": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'UAV', 'options': seaOpts}),
                "Generic1": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'generic', 'options': seaOpts}),
                "Generic2": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'generic', 'options': seaOpts})
            },
            "Impacts - Adversary Ops": {
                "Skiff": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'skiff', 'options': seaOpts}),
                "Dhow": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'dhow', 'options': seaOpts}),
                "Fishing:120GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'fishingboat_120', 'options': seaOpts}),
                "Fishing:500GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'fishingboat_500', 'options': seaOpts}),
                "Fishing:1000GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'fishingboat_1000', 'options': seaOpts}),
                "Fishing:2000GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'fishingboat_2000', 'options': seaOpts}),
                "Generic1": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'generic', 'options': stdOpts}),
                "Generic2": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'generic', 'options': stdOpts})
            },
            "Forecasts": {
                "wind": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver1,vector_spacing=80,vector_offset=20'}, legendParams: {show: true}}),
                "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'windSpeed', 'options': stdOpts}),
                "winddirection": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=black_vector,vector_spacing=80,vector_offset=20'}}),
                "windbarbs": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'windDirection', 'options': stdOpts}),
                "pressure": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'seaLevelPressure', 'options': stdOpts}),
                "precip": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'totalPrecipitation', 'options': stdOpts}),
                "airtemp": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'airTemperature', 'options': stdOpts}),
                "cloudcover": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'totalCloudCover', 'options': stdOpts}),
                "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'wavePeriod', 'options': stdOpts}),
                "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'waveHeight', 'options': stdOpts}),
                "seastate": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'seaState', 'options': stdOpts}),
                "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'waveDirection', 'options': stdOpts}),
                "current": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'currentDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver2'}, legendParams: {show: true}}),
                "currentspeed": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'currentSpeed', 'options': stdOpts}),
                "currentdirection": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'currentDirection', 'options': stdOpts}),
                "seatemp": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'sst', 'options': stdOpts}),
                "salinity": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'sss', 'options': stdOpts})
            }, 
            "Celestial information": {
                "Solar Terminator": store.getSolarTerminator()
            },
            "Static layers": {
                "EEZ": store.getEEZ()
            }
        };
        zoom = 5;
        lat = 0.0;
        lon = 56.0;
    } else if (domain === 'mediterranean') {
        overlays = {
            "Forecasts": {
                "wind": store.getLayer({'dataset': 'ECMWF/DXD/MEDITERRANEAN', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver1,vector_spacing=80,vector_offset=20'}, legendParams: {show: true}}),
                "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/MEDITERRANEAN', 'parameter': 'windSpeed', 'options': stdOpts}),
                "winddirection": store.getLayer({'dataset': 'ECMWF/DXD/MEDITERRANEAN', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=black_vector,vector_spacing=80,vector_offset=20'}}),
                "windbarbs": store.getLayer({'dataset': 'ECMWF/DXD/MEDITERRANEAN', 'parameter': 'windDirection', 'options': stdOpts}),
                "pressure": store.getLayer({'dataset': 'ECMWF/DXD/MEDITERRANEAN', 'parameter': 'seaLevelPressure', 'options': stdOpts}),
                "precip": store.getLayer({'dataset': 'ECMWF/DXD/MEDITERRANEAN', 'parameter': 'totalPrecipitation', 'options': stdOpts}),
                "airtemp": store.getLayer({'dataset': 'ECMWF/DXD/MEDITERRANEAN', 'parameter': 'airTemperature', 'options': stdOpts}),
                "cloudcover": store.getLayer({'dataset': 'ECMWF/DXD/MEDITERRANEAN', 'parameter': 'totalCloudCover', 'options': stdOpts}),
                "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/MEDITERRANEAN', 'parameter': 'wavePeriod', 'options': stdOpts}),
                "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/MEDITERRANEAN', 'parameter': 'waveHeight', 'options': stdOpts}),
                "seastate": store.getLayer({'dataset': 'ECMWF/DXP/MEDITERRANEAN', 'parameter': 'seaState', 'options': stdOpts}),
                "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/MEDITERRANEAN', 'parameter': 'waveDirection', 'options': stdOpts}),
                "current": store.getLayer({'dataset': 'NOAA/HYCOM/MEDITERRANEAN', 'parameter': 'currentDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver2'}, legendParams: {show: true}}),
                "currentspeed": store.getLayer({'dataset': 'NOAA/HYCOM/MEDITERRANEAN', 'parameter': 'currentSpeed', 'options': stdOpts}),
                "currentdirection": store.getLayer({'dataset': 'NOAA/HYCOM/MEDITERRANEAN', 'parameter': 'currentDirection', 'options': stdOpts}),
                "seatemp": store.getLayer({'dataset': 'NOAA/HYCOM/MEDITERRANEAN', 'parameter': 'sst', 'options': stdOpts}),
                "salinity": store.getLayer({'dataset': 'NOAA/HYCOM/MEDITERRANEAN', 'parameter': 'sss', 'options': stdOpts})
            }, 
            "Celestial information": {
                "Solar Terminator": store.getSolarTerminator()
            },
            "Static layers": {
                "EEZ": store.getEEZ(),
            }
        };
        zoom = 5;
        lat = 36.8;
        lon = 20.4;
    } else if (domain === 'denmark_impact_sync') {
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
                "Solar Terminator": store.getSolarTerminator()
            },
            "Static layers": {
                "EEZ": store.getEEZ(),
                "Firing areas": store.getFiringAreas()
            }
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
                "Solar Terminator": store.getSolarTerminator()
            },
            "Static layers": {
                "EEZ": store.getEEZ(),
                "Firing areas": store.getFiringAreas()
            }
        };
    } else {
        throw new Error('Valid domain not specified: ' + domain);
    }

    // Construct maps
    maps = {
        map: {
            overlays: overlays
        }
    };

    // Hardcoded for impact sync test
    if (domain === 'denmark_impact_sync') {
        urlParams.multimaps = '2x1';
    }

    // Make multiple viewports if requested
    var multimaps = [];
    if (urlParams.multimaps !== undefined) {
        multimaps = urlParams.multimaps.split('x');
        var nx = parseInt(multimaps[0]);
        var ny = parseInt(multimaps[1]);
        var ntot = nx*ny;

        var dx = 100.0 / nx - 1.0;
        var dy = 100.0 / ny - 1.0;
        var mapobj = $('#map');
        var newmaps = {};
        var submapIDs = [];
        for (var i=0; i<ntot; i++) { 
            submapIDs[i] = 'map' + (i+1);
        }
        $.each(submapIDs, function(index, submapID) {
            var submap = $('<div/>');
            submap.addClass('map-container');
            submap.attr('id', submapID);
            submap.width(dx + '%');
            submap.height(dy + '%');
            mapobj.append(submap);
            newmaps[submapID] = maps.map;
        });
        maps = newmaps;
    }
     
    // Hardcoded for impact sync test
    if (domain === 'denmark_impact_sync') {
        // Construct maps
        maps = {
            map1: {
                overlays: overlays1
            },
            map2: {
                overlays: overlays2
            }
        };
    }

    // Retrieve overlay metainformation
    proxy.doAjax();

    // Init map
    var mapStore = initCommonMap(store, langs, maps, enablePrint);
    //console.profileEnd();

    $(document).ready(function () {
        //console.profile('ready');
        createCommonMap(store, basemap, maps, minZoom, maxZoom, zoom, 
                      lat, lon, enablePrint, useGeoMetoc, mapStore);
        //console.profileEnd();
    });

})();

/**
 * A JavaScript library for using Danish Defence Center for Operational Oceanography's (FCOO)
 * METOC forecast layers leaflet based maps without hassle.
 *
 * This file contains abstractions for accessing DMI HIRLAM K05.
 */

(function () {
	L.FLayer.Dmi.visibility = function (options) {
                options = L.extend(options, {attribution: 'Visibility forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'});
                return new L.FLayer.Dmi._visibility('DMI/HIRLAM/MAPS_DMI_K05_v005C.nc', options);
	};
	L.FLayer.Dmi._visibility = function (dataset, options) {
                var extraoptions = {layers: 'VIS', cmap: 'AirVisibility_km_RYG_11colors'}
                options = L.extend(options, extraoptions);
		var layer = new L.FLayer(dataset, options);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a> / HIRLAM / K05';
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=VIS&STYLES=horizontal,nolabel&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=AirVisibility_km_RYG_11colors';
		}
		return layer;
	};

	L.FLayer.Dmi.windSpeed = function (options) {
                options = L.extend(options, {attribution: 'Wind forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'});
                var layer1 = new L.FLayer.Dmi._windSpeed('DMI/HIRLAM/MAPS_DMI_K05_v005C.nc', options);
                return new L.FLayerGroup([layer1]);
	};
	L.FLayer.Dmi._windSpeed = function (dataset, options) {
                var windoptions = {layers: 'windspeed', cmap: 'Wind_ms_YRP_11colors'}
                options = L.extend(options, windoptions);
		var layer = new L.FLayer(dataset, options);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a> / HIRLAM / K05';
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=windspeed&STYLES=horizontal,nolabel&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=Wind_ms_YRP_11colors';
		}
		return layer;
	};

	L.FLayer.Dmi.windDirection = function (options) {
                options = L.extend(options, {attribution: 'Wind forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'});
                var layer1 = new L.FLayer.Dmi._windDirection('DMI/HIRLAM/MAPS_DMI_K05_v005C.nc', options);
                return new L.FLayerGroup([layer1]);
	};
	L.FLayer.Dmi._windDirection = function (dataset, options) {
                var windoptions = {layers: 'UGRD:VGRD', styles: 'black_arrowbarbs'}
                options = L.extend(options, windoptions);
		var layer = new L.FLayer(dataset, options);
		return layer;
	};

	L.FLayer.Dmi.humidity = function (options) {
                options = L.extend(options, {attribution: 'Humidity forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'});
                var layer1 = new L.FLayer.Dmi._humidity('DMI/HIRLAM/MAPS_DMI_K05_v005C.nc', options);
                return new L.FLayerGroup([layer1]);
	};
	L.FLayer.Dmi._humidity = function (dataset, options) {
                var extraoptions = {layers: 'SPFH', cmap: 'Humidity_kg_kg_WYR_7colors'}
                options = L.extend(options, extraoptions);
		var layer = new L.FLayer(dataset, options);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a> / HIRLAM / K05';
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=SPFH&STYLES=horizontal,nolabel&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=Humidity_kg_kg_WYR_7colors';
		}
		return layer;
	};

	L.FLayer.Dmi.airTemperature = function (options) {
                options = L.extend(options, {attribution: 'Temperature forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'});
                var layer1 = new L.FLayer.Dmi._airTemperature('DMI/HIRLAM/MAPS_DMI_K05_v005C.nc', options);
                return new L.FLayerGroup([layer1]);
	};
	L.FLayer.Dmi._airTemperature = function (dataset, options) {
                var extraoptions = {layers: 'TMP', cmap: 'AirTempCold_C_BGYR_19colors'};
                options = L.extend(options, extraoptions);
		var layer = new L.FLayer(dataset, options);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a> / HIRLAM / K05';
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=TMP&STYLES=horizontal,nolabel&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=AirTempCold_C_BGYR_19colors';
		}
		return layer;
	};

	L.FLayer.Dmi.seaLevelPressure = function (options) {
                options = L.extend(options, {attribution: 'Air pressure forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'});
                var layer1 = new L.FLayer.Dmi._seaLevelPressure('DMI/HIRLAM/MAPS_DMI_K05_v005C.nc', options);
                return new L.FLayerGroup([layer1]);
	};
	L.FLayer.Dmi._seaLevelPressure = function (dataset, options) {
                var extraoptions = {layers: 'PRES', 
                                    cmap: 'SeaLevelPressure_hPa_BGYR_13colors',
                                    styles: 'contour'}
                options = L.extend(options, extraoptions);
		var layer = new L.FLayer(dataset, options);
		//if (layer.options.legendImagePath == null) {
                        //layer.options.legendAttribution = 'Source: <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a> / HIRLAM / K05';
			//layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=PRES&STYLES=horizontal,nolabel&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=SeaLevelPressure_hPa_BGYR_13colors';
		//}
		return layer;
	};

	L.FLayer.Dmi.totalCloudCover = function (options) {
                options = L.extend(options, {attribution: 'Cloud cover forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'});
                var layer1 = new L.FLayer.Dmi._totalCloudCover('DMI/HIRLAM/MAPS_DMI_K05_v005C.nc', options);
                return new L.FLayerGroup([layer1]);
	};
	L.FLayer.Dmi._totalCloudCover = function (dataset, options) {
                var extraoptions = {layers: 'TCDC', cmap: 'CloudCover_km_WGB_10colors'}
                options = L.extend(options, extraoptions);
		var layer = new L.FLayer(dataset, options);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a> / HIRLAM / K05';
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=TCDC&STYLES=horizontal,nolabel&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=CloudCover_km_WGB_10colors';
		}
		return layer;
	};

        L.FLayer.Dmi.totalPrecipitation = function (options) {
                options = L.extend(options, {attribution: 'Precipitation forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'});
                return new L.FLayer.Dmi._totalPrecipitation('DMI/HIRLAM/MAPS_DMI_K05_v005C.nc', options);
        };
        L.FLayer.Dmi._totalPrecipitation = function (dataset, options) {
                var extraoptions = {layers: 'precip', cmap: 'Precip_mm_per_h_YRP_11colors'}
                options = L.extend(options, extraoptions);
                var layer = new L.FLayer(dataset, options);
                if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a> / HIRLAM / K05';
                        layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=precip&STYLES=horizontal,nolabel&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=Precip_mm_per_h_YRP_11colors';
                }
                return layer;
        };

}());

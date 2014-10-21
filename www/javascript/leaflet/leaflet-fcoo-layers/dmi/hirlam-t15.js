/**
 * A JavaScript library for using Danish Defence Center for Operational Oceanography's (FCOO)
 * METOC forecast layers leaflet based maps without hassle.
 *
 * This file contains abstractions for accessing DMI HIRLAM T15.
 */

(function () {
	L.FLayer.Dmi.windSpeed = function (options) {
                options = L.extend(options, {attribution: 'Wind forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'});
                var layer1 = new L.FLayer.Dmi._windSpeed('DMI/HIRLAM/GETM_DMI_HIRLAM_T15_v004C.nc', options);
                return new L.FLayerGroup([layer1]);
	};
	L.FLayer.Dmi._windSpeed = function (dataset, options) {
                var windoptions = {layers: 'u10_v10', cmap: 'Wind_ms_YRP_11colors'}
                options = L.extend(options, windoptions);
		var layer = new L.FLayer(dataset, options);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a> / HIRLAM / T15';
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=u10_v10&STYLES=horizontal&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=Wind_ms_YRP_11colors';
		}
		return layer;
	};

	L.FLayer.Dmi.windDirection = function (options) {
                options = L.extend(options, {attribution: 'Wind forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'});
                var layer1 = new L.FLayer.Dmi._windDirection('DMI/HIRLAM/GETM_DMI_HIRLAM_T15_v004C.nc', options);
                return new L.FLayerGroup([layer1]);
	};
	L.FLayer.Dmi._windDirection = function (dataset, options) {
                var windoptions = {layers: 'u10:v10', styles: 'black_arrowbarbs'}
                options = L.extend(options, windoptions);
		var layer = new L.FLayer(dataset, options);
		return layer;
	};

	L.FLayer.Dmi.humidity = function (options) {
                options = L.extend(options, {attribution: 'Humidity forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'});
                var layer1 = new L.FLayer.Dmi._humidity('DMI/HIRLAM/GETM_DMI_HIRLAM_T15_v004C.nc', options);
                return new L.FLayerGroup([layer1]);
	};
	L.FLayer.Dmi._humidity = function (dataset, options) {
                var extraoptions = {layers: 'sh', cmap: 'Humidity_kg_kg_WYR_7colors'}
                options = L.extend(options, extraoptions);
		var layer = new L.FLayer(dataset, options);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a> / HIRLAM / T15';
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=sh&STYLES=horizontal&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=Humidity_kg_kg_WYR_7colors';
		}
		return layer;
	};

	L.FLayer.Dmi.airTemperature = function (options) {
                options = L.extend(options, {attribution: 'Temperature forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'});
                var layer1 = new L.FLayer.Dmi._airTemperature('DMI/HIRLAM/GETM_DMI_HIRLAM_T15_v004C.nc', options);
                return new L.FLayerGroup([layer1]);
	};
	L.FLayer.Dmi._airTemperature = function (dataset, options) {
                var extraoptions = {layers: 't2', cmap: 'AirTemp_C_BGYR_19colors'}
                options = L.extend(options, extraoptions);
		var layer = new L.FLayer(dataset, options);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a> / HIRLAM / T15';
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=t2&STYLES=horizontal&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=AirTemp_C_BGYR_19colors';
		}
		return layer;
	};

	L.FLayer.Dmi.seaLevelPressure = function (options) {
                options = L.extend(options, {attribution: 'Air pressure forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'});
                var layer1 = new L.FLayer.Dmi._seaLevelPressure('DMI/HIRLAM/GETM_DMI_HIRLAM_T15_v004C.nc', options);
                return new L.FLayerGroup([layer1]);
	};
	L.FLayer.Dmi._seaLevelPressure = function (dataset, options) {
                var extraoptions = {layers: 'slp', cmap: 'SeaLevelPressure_hPa_BGYR_13colors', styles: 'contour'}
                options = L.extend(options, extraoptions);
		var layer = new L.FLayer(dataset, options);
//		if (layer.options.legendImagePath == null) {
//                        layer.options.legendAttribution = 'Source: <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a> / HIRLAM / T15';
//			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=slp&STYLES=horizontal&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=SeaLevelPressure_hPa_BGYR_13colors';
//		}
		return layer;
	};

	L.FLayer.Dmi.totalCloudCover = function (options) {
                options = L.extend(options, {attribution: 'Cloud cover forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'});
                var layer1 = new L.FLayer.Dmi._totalCloudCover('DMI/HIRLAM/GETM_DMI_HIRLAM_T15_v004C.nc', options);
                return new L.FLayerGroup([layer1]);
	};
	L.FLayer.Dmi._totalCloudCover = function (dataset, options) {
                var extraoptions = {layers: 'tcc', cmap: 'CloudCover_km_WGB_10colors'}
                options = L.extend(options, extraoptions);
		var layer = new L.FLayer(dataset, options);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a> / HIRLAM / T15';
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=tcc&STYLES=horizontal&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=CloudCover_km_WGB_10colors';
		}
		return layer;
	};
}());

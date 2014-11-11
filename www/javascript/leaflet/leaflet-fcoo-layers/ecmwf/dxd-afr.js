/**
 * A JavaScript library for using Danish Defence Center for Operational Oceanography's (FCOO)
 * METOC forecast layers leaflet based maps without hassle.
 *
 * This file contains abstractions for accessing ECMWF IFS forecast fields.
 */

(function () {
	L.FLayer.Ecmwf.windSpeed = function (options) {
                options = L.extend(options, {attribution: 'Wind forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'});
                return new L.FLayer.Ecmwf._windSpeed('ECMWF/DXD/ECMWF_DXD_AFR.nc', options);
	};
	L.FLayer.Ecmwf._windSpeed = function (dataset, options) {
                var windoptions = {layers: 'U10M_V10M', cmap: 'Wind_ms_YRP_11colors'}
                options = L.extend(options, windoptions);
		var layer = new L.FLayer(dataset, options);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a> / IFS';
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=U10M_V10M&STYLES=horizontal&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=Wind_ms_YRP_11colors';
		}
		return layer;
	};

	L.FLayer.Ecmwf.windDirection = function (options) {
                options = L.extend(options, {attribution: 'Wind forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'});
                return new L.FLayer.Ecmwf._windDirection('ECMWF/DXD/ECMWF_DXD_AFR.nc', options);
	};
	L.FLayer.Ecmwf._windDirection = function (dataset, options) {
                var windoptions = {layers: 'U10M:V10M', styles: 'black_arrowbarbs'}
                options = L.extend(options, windoptions);
		var layer = new L.FLayer(dataset, options);
		return layer;
	};

	L.FLayer.Ecmwf.airTemperature = function (options) {
                options = L.extend(options, {attribution: 'Temperature forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'});
                return new L.FLayer.Ecmwf._airTemperature('ECMWF/DXD/ECMWF_DXD_AFR.nc', options);
	};
	L.FLayer.Ecmwf._airTemperature = function (dataset, options) {
                var extraoptions = {layers: 'T2M', cmap: 'AirTempCold_C_BGYR_19colors'};
                options = L.extend(options, extraoptions);
		var layer = new L.FLayer(dataset, options);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a> / IFS';
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=T2M&STYLES=horizontal&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=AirTempCold_C_BGYR_19colors';
		}
		return layer;
	};

	L.FLayer.Ecmwf.seaLevelPressure = function (options) {
                options = L.extend(options, {attribution: 'Air pressure forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'});
                return new L.FLayer.Ecmwf._seaLevelPressure('ECMWF/DXD/ECMWF_DXD_AFR.nc', options);
	};
	L.FLayer.Ecmwf._seaLevelPressure = function (dataset, options) {
                var extraoptions = {layers: 'MSL', 
                                    cmap: 'SeaLevelPressure_hPa_BGYR_13colors',
                                    styles: 'contour'}
                options = L.extend(options, extraoptions);
		var layer = new L.FLayer(dataset, options);
		return layer;
	};

	L.FLayer.Ecmwf.totalCloudCover = function (options) {
                options = L.extend(options, {attribution: 'Cloud cover forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'});
                return new L.FLayer.Ecmwf._totalCloudCover('ECMWF/DXD/ECMWF_DXD_AFR.nc', options);
	};
	L.FLayer.Ecmwf._totalCloudCover = function (dataset, options) {
                var extraoptions = {layers: 'TCC', cmap: 'CloudCover_km_WGB_10colors'}
                options = L.extend(options, extraoptions);
		var layer = new L.FLayer(dataset, options);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a> / IFS';
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=TCC&STYLES=horizontal&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=CloudCover_km_WGB_10colors';
		}
		return layer;
	};
}());


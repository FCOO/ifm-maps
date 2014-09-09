/**
 * A JavaScript library for using Danish Defence Center for Operational Oceanography's (FCOO)
 * METOC forecast layers leaflet based maps without hassle.
 *
 * This file contains abstractions for accessing ECMWF DXD global forecast fields.
 */

(function () {
	L.FLayer.windSpeed = function (options) {
                options = L.extend(options, {attribution: 'Wind forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'});
                return new L.FLayer._windSpeed('ECMWF/DXD/ECMWF_DXD_GLOBAL.nc', options);
	};
	L.FLayer._windSpeed = function (dataset, options) {
                var windoptions = {layers: 'U10M_V10M', cmap: 'Wind_ms_WBGYR_10colors'}
                options = L.extend(options, windoptions);
		var layer = new L.FLayer(dataset, options);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a> / IFS';
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=U10M_V10M&STYLES=horizontal&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=Wind_ms_WBGYR_10colors';
		}
		return layer;
	};

	L.FLayer.windDirection = function (options) {
                options = L.extend(options, {attribution: 'Wind forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'});
                return new L.FLayer._windDirection('ECMWF/DXD/ECMWF_DXD_GLOBAL.nc', options);
	};
	L.FLayer._windDirection = function (dataset, options) {
                var windoptions = {layers: 'U10M:V10M', styles: 'black_barbs'}
                options = L.extend(options, windoptions);
		var layer = new L.FLayer(dataset, options);
		return layer;
	};

}());

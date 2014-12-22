/**
 * A JavaScript library for using Danish Defence Center for Operational Oceanography's (FCOO)
 * METOC forecast layers leaflet based maps without hassle.
 *
 * This file contains abstractions for accessing ECMWF DXD global forecast fields.
 */

(function () {
	L.FLayer.Ecmwf.windSpeed = function (options) {
                options = L.extend(options, {attribution: 'Wind forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'});
                return new L.FLayer.Ecmwf._windSpeed('ECMWF/DXD/MAPS_ECMWF_DXD_GLOBAL.nc', options);
	};
	L.FLayer.Ecmwf._windSpeed = function (dataset, options) {
                var windoptions = {layers: 'windspeed', cmap: 'Wind_ms_YRP_11colors'}
                options = L.extend(options, windoptions);
		var layer = new L.FLayer(dataset, options);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a> / IFS';
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=windspeed&STYLES=horizontal&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=Wind_ms_YRP_11colors';
		}
		return layer;
	};

	L.FLayer.Ecmwf.windDirection = function (options) {
                options = L.extend(options, {attribution: 'Wind forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'});
                return new L.FLayer.Ecmwf._windDirection('ECMWF/DXD/MAPS_ECMWF_DXD_GLOBAL.nc', options);
	};
	L.FLayer.Ecmwf._windDirection = function (dataset, options) {
                var windoptions = {layers: 'U10:V10', styles: 'black_arrowbarbs'}
                options = L.extend(options, windoptions);
		var layer = new L.FLayer(dataset, options);
		return layer;
	};

}());

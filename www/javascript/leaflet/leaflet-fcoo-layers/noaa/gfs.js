/**
 * A JavaScript library for using Danish Defence Center for Operational Oceanography's (FCOO)
 * METOC forecast layers leaflet based maps without hassle.
 */

(function () {
	L.FLayer.visibility = function (options) {
                options = L.extend(options, {attribution: 'Visibility forecasts from <a href="http://noaa.gov" alt="National Oceanic and Atmospheric Administration">NOAA</a>'});
                var layer1 = new L.FLayer._visibility('NOAA/GFS/NOAA_GFS_VISIBILITY.nc', options);
                return new L.FLayerGroup([layer1]);
	};
	L.FLayer._visibility = function (dataset, options) {
                var extraoptions = {layers: 'vis', cmap: 'AirVisibility_KM_BYR_3colors'}
                options = L.extend(options, extraoptions);
		var layer = new L.FLayer(dataset, options);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://noaa.gov" alt="National Oceanic and Atmospheric Administration">NOAA</a> / GFS';
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=vis&STYLES=horizontal&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=AirVisibility_KM_BYR_3colors';
		}
		return layer;
	};
}());

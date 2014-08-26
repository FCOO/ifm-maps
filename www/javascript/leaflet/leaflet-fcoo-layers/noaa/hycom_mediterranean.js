/**
 * A JavaScript library for using Danish Defence Center for Operational Oceanography's (FCOO)
 * METOC forecast layers leaflet based maps without hassle.
 */

(function () {
	L.FLayer.currentSpeed = function (options) {
                options = L.extend(options, {attribution: 'Current forecasts from <a href="http://noaa.gov" alt="National Oceanic and Atmospheric Administration">NOAA</a>'});
                var layer1 = new L.FLayer._currentSpeed('NOAA/HYCOM/NOAA_HYCOM_MEDSEA.nc', options);
                //options = L.extend(options, {legendImagePath: ''});
                //var layer2 = new L.FLayer._currentSpeed('metoc.dk.velocities.1nm.surface.1h.NS1C', options);
                //return new L.FLayerGroup([layer1, layer2]);
                return new L.FLayerGroup([layer1]);
	};
	L.FLayer._currentSpeed = function (dataset, options) {
                var currentoptions = {layers: 'u_velocity_v_velocity', cmap: 'Current_kn_GYR_9colors'}
                options = L.extend(options, currentoptions);
		var layer = new L.FLayer(dataset, options);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://noaa.gov" alt="National Oceanic and Atmospheric Administration">NOAA</a> / HYCOM';
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=u_velocity_v_velocity&STYLES=horizontal&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=Current_kn_GYR_9colors';
		}
		return layer;
	};

	L.FLayer.currentDirection = function (options) {
                options = L.extend(options, {attribution: 'Current forecasts from <a href="http://noaa.gov" alt="National Oceanic and Atmospheric Administration">NOAA</a>'});
                var layer1 = new L.FLayer._currentDirection('NOAA/HYCOM/NOAA_HYCOM_MEDSEA.nc', options);
                //var layer2 = new L.FLayer._currentDirection('metoc.dk.velocities.1nm.surface.1h.NS1C', options);
                //return new L.FLayerGroup([layer1, layer2]);
                return new L.FLayerGroup([layer1]);
	};
	L.FLayer._currentDirection = function (dataset, options) {
                var currentoptions = {layers: 'u_velocity:v_velocity'}
                options = L.extend(options, currentoptions);
		var layer = new L.FLayer(dataset, options);
		return layer;
	};
}());

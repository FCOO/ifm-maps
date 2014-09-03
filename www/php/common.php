<!DOCTYPE html>
<html>
<head>
	<title>Information for Mariners Maps - <?php echo $domain_name ?></title>
	<meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <!--<link rel="stylesheet" type="text/css" href="../fonts/font-awesome-4.1.0/css/font-awesome.min.css" />-->
        <link href="//netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="../javascript/leaflet/leaflet.css" />
	<link rel="stylesheet" type="text/css" href="../css/map.css" />
	<link rel="stylesheet" type="text/css" href="../css/flag-icon.css" />
	<link rel="stylesheet" type="text/css" href="../javascript/leaflet/leaflet-fcoo-layers.css" />
	<link rel="stylesheet" type="text/css" href="../javascript/leaflet/leaflet-languageselector.css" />
	<link rel="stylesheet" type="text/css" href="../javascript/leaflet/leaflet-datetimeselector.css" />
	<link rel="stylesheet" type="text/css" href="../javascript/leaflet/L.Control.MousePosition.css" />
	<link rel="stylesheet" type="text/css" href="../javascript/leaflet/L.Control.Print.css" />
	<link rel="stylesheet" type="text/css" href="../javascript/leaflet/leaflet-control-position.css" />
	<link rel="stylesheet" type="text/css" href="../javascript/leaflet/Control.OSMGeocoder.css" />
        <link href='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-locatecontrol/v0.24.0/L.Control.Locate.css' rel='stylesheet' />
        <script>window.L_PREFER_CANVAS = true;</script>
        <!--[if lt IE 9]><link href='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-locatecontrol/v0.21.0/L.Control.Locate.ie.css' rel='stylesheet' /><![endif]-->
</head>
<body>
	<div id="map"></div>
	<script src="../javascript/jquery-1.11.1.js"></script>
	<script src="../javascript/date.js"></script>
	<script src="../javascript/moment-with-langs.min.js"></script>
	<script src="../javascript/leaflet/leaflet.js"></script>
	<script src="../javascript/leaflet/Permalink.js"></script>
	<script src="../javascript/leaflet/Permalink.Layer.js"></script>
	<script src="../javascript/leaflet/Permalink.Overlay.js"></script>
	<script src="../javascript/leaflet/leaflet-flattrbutton.js"></script>
	<!---<script src="../javascript/leaflet/L.Graticule.js"></script>-->
	<!--[if lt IE 9]><script type="text/javascript" src="../javascript/polyfills/excanvas.js"></script><![endif]-->
	<!--[if lt IE 10]><script type="text/javascript" src="../javascript/polyfills/typedarray.js"></script><![endif]-->
	<script src="../javascript/leaflet/leaflet-fcoo-layers/leaflet-fcoo-layers-common.js"></script>
	<script src="../javascript/map_<?php echo $domain_id ?>.js"></script>
	<script src="../javascript/leaflet/leaflet-languageselector.js"></script>
	<script src="../javascript/leaflet/leaflet-datetimeselector.js"></script>
	<script src="../javascript/leaflet/leaflet-control-position.js"></script>
	<script src="../javascript/leaflet/L.Control.MousePosition.js"></script>
	<script src="../javascript/leaflet/L.Control.Print.js"></script>
	<script src="../javascript/leaflet/Control.OSMGeocoder.js"></script>
	<script src="../javascript/leaflet/leaflet.dbpedialayer.js"></script>
        <script src='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-locatecontrol/v0.24.0/L.Control.Locate.js'></script>
        <script src='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-omnivore/v0.1.2/leaflet-omnivore.min.js'></script>
        <script src="../javascript/map_common.js"></script>
<?php
$arrlength=count($model_ids);
for($x=0; $x<$arrlength; $x++) {
  echo "        <script src=\"../javascript/leaflet/leaflet-fcoo-layers/$model_ids[$x]\"></script>";
}
?>
	<script>initMap();</script>
</body>
</html>

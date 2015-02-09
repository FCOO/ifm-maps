<!DOCTYPE html>
<html>
<head>
	<title>Information for Mariners Maps - <?php echo $domain_name ?></title>
	<meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <!--<link rel="stylesheet" type="text/css" href="../fonts/font-awesome-4.1.0/css/font-awesome.min.css" />-->
        <link href="//netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="../javascript/leaflet/leaflet.css" />
	<link rel="stylesheet" type="text/css" href="../javascript/leaflet/leaflet-categorized-layers.src.css" />
	<link rel="stylesheet" type="text/css" href="../css/map.css" />
	<link rel="stylesheet" type="text/css" href="../css/flag-icon.css" />
	<link rel="stylesheet" type="text/css" href="../javascript/jquery-ui-1.11.2.custom/jquery-ui.css" />
	<link rel="stylesheet" type="text/css" href="../javascript/leaflet/leaflet-home.css" />
	<link rel="stylesheet" type="text/css" href="../javascript/leaflet/leaflet-fcoo-layers.css" />
	<link rel="stylesheet" type="text/css" href="../javascript/leaflet/leaflet-fcoo-layers/leaflet-fcoo-layers-impact.css" />
	<link rel="stylesheet" type="text/css" href="../javascript/leaflet/leaflet-languageselector.css" />
	<link rel="stylesheet" type="text/css" href="../javascript/leaflet/leaflet-control-datetime.css" />
	<link rel="stylesheet" type="text/css" href="../javascript/leaflet/L.Control.MousePosition.css" />
	<link rel="stylesheet" type="text/css" href="../javascript/leaflet/L.Control.Print.css" />
	<link rel="stylesheet" type="text/css" href="../javascript/leaflet/leaflet-control-position.css" />
	<link rel="stylesheet" type="text/css" href="../javascript/leaflet/Control.OSMGeocoder.css" />
        <link href='../javascript/leaflet/leaflet-locatecontrol_2014-09-11/L.Control.Locate.css' rel='stylesheet' />
        <script>window.L_PREFER_CANVAS = true;</script>
</head>
<body>
	<div id="map"></div>
	<!--[if lt IE 9]><script type="text/javascript" src="../javascript/polyfills/object.js"></script><![endif]-->
	<script src="../javascript/jquery-1.11.1.js"></script>
	<!--[if lt IE 9]><script type="text/javascript" src="../javascript/polyfills/jquery.xdomainrequest.min.js"></script><![endif]-->
        <script src="../javascript/jquery-ui-1.11.2.custom/jquery-ui.js"></script>
        <script src="../javascript/noty-2.2.9/jquery.noty.packaged.js"></script>
        <script src="../javascript/polyfills/jquery.placeholder_v2.0.8.js"></script>
	<script src="../javascript/date.js"></script>
	<script src="../javascript/magellan.js"></script>
	<script src="../javascript/moment-with-locales.min.js"></script>
	<script src="../javascript/leaflet/leaflet-src.js"></script>
        <script src="../javascript/leaflet/leaflet-celestial/leaflet-celestial.js" charset="UTF-8"></script>
        <script src="../javascript/leaflet/leaflet-celestial/celestial.js" charset="UTF-8"></script>
        <script src="../javascript/leaflet/leaflet-celestial/moon-phase/riset.js" charset="UTF-8"></script>
	<script src="../javascript/leaflet/leaflet-categorized-layers.src.js"></script>
	<script src="../javascript/leaflet/Permalink.js"></script>
	<script src="../javascript/leaflet/Permalink.CategorizedLayer.js"></script>
	<script src="../javascript/leaflet/Permalink.CategorizedOverlay.js"></script>
	<script src="../javascript/leaflet/L.Terminator.js"></script>
	<script src="../javascript/leaflet/leaflet-flattrbutton.js"></script>
	<script src="../javascript/leaflet/leaflet-home.js"></script>
	<!--[if lt IE 9]><script type="text/javascript" src="../javascript/polyfills/excanvas.js"></script><![endif]-->
	<!--[if lt IE 10]><script type="text/javascript" src="../javascript/polyfills/typedarray.js"></script><![endif]-->
	<script src="../javascript/leaflet/leaflet-fcoo-layers/leaflet-fcoo-layers-common.js"></script>
	<script src="../javascript/leaflet/leaflet-fcoo-layers/leaflet-fcoo-layers-impact.js"></script>
	<script src="../javascript/leaflet/leaflet-fcoo-layers/Permalink.ImpactLayer.js"></script>
	<script src="../javascript/map_<?php echo $domain_id ?>.js"></script>
	<script src="../javascript/leaflet/leaflet-languageselector.js"></script>
	<script src="../javascript/leaflet/leaflet-control-datetime.js"></script>
	<script src="../javascript/leaflet/leaflet-control-position.js"></script>
	<script src="../javascript/leaflet/L.Control.MousePosition.js"></script>
	<script src="../javascript/leaflet/L.Control.Print.js"></script>
	<script src="../javascript/leaflet/Control.OSMGeocoder.js"></script>
	<script src="../javascript/leaflet/leaflet.dbpedialayer-src.js"></script>
        <script src='../javascript/leaflet/leaflet-locatecontrol_2014-09-11/L.Control.Locate.js'></script>
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

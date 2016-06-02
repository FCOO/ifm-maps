# Marine Forecast / Sejladsudsigt
>Shows current meteorological and oceanographic forecast and measurements


## Description
Provides a web map interface to FCOO METOC forecasts.
 
Marine Forecast is distributed under the GPL v.3 License, see `COPYING` for the full license. 

## links

#### Main page [ifm.fcoo.dk](https://ifm.fcoo.dk) or [sejladsudsigt.dk](https://sejladsudsigt.dk)

#### Specific domain ifm.fcoo.dk/DOMAIN e.g. [ifm.fcoo.dk/denmark](https://ifm.fcoo.dk/denmark)

#### Information in [Danish](http://fcoo.dk/mf-info) or [English](http://fcoo.dk/mf-info/?lang=eng)

#### Manual in [Danish](http://fcoo.dk/mf-tutorial) or [English](http://fcoo.dk/mf-tutorial/?lang=eng)

## Parameters
#### `lang=en`
Show in English

#### `domain=`*DOMAIN*
Same as `ifm.fcoo.dk/`*DOMAIN*


#### `hidecontrols=` *id1*`,`*id2*`,`..`,`*idN*
Using [leaflet-control-display](https://github.com/FCOO/leaflet-control-display) to hide controls.

| id | Controls |
| :--: | :--- |
| `zoom` | Zoom button (top-left) | 
| `attribution` | Standard leaflet (bottom-right) |
| `layers` | Layer selector (top-right) |
| `scale` | km and nm scale (bottom-left) |
| `legend` | Layer legends (bottom-left) |
| `mouseposition` | Mouse-position (bottom-left) |
| `ALL` | Hide all controls |

#### `showcontrols=` *id1*`,`*id2*`,`..`,`*idN*   
Used together with `hidecontrols=ALL` to display specific controls. 
E.q. `hidecontrols=ALL&showcontrols=scale` will hide all controls but the scale


## Copyright and License

Copyright (c) 2016 [FCOO](https://github.com/FCOO)

## Contact information

Jesper Baasch-Larsen jla@fcoo.dk
Niels Holt nho@fcoo.dk



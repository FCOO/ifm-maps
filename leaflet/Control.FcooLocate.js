L.Control.FcooLocate = L.Control.Locate.extend({
    start: function() {
        L.Control.Locate.prototype.start.call(this);
        this._map.fire('startlocator', this);
    },
    stop: function() {
        L.Control.Locate.prototype.stop.call(this);
        this._map.fire('stoplocator', this);
    }
});

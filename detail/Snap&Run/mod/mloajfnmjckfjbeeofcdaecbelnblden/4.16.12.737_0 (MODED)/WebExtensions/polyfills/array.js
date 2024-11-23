(function () {
    "undefined" === typeof Array.prototype.at &&
        (Array.prototype.at = function (a) {
            return 0 <= a ? this[a] : this[this.length + a];
        });
})();

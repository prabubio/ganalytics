var fs = require('fs');

function Model () {
    var self = this;
    self._analyticsData = {}
}

Model.prototype._parseRevenueData = function (data) {
    var self = this;
    var result = {};
    data.forEach(function (item) {
        if (item && item.year && item.product && item.country && item.revenue) {
            self._addYear(item.year);
            self._addProduct(item.year, item.product);
            self._addCountry(item.year, item.product, item.country);
            self._addRevenue(item.year, item.product, item.country, item.revenue);
        }
    });
};

Model.prototype._addYear = function (year) {
    var self = this;
    if (self._analyticsData[year] == null) {
        self._analyticsData[year] = {}
    }
};

Model.prototype._addProduct = function (year, product) {
    var self = this;
    if (self._analyticsData[year] && self._analyticsData[year][product] == null) {
        self._analyticsData[year][product] = {}
    }
};

Model.prototype._addCountry = function (year, product, country) {
    var self = this;
    if (self._analyticsData[year] &&
        self._analyticsData[year][product] &&
        self._analyticsData[year][product][country] == null) {
        self._analyticsData[year][product][country] = 0;
    }
};

Model.prototype._addRevenue = function (year, product, country, revenue) {
    var self = this;

    if (self._analyticsData[year] &&
        self._analyticsData[year][product] &&
        self._analyticsData[year][product][country] !== null) {
        self._analyticsData[year][product][country] += revenue;
    }
};

Model.prototype.readData = function (callback) {
    var self = this;
    fs.readFile('data.json', 'utf8', function (err, data) {
        data = JSON.parse(data);
        self._parseRevenueData(data);
        return callback(null, self._analyticsData);
    });
};

/* global React, ReactDOM
*/

var AnalyticsDashBoard = React.createClass({
    getInitialState: function (){
        return {data: {}, selectedYear: "", selectedProduct:""};
    },
    componentDidMount: function () {
        var data = {
            "revenue": {
                "2012": {
                    "Server": {
                        "US": 6000,
                        "China": 1340,
                        "Japan": 2000,
                        "EU": 4000
                    },
                    "Database": {
                        "US": 2400,
                        "China": 400,
                        "Japan": 1200,
                        "EU": 4700
                    }
                },
                "2013": {
                    "Server": {
                        "US": 7000,
                        "China": 2340,
                        "Japan": 3000,
                        "EU": 3500
                    },
                    "Database": {
                        "US": 14400,
                        "China": 200,
                        "Japan": 3200,
                        "EU": 2000
                    }
                }
            }
        };
        this.setState({data: data, selectedYear: "2012"});
    },
    onYearChange: function (year) {
        console.log('year changed to ', year);
        this.setState({selectedYear: year, selectedProduct: ""});
    },
    onProductClick: function (year, product) {
        console.log('product selected: ', product);
        this.setState({selectedProduct: product});
    },
    render: function () {
        var data = this.state.data;
        var years = data.revenue || {};
        var selectedYear = this.state.selectedYear;
        var selectedProduct = this.state.selectedProduct;
        console.log(years);
        return (
            <div className="analytics-dash">
                <YearSelector
                    data = {years}
                    selectedYear = {selectedYear}
                    onYearChange = {this.onYearChange}
                />
                <RevenuePieChart
                    data = {years[selectedYear]}
                    year = {selectedYear}
                    onProductClick = {this.onProductClick}
                />
                <RevenueReport
                    data = {years[selectedYear]}
                    year = {selectedYear}
                    product = {selectedProduct}
                />
            </div>
        );
    }
});

var YearSelector = React.createClass({
    // getInitialState: function () {
        // return {year: ''};
    // },
    handleChange: function (e) {
        var selectedYear = e.target.value;
        this.props.onYearChange(selectedYear);
        // this.setState({year: selectedYear});
    },
    render: function () {
        var revenueData = this.props.data;
        var years = [];
        var defaultOption = "";

        for (var year in revenueData) {
            if (revenueData.hasOwnProperty(year)) {
                years.push(year);
            }
        }

        var selectedYear = this.props.selectedYear || years.length && years[0] || "";
        var options = years.map(function (year, i) {
            if (year === selectedYear) {
                defaultOption = year;
            }
            return <option key={year} value={year}>{year}</option>
        });

        return (
            <select
                className = "year-selector"
                defaultValue = {defaultOption}
                onChange = {this.handleChange}
                >
                {options}
            </select>
        )
    }
});

var RevenuePieChart = React.createClass({
    handleClick: function (evt) {
        var selectedProduct = evt.target.dataset.id;
        console.log("clicked a product", evt.target);
        this.props.onProductClick(this.props.year, selectedProduct);
    },
    render: function () {
        var self = this;
        console.log('I am in RevenuePieChart year: ', this.props.year, ', data = ', this.props.data);

        var productsData = this.props.data;
        var products = [];
        var productRev = {};
        var revPieAvg = {};
        var revTotal = 0;

        for (var product in productsData) {
            if (productsData.hasOwnProperty(product)) {
                products.push(product);

                var productData = productsData[product];
                // Get total revenue per product
                for (var country in productData) {
                    if (productData.hasOwnProperty(country)) {
                        if (productRev[product]) {
                            productRev[product] += productData[country];
                        } else {
                            productRev[product] = productData[country];
                        }
                    }
                }
                revTotal += productRev[product];
            }
        }

        var pieConstructed = 0;
        var pieColors = ['#1b458b', '#cc0000'];
        var slices=[];
        products.forEach(function (product, i) {
            revPieAvg[product] = Math.round(productRev[product] / revTotal * 360);
            console.log('rev avg for product ', product, ' = ', revPieAvg[product]);
            var start = pieConstructed;
            var end = revPieAvg[product];
            var result;
            pieConstructed = pieConstructed + end;

            var createSlice = function (product, id, start, end) {
                var startTransform = 'rotate(' + start + 'deg)';
                var endTransform = 'rotate(' + end + 'deg)';
                var divStyle = {
                    WebkitTransform: startTransform
                };

                var pieStyle = {
                    backgroundColor: pieColors[i],
                    WebkitTransform: endTransform
                };
                return (<div
                    key={id}
                    id={id}
                    className="hold"
                    data-id={product}
                    style={divStyle}
                    onClick={self.handleClick}>
                    <div className="pie"
                         style={pieStyle}
                         onClick={self.handleClick}
                         data-id={product}>
                    </div>
                </div>);
            };

            if (revPieAvg[product] > 180) {
                slices.push(createSlice(product, product + '-1', start, 180));
                slices.push(createSlice(product, product + '-2', start + 180, end - 180));

            } else {
                slices.push(createSlice(product, product, start, end));
            }
        });

        return (
            <div className="pieContainer"> &nbsp;
                {slices}
            </div>
        );
    }
});

var RevenueReport = React.createClass({
    render: function () {
        var product = this.props.product;
        var year = this.props.year;
        var data = this.props.data;
        if (product === "") {
            return null;
        }
        var productData = data[product];
        var rows = [];

        for (var country in productData) {
            rows.push(
                <tr key={country}>
                    <td>{year}</td>
                    <td>{product}</td>
                    <td>{country}</td>
                    <td>{productData[country]}</td>
                </tr>
            )
        }

        return (
            <table>
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Product</th>
                        <th>Country</th>
                        <th>Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }
});

ReactDOM.render(
    <AnalyticsDashBoard />,
    document.querySelector('#analytics')
);
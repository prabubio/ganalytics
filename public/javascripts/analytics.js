/* global React, ReactDOM
*/

var AnalyticsDashBoard = React.createClass({
    getInitialState: function (){
        return {data: {}, selected: ""};
    },
    componentDidMount: function () {
        var data = {
            "revenue": {
                "2012": {
                    "Server": {
                        "US": "6M",
                        "China": "1.34M",
                        "Japan": "2M",
                        "EU": "4M"
                    },
                    "Database": {
                        "US": "2.4M",
                        "China": "0.4M",
                        "Japan": "1.2M",
                        "EU": "4.7M"
                    }
                },
                "2013": {
                    "Server": {
                        "US": "7M",
                        "China": "2.34M",
                        "Japan": "3M",
                        "EU": "3.5M"
                    },
                    "Database": {
                        "US": "4.4M",
                        "China": "0.2M",
                        "Japan": "3.2M",
                        "EU": "2M"
                    }
                }
            }
        };
        this.setState({data: data, selected: "2012"});
    },
    onYearChange: function (year) {
        console.log('year changed to ', year);
        this.setState({selected: year});
    },
    render: function () {
        var data = this.state.data;
        var years = data.revenue || {};
        var selectedYear = this.state.selected;
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
    render: function () {
        console.log('I am in RevenuePieChart year: ', this.props.year, ', data = ', this.props.data);

        var productsData = this.props.data;
        var products = [];

        for (var product in productsData) {
            if (productsData.hasOwnProperty(product)) {
                products.push(product);
            }
        }

        var slices = products.map(function (product, i) {
            return <div key={product} id={product} className="hold"><div className="pie"></div></div>
        });

        return (
            <div className="pieContainer">
                <div className="pieBackground"></div>
                {slices}
            </div>
        );
    }
});

var RevenueReport = React.createClass({
    render: function () {

    },
    getInitialState: function () {

    },
    componentDidMount: function () {

    }
});

ReactDOM.render(
    <AnalyticsDashBoard />,
    document.querySelector('#analytics')
);
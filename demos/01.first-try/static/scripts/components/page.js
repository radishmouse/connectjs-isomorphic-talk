/** @jsx React.DOM */

var React = require('react');

var HelloWorld = require('./hello-world.js');
var GoodbyeWorld = require('./goodbye-world.js');


var Page = React.createClass({
    render: function () {
        // var component = this.props.subComponent;

        return (<div className="container">
                    <HelloWorld/>
                    <GoodbyeWorld/>
                </div>
                );
    }
});
module.exports = Page;

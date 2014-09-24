var React = require('react');
var helloWorld = require('./hello-world.js');

React.renderComponent(helloWorld(), document.body);

// var App = React.createClass({
//     render: function () {
//         return (
//             <Page/>
//         );
//     }
// });
//
// window.App = App;

// module.exports = (function () {
    // window.addEventListener('load', function () {
    // });
// })();

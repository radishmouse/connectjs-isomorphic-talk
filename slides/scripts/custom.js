function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
(function (remark) {
    'use strict';

    var base = "name: cover\n";
    base += "class: center, middle, s-inverse, l-cover\n";
    base += "layout: true\n";
    base += "---\n";

    var slideshow;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'slides.md');
    xhr.send();
    xhr.onload = function () {

        var lines = this.responseText;
        if (getParameterByName('print')) {
            lines = this.responseText.split("\n");
            lines = lines.filter(function (line) {
                return line !== "--";
            });
            lines = lines.join("\n");
        }
        document.querySelector('#source').innerHTML = base + lines;

        slideshow = remark.create({
            navigation: {
                scroll: false
            },
            ratio: '16:9',
            highlightStyle: 'vs'
            // highlightStyle: 'googlecode'
            // highlightStyle: 'idea'
            // highlightStyle: 'tomorrow-night-bright' // dark, bold
        });

        var jsbinScript = document.createElement("script");
        jsbinScript.setAttribute('src', 'http://static.jsbin.com/js/embed.js');
        document.querySelector('body').appendChild(jsbinScript);

        var cps = document.createElement("script");
        cps.setAttribute('src', '//codepen.io/assets/embed/ei.js');
        document.querySelector('body').appendChild(cps);

        var el = document.querySelector('.original-size');
        var clickEvent = function(event){
            event.preventDefault();
            var target = event.target;
            target.classList.toggle('is-bigger');
        };
        if (el) {
            el.addEventListener('click', clickEvent);
        }
    };

})(window.remark);


/*
 * TODO: modify this so that it:
 * 1. reads the TOC of Chapter folder names
 * 2. Uses Ajax to grab each of them, in order
 * 3. Writes that to the #source textarea
 * 4. Strips out any lines that are just "--"
 *
 * This will give us a single PDF with page numbers.
 *
 *
 */

var base = "name: cover\n";
base += "class: center, middle, s-inverse, l-cover\n";
base += "layout: true\n";
base += "---\n";

var slideshow;
var xhr = new XMLHttpRequest();
xhr.open('GET', 'slides.md');
xhr.send();
xhr.onload = function () {

    'use strict';
    var lines = this.responseText;
    // var lines = this.responseText.split("\n");
    // lines = lines.filter(function (line) {
    //     return line !== "--";
    // });
    // lines = lines.join("\n");
    document.getElementById('source').innerHTML = base + lines;

    slideshow = remark.create({
        navigation: {
            scroll: false
        },
        highlightStyle: 'monokai'
    });
};

var jsbinScript = document.createElement("script");
jsbinScript.setAttribute('src', 'http://static.jsbin.com/js/embed.js');
document.querySelectorAll('body')[0].appendChild(jsbinScript);

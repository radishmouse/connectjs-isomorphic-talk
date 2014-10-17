
template: cover

# Building Blocks for Isomorphic JavaScript Apps
## Chris Aquino, Big Nerd Ranch

???

excited

first connect-js

---

class: middle, center
layout: false

![](img/bnr-logo.png)

???

big nerd ranch

training

app development

director of front end web

favorite part of job...


---
# Arbitrarily ridiculous photo of me

![](img/me.png)

???

is playing ping pong

my second favorite

researching techniques

make my team more effective

when I'm doing research...

---

template: cover

# Front end development has gotten complex.

???

realize stuff has gotten complicated

and it's only getting more complicated

before I contribute to that

let's take a step back and ask...


---

template: cover

# Are we actually doing a better job?

???


I don't know.

Let's take a look.


---


layout: false

# In the beginning...

![](img/01.static.png)

???

One file, one page.

Human writes HTML.

Browser renders it to a DOM.

---

# Database-driven

![](img/02a.dynamic.png)

???

Dynamic data

write code

mashes it up with HTML

send it down the wire

Browser renders it to a DOM.

---

# Server-side MVC

![](img/02b.dynamic.png)

???

Next version

software engineering best practices

come to web development

processes and workflows

result in HTML

Browser renders it to a DOM.


---

# Ajax

![](img/03.ajax.png)

???

2005

Designer: Jesse James Garret

technique to increase increase interactivity

fewer page reloads

more dynamic pages

Server delivers some HTML

Browser renders it to DOM

JavaScript modifies that DOM in some way.

---

# Single Page Applications

![](img/04.JSMVC.png)

???

Google and Yahoo turn Ajax up to 11

Apps like Gmail are created.

Then, the rest of us start doing it.

How?


---

template: cover

# Anatomy of an MVC Application

???

For those of you who don't know

MVC is a design pattern

created by Alan Kay in the 70s

used in iOS applications

Rails made it popular with web devs

and we brought various forms to the browser

In general...

---

# MV* in the Browser

![](img/05a1.MVC.png)

???

Three basic conceptual pieces

Models - source of truth

Views - draw UI and handle UI events

Controllers - house business logic

---

# MV* in the Browser

![](img/05a2.MVC.png)


???

Here's how they relate.

Virtuous cycle

But, that's not the whole picture


---

# MV* in the Browser

![](img/05b.MVC.png)

???

You want reusable templates that your views can render

---

# MV* in the Browser

![](img/05c.MVC.png)

???

And, your models may talk to an API for data

---

# MV* in the Browser

![](img/05d.MVC.png)

???

Oh, and you probably want to cache some of that data locally

---

# MV* in the Browser

![](img/05e.MVC.png)

???

Finally, all of that stuff will need to be

swapped out

or nested

for internal navigation

But...what was the point of all of this again?...

---

# MV* in the Browser

![](img/05f.MVC.png)

???

Oh yeah!

To render a DOM.

---

template: cover

# mvcwtf

???

what have we done?

---

# Shifting Responsibility

![](img/06a.Complexity.png)

???

Started with a simple model

---

# Shifting Responsibility

![](img/06b.Complexity.png)

???

Then took an increasingly complicated pattern

---

# Shifting Responsibility

![](img/06c.Complexity.png)

???

And moved it

to a platform

originally designed to show text

And...

---

# Thick clients, slow startup

![](img/07.Problem2.png)

???

js and all assets need to download

then it has to grab remote data

takes too long for initial presentation of data

Then, back end...

---

# Back end vs. UI

## Many requests

```js
$.get('/api/users', function (data) { /* ... */});
$.get('/api/events', function (data) { /* ... */});
$.get('/api/groups', function (data) { /* ... */});
$.get('/api/puppies', function (data) { /* ... */});
```

## Or vague endpoints

```js
$.get('/api/all-the-things-for-dashboard', function (data) { /* ... */});
```

???


Do you make many requests?

Or do you have your back end devs write code that is specific to your UI

What about iOS or Android clients with different UI?


---
template: cover

# A (Possible) Solution

???

Where do we go from here?

---

# Isomorphic JavaScript Application Architecture

![](img/10.Isomorphic.png)


???

You add a UI server

can render any screen, any route statically

delivers HTML straight to the browser

and it can cache data from APIs

---

# "Isomorphic"

--

* A single JavaScript application

--

* UI code runs in browser or Node.js

--

* Network code runs in browser or Node.js

???

Code that produces a DOM (or HTML) can run from client or server

Also, any code that helps produce the DOM (populating it with data)

can run from client or server.

---


# bitly.com/isojs

![](img/github.png)

???

I've put together a demo project.

Nothing fancy.

Definition of "trivial" application


---

# Build Tool

* JavaScript-based

* Pipeline-oriented

* Modular

---

# Gulp

```js
var gulp = require('gulp');
var config = require('./config');
var paths = config.paths;

// Actual task functions are in `tasks` folder
var bSync = require('./tasks/sync');
var browserify = require('./tasks/browserify')(paths.js.app, paths.bundleName, paths.js.dest);

gulp.task('build', browserify);
gulp.task('browser-sync', ['build'], bSync.sync(paths.baseDir));

gulp.task('default', ['browser-sync'], function () {
    gulp.watch(paths.js.src, ['build', function () {
        bSync.reload(); // full reload
    }]);
});
```


???

Alternatives: Grunt, Make, Cake, Rake, etc.



## diagram what is the end result of using gulp


Gulp provides a pipeline style task runner with a small API.
Browserify allows you to create and use Node-style modules in your browser-based JavaScript.

Used in combination, you write simple modules, which are bundled into a single JavaScript payload.

---


# Live Reload: BrowserSync

```js
// BrowserSync is a better live-reload + static server
var browserSync = require('browser-sync');

function _sync(dir){
    return function () {
        browserSync({
            open: false,
            server: {
                baseDir: dir,
            }
        });
    };
}

module.exports = {
    sync: _sync,
    reload: browserSync.reload
};
```

???

want to guarantee parity between what is emitted by UI server and what is drawn by the static JS in-browser is the same. so, BS for development testing.

diagram of what i mean by "parity"

A basic `index.html` file will be the base of the application.
BrowserSync will serve it and the bundled JavaScript to the browser, and it
will reload the browser when changes are made to the application code.

---

# Module System

* Context-agnostic

* Minimal Syntax (not require.js)

---

# Browserify

```js
var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');

module.exports = function (src, bundleName, dest) {
    return function () {
        var b = browserify({
            detectGlobals : true
        });
        b.transform(reactify);
        b.add([src]);
        return b.bundle()
            .pipe(source(bundleName))
            .pipe(gulp.dest(dest));
    };
};```



???


Provides Node style Modules as well as some Node APIs for the browser

Alternatives: Webpack

---


# Views: React Components

--

* Declarative

--

* Composable

--

* Performant

---

# Component: Router

```js
/** @jsx React.DOM */
var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
var DefaultRoute = Router.DefaultRoute;






var routes = (









);

module.exports = routes;
```

---

# Component: Router

```js
/** @jsx React.DOM */
var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
var DefaultRoute = Router.DefaultRoute;
var App = require('./App');
var HelloWorld = require('./components/hello');
var About = require('./components/about');
var Yep = require('./components/yep');
var routes = (










);

module.exports = routes;
```

???

`ReactRouter` was chosen because it is modeled after Ember's robust routing system.
---

# Component: Router

```js
/** @jsx React.DOM */
var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
var DefaultRoute = Router.DefaultRoute;
var App = require('./App');
var HelloWorld = require('./components/hello');
var About = require('./components/about');
var Yep = require('./components/yep');
var routes = (
    <Routes location="history" scrollBehavior="browser">
        <Route name="app" path="/" handler={App}>
            <Route name="yep" handler={Yep}></Route>
            <Route name="about" handler={About}></Route>
            <DefaultRoute handler={HelloWorld}></DefaultRoute>
        </Route>
    </Routes>
);

module.exports = routes;
```

???

---
# Component: Router

```js
/** @jsx React.DOM */
var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
var DefaultRoute = Router.DefaultRoute;
* var App = require('./App');
var HelloWorld = require('./components/hello');
var About = require('./components/about');
var Yep = require('./components/yep');
var routes = (
    <Routes location="history" scrollBehavior="browser">
*        <Route name="app" path="/" handler={App}>
            <Route name="yep" handler={Yep}></Route>
            <Route name="about" handler={About}></Route>
            <DefaultRoute handler={HelloWorld}></DefaultRoute>
        </Route>
    </Routes>
);

module.exports = routes;
```

???

---

# Component: Router

```js
/** @jsx React.DOM */
var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
var DefaultRoute = Router.DefaultRoute;
var App = require('./App');
var HelloWorld = require('./components/hello');
var About = require('./components/about');
var Yep = require('./components/yep');
var routes = (
    <Routes location="history" scrollBehavior="browser">
        <Route name="app" path="/" handler={App}>
*            <Route name="yep" handler={Yep}></Route>
*            <Route name="about" handler={About}></Route>
            <DefaultRoute handler={HelloWorld}></DefaultRoute>
        </Route>
    </Routes>
);

module.exports = routes;
```

???

---

# Component: Router

```js
/** @jsx React.DOM */
var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
var DefaultRoute = Router.DefaultRoute;
var App = require('./App');
var HelloWorld = require('./components/hello');
var About = require('./components/about');
var Yep = require('./components/yep');
var routes = (
    <Routes location="history" scrollBehavior="browser">
        <Route name="app" path="/" handler={App}>
            <Route name="yep" handler={Yep}></Route>
            <Route name="about" handler={About}></Route>
*            <DefaultRoute handler={HelloWorld}></DefaultRoute>
        </Route>
    </Routes>
);

module.exports = routes;
```

???

---

# Component: App

```js
/** @jsx React.DOM */
var React = require('react');




var App = React.createClass({
    render: function () {
        return (
            <section>





            </section>
        );
    },




});
module.exports = App;
```

---


# Component: App

```js
/** @jsx React.DOM */
var React = require('react');
*var Header = require('./components/header');
*var Footer = require('./components/footer');
*var HelloWorld = require('./components/hello');
var App = React.createClass({
    render: function () {
        return (
            <section>





            </section>
        );
    },




});
module.exports = App;
```

---

# Component: App

```js
/** @jsx React.DOM */
var React = require('react');
var Header = require('./components/header');
var Footer = require('./components/footer');
var HelloWorld = require('./components/hello');
var App = React.createClass({
    render: function () {
        return (
            <section>
*                <Header />
*                <HelloWorld />
*                <Footer />
            </section>
        );
    },




});
module.exports = App;
```

---


# Component: App

```js
/** @jsx React.DOM */
var React = require('react');
var Header = require('./components/header');
var Footer = require('./components/footer');
var HelloWorld = require('./components/hello');
var App = React.createClass({
    render: function () {
        return (
            <section>
                <Header />
                <HelloWorld />
*                <Footer timeStamp={this._timeStamp()}/>
            </section>
        );
    },
*    _timeStamp: function () {
*        return (new Date()).getTime();
*    }
});
module.exports = App;
```

---

# Component: Footer

```js
/** @jsx React.DOM */
var React = require('react');
var Footer = React.createClass({
    render: function () {
        return (
            <footer>
*                <p>&copy; 2014 @radishmouse: {this.props.timeStamp}</p>
            </footer>
        );
    }
});

module.exports = Footer;
```

---

# Component: Header

```js
/** @jsx React.DOM */
*var Nav = require('./nav');

var React = require('react');
var Header = React.createClass({
    render: function () {
        return (
*            <Nav />
        );
    }
});

module.exports = Header;
```

---

# Component: Nav

```js
/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
*var Link = Router.Link;

var Nav = React.createClass({
    render: function () {
        return (
            <nav>
                <ul>
*                   <li><Link to="app">Hello</Link></li>
*                   <li><Link to="yep">Yep</Link></li>
*                   <li><Link to="about">About</Link></li>
                </ul>
            </nav>
        );
    }
});

module.exports = Nav;
```

---

# Component: HelloWorld

```js
/** @jsx React.DOM */
var React = require('react');
var HelloWorld = React.createClass({
    getInitialState: function () {
        return {
            _message: 'Hello, World!'
        };
    },
    render: function () {
        return (
*            <h1 onClick={this._changeMessage}>{this.state._message}</h1>
        );
    },
    _changeMessage: function () {
        return /Hello/.test(this.state._message) ?
            this.setState({_message: 'Goodbye, World!!!'}) :
            this.setState({_message: 'Hello, World!'});
    }
});
module.exports = HelloWorld;
```

???

why react?
b/c it fulfills the DOM production aspect, regardless of context.

(maybe on an earlier slide, i can make it more explicit what my goals are for isomorphic)

Use React components for the View layer.

* functions
* composable
* context-agnostic
* can emit HTML strings


---



# Static Version

```html
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <title>isomorphic demo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="stylesheets/application.css">
    </head>
    <body>
        <script src="scripts/bundle.js"></script>
    </body>
</html>
```


---

# Server-Side Rendering: React Component

```js
var express = require('express');
var webapp = express();
var path = require('path');
var React = require('react');
require('node-jsx').install(); // Compile JSX on the fly
*var App = require('../src/app');

webapp.get('*', function (req, res) {
    var htmlString = '<!doctype html><html><head></head><body>';
*    htmlString += React.renderComponentToString(App());
    htmlString += '<script src="scripts/bundle.js"></script>';
    htmlString += '</body></html>';
    res.send(htmlString);
});

var PORT = 1337;
webapp.listen(PORT);
console.log('Listening on ' + PORT);
```


???

Routing is duplicated on the server using our custom `ReactRouter` component.
We could not it render on the server the way that regular React components are rendered to HTML.

---
# Server-Side Rendering: React Router

```js
var express = require('express');
var webapp = express();
var path = require('path');
var React = require('react');
require('node-jsx').install(); // Compile JSX on the fly
var Router = require('react-router');
*var AppRoutes = require('../src/routes');

webapp.get('*', function (req, res) {
*    Router.renderRoutesToString(AppRoutes, req.path, function (err, reason, string) {
        var htmlString = '<!doctype html><html><head></head><body>';
*        htmlString += string;
        htmlString += '<script src="scripts/bundle.js"></script>';
        htmlString += '</body></html>';
        res.send(htmlString);
    });
});

var PORT = 1337;
webapp.listen(PORT);
console.log('Listening on ' + PORT);
```

???


The Express application can compile the components as needed.
The components are rendered to an their HTML representation.


---


# Models and Controllers: Flux

* Stores instead of Models
* Controller-Views instead of Controllers

--

* Actions are messages about data
* Dispatcher manages all Actions

---

# Flux Architecture: Overview

![](img/09a.flux.png)

---

# Flux Architecture: Overview


![](img/09b.flux.png)



---

# Flux Architecture: Dipatcher

```js
var Dispatcher = require('flux').Dispatcher;
var copyProperties = require('react/lib/copyProperties');
var AppDispatcher = copyProperties(new Dispatcher(), {

    handleServerAction: function(action) {
        var payload = {
            source: 'SERVER_ACTION',
            action: action
        };
        this.dispatch(payload);
    },
    handleViewAction: function(action) {
        var payload = {
            source: 'VIEW_ACTION',
            action: action
        };
        this.dispatch(payload);
    }
});

module.exports = AppDispatcher;
```


???

Flux Stores are used instead of a traditional (mutative) Model layer (such as Backbone.Model).

Dispatchers and Actions replace controllers.

???

# Rendering Components with initial data (aside)

On the server, we inject the initial data for the stores via a global variable.

---

# Flux Architecture: Actions

```js
var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {
    receiveAll: function(rawData) {
*        AppDispatcher.handleServerAction({
            type: "RECEIVE_DATA",
            rawData: rawData
        });
    }
};
```

---

# Flux Architecture: Stores

```js
var AppDispatcher = require('../dispatcher/AppDispatcher');
...
var Store = merge(EventEmitter.prototype, {
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    }
});
*Store.dispatchToken = AppDispatcher.register(function(payload) {
    var action = payload.action;
    switch(action.type) {
        case "RECEIVE_DATA":
            _data = action.rawData;
            Store.emitChange();
        break;
        default: // do nothing
    }
});
module.exports = Store;
```

---

#Flux Architecture: Views Subscribing to Stores

```js
...
var Yep = React.createClass({
    getInitialState: function() {
        return getStateFromStore();
    },
    componentDidMount: function() {
*      Store.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
*      Store.removeChangeListener(this._onChange);
    },

    render: function () {...},

    _onChange: function () {
*        this.setState(getStateFromStore());
    }
});

module.exports = Yep;

```

---
#Flux Architecture: Views Subscribing to Stores

```js
...
var Yep = React.createClass({
...
    render: function () {
*        var nodes = Object.keys(this.state.data).map(function (key) {
            var datum = this.state.data[key];
            return <p key={datum._id}> {datum.name}: {datum.price}</p>;
        }.bind(this));
        return (
            <div>
                <h1>Yep</h1>
*                {nodes}
            </div>

        );
    },
...
});

module.exports = Yep;

```
---

# Isomorphic Library: SuperAgent

```js
var ActionCreator = require('../actions/ActionCreator');
var request = require('superagent');
var URL = 'http://my.remote.server/endpoint';

var _data = [{
    name: 'placholder',
    price: '1'
}];
module.exports = {

    getAllNodes: function() {

        // fake caching via intermediary variable
        ActionCreator.receiveAll(_data);

*        request.get(URL, function (res){
            _data = res.body;
            ActionCreator.receiveAll(_data);
        });
    }
};
```

---

# Isomorphic Library: SuperAgent

```js
var ActionCreator = require('../actions/ActionCreator');
var request = require('superagent');
var URL = 'http://my.remote.server/endpoint';

var _data = [{
    name: 'placholder',
    price: '1'
}];
module.exports = {

    getAllNodes: function() {

        // fake caching via intermediary variable
*        ActionCreator.receiveAll(_data);

        request.get(URL, function (res){
            _data = res.body;
*            ActionCreator.receiveAll(_data);
        });
    }
};
```


???
Take one of our Stores, and wire it up with SuperAgent

The server doesn't actually need to .post anything, just .get stuff from
the remote server

bonus: add caching

we are highlighting the use of an isomorphic library, superagent

Retrieve the data from the remote host from either the server or the client.

If appropriate, cache the data per screen on the server-side.

---

template: cover

# Wins

---

# Focused Development Energy

--

* Single JavaScript codebase

--

* API developers no longer concerned with UI


---

# React + Flux

--

* Simple patterns that scale

--

* Side-steps issues with data-binding

--

* Simple server-side rendering of deep links

???

* What is the payoff after using this complicated setup?
    * The React/Flux stack was designed with scaling development by simplifying the mental model
        * The conventions of your stack are data-flow centric, not object-mutation centric
        * (If you think about an organization, you're focused on what people do, and not what they're called)
    * Likewise, you allow your developers to play to their strengths
        * Back end can build out APIs
        * Front end can focus on performant UIs
            * Per-screen API calls can be aggregated and cached on the Node server
            * Component-based styling lends itself to styleguide driven development

---

# Affordances for Designers and UI Engineers

--

* Components allow for atomic design

--

* JSX is familiar

--

* Synchronized device testing

--

* Components usable for styleguide-driven development

???

* Implications on design
    * the JSX in /src/components lends itself to atomic design
    * after the stack is installed (via `npm install`, BrowserSync provides a way to test your design on multiple devices simultaneously
        * you could use fixture data
        * and one could add automated screenshots
    * you could create prototypes relatively quickly by:
        * serving stubbed out .json files from `/api-static`
        * using lo-fi CSS coupled with pre-built standard components
            * (similar to react-bootstrap)
* How easy is it to do TDD with this style of development? (That is, won't you have to test everything twice to make sure that the server-side rendering and browser rendering of components is the same?)
    * Testing the changes that occur during user interaction is the same.
    * Testing load of deep linking is what needs to be duplicated
    * Otherwise, there are tools (yes, from Facebook) that work well with React/Flux based stack
        * Jest for unit tests
        * [Huxley](https://github.com/facebook/huxley) for visual regression


---

# User sees stuff, sooner

--

* HTML pre-rendered with data

--

* Lower latency from UI server caching

--

* Reduced rendering overhead

---

template: cover
# Tradeoffs

---

# Not an established ecosystem

--

* Some assembly required

--

* Smaller community

--

* No training or books

---

# Not an established ecosystem, but...

--

* Examples exist: [bit.ly/isojs-demo](bit.ly/isojs-demo)

* Setup is `npm install && gulp`


--

* Community is combination of Node.js and Front End developers

--

* Big Nerd Ranch offers training for Cross-Platform JavaScript Apps


???

(break up)

* And what are the tradeoffs?
    * It's not an already established ecosystem (outside of places like Facebook or AirBnB) like Embularbone
        * You can't just it up and build an app with a dozen lines of configuration
        * But, at the same time, there is no magic, no mystery about the way it works.
            * The ecosystem is largey npm
    * Getting the stack set up is tricky
        * There are a few sample projects on github
            * including this one
    * Training? Books?
        * Big Nerd Ranch's Cross-Platform JavaScript Apps course is available, with Isomorphic techniques


---

template: cover

# Thank you for listening!

![](img/ihgFYuzcRBqXg.gif)

## @radishmouse, @bignerdranch


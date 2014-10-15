
template: cover

# Building Blocks for Isomorphic JavaScript Apps
## Chris Aquino, Big Nerd Ranch

---

class: middle, center
layout: false

![](img/bnr-logo.png)

---

template: cover


# (stating the problem) Ultimately, the goal is DOM production
## followed by a short history of how we have done this

why am i showing the history?
what problem were we solving (whose by product is all the complexity we're dealing with as developers)

* the needs and expectations of the user increased, so we shifted the logic to the browser



* competing with desktop
* then, competing with smartphone apps
* we're providing the user with immersion, cohesion, and integration (partially a time thing. faster access to collaborative data)

---


layout: false

# In the beginning...

![](img/01.static.png)

???

One file, one page.
Human writes HTML.
Browser renders it.

---

# Database-driven

![](img/02a.dynamic.png)

???

Support dynamic data, without manually creating new pages
Human writes algorithm to write HTML using data from database.
Browser renders it.

---

# Server-side MVC

![](img/02b.dynamic.png)

???

Software engineering practices come to web servers.
Humans create workflows in code form.
Workflows result in HTML.
Browser renders it.


---

# Ajax

![](img/03.ajax.png)

???

To increase the "interactivty" on a page, humans employ Ajax.
Whole chunks of HTML are retrieved from server.
Or, XML or JSON data is retrieved from server.

In the case of XML or JSON, the DOM elements are created via JavaScript.
This JavaScript is written either by a human, or is incorporated
into the framework (Rails is writing the JS for the Ajax).

Marks the advent of browser-based thick clients.

---

# Single Page Applications

![](img/04.JSMVC.png)

???
Software engineering practices come to JavaScript.

---

template: cover

# What's in a Single Page App?

---

# MV* in the Browser

![](img/05a1.MVC.png)

---

# MV* in the Browser

![](img/05a2.MVC.png)


???

Enter MV*
Which also includes Templating, Routing, and Persistence

JavaScript handles the creation of most, if not all, DOM
using data retrieved from a remote API.

---

# MV* in the Browser

![](img/05b.MVC.png)


---

# MV* in the Browser

![](img/05c.MVC.png)


---

# MV* in the Browser

![](img/05d.MVC.png)


---

# MV* in the Browser

![](img/05e.MVC.png)


---
template: cover

# Problems arise

---

# Complexity

![](img/04.JSMVC.png)


---

# Complexity

![](img/06.Problem1.png)

???

* js and all assets need to download
* then it has to grab remote data
* takes too long for initial presentation of data



---

# Frameworks organize your application code

--

* Abstractions

--

* Conventions

--

* Community


???


Frameworks make organize your application.
By standardizing the patterns and conventions you use.

To wrangle the complexity, we add more layers of abstraction and standardize the conventions, which increases the overall complexity, but reduces the amount of complexity for the day-to-day work of a developer

solve some of the problems, but not all

---

# Build Tools organize your development process

--

* Manage dependencies

--

* Optimize assets

--

* Transpile and/or Precompile


???

Makes it easier to operate at an even higher level of abstraction.

Build tools organize your development process.

Build tools and frameworks shim the development environment.

---

template: cover

# Congratulations! Next?

???

With frameworks and build tools, you've shimmed away the complexities.

---



# Performance and Per-screen requests

![](img/07.Problem2.png)

???


The front end now replicates the kind of DOM production formerly done by back end frameworks.

They can now move towards APIs.

But, the APIs should not need to know about what's on a screen.

By the same token, we should not weigh down the client with too many API requests to assemble the data needed for any single screen.


---
template: cover

# So, what can we do?

---

template: cover

# Going Isomorphic
## this section needs to be about the isomorphic architecture, with a diagram on the very first slide
## The next slide needs a statement of goals.

???

How do we go from where we are to where we want to be?
---

# Divide and conquer

One of our remaining problems is that the back end knows too much about how our UI is put together.

To solve this problem, we split our concerns further.

We introduce a second server, specifically for aggregating the data for the UI.

But, couldn't we move the template rendering to the second server, also?



---

template: cover

# The Stack

---

# Common ground

(that last transition is messy and unclear)
To do that, we should choose a common

* language
* module system
* set of libraries (context agnostic libraries that are needed to fulfill the UI)

---

# Base setup

---

# Build Tool

## diagram what is the end result of using gulp


Gulp provides a pipeline style task runner with a small API.
Browserify allows you to create and use Node-style modules in your browser-based JavaScript.

Used in combination, you write simple modules, which are bundled into a single JavaScript payload.

---

## BrowserSync

want to guarantee parity between what is emitted by UI server and what is drawn by the static JS in-browser is the same. so, BS for development testing.

diagram of what i mean by "parity"

A basic `index.html` file will be the base of the application.
BrowserSync will serve it and the bundled JavaScript to the browser, and it
will reload the browser when changes are made to the application code.

---

# application architecture

(diagram of previous messy browser architecture, highlight each one as you go from piece to piece of the app)


---

# Views


why react?
b/c it fulfills the DOM production aspect, regardless of context.

(maybe on an earlier slide, i can make it more explicit what my goals are for isomorphic)

Use React components for the View layer.

* functions
* composable
* context-agnostic
* can emit HTML strings

---

# Routing

`ReactRouter` was chosen because it is modeled after Ember's robust routing system.

---

# Server-Side Rendering (UI Server)

The Express application can compile the components as needed.
The components are rendered to an their HTML representation.

---

# Rendering the Router component (an aside)

Routing is duplicated on the server using our custom `ReactRouter` component.
We could not it render on the server the way that regular React components are rendered to HTML.

---

# Models and Controllers

Flux Stores are used instead of a traditional (mutative) Model layer (such as Backbone.Model).

Dispatchers and Actions replace controllers.

---

# Rendering Components with initial data (aside)

On the server, we inject the initial data for the stores via a global variable.

---

# HTTP/XHR (aside about the thing that talks to API)

we are highlighting the use of an isomorphic library, superagent

Retrieve the data from the remote host from either the server or the client.

If appropriate, cache the data per screen on the server-side.

---

template: cover

# And...so:

---

# Winning

(break this into multiple slides)

* What is the payoff after using this complicated setup?
    * The React/Flux stack was designed with scaling development by simplifying the mental model
        * The conventions of your stack are data-flow centric, not object-mutation centric
        * (If you think about an organization, you're focused on what people do, and not what they're called)
    * Likewise, you allow your developers to play to their strengths
        * Back end can build out APIs
        * Front end can focus on performant UIs
            * Per-screen API calls can be aggregated and cached on the Node server
            * Component-based styling lends itself to styleguide driven development


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

# Still climbing

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

# Thank you!

![cute cat gif here]()

## @radishmouse, @bignerdranch


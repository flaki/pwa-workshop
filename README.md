# Empire TODO

# Quickstart
> npm install
> npm run start

Open the demo at http://localhost:8888

## TOC:
* v0 - no offline support
* v1 - app shell caching for performance
* v1b - sw for just PWA features (add-to-homescreen, push) (TODO)
* v2 - "appcache manifest"-ish network-first caching
* v3 - cache-first caching with separate caches
* v4 - local API data caching/synthetic responses (TODO)
* v4b - API data syncing into local indexDB/synthetic responses (TODO)
* v5 - POST method fallback/background sync (TODO)
* v6 - interacting with the main thread (postMessage on cache update) (TODO)
* v7 - interacting with the service worker (interactive caching with postMessage) (TODO)

# Getting started

## Files
- `css/style.css` - basic stylesheet
- `img/*` - image assets for the page, icons etc.
- `data.json` - initial data and schema used by the backend
- `v0` - `vN` - service worker applications of various (increasing) complexity, see below

# Demos

This repository contains the implementation of a rudimentary TODO application, showcasing
the different usecases and powerful features of a serive-worker enhanced webapplication.

The various gains range from performance improvements, network-failure-tolerance through
offline support and first-class offline first behavior. These demos focus on the data
model, network interactions etc (the so-called "business logic") of the app, rather
than the UI frontend parts - but keep in mind, both an intuitive, responsive UI
and a fault-tolerant offline-first backend are essential for building a web application
(sometimes referred to as a "progressive webapp") that's intended to compete with
native applications in usability and user engagement.

## Technologies and web API/JavaScript features used

### Arrow functions
...

### Promises
...

### Fetch API
...

### Cache API
...



## *"v0":* no service worker

The first demo is the simplest, just to showcase the basic structure of the app we
will be using for the more contrived demos. The app includes both a frontend (the
TODO webapplication itself) and a backend (a locally-runnable node.js application
that serves the app UI and backend API for testing).

### Running
Make sure you have all [dependencies](#Quickstart) installed, then run `npm run start`
in the console and open http://localhost:8888/v0/ in a browser.

### Code Guide
server.js uses data.json
app.js uses fetch()
GET + POST to API endpoint /api/todos

### Notes
We want offline support.
First we want the application to at least load - to do that, we need to cache some
essential resources and serve them when there's no network connection.

This first step will also enable us to take advantage of the extra performance
service-worker-cached resources are able to provide, as well as the added flexibility
and control over cached resources (no more cache-bustin' ;D).

**Application Shell**  
> The app shell model makes a distinction between assets required to render
> the minimal application UI (toolbars, header, menus, etc - the "shell" of the app)
> and assets that the application will use to display user-facing information
> (a.k.a. "content").  
> Contrary to the content, app shell assets infrequently change and are usually
> countably numerous, whereas content resources may change frequently and there could
> be any of them.



## *"v1":* static asset caching for performance

In this demo we create our first-ever service worker. Here we are not really looking
into solving *all* our problems, rather just trying to understand the main concepts
behind the technology.

This exercise may also come handy for those who'd want to progressively enhance
their (pre-existing) application with a service worker, and leverage the increased
control and performance a service worker provides via serving pre-cached app assets.

To further explore this "no-real-offline-features" approach, please refer to *v1b*,
but plase also make sure to read the [disclaimer](#v1b-disclaimer) attached why
disregarding offline support isn't a recommended practice (from a progressive
enhancement perspective).

### Running
Make sure you have all [dependencies](#Quickstart) installed, then run `npm run start`
in the console and open http://localhost:8888/v1/ in a browser.

### Code Guide
New `service-worker.js`.
Need to register the service worker script - from JavaScript with `navigator.serviceWorker.register()`.
Returns a promise.
we can put this into a different file (we will).

In `service-worker.js`.
Handle events
SW lifetime.
Registered/active.
Handle events (extensible): fetch, push, etc...
caches.match returns a promise, result is null on no-match or cached object.
reminder: `return x||do_something_else();` is *short-circuit*, e.g. works as
`if (x) return x; else return do_something_else();`.

**`<event>.respondWith()`**
> ...

**`<event>.waitUntil()`**  
> ...

**importScripts()**  
> anti-spaghetti in workers, import code from other files.
> importScripts files in a service worker are automatically cached
> note: early spec versions didn't start a sw update on imported script changes,
> but [later revisions fixed that](https://github.com/slightlyoff/ServiceWorker/issues/839#issuecomment-236256162)
> (not in any of the implementations yet at time of writing).


### Notes
Now our app loads but is totally useless, content data is unavailable still. We
want the app to be actually usable offline (even if just in a limited fashion) for
this whole hassle to be worth it, that's where *offline-first* will come in - we
want to be moving towards *offline-first* behavior.

**Offline-first**
> Offline first approaches hold the network as a progressive enhancement (a.k.a.
> "nice-to-have") feature, in that they work perfectly without network connection
> at any time, and only use the network connection for synchronizing application
> state with remote nodes/servers and communication when it becomes available.
>
> Also important aspect of offline-first approaches is to remove the overall
> reliance on the network from the user interactions and make sure users are
> not kept waiting in limbo because of network issues - but user interactions
> are synced and communicated towards the network in the background when it's
> possible. The goal of this is removing or reducing the negative effect of
> bad/slow network conditions on the user experience just as much as
> providing offline functionality

**Lifetime of a service worker**  
> updates
> etc.

**Service workers vs Cache API vs HTTP Cache**
> Rule of thumb: service workers always come first. The HTTP cache is part of the
> network stack, so it is only consulted when a request falls back to the network.
>
> This also means that a "network" request might not, in fact come from the network,
> when e.g. there is a cached version of the asset and the caching headers make it
> valid still - this may or may not be a problem for one's usecase but extra attention
> should be taken into making sure up-to-to date assets always reach the end user.



## *v1b:* add-to-homescreen and push

### Running

### Code Guide

https://www.npmjs.com/package/web-push

### Notes

*disclaimer* it's not nice to not-provide at least rudimentary offline experience
"this app needs internet connection" is the minimum, but even that's not very user-friendly.
showing stale content is ok.

Also, please note that service workers have a startup cost.

**Startup cost of service workers**  
> As you might imagine, as service workers become more widely used, your browser
> will end up a bunch of service worker installs active at any given time. To
> avoid the memory and CPU costs and the impact on battery life of constantly
> running (or even, idle) service workers, the spec is written so the browser
> can (and will) shut down service workers at-will, any time, without warning.
>
> With all the gains this of this above behavior, comes a drawback, too - namely
> on any event dispatched to a service worker, if the service worker script is not
> already running, this will impact processing speed. Depending on circumstances
> and browser version, the time between event dispatch and service worker response
> could be several hundred milliseconds, which is already a noticeable lag.
>
> It is important to note, that this only affects a site which has no running
> service worker, such as on initial cold start - for example, if you had the webapp
> recently opened, or just received a push notification, which already spun up the
> service worker, no delay is observed.
> https://github.com/w3c/ServiceWorker/issues/920#issuecomment-229015463



## *v2:* network-first approach with offline fallback
Before we dive into an offline-first approach we will look into using another,
frequently used and rather straightforward pattern, the network-first (with fallback)
method.

This demo caches any accessed content when network is available, and provides
fallback content, loaded from the cache for offline scenarios (offline fallback).

### Running

### Code Guide

sw-dynamic.js

fetch

We create a copy of the response in `intoCache` by cloning the original response
received from the fetch (`response.clone()`). We use this variable then to open
our dynamic cache and store the response, keyed by the original request, so later
we can use it as fallback when network connectivity is down.

catch() cache

### Notes
So while this behavior is similar (but not the same) as an
`appcache.manifest`-defined behavior (in that it's provides fallbacks to counter
network failures), it is not very useful.

For example, we have lost the performance gains of service worker caching, since
all non-static asset requests first go to the network, which even with good network
conditions results in latency (and also, unneccessary battery/bandwidth consumption).
But even in this rather simple example, the real power of service workers shines
through - the flexibility. We already know how to solve the above performance
problem: just look in all caches. This may or may not solve our problem depending
on our application use case, but we can certainly work our code to improve and
cater whatever need arises so we can make sure we cover all our bases, making
the appropriate tradeoffs to fit our needs and expectations.

Some techiques:
* **Partition fetch handler** - use url prefixes and corresponding caches to handle
  requests differently

**`<response>.clone()`**  
When one needs to use a response multiple times (a response generally can only
be used once) one needs to clone the response first (as many times as many extra
times one plans to use it).  
[Response.clone() docs at MDN](https://developer.mozilla.org/en-US/docs/Web/API/Response/clone)

This seemingly superfluous behavior is actually quite important for browser
implementations, since this way they can recycle the memory used by the response
data (which can be several hundreds of megabytes, even) as soon as one used up
the response data (in the original request, as well as all "clones").

**Offline scenarios**  
* True offline scenarios (see below) and "lie-fi"
* "Airplane" mode, no physical network connection
* Connected to network but no internet connection (captive portal etc.)
* Host (application/API server) down or overloaded


**Lie-fi**  
The connection seemingly exists and has access to the internet, but
because of various network impediments, no data is coming through.
* Airbnb/hotel room has terrible wifi
* Cafe/public hotspot has terrible wifi/is overcrowded
* The user is roaming/in the countryside (e.g. on 2G or spotty network)
* User is in a huge crowd and mobile network is breaking down
* User is on a flight/bus/train wifi
* User is (on the) underground



## *v3:* - cache-first caching with separate caches

### Running

### Code Guide

### Notes


## *v4:*:

### Running

### Code Guide

### Notes



## *v5:* POST requests and background syncing
As you have seen, the Cache API can not be suited to "offline" POST-based requests.

What would be the expectation on such requests in an offline-first approach? Well,
first of all, the app needs to "get out of the way" as fast as possible, here this
mostly means "accept the interaction, show it locally, and synchronize it to the
server in the background".

To pull this off, we will use a very simple local solution using `indexedDB`
storage and the Background Sync API to periodically sync these changes to the
server.

### Running

### Code Guide

### Notes

# Used assets
* Kepler10b_artist.jpg - public domain, NASA [(source)](http://www.nasa.gov/topics/universe/features/rocky_planet.html)
* logo.png - public domain, Sensible World [(source)](https://www.iconfinder.com/icons/216969/death_space_station_star_icon)


# Impressum

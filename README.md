JourneyMap Webmap Client
========================

[Website](https://journeymap.info) | [Discord](https://discord.gg/eP8gE69)

This repository contains the rewritten client portion of the JourneyMap Webmap. **This project is currently a
work-in-progress!**

Due to some technical debt we encountered while working with the Google Maps API, we decided to rebuild the webmap
using [Vue](https://vuejs.org/) and [Leaflet](https://leafletjs.com/). We believe that these frameworks will
eventually result in something easier to work with (and therefore more maintainable) in comparison to the old
webmap.

**Please note**: _This is a development repository. If you're a JourneyMap user, you do not need anything in this
repo - everything you need will be included with the JourneyMap mod itself when we make a release._

Contributing
============

We're huge fans of the open source community, and we're happy to accept pull requests. That said, we would prefer
that you [join the discord server](https://discord.gg/eP8gE69) and have a chat with us about it first. This allows
us to cooperate with you and ensure that your PR makes sense, and isn't stepping on anyone else's toes.

Please also take a look at the [Code of Conduct](CONDUCT.md) before posting an issue, PR or comment.

Working with this project
=========================

In order to work with the webmap client, you'll need to set up a few things.

* OpenJDK 1.8 or later
* NodeJS 13.1 or later
* NPM 6.12 or later

In addition, we make use of IntelliJ IDEA - so the project will be geared around that. Feel free to use whatever
IDE or editor suits you, we just can't help you with editor-specific issues.

Setting Up
----------

1. If you have direct access to the repository, then clone it. If you don't (or you don't know what that means), then
   click the "Fork" button at the top right to create a fork under your own GitHub account, and fork that.
2. Create a branch for the changes you're making. Do not push directly to `master`, even if you're on a fork!
3. Install the project dependencies using `npm install --save`.

Building
--------

To build a JAR containing a Webpack bundle of the project's assets, simply run `gradlew build`. Use `./gradlew build` 
on Linux.

Testing
-------

**Please note:** These instructions currently only apply to people with direct access to the JourneyMap codebase, as 
currently the version that implements support for the `journeymap.webmap.assets_root` property is unreleased. Once it 
has released, anyone using that version or later will be able to follow these instructions.

Once you've made your changes, you can tell JourneyMap to load the webmap's static assets from a directory on your
filesystem. This will allow you to make changes to the webmap client and simply reload your browser tab to test
changes, instead of having to repack everything and restart Minecraft.

In your Minecraft launcher, find the setting that allows you to supply extra arguments, and add the following to it,
assuming that you've cloned the webmap client to `/home/username/webmap-client`:

```bash
-Djourneymap.webmap.assets_root="/home/username/webmap-client/src/main/resources/assets/journeymap/web"
```

Once you've started Minecraft with this argument applied, you should see the following in the console output:

```
Detected 'journeymap.webmap.assets_root' property, serving static files from: /home/gdude/webmap-client/src/main/resources/assets/journeymap/web
```

That's all you need to do. Just head to the full screen map and enable the webmap as usual, and you're good to go!

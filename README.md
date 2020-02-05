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

**Please note:** The version of JourneyMap that implements support for the `journeymap.webmap.assets_root` property 
is unreleased. If you'd like to work on the webmap client, please [join the discord server](https://discord.gg/eP8gE69)
and ask to be given a testing-only JAR, and we'll give you a hand.

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
Detected 'journeymap.webmap.assets_root' property, serving static files from: /home/username/webmap-client/src/main/resources/assets/journeymap/web
```

If you're on Windows, you'll need to use two backslashes in your path instead of one.

That's all you need to do. Just head to the full screen map and enable the webmap as usual, and you're good to go!

Endpoints
=========

These are the endpoints that are currently exposed by the JourneyMap mod for use with the webmap. Feel free to open
an issue if the feature you're working on requires changes or additions to this list!

GET /
-----

This endpoint just returns the contents of `index.html`. It's powered by the static files handler, as detailed in the
next section.

GET /:path-or-filename
----------------------

This endpoint is also a static file handler, which is configured for files within `assets/journeymap/web`. This may
be configured at runtime using the `journeymap.webmap.assets_root` property to enable easier testing - see the "Testing"
section above for more information.

GET /data/:type
---------------

Parameters:

* `type` - The type of data to query for. Must be one of `all`, `animals`, `mobs`, `images`, `messages`, `player`, 
  `players`, `world`, `villagers` or `waypoints`
* `image.since` - Required parameter when `type` is set to `all` or `images`; undocumented as of right now 

This endpoint returns a collection of data based on the `type` parameter that was provided. This will return a JSON
object containing the requested data.

### Sample data

See below for a list of keys and associated data returned (in JSON format) for each of the data types. Don't worry
if something is missing - we'll get around to adding it at some point!

This data will be moved from the README to somewhere more sensible later on.

**Type: `all`**

* `world`: Provides some information on the world the player is currently active on
    * `name`: The name of the world
    * `dimension`: The number of the current dimension
    * `time`: The current time, in ticks
    * `hardcore`: A boolean representing whether hardcode mode is enabled
    * `singlePlayer`: A boolean representing whether the player is playing on a single-player world
    * `features`: An object with a set of keys and boolean values representing which features are enabled
        * Possible keys: `MapSurface`, `RadarAnimals`, `MapCaves`, `RadarVillagers`, `RadarMobs`, `RadarPlayers`, `MapTopo`
    * `jm_version`: The current version of JourneyMap
    * `latest_journeymap_version`: The latest Curse release of Journeymap
    * `mc_version`: The current version of Minecraft
    * `mod_name`: The full name of the mod, including version numbers
    * `browser_poll`: The current value of the "Browser poll interval" setting in JM's settings
* `player`: Provides some information on the player and their location
    * `entityId`: The player's unique entity ID
    * `iconLocation`: The Minecraft ResourceLocation string for this player's skin texture
    * `hostile`: Always `false`
    * `posX`, `posY` and `posZ`: The player's position in the world, in Minecraft block-relative coordinates
    * `chunkCoordX`, `chunkCoordY` and `chunkCoordZ`: The chunk coordinates for the chunk the player is currently in
    * `heading`: The direction the player is facing, given as degrees represented by a float
    * `username`: The player's username
    * `biome`: The biome type the player is currently within
    * `dimension`: The dimension the player is currently within
    * `underground`: A boolean representing whether the player is underground
    * `invisible`: A boolean representing whether the player has the "Invisible" potion effect
    * `sneaking`: A boolean representing whether the player is sneaking
    * `passiveAnimal`: Always `false`
    * `npc`: Always `false`
    * `color`: _Currently unknown_
* `images`: Provides information on which tiles have been modified since the time given in the `image.since` parameter
    * `since`: The value of the `image.since` parameter
    * `queryTime`: The time of the query being processed by the server
    * `regions`: An array of regions that have had their tiles updated
        * Each element is an array of `x`, `z` coordinates (tiles are generated per region)
* `waypoints`: Provides an object containing the player's waypoints
    * Each object is keyed based on its ID, as shown below
    * `id`: The waypoint's unique ID, usually in the format `name_x,y,z` - but don't rely on this value for anything more than an identifier
    * `name`: The given name of the waypoint, which usually defaults to `x, z`
    * `icon`: The name of the icon used for this waypoint
    * `x`, `y` and `z`: The waypoint's position in the world, in (floored) Minecraft block-relative coordinates
    * `r`, `g` and `b`: The waypoint's RGB colour values
    * `enable`: A boolean representing whether the waypoint is enabled
    * `type`: The waypoint type (_no information is currently available on the list of possible types_)
    * `origin`: The modid for the mod that created the waypoint (`journeymap` for our own)
    * `dimensions`: An array of integers representing dimensions this waypoint is valid for
    * `persistent`: A boolean representing whether this waypoint will be saved to disk by JourneyMap
* `animals`: Currently, always an empty object for the `all` data type
* `mobs`: Currently, always an empty object for the `all` data type
* `players`: Currently, always an empty object for the `all` data type
* `villagers`: Currently, always an empty object for the `all` data type

**Type: `animals`**

This endpoint returns an object representing all of the animals that are currently being shown on the map.

* Each animal object is keyed based on the unique entity ID of the animal, prepended with `id`
* The keys given here match the keys in the `player` object detailed in the `all` type above, with the following differences:
    * Removed keys: `username`, `biome`, `underground`

**Type: `mobs`**

This endpoint returns an object representing all of the mobs that are currently being shown on the map.

* Each mob object is keyed based on the unique entity ID of the mob, prepended with `id`
* The keys given here match the keys in the `animal` objects detailed above

No sample data is available just yet, we'll get around to it.

**Type: `villagers`**

This endpoint returns an object representing all of the villagers that are currently being shown on the map.

* Each villagers object is keyed based on the unique entity ID of the villagers, prepended with `id`
* The keys given here match the keys in the `animal` objects detailed above, with the following differences:
    * Key added: `profession` - The profession assigned to this villager

GET /logs
---------

This endpoint returns the contents of the `journeymap.log` file.

POST /properties
----------------

This endpoint provides a way to change the webmap properties - essentially, a set of settings. A setting is modified
by providing it as a query parameter. To set a property, the parameter should be either `"true"` or `"false"`.

Properties:

* `showCaves` - Whether to auto-switch to cave mode
* `showEntityNames` - Whether to show pet names, NPC names, etc
* `showGrid` - Whether to show a grid overlaid onto the map
* `showSelf` - Whether to show the player on the map
* `showWaypoints` - Whether to show waypoints on the map

GET /resources
--------------

This endpoint provides a way to retrieve a resource registered by Minecraft's resource loader. It will only allow
you to retrieve a `.png` file - the URL for this endpoint can be embedded directly as an image.

Parameters:

* `resource` - The Minecraft ResourceLocation string representing the resource to get (`modid:/path`)

GET /skin/:username
-------------------

Parameters:

* `username` - The username of the player to get the skin data for

This endpoint simply returns image data from the texture cache, representing the head part of a player's skin in PNG
format. The player's skin must be in the texture cache for this to work (so they must have been online during this
session).

GET /tiles/tile.png
-------------------

Parameters:

* `x` - The "x" coordinate of the tile
* `y` - The "y" coordinate of the tile; this is only applicable for cave maps and represents the map layer
* `z` - The "z" coordinate of the tile
* `dimension` - The numerical dimension ID to retrieve the map for
* `mapTypeString` - The map type; must be one of `day`, `night`, `surface`, `topo` or `underground`
* `zoom` - A numerical value representing the map zoom level

This endpoint returns a map tile in PNG format, corresponding with the above parameters.

Please note that the `dimension` parameter does not change which world the map is displaying. The effect of this
parameter is currently undocumented.

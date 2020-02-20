JourneyMap Webmap Client
========================

[![Website](https://img.shields.io/badge/Website-journeymap.info-FF7139?logo=Mozilla%20Firefox)](https://journeymap.info) [![Discord](https://img.shields.io/discord/239040424214396929?color=7289DA&label=Discord&logo=Discord)](https://discord.gg/eP8gE69) [![API Docs](https://img.shields.io/badge/Apiary-API%20Docs-55B7B1?logo=data:image/svg%2bxml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjI1NnB4IiBoZWlnaHQ9IjI1OXB4IiB2aWV3Qm94PSIwIDAgMjU2IDI1OSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCI+CiAgICA8ZGVmcz4KICAgICAgICA8bGluZWFyR3JhZGllbnQgeDE9IjEwMC4wMTE1ODglIiB5MT0iNDkuOTkwNTA1OSUiIHgyPSItNi40ODE5NTczN2UtMTAlIiB5Mj0iNDkuOTkwNTA1OSUiIGlkPSJsaW5lYXJHcmFkaWVudC0xIj4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzM3QkRBNiIgb2Zmc2V0PSIwJSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjOEFEM0I4IiBvZmZzZXQ9IjEwMCUiPjwvc3RvcD4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iMTAwLjAxMTU4OCUiIHkxPSI0OS45OTgwOTM2JSIgeDI9Ii0zLjg4ODYyODA0ZS0wOSUiIHkyPSI0OS45OTgwOTM2JSIgaWQ9ImxpbmVhckdyYWRpZW50LTIiPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjNEJCNkFEIiBvZmZzZXQ9IjUwJSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjNzhCQkMxIiBvZmZzZXQ9IjEwMCUiPjwvc3RvcD4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iLTAuMDE4NDM4NDM4NCUiIHkxPSI0OS45OTgwOTM2JSIgeDI9IjEwMC4wMjMxODMlIiB5Mj0iNDkuOTk4MDkzNiUiIGlkPSJsaW5lYXJHcmFkaWVudC0zIj4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzQzNzlBNyIgb2Zmc2V0PSIwJSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjN0NDOUI4IiBvZmZzZXQ9IjEwMCUiPjwvc3RvcD4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPC9kZWZzPgoJPGc+CgkJPHBhdGggZD0iTTEyNy42OTM0MTMsMzYuODY3MDY1OSBMMTI3LjY5MzQxMywxMTAuNDQ3OTA0IEwxOTEuNTQwMTIsNzMuNTgwODM4MyBMMTkxLjU0MDEyLDAgTDEyNy42OTM0MTMsMzYuODY3MDY1OSBMMTI3LjY5MzQxMywzNi44NjcwNjU5IFoiIG9wYWNpdHk9IjAuNSIgZmlsbD0iIzEzQTA0OSI+PC9wYXRoPgoJCTxwYXRoIGQ9Ik0xMjcuNjkzNDEzLDM2Ljg2NzA2NTkgTDYzLjg0NjcwNjYsMCBMNjMuODQ2NzA2Niw3My43MzQxMzE3IEwxMjcuNjkzNDEzLDExMC42MDExOTggTDEyNy42OTM0MTMsMzYuODY3MDY1OSBMMTI3LjY5MzQxMywzNi44NjcwNjU5IFoiIG9wYWNpdHk9IjAuNSIgZmlsbD0iI0EyQ0MzOSI+PC9wYXRoPgoJCTxwYXRoIGQ9Ik0xOTEuNTQwMTIsMCBMMTI3LjY5MzQxMywzNi44NjcwNjU5IEw2My44NDY3MDY2LDAgTDAsMzYuODY3MDY1OSBMMTI3LjY5MzQxMywxMTAuNjAxMTk4IEwyNTUuMzEwMTgsMzYuODY3MDY1OSBMMTkxLjU0MDEyLDAgTDE5MS41NDAxMiwwIFoiIG9wYWNpdHk9IjAuOSIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudC0xKSI+PC9wYXRoPgoJCTxwYXRoIGQ9Ik0xMjcuNjkzNDEzLDExMC42MDExOTggTDAsMzYuODY3MDY1OSBMMCwxMTAuNjAxMTk4IEw2My44NDY3MDY2LDE0Ny40NjgyNjMgTDYzLjg0NjcwNjYsMjIxLjEyNTc0OSBMMTI3LjY5MzQxMywyNTcuOTkyODE0IEwxOTEuNTQwMTIsMjIxLjEyNTc0OSBMMTkxLjU0MDEyLDE0Ny40NjgyNjMgTDI1NS4zMTAxOCwxMTAuNjAxMTk4IEwyNTUuMzEwMTgsMzYuODY3MDY1OSBMMTI3LjY5MzQxMywxMTAuNjAxMTk4IEwxMjcuNjkzNDEzLDExMC42MDExOTggWiIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudC0yKSI+PC9wYXRoPgoJCTxwYXRoIGQ9Ik0xMjcuNjkzNDEzLDExMC42MDExOTggTDEyNy42OTM0MTMsMjU3Ljk5MjgxNCBMMTkxLjU0MDEyLDIyMS4xMjU3NDkgTDE5MS41NDAxMiwxNDcuNDY4MjYzIEwyNTUuMzEwMTgsMTEwLjYwMTE5OCBMMjU1LjMxMDE4LDM2Ljg2NzA2NTkgTDEyNy42OTM0MTMsMTEwLjYwMTE5OCBMMTI3LjY5MzQxMywxMTAuNjAxMTk4IFoiIGZpbGw9InVybCgjbGluZWFyR3JhZGllbnQtMykiPjwvcGF0aD4KCQk8cGF0aCBkPSJNMTI3LjY5MzQxMywxODQuMjU4NjgzIEwxMjcuNjkzNDEzLDI1Ny45OTI4MTQgTDE5MS41NDAxMiwyMjEuMTI1NzQ5IEwxMjcuNjkzNDEzLDE4NC4yNTg2ODMgTDEyNy42OTM0MTMsMTg0LjI1ODY4MyBaIiBvcGFjaXR5PSIwLjA1IiBmaWxsPSIjMjMxRjIwIj48L3BhdGg+CgkJPHBhdGggZD0iTTEyNy42OTM0MTMsMjU4LjE0NjEwOCBMMTI3LjY5MzQxMywxODQuNDExOTc2IEw2My44NDY3MDY2LDIyMS4yNzkwNDIgTDEyNy42OTM0MTMsMjU4LjE0NjEwOCBMMTI3LjY5MzQxMywyNTguMTQ2MTA4IFoiIG9wYWNpdHk9IjAuMSIgZmlsbD0iIzIzMUYyMCI+PC9wYXRoPgoJCTxwYXRoIGQ9Ik02My44NDY3MDY2LDczLjczNDEzMTcgTDAsMTEwLjYwMTE5OCBMNjMuODQ2NzA2NiwxNDcuNDY4MjYzIEwxMjcuNjkzNDEzLDExMC42MDExOTggTDYzLjg0NjcwNjYsNzMuNzM0MTMxNyBMNjMuODQ2NzA2Niw3My43MzQxMzE3IFoiIG9wYWNpdHk9IjAuMDUiIGZpbGw9IiMyMzFGMjAiPjwvcGF0aD4KCQk8cGF0aCBkPSJNMTkxLjU0MDEyLDczLjczNDEzMTcgTDEyNy42OTM0MTMsMTEwLjYwMTE5OCBMMTkxLjU0MDEyLDE0Ny40NjgyNjMgTDI1NS4zMTAxOCwxMTAuNjAxMTk4IEwxOTEuNTQwMTIsNzMuNzM0MTMxNyBMMTkxLjU0MDEyLDczLjczNDEzMTcgWiIgb3BhY2l0eT0iMC4wNSIgZmlsbD0iIzIzMUYyMCI+PC9wYXRoPgoJPC9nPgo8L3N2Zz4K)](https://jmwebmap.docs.apiary.io/)

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

New to Git? Check out [the Pro Git book](https://git-scm.com/book/)

1. If you have direct access to the repository, then clone it. If you don't (or you don't know what that means), then
   click the "Fork" button at the top right to create a fork under your own GitHub account, and clone that.
2. Create a branch for the changes you're making. Do not push directly to `master`, even if you're on a fork!
3. Install the project dependencies using `npm install --save`.

Building
--------

To build a JAR containing a Webpack bundle of the project's assets, simply run `gradlew build`. Use `./gradlew build` 
on Linux.

Testing
-------

**Please note:** The version of JourneyMap that implements support for the following properties 
is unreleased. If you'd like to work on the webmap client, please [join the discord server](https://discord.gg/eP8gE69)
and ask to be given a testing-only JAR, and we'll give you a hand.

Once you've made your changes, you can tell JourneyMap to load the webmap's static assets from a directory on your
filesystem. This will allow you to make changes to the webmap client and simply reload your browser tab to test
changes, instead of having to repack everything and restart Minecraft.

In your Minecraft launcher, find the setting that allows you to supply extra arguments and add the following to it,
assuming that you've cloned the webmap client to `/home/username/webmap-client`:

```bash
-Djourneymap.webmap.assets_root="/home/username/webmap-client/src/main/resources/assets/journeymap/web"
```

**Note:** _If you're on Windows, you'll need to use two backslashes in your path instead of one._

Once you've started Minecraft with this argument applied, you should see the following in the console output:

```
Detected 'journeymap.webmap.assets_root' property, serving static files from: /home/username/webmap-client/src/main/resources/assets/journeymap/web
```

That's all you need to do. Just head to the full screen map and enable the webmap as usual, and you're good to go!

### Testing polygon support

If you need to test polygon support, you can set the `journeymap.map_testing` property in a similar manner to any
value you like, and a button will be added to the full-screen map which will add polygons denoting Minecraft regions
to the map. If it doesn't show up, move the map a little and toggle the option a couple times.

```bash
-Djourneymap.map_testing="brother, may i have some loops?"
```

API Documentation
-----------------

Our REST API has been fully documented! Instead of finding it in this README, you can find the documentation
[over at Apiary](https://jmwebmap.docs.apiary.io/).
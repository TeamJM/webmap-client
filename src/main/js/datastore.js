"use strict"

import Bowser from "bowser"
import L from "leaflet"

import { JMTileLayer } from "./tile"
import { Point } from "leaflet"

import dayIconActive from "../images/day-active.png"
import followIconOff from "../images/follow-off.png"
import jmIcon from "../images/journeymap.png"
import nightIcon from "../images/night.png"
import topoIcon from "../images/topo.png"
import undergroundIcon from "../images/underground.png"

const browser = Bowser.getParser(window.navigator.userAgent)

export default {
    state: {
        "L": L,

        map_bounds: [
            new Point(- 29999984, - 29999984),
            new Point(29999984, 29999984),
        ],

        followMode: false,
        jmIcon: jmIcon,

        dayIcon: dayIconActive,
        followIcon: followIconOff,
        nightIcon: nightIcon,
        topoIcon: topoIcon,
        undergroundIcon: undergroundIcon,

        markers: [],
        polygons: [],
        tiles: {},
        waypoints: [],

        caveMappingAllowed: true,
        surfaceMappingAllowed: true,
        topoMappingAllowed: true,

        playerBiome: "N/A",
        playerWorld: "N/A",
        playerX: "~",
        playerY: "~",
        playerZ: "~",

        logContent: null,
        logModalActive: false,
        logsLoading: false,

        isSafari: browser.isBrowser("safari"),
        status: "other",

        settingsVisible: false,

        followMapType: true, // Follow mode follows minimap map type

        visiblePlayer: true,

        visibleAnimals: true,
        visibleMobs: true,
        visiblePlayers: true,
        visibleVillagers: true,

        visiblePolygons: true,
        visibleWaypoints: true,

        JMTileLayer: JMTileLayer,
    },
}

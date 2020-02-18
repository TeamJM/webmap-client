"use strict";

import {Point} from "leaflet";

import dayIconActive from "../images/day-active.png";
import followIconOff from "../images/follow-off.png"
import jmIcon from "../images/journeymap.png"
import nightIcon from "../images/night.png";
import topoIcon from "../images/topo.png";
import undergroundIcon from "../images/underground.png";

import {JMTileLayer} from "./tile";

export default {
    state: {
        map_bounds: [
            new Point(-29999984, -29999984),
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

        status: "other",

        settingsVisible: false,

        visiblePlayer: true,

        visibleAnimals: true,
        visibleMobs: true,
        visiblePlayers: true,
        visibleVillagers: true,

        visiblePolygons: true,
        visibleWaypoints: true,

        JMTileLayer: JMTileLayer,
    },
};

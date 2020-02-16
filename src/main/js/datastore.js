"use strict";

import {Point} from "leaflet";
import dayIconActive from "../images/day-active.png";

import followIconOff from "../images/follow-off.png"
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

        dayIcon: dayIconActive,
        followIcon: followIconOff,
        nightIcon: nightIcon,
        topoIcon: topoIcon,
        undergroundIcon: undergroundIcon,

        markers: [],
        polygons: [],
        tiles: {},
        waypoints: [],

        mouseCoords: "0, 0",
        status: "other",

        JMTileLayer: JMTileLayer,
    },
};

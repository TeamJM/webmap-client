"use strict";

import Vue from "vue";

import Buefy from "buefy";
import "buefy/dist/buefy.css";

import {LCircleMarker, LMap, LMarker, LTileLayer} from "vue2-leaflet";

import "leaflet-rotatedmarker"

import {Icon} from "leaflet";
import "leaflet/dist/leaflet.css"

import datastore from "./datastore";
import {methods} from "./methods";
import "../css/index.css";

import MarkerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import MarkerIcon from "leaflet/dist/images/marker-icon.png"
import MarkerShadow from "leaflet/dist/images/marker-shadow.png"

Vue.component("l-map", LMap);
Vue.component("l-tile-layer", LTileLayer);
Vue.component("l-marker", LMarker);
Vue.component('l-circle-marker', LCircleMarker);

delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
    iconRetinaUrl: "/bundled/" + MarkerIcon2x,
    iconUrl: "/bundled/" + MarkerIcon,
    shadowUrl: "/bundled/" + MarkerShadow
});

Vue.config.devtools = true;
Vue.use(Buefy);

const app = new Vue({
    el: "#main",
    data: datastore.state,
    methods: methods,
});

window.app = app;  // To make it available for debugging and such

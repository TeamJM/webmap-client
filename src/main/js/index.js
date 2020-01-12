"use strict";

import Vue from "vue";

import Buefy from "buefy";
import "buefy/dist/buefy.css";

import {LMap, LMarker, LTileLayer} from "vue2-leaflet";
import {Icon} from "leaflet";
import "leaflet/dist/leaflet.css"

import datastore from "./datastore";
import "../css/index.css";

Vue.component("l-map", LMap);
Vue.component("l-tile-layer", LTileLayer);
Vue.component("l-marker", LMarker);

delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

Vue.use(Buefy);

const app = new Vue({
    el: "#main",
    data: datastore.state,
});

window.app = app;  // To make it available for debugging and such

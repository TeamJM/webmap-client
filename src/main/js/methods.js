"use strict";

import {JMIcon} from "./icon";
import {JM, JMError} from "./journeymap";
import {JMTileLayer} from "./tile";

let lastCenter = null;

export const methods = {
    centerUpdated: centerUpdated,
    getMarkerIconObj: getMarkerIconObj,
    mapReady: mapReady,
    toggleFollowMode: toggleFollowMode,
    updateZoom: updateZoom,

    getTileClass: (url, options) => {
        return new JMTileLayer(url, options);
    },
};

export function mapReady() {
    setInterval(
        () => {
            try {
                JM._checkForChanges().then()
            } catch (e) {
                if (e instanceof JMError) {
                    e.responseObj.text().then((text) => {
                        console.error(`Failed to check for tile changes: ${text}`)
                    })
                }
            }
        },
        1000)
}

export function updateZoom() {
    const mapElement = document.getElementById("map");
    const zoom = this.$refs.map.mapObject._zoom;

    if (zoom > 0) {
        mapElement.classList.add("pixelated")
    } else {
        mapElement.classList.remove("pixelated")
    }

    JM.setZoom(zoom);
}

export function getMarkerIconObj(marker) {
    return new JMIcon({
        "anchor": marker.anchor,
        "className": marker.className,
        "iconUrl": marker.url,
        "iconSize": marker.size,
    });
}

export function translateCoords(x, z, offset) {
    if (offset === undefined) {
        offset = 0;
    }

    return [(z * -1) + offset, x + offset]
}

export function toggleFollowMode() {
    JM.toggleFollowMode();
}

export function centerUpdated(center) {
    if (center === lastCenter) {
        return;
    }

    lastCenter = center;

    if (JM.followMode) {
        JM.setFollowMode(false);
    }
}
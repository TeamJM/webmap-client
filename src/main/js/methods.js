"use strict";

import {JM, JMError} from "./journeymap";
import {JMTileLayer} from "./tile";

export const methods = {
    mapReady: mapReady,
    updateZoom: updateZoom,

    getTileClass: (url, options) =>
    {
        return new JMTileLayer(url, options);
    }
};

export function mapReady()
{
    setInterval(
        () =>
        {
            try
            {
                JM._checkForChanges().then()
            }
            catch (e)
            {
                if (e instanceof JMError)
                {
                    e.responseObj.text().then((text) =>
                    {
                        console.error(`Failed to check for tile changes: ${text}`)
                    })
                }
            }
        },
        1000)
}

export function updateZoom()
{
    const mapElement = document.getElementById("map");
    const zoom = this.$refs.map.mapObject._zoom;

    if (zoom !== 0)
    {
        mapElement.classList.add("pixelated")
    }
    else
    {
        mapElement.classList.remove("pixelated")
    }
}

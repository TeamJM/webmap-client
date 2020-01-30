"use strict";

import {JM, JMError} from "./journeymap";
import {JMTileLayer} from "./tile";


export default {
    methods: {
        mapReady: mapReady,
        updateZoom: updateZoom,

        getTileClass: (url, options) =>
        {
            return new JMTileLayer(url, options);
        }
    }
};

function mapReady()
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

function updateZoom()
{
    JM.setZoom(this.$refs.map.mapObject._zoom);
}

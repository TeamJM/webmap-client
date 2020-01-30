"use strict";


export class JMError extends Error
{
    constructor(statusCode, errorText, responseObj)
    {
        super();

        this.statusCode = statusCode;
        this.errorText = errorText;
        this.responseObj = responseObj;
    }
}


class Journeymap
{
    constructor()
    {
        this.tiles = {};
        this.changedTiles = [];
        this.lastTileCheck = Date.now();

        this.currentDim = 0;
        this.currentMapType = "day";
        this.currentSlice = 0;
        this.currentZoom = 0;
    }

    async data(type, imagesSince)
    {
        let url = `/data/${type}`;

        if (imagesSince !== undefined)
        {
            url = url + `?images.since=${imagesSince}`
        }

        const response = await fetch(
            url,
            {method: "GET"}
        );

        if (!response.ok)
        {
            throw new JMError(response.status, response.statusText, response)
        }

        return await response.json()
    }

    async logs()
    {
        const response = await fetch(
            "/logs",
            {method: "GET"}
        );

        if (!response.ok)
        {
            throw new JMError(response.status, response.statusText, response)
        }

        return await response.json()
    }

    async getProperties()
    {
        const response = await fetch(
            "/properties",
            {method: "GET"}
        );

        if (!response.ok)
        {
            throw new JMError(response.status, response.statusText, response)
        }

        return await response.json()
    }

    async setProperties(properties)
    {
        const data = new FormData();

        for (let key of properties)
        {
            data.append(key, properties[key]);
        }

        const response = await fetch(
            "/properties",
            {method: "POST", body: data}
        );

        if (!response.ok)
        {
            throw new JMError(response.status, response.statusText, response)
        }

        return await response.json()
    }

    skinUrl(username)
    {
        return `/skin/${username}`
    }

    tileUrl(x, z, givenZoom)
    {
        let zoom = this.currentZoom;

        if (givenZoom !== undefined)
        {
            zoom = givenZoom;
        }

        let slug = this._slugifyTile(x, z, zoom);

        if (slug in this.tiles)
        {
            if (!this.changedTiles.includes(slug))
            {
                return this.tiles[slug]
            }

            this.changedTiles.splice(
                this.changedTiles.indexOf(slug), 1
            )
        }

        const dimension = this.currentDim,
            mapTypeString = this.currentMapType,
            y = this.currentSlice;

        const time = Date.now();  // This ensures that we don't end up with a cached URL
        const url = `/tiles/tile.png?x=${x}&y=${y}&z=${z}&dimension=${dimension}&mapTypeString=${mapTypeString}&zoom=${zoom}&t=${time}`;

        this.tiles[slug] = url;

        return url
    }

    async _checkForChanges()
    {
        let now = Date.now();
        let data = await this.data("images", this.lastTileCheck);

        for (let element of data.regions)
        {
            for (let i of Array(5).keys())
            {
                let slug = this._slugifyTile(element[0], element[1], i);

                if (!this.changedTiles.includes(slug))
                {
                    this.changedTiles.push(slug);
                }
            }
        }

        this.lastTileCheck = now;
    }

    _slugifyTile(x, z, givenZoom)
    {
        let dim = this.currentDim,
            type = this.currentMapType,
            y = this.currentSlice,
            zoom = this.currentZoom;

        if (givenZoom !== undefined)
        {
            zoom = givenZoom;
        }

        return `X ${x}, Y ${y}, Z ${z} / Dim ${dim}, Type ${type}, Zoom ${zoom}`
    }

    setZoom(zoom)
    {
        this.currentZoom = zoom;
    }
}

export const JM = new Journeymap();
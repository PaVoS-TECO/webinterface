define(["appState", "color", "multiColorGradient", "bounds", "recursiveRectangleGrid", "utcDateTime"], function(AppState, Color, MultiColorGradient, Bounds, RecursiveRectangleGrid, UTCDateTime) {
    var SERVER_URL = 'http://pavos.oliver.pw';
    var EDMS_PORT    = '8084';
    var CORE_PORT    = '7700';
    var GRAFANA_PORT = '3000';
    var GRAFANA_PANEL_TYPE = 'd-solo';
    var GRAFANA_PANEL_ID = '86xD1ahik';
    var GRAFANA_URL;
    
    // Latitude - Longitude
    var KARLSRUHE      = [49.007, 8.404];
    var KARLSRUHE_TECO = [49.013, 8.424];

    var LEAFLET_MAP_CONTAINER = "mapContainer";
    var BASEMAP_URL = "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";
    var BASEMAP_ATTRIBUTION = { attribution: "Positron", minZoom: 2, maxZoom: 15 };
    var INITIAL_COORDINATES = KARLSRUHE;
    var INITIAL_ZOOMLEVEL = 10;
    var IS_FULLSCREEN_AVAILABLE = true;
    var IS_MOUSE_COORDINATES_VISIBLE = true;

    var MAP;
    var MAP_BOUNDS;
    var MAP_STYLE_EMPTY_CLUSTER = {
        "fillColor": "#050505",
        "fillOpacity": 0.05,
        "color": "#050505",
        "opacity": 0.25,
        "weight": 1.5
    };
    var MAP_LAYER_SELECTED_CLUSTERS;
    var MAP_STYLE_SELECTED_CLUSTERS = {
        "fillColor": "#88ff00",
        "fillOpacity": 0.25,
        "color": "#55bb00",
        "opacity": 0.5,
        "weight": 4
    };
    var MAP_LAYER_HOVERED_OVER_CLUSTER;
    var MAP_STYLE_HOVERED_OVER_CLUSTER = {
        "fillColor": "#040404",
        "fillOpacity": 0.1,
        "color": "#040404",
        "opacity": 0.25,
        "weight": 4
    };

    var FILL_COLOR_OPACITY = 0.2;
    var BORDER_COLOR_OPACITY = 0.6;
    var BORDER_WEIGHT = 1.5;

    var COLOR_GRADIENTS;
    var COLOR_GRADIENTS_RANGE;
    var COLOR_GRADIENTS_DEFAULT = new MultiColorGradient([new Color("#0000ff"), new Color("#00ff00"), new Color("#ff0000")]);
    var COLOR_GRADIENTS_RANGE_DEFAULT = [-20, 50];

    var GRID;
    var CURRENT_GRID_LEVEL;
    var BOUNDS;
    var APP_STATE;

    var LIVE_MODE_ENABLED;
    var GEOJSON_ARRAY = [];
    var HISTORICAL_SNAPSHOT_AMOUNT = 10;
    var LEAFLET_ZOOM_TO_GRID_LEVEL_ARRAY = [3, 6];

    var HTTP_REQUEST_TIMEOUT = 30000;
    var EXPORT_TIMEOUT = 10000;
    var EXPORT_STATUS_TIMEOUT = 500;
    var DOWNLOAD_FORMAT = "zip";

    var SENSORTYPES_ARRAY;
    var EXPORTFORMATS_ARRAY;
    var REFRESH_STATES_ARRAY = ["Automatic", "Manual"];
    var CONTENT_TABLE = [["id", "temperature_celsius"], []];
    var CURRENT_CONTENT_TABLE_ARRAY;
    var CONTENT_TABLE_SELECTED_IDENTIFIER;

    var DEFAULT_LIVE_MODE_ENABLED = true;
    var DEFAULT_TIMEFRAME = [
        new UTCDateTime(
            2018, 1, 1, 0, 0, 0
        ),
        new UTCDateTime(
            2018, 9, 1, 0, 0, 0
        )
    ];
    var DEFAULT_LIVE_REFRESH_INTERVAL = 15000;
    var DEFAULT_HISTORICAL_REFRESH_INTERVAL = 1000;
    var DEFAULT_AUTOMATIC_REFRESH_ENABLED = false;
    
    return {
        SERVER_URL,
        EDMS_PORT,
        CORE_PORT,
        GRAFANA_PORT,
        GRAFANA_PANEL_TYPE,
        GRAFANA_PANEL_ID,
        GRAFANA_URL,

        KARLSRUHE,
        KARLSRUHE_TECO,

        LEAFLET_MAP_CONTAINER,
        BASEMAP_URL,
        BASEMAP_ATTRIBUTION,
        INITIAL_COORDINATES,
        INITIAL_ZOOMLEVEL,
        IS_FULLSCREEN_AVAILABLE,
        IS_MOUSE_COORDINATES_VISIBLE,

        MAP,
        MAP_BOUNDS,
        MAP_STYLE_EMPTY_CLUSTER,
        MAP_LAYER_SELECTED_CLUSTERS,
        MAP_STYLE_SELECTED_CLUSTERS,
        MAP_LAYER_HOVERED_OVER_CLUSTER,
        MAP_STYLE_HOVERED_OVER_CLUSTER,

        FILL_COLOR_OPACITY,
        BORDER_COLOR_OPACITY,
        BORDER_WEIGHT,

        COLOR_GRADIENTS,
        COLOR_GRADIENTS_RANGE,
        COLOR_GRADIENTS_DEFAULT,
        COLOR_GRADIENTS_RANGE_DEFAULT,

        GRID,
        CURRENT_GRID_LEVEL,
        BOUNDS,
        APP_STATE,

        HTTP_REQUEST_TIMEOUT,
        EXPORT_TIMEOUT,
        EXPORT_STATUS_TIMEOUT,
        DOWNLOAD_FORMAT,

        LIVE_MODE_ENABLED,
        GEOJSON_ARRAY,
        HISTORICAL_SNAPSHOT_AMOUNT,
        LEAFLET_ZOOM_TO_GRID_LEVEL_ARRAY,

        CONTENT_TABLE,
        CURRENT_CONTENT_TABLE_ARRAY,
        CONTENT_TABLE_SELECTED_IDENTIFIER,
        SENSORTYPES_ARRAY,
        EXPORTFORMATS_ARRAY,
        REFRESH_STATES_ARRAY,

        DEFAULT_LIVE_MODE_ENABLED,
        DEFAULT_TIMEFRAME,
        DEFAULT_LIVE_REFRESH_INTERVAL,
        DEFAULT_HISTORICAL_REFRESH_INTERVAL,
        DEFAULT_AUTOMATIC_REFRESH_ENABLED
    }
});
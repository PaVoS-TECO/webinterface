define(['jquery', 'appManager', 'appState', 'mapManager', 'fetchRoutine', 'exportRoutine', 'sensorReportRoutine',
        'recursiveRectangleGrid','recursiveRectangleCluster', 'bounds', 'dynamicHtmlBuilder', 
        'utcDateTime', 'gridUtil', 'leafletUtil', 'mathUtil', 'storageUtil', 'tableUtil', 'util', 'requestor', 'mapManager', 
        'leaflet', 'bootstrapDatetimepicker', 'bootstrapTouchspin'],
function($, AppManager, AppState, MapManager, FetchRoutine, ExportRoutine, SensorReportRoutine, 
         RecursiveRectangleGrid, RecursiveRectangleCluster, Bounds, DynamicHtmlBuilder, 
         UTCDateTime, GridUtil, LeafletUtil, MathUtil, StorageUtil, TableUtil, Util, Requestor, MapManager) {
    var exportModalTemp;
    var favoritesModalTemp;
    var addFavoritesModalTemp;
    var timeSettingsModalTemp;

    return {
        start: function(){
            this.initGlobalVariables();

            exportModalTemp = AppManager.APP_STATE.clone();
            sensortypeModalTemp = AppManager.APP_STATE.clone();
            favoritesModalTemp = new AppState();
            addFavoritesModalTemp = AppManager.APP_STATE.clone();
            timeSettingsModalTemp = AppManager.APP_STATE.clone();

            startStopChecked = true;

            this.initLeafletMap();
            this.initExportModal();
            this.initSensortypeModal();
            this.initFavoritesModal();
            this.initAddFavoriteModal();
            this.initContentTable();
            this.initTimestampSlider();
            this.initStartStopUpdateButtons();
            this.initTimeSettingsModal();
            this.initWindow();
        },

        initGlobalVariables: function() {
            AppManager.LIVE_MODE_ENABLED = AppManager.DEFAULT_LIVE_MODE_ENABLED;
            AppManager.APP_STATE = new AppState(
                undefined,
                [],
                AppManager.SENSORTYPES_ARRAY[0],
                AppManager.EXPORTFORMATS_ARRAY[0],
                AppManager.DEFAULT_TIMEFRAME,
                AppManager.DEFAULT_LIVE_REFRESH_INTERVAL,
                AppManager.DEFAULT_HISTORICAL_REFRESH_INTERVAL,
                AppManager.DEFAULT_AUTOMATIC_REFRESH_ENABLED
            );
        },

        initLeafletMap: function() {
            AppManager.MAP = LeafletUtil.createLeafletMap(
                AppManager.LEAFLET_MAP_CONTAINER,
                AppManager.BASEMAP_URL, AppManager.BASEMAP_ATTRIBUTION,
                AppManager.MAP_BOUNDS,
                AppManager.INITIAL_COORDINATES, AppManager.INITIAL_ZOOMLEVEL,
                AppManager.IS_FULLSCREEN_AVAILABLE, AppManager.IS_MOUSE_COORDINATES_VISIBLE
            );

            AppManager.MAP_LAYER_HOVERED_OVER_CLUSTER = LeafletUtil.createLayer();
            LeafletUtil.addLayer(AppManager.MAP, AppManager.MAP_LAYER_HOVERED_OVER_CLUSTER);
            AppManager.MAP_LAYER_SELECTED_CLUSTERS = LeafletUtil.createLayer();
            LeafletUtil.addLayer(AppManager.MAP, AppManager.MAP_LAYER_SELECTED_CLUSTERS);

            AppManager.BOUNDS = this.calculateViewedMapBounds();
            AppManager.CURRENT_GRID_LEVEL = this.calculateGridLevel();

            var _this = this;
            LeafletUtil.initializeLeafletMap(
                // The Leaflet map
                AppManager.MAP,
                // The function called by the mouseclick listener
                function(e) {
                    var cluster = AppManager.GRID.getClusterContainingCoordinate(
                        LeafletUtil.convertLatLngToCoordinate(e.latlng), 
                        AppManager.CURRENT_GRID_LEVEL
                    );

                    GridUtil.toggleClusterInClusterArray(
                        AppManager.APP_STATE.getSelectedClusters(),
                        cluster
                    );

                    LeafletUtil.togglePolygonsInLayerFromCoordinateArray(
                        AppManager.MAP_LAYER_SELECTED_CLUSTERS,
                        [
                            cluster.getCoordinates()
                        ],
                        AppManager.MAP_STYLE_SELECTED_CLUSTERS
                    );
                },
                // The function called by the mousemove listener
                function(e) {
                    var cluster = AppManager.GRID.getClusterContainingCoordinate(
                        LeafletUtil.convertLatLngToCoordinate(e.latlng), 
                        AppManager.CURRENT_GRID_LEVEL
                    );

                    LeafletUtil.updatePolygonsInLayerFromCoordinateArray(
                        AppManager.MAP_LAYER_HOVERED_OVER_CLUSTER,
                        [
                            cluster.getCoordinates()
                        ],
                        AppManager.MAP_STYLE_HOVERED_OVER_CLUSTER
                    );
                },
                // The function called by the mouseout listener
                function() {
                    LeafletUtil.resetLayer(AppManager.MAP_LAYER_HOVERED_OVER_CLUSTER);
                },
                // The function called by the zoomend listener
                function() {
                    AppManager.MAP.panInsideBounds(
                        AppManager.MAP_BOUNDS.toLeafletMapBounds(), 
                        { animate: false }
                    );
                    
                    AppManager.BOUNDS = _this.calculateViewedMapBounds();

                    AppManager.CURRENT_GRID_LEVEL = _this.calculateGridLevel();
                },
                // The function called by the dragend listener
                function() {
                    AppManager.MAP.panInsideBounds(
                        AppManager.MAP_BOUNDS.toLeafletMapBounds(), 
                        { animate: false }
                    );
                    
                    AppManager.BOUNDS = _this.calculateViewedMapBounds();

                    AppManager.CURRENT_GRID_LEVEL = _this.calculateGridLevel();
                },
            );
        },

        initExportModal: function() {
            DynamicHtmlBuilder.buildRadioButtonGroup('#exportModalSensorTypeRadioButtons', 'exportModalSensorTypeRadioButtons', AppManager.SENSORTYPES_ARRAY, AppManager.SENSORTYPES_ARRAY[0]);
            DynamicHtmlBuilder.buildRadioButtonGroup('#exportModalExportFormatRadioButtons', 'exportModalExportFormatRadioButtons', AppManager.EXPORTFORMATS_ARRAY, AppManager.SENSORTYPES_ARRAY[0]);

            // Adding Z (-> symbolizes +00:00) at the end of the format doesn't work yet
            $('#exportFrom-datetimepicker').datetimepicker({
                format: "yyyy-mm-ddThh:ii:00",
                orientation: "top"
            });
            // Adding Z (-> symbolizes +00:00) at the end of the format doesn't work yet
            $('#exportTo-datetimepicker').datetimepicker({
                format: "yyyy-mm-ddThh:ii:00",
                orientation: "top"
            });
            
            // Insert current app state into each component when export modal is opened
            $('#exportModal').on('shown.bs.modal', function (e) {
                $('#exportFrom-datetimepicker').val(AppManager.APP_STATE.getSelectedTimeframe()[0].toString());
                $('#exportTo-datetimepicker').val(AppManager.APP_STATE.getSelectedTimeframe()[1].toString());
                $('#selectedClusters-inputForm').val(JSON.stringify(AppManager.APP_STATE.getSelectedClusters()));
                $('input[name=' + 'exportModalSensorTypeRadioButtons' + '][value=' + AppManager.APP_STATE.getSelectedSensortype() + ']').prop("checked",true);
                $('input[name=' + 'exportModalExportFormatRadioButtons' + '][value=' + AppManager.APP_STATE.getSelectedExportformat() + ']').prop("checked",true);
                exportModalTemp = AppManager.APP_STATE.clone();
            })

            $('#exportFrom-datetimepicker').change(function() {
                var from = new UTCDateTime();
                from.parse($(this).val());
                exportModalTemp.setSelectedTimeframe([from, exportModalTemp.getSelectedTimeframe()[1]]);
            });

            $('#exportTo-datetimepicker').change(function() {
                var to = new UTCDateTime();
                to.parse($(this).val());
                exportModalTemp.setSelectedTimeframe([exportModalTemp.getSelectedTimeframe()[0], to]);
            });

            $('#exportModalselectedClustersDropdownInBounds').click(function() {
                var leafletMapBounds = AppManager.MAP.getBounds();
                var bounds = new Bounds([leafletMapBounds._southWest.lat, leafletMapBounds._southWest.lng],
                                        [leafletMapBounds._northEast.lat, leafletMapBounds._northEast.lng]);
                var gridLevel = LeafletUtil.calculateGridLevel(AppManager.MAP.getZoom());

                $('#selectedClusters-inputForm').val(JSON.stringify(AppManager.GRID.getClustersContainedInBounds(bounds, gridLevel)));
                $('#selectedClusters-inputForm').trigger('change');
            });

            $('#exportModalselectedClustersDropdownSelected').click(function() {
                $('#selectedClusters-inputForm').val(JSON.stringify(AppManager.APP_STATE.getSelectedClusters()));
                $('#selectedClusters-inputForm').trigger('change');
            });

            $('#exportModalselectedClustersDropdownReset').click(function() {
                $('#selectedClusters-inputForm').val('[{"clusterID": null}]');
                $('#selectedClusters-inputForm').trigger('change');
            });

            $('#selectedClusters-inputForm').change(function() {
                var clusterIDArray = JSON.parse($(this).val());
                exportModalTemp.setSelectedClusters(clusterIDArray);
            });

            $('input[name=' + 'exportModalSensorTypeRadioButtons' + ']').change(function() {
                exportModalTemp.setSelectedSensortype(this.value);
            });

            $('input[name=' + 'exportModalExportFormatRadioButtons' + ']').change(function() {
                exportModalTemp.setSelectedExportformat(this.value);
            });

            $('#exportModalFavoritesButton').click(function() {
                $('#exportModal').modal('toggle');
                
                // Wait to prevent body shift to the left -> modal bug
                setTimeout(function() {
                    $('#favoritesModal').modal('toggle');
                }, 400);
            });

            $('#exportModalAddFavoriteButton').click(function() {
                addFavoritesModalTemp = exportModalTemp.clone();

                $('#exportModal').modal('toggle');

                // Wait to prevent body shift to the left -> modal bug
                setTimeout(function() {
                    $('#addFavoriteModal').modal('toggle');
                }, 400);
            });

            $("#exportModalApplyButton").click(function() {
                var exportRoutine = new ExportRoutine(
                    AppManager.EXPORT_TIMOUT, 
                    AppManager.EXPORT_STATUS_TIMEOUT, 
                    exportModalTemp.getSelectedExportformat(),
                    exportModalTemp.getSelectedTimeframe(),
                    exportModalTemp.getSelectedSensortype(),
                    exportModalTemp.getSelectedClusters());
                exportRoutine.run();

                $("#exportModal").modal('toggle');
            });

            // $("#exportModalCancelButton").click(function() { });
        },

        initSensortypeModal: function() {
            DynamicHtmlBuilder.buildRadioButtonGroup('#sensorTypeModalRadioButtons', 'sensorTypeModalSensorTypeRadioButtons', AppManager.SENSORTYPES_ARRAY, 'temperature_celsius');

            $('#sensortypeModal').on('shown.bs.modal', function(){
                sensortypeModalTemp.setSelectedSensortype(AppManager.APP_STATE.getSelectedSensortype());
                $('input[name=' + 'sensorTypeModalSensorTypeRadioButtons' + '][value=' + AppManager.APP_STATE.getSelectedSensortype() + ']').prop("checked",true);
            });

            $('input[name=' + 'sensorTypeModalSensorTypeRadioButtons' + ']').change(function() {
                sensortypeModalTemp.setSelectedSensortype(this.value);
            });

            $('#sensortypeModalApplyButton').click(function() {
                AppManager.APP_STATE.setSelectedSensortype(sensortypeModalTemp.getSelectedSensortype());
                addFavoritesModalTemp.setSelectedSensortype(sensortypeModalTemp.getSelectedSensortype());

                $('#sensortypeModal').modal('toggle');
            });
        },

        initFavoritesModal: function() {
            $("#favoritesModal").on('shown.bs.modal', function(){
                favoritesModalTemp = new AppState();

                // Update table
                $("#favoritesTable tr").remove();
                DynamicHtmlBuilder.buildListTableFromArray('#favoritesTable', JSON.parse(StorageUtil.getIdentifiersArray()));

                // Reset output field
                $("#selectedFavoriteOutput").val("");
            });

            /**
              * When the table cell with the favorite identifeir is clicked the app state object is shown in the
              * favourite output textfield. 
              */
             $(document).on("click", "#favoritesTable td", function() {
                if (favoritesModalTemp.parse(JSON.parse(localStorage.getItem($(this)[0].innerHTML)))) {
                    $("#selectedFavoriteOutput").val(AppManager.APP_STATE.toString());
                } else {
                    alert("The selected favorite has an incompatible format.");
                }
            });

            $('#favoritesModalDeleteButton').click(function() {
                selectedFavoriteOutputContent = $('#selectedFavoriteOutput').val();
                if (selectedFavoriteOutputContent !== '') {
                    // Delete favorite from local storage
                    favoritesModalTemp.parse(JSON.parse(selectedFavoriteOutputContent));
                    favoritesModalTemp.delete();
                    $('#selectedFavoriteOutput').val('');

                    // Update table
                    $("#favoritesTable tr").remove();
                    DynamicHtmlBuilder.buildListTableFromArray('#favoritesTable', JSON.parse(StorageUtil.getIdentifiersArray()));
                }
            });

            $('#favoritesModalEditButton').click(function() {
                addFavoritesModalTemp.update(favoritesModalTemp);

                $('#favoritesModal').modal('toggle');

                // Wait to prevent body shift to the left -> modal bug
                setTimeout(function() {
                    $('#addFavoriteModal').modal('toggle');
                }, 400);
            });

            $('#favoritesModalApplyButton').click(function() {
                AppManager.APP_STATE.update(favoritesModalTemp);
                exportModalTemp.update(favoritesModalTemp);
                addFavoritesModalTemp.update(favoritesModalTemp);
                timeSettingsModalTemp.update(favoritesModalTemp);

                $('#favoritesModal').modal('toggle');
            });
        },

        initAddFavoriteModal: function() {
            $("#addFavoriteModal").on('shown.bs.modal', function(){
                $('#yourFavoriteInput').val(addFavoritesModalTemp.toString());
            });

            $('#addFavoriteInput').change(function() {
                addFavoritesModalTemp.setIdentifier($(this).val());
                $('#yourFavoriteInput').val(addFavoritesModalTemp.toString());
            });

            $('#addFavoriteModalApplyButton').click(function() {
                if (addFavoritesModalTemp.store()) {
                    $('#addFavoriteModal').modal('toggle');
                }
            });
        },
        
        initContentTable: function() {
            DynamicHtmlBuilder.buildTableContentFromNestedArray(
                '#contenttable', 
                AppManager.CONTENT_TABLE[0], 
                Util.fillNestedArray(AppManager.CONTENT_TABLE[1], "", 2)
            );

            TableUtil.addRowClickListener("#contenttable", TableUtil.handleContentTableClick);

            $("#contenttableEntryModalSensorReportButton").click(function() {
                var sensorID = AppManager.CONTENT_TABLE_SELECTED_IDENTIFIER;
                var reason = $("#contenttableEntrySensorReportReasonInput").val();
                
                var sensorReportRoutine = new SensorReportRoutine(sensorID, reason);
                sensorReportRoutine.run();

                $("#contenttableEntryModal").modal('toggle');
            });
            
            $("#contenttableEntryModalDisplayButton").click(function() {
                if (AppManager.GRID.isValidClusterID(AppManager.CONTENT_TABLE_SELECTED_IDENTIFIER)) {
                    if (AppManager.LIVE_MODE_ENABLED) {
                        Requestor.requestLiveGraphForCluster(
                            AppManager.GRID.getGridID(),
                            AppManager.CONTENT_TABLE_SELECTED_IDENTIFIER,
                            AppManager.APP_STATE.getSelectedSensortype()
                        );
                    } else {
                        Requestor.requestHistoricalGraphForCluster(
                            AppManager.APP_STATE.getSelectedTimeframe()[0],
                            AppManager.APP_STATE.getSelectedTimeframe()[1],
                            AppManager.GRID.getGridID(),
                            AppManager.CONTENT_TABLE_SELECTED_IDENTIFIER,
                            AppManager.APP_STATE.getSelectedSensortype()
                        );
                    }
                } else {
                    if (AppManager.LIVE_MODE_ENABLED) {
                        Requestor.requestLiveGraphForSensor(
                            AppManager.GRID.getGridID(),
                            AppManager.CONTENT_TABLE_SELECTED_IDENTIFIER,
                            AppManager.APP_STATE.getSelectedSensortype()
                        );
                    } else {
                        Requestor.requestHistoricalGraphForSensor(
                            AppManager.APP_STATE.getSelectedTimeframe()[0],
                            AppManager.APP_STATE.getSelectedTimeframe()[1],
                            AppManager.GRID.getGridID(),
                            AppManager.CONTENT_TABLE_SELECTED_IDENTIFIER,
                            AppManager.APP_STATE.getSelectedSensortype()
                        );
                    }
                }

                $("#contenttableEntryModal").modal('toggle');
            });
        },

        initTimestampSlider: function() {
            $('#timeStampSlider').prop({
                'min': 1,
                'max': (AppManager.HISTORICAL_SNAPSHOT_AMOUNT + 1),
                'step': 1,
                'value': 1
            });

            $('#timeStampSlider').on('change', function() {
                var step = Number($('#timeStampSlider').val()) - 1;
                MapManager.displayLayer(step);
                
                if (step < AppManager.CURRENT_CONTENT_TABLE_ARRAY.length) {
                    AppManager.CONTENT_TABLE = [
                        [
                            "id", 
                            AppManager.APP_STATE.getSelectedSensortype()
                        ],
                        AppManager.CURRENT_CONTENT_TABLE_ARRAY[step]
                    ];
    
                    $('#contenttable tr').remove();
                    DynamicHtmlBuilder.buildTableContentFromNestedArray(
                        '#contenttable', 
                        AppManager.CONTENT_TABLE[0], 
                        Util.fillNestedArray(AppManager.CONTENT_TABLE[1], "", 2)
                    );
                    TableUtil.addRowClickListener("#contenttable", TableUtil.handleContentTableClick);
                }

                var popover = $('#timeStampSlider').data('bs.popover');
                popover.options.content = MapManager.getCurrentTimestamp();
                popover.options.placement = "bottom";
                popover.options.trigger = "focus";
                
                $('#timeStampSlider').popover('show');
            });

            $('#timeStampSlider').popover({
                content: MapManager.getCurrentTimestamp(),
                placement: "bottom",
                trigger: "focus"
            });
        },

        initStartStopUpdateButtons: function() {
            $('#liveHistoricalButton').prop('checked', AppManager.LIVE_MODE_ENABLED);
            if (AppManager.LIVE_MODE_ENABLED) {
                $('span', $('#liveHistoricalButton')).addClass('glyphicon-repeat');
                $('span', $('#liveHistoricalButton')).removeClass('glyphicon-hourglass');
            } else {
                $('span', $('#liveHistoricalButton')).addClass('glyphicon-hourglass');
                $('span', $('#liveHistoricalButton')).removeClass('glyphicon-repeat');
            }

            /**
             * Encapsulates the state switch logic of starting and stopping the
             * current routine, as well as updating the current context.
             */
            $('#startStopUpdateButton').click(function () {
                // startStopChecked = $('input', this).is(':checked');
                // $('span', this).toggleClass('glyphicon-play glyphicon-pause');
                FetchRoutine.run();
            });

            /**
             * Encapsulates the state switch logic of changing between historical
             * mode and live mode.
             */
            $('#liveHistoricalButton').click(function () {
                AppManager.LIVE_MODE_ENABLED = !($('input', this).is(':checked'));
                if (AppManager.LIVE_MODE_ENABLED) {
                    $('span', this).addClass('glyphicon-repeat');
                    $('span', this).removeClass('glyphicon-hourglass');
                } else {
                    $('span', this).addClass('glyphicon-hourglass');
                    $('span', this).removeClass('glyphicon-repeat');
                }
            });
        },

        initTimeSettingsModal: function() {
            DynamicHtmlBuilder.buildRadioButtonGroup('#timeSettingsAutomaticManualRefreshRadioButtons', 'timeSettingsAutomaticManualRefreshRadioButtons', AppManager.REFRESH_STATES_ARRAY, 'Automatic');

            // Adding Z (-> symbolizes +00:00) at the end of the format doesn't work yet
            $('#timeSettingsFrom-datetimepicker').datetimepicker({
                format: "yyyy-mm-ddThh:ii:00",
                orientation: "top"
            });
            // Adding Z (-> symbolizes +00:00) at the end of the format doesn't work yet
            $('#timeSettingsTo-datetimepicker').datetimepicker({
                format: "yyyy-mm-ddThh:ii:00",
                orientation: "top"
            });

            $('#timeSettingsLiveRefreshIntervalSpinner').TouchSpin({
                initval: 15000,
                min: 10000,
                max: 600000,
                step: 500,
                decimals: 0,
                maxboostedstep: 30000,
                postfix: 'ms'
            });

            $('#timeSettingsHistoricalRefreshIntervalSpinner').TouchSpin({
                initval: 1500,
                min: 750,
                max: 60000,
                step: 50,
                decimals: 0,
                maxboostedstep: 3000,
                postfix: 'ms'
            });

            $('#timeSettingsModal').on('shown.bs.modal', function() {
                timeSettingsModalTemp.update(AppManager.APP_STATE);

                $('#timeSettingsFrom-datetimepicker').val(timeSettingsModalTemp.getSelectedTimeframe()[0]);
                $('#timeSettingsTo-datetimepicker').val(timeSettingsModalTemp.getSelectedTimeframe()[1]);
                $('#timeSettingsLiveRefreshIntervalSpinner').val(timeSettingsModalTemp.getSelectedLiveRefreshInterval());
                $('timeSettingsHistoricalRefreshIntervalSpinner').val(timeSettingsModalTemp.getSelectedHistoricalRefreshInterval());
                if (timeSettingsModalTemp.getAutomaticRefreshEnabled()) {
                    $('input[name=' + 'timeSettingsAutomaticManualRefreshRadioButtons' + '][value=' + 'Automatic' + ']').prop("checked",true);
                } else {
                    $('input[name=' + 'timeSettingsAutomaticManualRefreshRadioButtons' + '][value=' + 'Manual' + ']').prop("checked",true);
                }
            });

            $('#timeSettingsFrom-datetimepicker').change(function() {
                var from = new UTCDateTime();
                from.parse($(this).val());
                timeSettingsModalTemp.setSelectedTimeframe([from, timeSettingsModalTemp.getSelectedTimeframe()[1]]);
            });

            $('#timeSettingsTo-datetimepicker').change(function() {
                var to = new UTCDateTime();
                to.parse($(this).val());
                timeSettingsModalTemp.setSelectedTimeframe([timeSettingsModalTemp.getSelectedTimeframe()[0], to]);
            });

            $('#timeSettingsLiveRefreshIntervalSpinner').change(function() {
                timeSettingsModalTemp.setSelectedLiveRefreshInterval($(this).val());
            });

            $('#timeSettingsHistoricalRefreshIntervalSpinner').change(function() {
                timeSettingsModalTemp.setSelectedHistoricalRefreshInterval($(this).val());
            });

            $('input[name=' + 'timeSettingsAutomaticManualRefreshRadioButtons' + ']').change(function() {
                if (this.value === 'Automatic') {
                    timeSettingsModalTemp.setAutomaticRefreshEnabled(true);
                } else {
                    timeSettingsModalTemp.setAutomaticRefreshEnabled(false);
                }
            });

            $('#timeSettingsModalApplyButton').click(function() {
                AppManager.APP_STATE.update(timeSettingsModalTemp);
                addFavoritesModalTemp.update(timeSettingsModalTemp);

                $('#timeSettingsModal').modal('toggle');
            });
        },

        initWindow: function() {
            this.resizeWindow();
            var _this = this;
            $(window).on('resize', function() {
                _this.resizeWindow();
            });
        },

        resizeWindow: function() {
            var availableHeight = $(window).height() - $("#middleRow").height() - 10;
            var upperRowHeight = availableHeight * 0.65;
            var lowerRowHeight = availableHeight - upperRowHeight;

            $("#mapContainer").height(upperRowHeight);
            AppManager.MAP.invalidateSize();
            $("#contenttableContainer").height(upperRowHeight - $("#upperOptionpanelContainer").height() - 8);
            $("#graphContainer").height(lowerRowHeight);
        },

        calculateViewedMapBounds: function() {
            var bounds = new Bounds();
            bounds.parseLeafletMapBounds(AppManager.MAP.getBounds());
            return bounds;
        },

        calculateGridLevel: function() {
            return 2 + MathUtil.indexOfValueInSortedArray(
                AppManager.LEAFLET_ZOOM_TO_GRID_LEVEL_ARRAY, 
                AppManager.MAP.getZoom()
            );
        },

        handleContentTableClick: function(tr) {
            AppManager.CONTENT_TABLE_SELECTED_IDENTIFIER = tr.find('td').html();
            if (AppManager.CONTENT_TABLE_SELECTED_IDENTIFIER != undefined) {
                // The selected table row "tr" isn't a table header "th"
                var modal = $("#contenttableEntryModal");
                modal.find('.modal-header').html(
                    '<h3 class="modal-title text-center">'
                    + '<b>'
                    + "Display or Report " + AppManager.CONTENT_TABLE_SELECTED_IDENTIFIER
                    + '</b>'
                    + '</h1>'
                );

                if (AppManager.GRID.isValidClusterID(AppManager.CONTENT_TABLE_SELECTED_IDENTIFIER)) {
                    // The selected identifier is a cluster identifer
                    
                    // Disable report functionality
                    $("#contenttableEntrySensorReportReasonInput").prop('disabled', true);
                    $("#contenttableEntryModalSensorReportButton").prop('disabled', true);
                } else {
                    // The selected identifier is a sensor identifier

                    // Enable report functionality
                    $("#contenttableEntrySensorReportReasonInput").prop('disabled', false);
                    $("#contenttableEntryModalSensorReportButton").prop('disabled', false);
                }

                modal.modal('toggle');
            }
        }
    }
});
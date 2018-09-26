define(['jquery', 'appManager'], function($, AppManager) {
    return {
        addRowClickListener: function(identifier, handler) {
            $(identifier + " tr").click(function() {
                handler($(this));
            });
        },

        handleContentTableClick: function(tableRow) {
            AppManager.CONTENT_TABLE_SELECTED_IDENTIFIER = tableRow.find('td').html();
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
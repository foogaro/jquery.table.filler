/**
 * This is an example on how to create a jQuery plug-in (minimum jQuery version is 1.4.2).
 *
 * By the way, I'm going to use this example to build a table filler which loads JSON data from a remote and local resource and puts the data into the table as they are retrieved.
 *
 * Soon I'll start a new jQuery plug-in project based upon this one to handle pagination!
 *
 */

(function($) {

    var settings = {
        data: null,
        dataUrl: '',
        loader: false,
        tableInstance: null,
        headersSize: 0,
        columnsSize: 0,
        emptyDataMessage: 'No data found'
    };

    var methods = {

        init : function(options) {
            if (options) {
                $.extend(settings, options);
            }

            settings.tableInstance = this;
            $(settings.tableInstance).show();

            if (settings.data != null) {
                methods.analyzeData(settings.data.data);
            } else {
                methods.loadData(settings.dataUrl);
            }
        },
        analyzeData: function (data) {
            if (data && data.headers) {
                methods.buildHeader(data.headers);
            }
            settings.headersSize = $('thead tr th',settings.tableInstance).size();

            if (data && data.rows) {
                methods.fillTable(data.rows);
            } else {
                methods.handleNoDataFound(null);
            }
        },
        loadData: function(uri) {
            $.ajax({
                url: uri,
                success: function (response, textStatus, xhr) {
                    if (response && response.data) {
                        methods.analyzeData(response.data)
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    methods.handleLoadDataError(textStatus);
                }
            });
        },
        fillTable: function (rows) {
            $('tbody', settings.tableInstance).remove();
            $(settings.tableInstance).append('<tbody></tbody>');

            if (rows.length > 0) {
                for (var rowIndex in rows) {
                    $('tbody', settings.tableInstance).append('<tr></tr>');
                    var row = rows[rowIndex];
                    for (var columnsIndex in row) {
                        var columns = row[columnsIndex];
                        for (var ind in columns) {
                            $('tbody tr:last', settings.tableInstance).append('<td>' + columns[ind] + '</td>');
                        }
                    }
                }
            } else {
                methods.handleNoDataFound();
            }
        },
        buildHeader: function(headers) {
            $('thead', settings.tableInstance).remove();
            $(settings.tableInstance).prepend('<thead></thead>');
            $("thead", settings.tableInstance).append('<tr></tr>');
            for (var headerIndex in headers) {
                $('thead tr:first', settings.tableInstance).append('<th>' + headers[headerIndex] + '</th>');
            }
        },
        handleNoDataFound: function() {
            $('tbody', settings.tableInstance).remove();
            $(settings.tableInstance).append('<tbody></tbody>');
            $('tbody', settings.tableInstance).append('<tr><td colspan="' + settings.headersSize + '">' + settings.emptyDataMessage + '</td></tr>');
        },
        handleLoadDataError: function(msg) {
            alert(msg);
            $("#tableFillerErrorMessage").empty();
            $("#tableFillerErrorMessage").remove();
            $(settings.tableInstance).hide();
            $("body").append('<div id="tableFillerErrorMessage"><span>Error while loading data - ' + textStatus + '</span></div>');
        }
    };

    $.fn.tableFiller = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.tableFiller' );
        }
    };

})(jQuery);

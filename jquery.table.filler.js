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
        },

        createHelloWorldSpanTags : function(options) {
            var localSettings = {};
            $.extend(localSettings, settings, options);

            return this.each(function() {
                // creating a span tag and append it to the input elements of the initially jquery selector
                $('<span>').appendTo($(this)).text(localSettings.text);
            });
        }
    };

    $.fn.helloWorld = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.helloWorld' );
        }
    };



    $.tableFiller = {
        data: null,
        dataUrl: '',
        loader: false,
        tableInstance: null,
        headersSize: 0,
        columnsSize: 0,
        emptyDataMessage: 'No data found',
        options: {
            data: null,
            dataUrl: '',
            loader: false,
            emptyDataMessage: ''
        },
        init: function(opts) {
            this.each(function() {
                var tmpOptions = {};
                $.extend(tmpOptions, $.tableFiller.options);
                var el = {el: $(this)};
                $.extend(tmpOptions, el);
                $.extend(tmpOptions, opts);
                $(this).addClass(tmpOptions.position);
                this.opts = tmpOptions;
                $.tableFiller.data = tmpOptions.data;
                $.tableFiller.dataUrl = tmpOptions.dataUrl;
                if (tmpOptions.loader) $.tableFiller.loader = tmpOptions.loader;
                if (tmpOptions.emptyDataMessage) $.tableFiller.emptyDataMessage = tmpOptions.emptyDataMessage;

                $.tableFiller.tableInstance = $(this);

                if ($.tableFiller.data != null) {
                    $.tableFiller.fillTable($.tableFiller.data);
                } else {
                    $.tableFiller.loadData($.tableFiller.dataUrl);
                }
            });
        },
        loadData: function(uri) {
            $.ajax({
                url: $.tableFiller.dataUrl,
                success: function (response, textStatus, xhr) {
                    if (response && response.data && response.data.headers) {
                        $.tableFiller.buildHeader(response.data.headers);
                    }
                    $.tableFiller.headersSize = $('thead tr th',$.tableFiller.tableInstance).size();

                    if (response && response.data && response.data.rows) {
                        $.tableFiller.fillTable(response.data.rows);
                    } else {
                        $('tbody', $.tableFiller.tableInstance).remove();
                        $($.tableFiller.tableInstance).append('<tbody></tbody>');
                        $('tbody', $.tableFiller.tableInstance).append('<tr><td colspan="' + $.tableFiller.headersSize + '">' + $.tableFiller.emptyDataMessage + '</td></tr>');
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    $.tableFiller.handleError(textStatus);
                }
            });
        },
        fillTable: function (rows) {
            $('tbody', $.tableFiller.tableInstance).remove();
            $($.tableFiller.tableInstance).append('<tbody></tbody>');

            if (rows.length > 0) {
                for (var rowIndex in rows) {
                    $('tbody', $.tableFiller.tableInstance).append('<tr></tr>');
                    var row = rows[rowIndex];
                    for (var columnsIndex in row) {
                        var columns = row[columnsIndex];
                        for (var ind in columns) {
                            $('tbody tr:last', $.tableFiller.tableInstance).append('<td>' + columns[ind] + '</td>');
                        }
                    }
                }
            } else {
                $('tbody', $.tableFiller.tableInstance).append('<tr><td colspan="' + $.tableFiller.headersSize + '">' + $.tableFiller.emptyDataMessage + '</td></tr>');
            }
        },
        buildHeader: function(headers) {
            $('thead', $.tableFiller.tableInstance).remove();
            $($.tableFiller.tableInstance).prepend('<thead></thead>');
            $("thead", $.tableFiller.tableInstance).append('<tr></tr>');
            for (var headerIndex in headers) {
                $('thead tr:first', $.tableFiller.tableInstance).append('<th>' + headers[headerIndex] + '</th>');
            }
        },
        handleError: function(msg) {
            alert(msg);
            $("#tableFillerErrorMessage").empty();
            $("#tableFillerErrorMessage").remove();
            $($.tableFiller.tableInstance).hide();
            $("body").append('<div id="tableFillerErrorMessage"><span>Error while loading data - ' + textStatus + '</span></div>');
        }
    }
    $.fn.tableFiller = $.tableFiller.init;

    /**
     * Namespace method for this plugin
     * @param method
     * @return the selected and modified elements for jquery chaining feature
     */
    $.fn.tablefiller = function( method ) {

        // Method calling logic
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.helloWorld' );
        }
    };

})(jQuery);



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
        emptyDataMessage: 'No data found',
        defaultPageSize: 25,
        firstPageIndex: 0,
        totalRows:0,
        totalPages: 0,
        currentPageIndex: 0
    };

    var methods = {

        init : function(options) {
            if (options) {
                $.extend(settings, options);
            }

            settings.tableInstance = this;
            $(settings.tableInstance).show();

            methods.process();
        },
        process: function() {
            if (settings.data != null) {
                methods.analyzeData(settings.data.data);
            } else {
                methods.loadData(settings.dataUrl);
            }
            methods.buildPagerDashboard();
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
                    if (rowIndex < settings.defaultPageSize) {
                        $('tbody', settings.tableInstance).append('<tr></tr>');
                        var row = rows[rowIndex];
                        for (var columnsIndex in row) {
                            var columns = row[columnsIndex];
                            for (var ind in columns) {
                                $('tbody tr:last', settings.tableInstance).append('<td>' + columns[ind] + '</td>');
                            }
                        }
                    } else {
                        break;
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
        buildPagerDashboard: function () {
            $("#cntPagerTop").empty();
            $("#cntPagerTop").html('');
            var htmlFirstPrevious = '<ul class="ui-widget ui-helper-clearfix"><li title=".ui-icon-seek-first" class="ui-state-default ui-corner-all"><span class="ui-icon ui-icon-seek-first"></span></li><li title=".ui-icon-seek-prev" class="ui-state-default ui-corner-all"><span class="ui-icon ui-icon-seek-prev"></span></li></ul>';
            var htmlNextLast = '<ul class="ui-widget ui-helper-clearfix"><li title=".ui-icon-seek-next" class="ui-state-default ui-corner-all"><span class="ui-icon ui-icon-seek-next"></span></li><li title=".ui-icon-seek-end" class="ui-state-default ui-corner-all"><span class="ui-icon ui-icon-seek-end"></span></li></ul>';
            var htmlPager = '<span>' + htmlFirstPrevious + '</span><span>page ' + (settings.currentPageIndex+1) + ' of ' + settings.totalPages + '(' + settings.totalRows + ')' + '</span><span>' + htmlNextLast + '</span>';
            $("#cntPagerTop").append(htmlPager);
            //$("#cntPagerBottom").append(htmlPager);

            if (settings.currentPageIndex > 0) {
                $('span:first ul li:first', $("#cntPagerTop")).click(function (){
                    methods.firstPage();
                });
            }
            if (settings.currentPageIndex > 0) {
                $('span:first ul li:last', $("#cntPagerTop")).click(function (){
                    methods.previousPage();
                });
            }
            if (settings.currentPageIndex >= 0 && settings.currentPageIndex < settings.totalPages-1) {
                $("#cntPagerTop > span:last ul li:first").click(function (){
                    methods.nextPage();
                });
            }
            if (settings.currentPageIndex >=0 && settings.currentPageIndex < settings.totalPages-1) {
                $("#cntPagerTop > span:last ul li:last").click(function (){
                    methods.lastPage();
                });
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
        },
        firstPage: function() {
            settings.currentPageIndex = 0;
            methods.moveToPage();
        },
        previousPage: function() {
            settings.currentPageIndex--;
            methods.moveToPage();
        },
        nextPage: function() {
            settings.currentPageIndex++;
            methods.moveToPage();
        },
        lastPage: function() {
            settings.currentPageIndex = settings.totalPages-1;
            methods.moveToPage();
        },
        moveToPage: function () {
            //methods.loadData(settings.dataUrl + "/" + settings.currentPageIndex + "/" + settings.defaultPageSize);
            methods.analyzeData(localData[settings.currentPageIndex].data);
            methods.buildPagerDashboard();
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

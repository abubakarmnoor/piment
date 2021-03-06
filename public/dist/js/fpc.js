//doc ready
// YWRkbmV3 => add new
// ZWlk => eid
// ZGlk => did
var tableLampshade;
var tableStand;
var tableEuro;
var tableUS;
var tableJapan;
var tableUK;
var tableAUS;
$(document).ready(function() {

    // var sdate_ = moment().subtract(29, 'days').format('YYYY-MM-DD');
    // var edate_ = moment().format('YYYY-MM-DD');;
    refreshLampshade();
    refreshStand();
    refreshEuro();
    refreshUS();
    refreshJapan();
    refreshUK();
    refreshAUS();
    // New record
    $('a.editor-create').on('click', function (e) {
        //e.preventDefault();
        //alert('create')
        
    } );

    // Edit record
    $('#dtTbl').on('click', 'td.editor-edit', function (e) {
        e.preventDefault();
        //console.log( table.row( this ).data().id );
        const _id = table.row( this ).data().id;
        location.href = "/fpc-details/"+$("#fpid").val()+"/"+_id+"/ZWlk/";
    } );
    
    // Details record
    $('#dtTbl').on('click', 'td.editor-details', function (e) {
        e.preventDefault();
        //console.log( table.row( this ).data().id );
        const _id = table.row( this ).data().id;
        location.href = "/fpc-details/"+$("#fpid").val()+"/"+_id+"/ZGlk/";
        
    } );
    // Delete a record
    $('#dtTbl').on('click', 'td.editor-delete', function (e) {
        e.preventDefault();
        const _id = table.row( this ).data().id;
        //console.log( table.row( this ).data().id );

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
                )
            }
        })
    } );

    $("#btn_refresh").on("click", function(){
        tableLampshade.ajax.url("/data/fpc-lampshade.json", null, false).load();
        tableStand.ajax.url("/data/fpc-stand.json", null, false).load();
        tableEuro.ajax.url("/data/fpc-euro.json", null, false).load();
        tableUS.ajax.url("/data/fpc-us.json", null, false).load();
        tableJapan.ajax.url("/data/fpc-japan.json", null, false).load();
        tableUK.ajax.url("/data/fpc-uk.json", null, false).load();
        tableAUS.ajax.url("/data/fpc-aus.json", null, false).load();
        // spinner_popup();
        // var sdate_ =  moment($("input[name='daterangepicker_start']").val()).format('YYYY-MM-DD');
        // var edate_ =  moment($("input[name='daterangepicker_end']").val()).format('YYYY-MM-DD');
        // if (moment(sdate_)._isValid == false){
        //     sdate_ = moment().subtract(29, 'days').format('YYYY-MM-DD');
        //     edate_ = moment().format('YYYY-MM-DD');;
        // }
        // if (_active_tab == "lampshade"){
        //     table.ajax.url("/data/fpc-lampshade.json", null, false).load();
        // }else if (_active_tab == "stand"){
        //     table.ajax.url("/data/fpc-stand.json", null, false).load();
        // }else if (_active_tab == "euro"){
        //     table.ajax.url("/data/fpc-euro.json"_, null, false).load();
        // }else if (_active_tab == "us"){
        //     table.ajax.url("/data/fpc-us.json", null, false).load();
        // }else if (_active_tab == "japan"){
        //     table.ajax.url("/data/fpc-japan.json", null, false).load();
        // }else if (_active_tab == "uk"){
        //     table.ajax.url("/data/fpc-uk.json", null, false).load();
        // }else{
        //     table.ajax.url("/data/fpc-aus.json", null, false).load();
        // }
        
    })
    $("#btn_add_lampshade").on("click", function(e){
        e.preventDefault();
        location.href = "/fpc-details/"+$("#fpid").val()+"/null/YWRkbmV3/";

    })

    //// btn tab 
    // var _active_tab="";
    // $("#btn_tab_lampshade").on("click", function(){
    //     // spinner_popup();
    //     var sdate_ =  moment($("input[name='daterangepicker_start']").val()).format('YYYY-MM-DD');
    //     var edate_ =  moment($("input[name='daterangepicker_end']").val()).format('YYYY-MM-DD');
    //     if (moment(sdate_)._isValid == false){
    //         sdate_ = moment().subtract(29, 'days').format('YYYY-MM-DD');
    //         edate_ = moment().format('YYYY-MM-DD');;
    //     }
    //     _active_tab = "lampshade";
    //     table.ajax.url("/data/fpc-lampshade.json?sdate="+sdate_+"?edate="+edate_, null, false).load();
    // })
    // $("#btn_tab_stand").on("click", function(){
    //     // spinner_popup();
    //     var sdate_ =  moment($("input[name='daterangepicker_start']").val()).format('YYYY-MM-DD');
    //     var edate_ =  moment($("input[name='daterangepicker_end']").val()).format('YYYY-MM-DD');
    //     if (moment(sdate_)._isValid == false){
    //         sdate_ = moment().subtract(29, 'days').format('YYYY-MM-DD');
    //         edate_ = moment().format('YYYY-MM-DD');;
    //     }
    //     _active_tab = "stand";
    //     table.ajax.url("/data/fpc-stand.json?sdate="+sdate_+"?edate="+edate_, null, false).load();
    // })
    // $("#btn_tab_euro").on("click", function(){
    //     // spinner_popup();
    //     var sdate_ =  moment($("input[name='daterangepicker_start']").val()).format('YYYY-MM-DD');
    //     var edate_ =  moment($("input[name='daterangepicker_end']").val()).format('YYYY-MM-DD');
    //     if (moment(sdate_)._isValid == false){
    //         sdate_ = moment().subtract(29, 'days').format('YYYY-MM-DD');
    //         edate_ = moment().format('YYYY-MM-DD');;
    //     }
    //     _active_tab = "euro";
    //     table.ajax.url("/data/fpc-euro.json?sdate="+sdate_+"?edate="+edate_, null, false).load();
    // })
    // $("#btn_tab_us").on("click", function(){
    //     // spinner_popup();
    //     var sdate_ =  moment($("input[name='daterangepicker_start']").val()).format('YYYY-MM-DD');
    //     var edate_ =  moment($("input[name='daterangepicker_end']").val()).format('YYYY-MM-DD');
    //     if (moment(sdate_)._isValid == false){
    //         sdate_ = moment().subtract(29, 'days').format('YYYY-MM-DD');
    //         edate_ = moment().format('YYYY-MM-DD');;
    //     }
    //     _active_tab = "us";
    //     table.ajax.url("/data/fpc-us.json?sdate="+sdate_+"?edate="+edate_, null, false).load();
    // })
    // $("#btn_tab_japan").on("click", function(){
    //     // spinner_popup();
    //     var sdate_ =  moment($("input[name='daterangepicker_start']").val()).format('YYYY-MM-DD');
    //     var edate_ =  moment($("input[name='daterangepicker_end']").val()).format('YYYY-MM-DD');
    //     if (moment(sdate_)._isValid == false){
    //         sdate_ = moment().subtract(29, 'days').format('YYYY-MM-DD');
    //         edate_ = moment().format('YYYY-MM-DD');;
    //     }
    //     _active_tab = "japan";
    //     table.ajax.url("/data/fpc-japan.json?sdate="+sdate_+"?edate="+edate_, null, false).load();
    // })
    // $("#btn_tab_uk").on("click", function(){
    //     // spinner_popup();
    //     var sdate_ =  moment($("input[name='daterangepicker_start']").val()).format('YYYY-MM-DD');
    //     var edate_ =  moment($("input[name='daterangepicker_end']").val()).format('YYYY-MM-DD');
    //     if (moment(sdate_)._isValid == false){
    //         sdate_ = moment().subtract(29, 'days').format('YYYY-MM-DD');
    //         edate_ = moment().format('YYYY-MM-DD');;
    //     }
    //     _active_tab = "uk";
    //     table.ajax.url("/data/fpc-uk.json?sdate="+sdate_+"?edate="+edate_, null, false).load();
    // })
    // $("#btn_tab_aus").on("click", function(){
    //     // spinner_popup();
    //     var sdate_ =  moment($("input[name='daterangepicker_start']").val()).format('YYYY-MM-DD');
    //     var edate_ =  moment($("input[name='daterangepicker_end']").val()).format('YYYY-MM-DD');
    //     if (moment(sdate_)._isValid == false){
    //         sdate_ = moment().subtract(29, 'days').format('YYYY-MM-DD');
    //         edate_ = moment().format('YYYY-MM-DD');;
    //     }
    //     _active_tab = "aus";
    //     table.ajax.url("/data/fpc-aus.json?sdate="+sdate_+"?edate="+edate_, null, false).load();
    // })

    //// end btn tab
    
    //back
    $("#btn_back").on("click", function(e){
        e.preventDefault;
        location.href = "/finish-product-details/"+$("#fpid").val()+"/"+$("#act").val();
    })
    
    //

//end doc ready
});

function refreshLampshade(){
    tableLampshade = $('#dtTblLampshade').DataTable({
        // "scrollY": "370px",
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;
 
            // converting to interger to find total
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
 
	        var col7 = api
                .column( 7 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
				
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 7 ).footer() ).html(numberWithCommas(col7));
        },
        "scrollCollapse": true,
        "paging": true, 
        "lengthChange": false,
        "ajax": "/data/fpc-lampshade.json",
        "processing": true,
        "language": {
            processing: '<i class="fa fa-spinner fa-pulse fa-3x fa-fw loader-custom"></i><span class="sr-only"></span> '},
        //"serverSide": true,
        "columnDefs": [{
            "targets": [ 2 ],
            "visible": false
        }],
        "columns": [
            {
                data: null,
                className: "dt-center editor-edit",
                defaultContent: '<i class="fa fa-pencil"/>',
                orderable: false
            },
            {
                data: null,
                className: "dt-center editor-delete",
                defaultContent: '<i class="fa fa-trash"/>',
                orderable: false
            },
            { "data": "id" },
            {
                data: "rm_code",
                className: "dt-center editor-details",
                orderable: true
            },
            { "data": "rm_desc" },
            { "data": "qty" },
            { "data": "unit" },
            {"data": "price", render: $.fn.dataTable.render.number(',', '.', 2, '')},
            
        ]
    });
}
function refreshStand(){
    tableStand = $('#dtTblStand').DataTable({
        // "scrollY": "370px",
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;
 
            // converting to interger to find total
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
 
	        var col7 = api
                .column( 7 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
				
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 7 ).footer() ).html(numberWithCommas(col7));
        },
        "scrollCollapse": true,
        "paging": true, 
        "lengthChange": false,
        "ajax": "/data/fpc-stand.json",
        "processing": true,
        "language": {
            processing: '<i class="fa fa-spinner fa-pulse fa-3x fa-fw loader-custom"></i><span class="sr-only"></span> '},
        //"serverSide": true,
        "columnDefs": [{
            "targets": [ 2 ],
            "visible": false
        }],
        "columns": [
            {
                data: null,
                className: "dt-center editor-edit",
                defaultContent: '<i class="fa fa-pencil"/>',
                orderable: false
            },
            {
                data: null,
                className: "dt-center editor-delete",
                defaultContent: '<i class="fa fa-trash"/>',
                orderable: false
            },
            { "data": "id" },
            {
                data: "rm_code",
                className: "dt-center editor-details",
                orderable: true
            },
            { "data": "rm_desc" },
            { "data": "qty" },
            { "data": "unit" },
            {"data": "price", render: $.fn.dataTable.render.number(',', '.', 2, '')},
            
        ]
    });
}
function refreshEuro(){
    tableEuro = $('#dtTblEuro').DataTable({
        // "scrollY": "370px",
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;
 
            // converting to interger to find total
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
 
	        var col7 = api
                .column( 7 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
				
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 7 ).footer() ).html(numberWithCommas(col7));
        },
        "scrollCollapse": true,
        "paging": true, 
        "lengthChange": false,
        "ajax": "/data/fpc-euro.json",
        "processing": true,
        "language": {
            processing: '<i class="fa fa-spinner fa-pulse fa-3x fa-fw loader-custom"></i><span class="sr-only"></span> '},
        //"serverSide": true,
        "columnDefs": [{
            "targets": [ 2 ],
            "visible": false
        }],
        "columns": [
            {
                data: null,
                className: "dt-center editor-edit",
                defaultContent: '<i class="fa fa-pencil"/>',
                orderable: false
            },
            {
                data: null,
                className: "dt-center editor-delete",
                defaultContent: '<i class="fa fa-trash"/>',
                orderable: false
            },
            { "data": "id" },
            {
                data: "rm_code",
                className: "dt-center editor-details",
                orderable: true
            },
            { "data": "rm_desc" },
            { "data": "qty" },
            { "data": "unit" },
            {"data": "price", render: $.fn.dataTable.render.number(',', '.', 2, '')},
            
        ]
    });
}
function refreshUS(){
    tableUS = $('#dtTblUS').DataTable({
        // "scrollY": "370px",
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;
 
            // converting to interger to find total
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
 
	        var col7 = api
                .column( 7 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
				
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 7 ).footer() ).html(numberWithCommas(col7));
        },
        "scrollCollapse": true,
        "paging": true, 
        "lengthChange": false,
        "ajax": "/data/fpc-us.json",
        "processing": true,
        "language": {
            processing: '<i class="fa fa-spinner fa-pulse fa-3x fa-fw loader-custom"></i><span class="sr-only"></span> '},
        //"serverSide": true,
        "columnDefs": [{
            "targets": [ 2 ],
            "visible": false
        }],
        "columns": [
            {
                data: null,
                className: "dt-center editor-edit",
                defaultContent: '<i class="fa fa-pencil"/>',
                orderable: false
            },
            {
                data: null,
                className: "dt-center editor-delete",
                defaultContent: '<i class="fa fa-trash"/>',
                orderable: false
            },
            { "data": "id" },
            {
                data: "rm_code",
                className: "dt-center editor-details",
                orderable: true
            },
            { "data": "rm_desc" },
            { "data": "qty" },
            { "data": "unit" },
            {"data": "price", render: $.fn.dataTable.render.number(',', '.', 2, '')},
            
        ]
    });
}
function refreshJapan(){
    tableJapan = $('#dtTblJapan').DataTable({
        // "scrollY": "370px",
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;
 
            // converting to interger to find total
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
 
	        var col7 = api
                .column( 7 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
				
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 7 ).footer() ).html(numberWithCommas(col7));
        },
        "scrollCollapse": true,
        "paging": true, 
        "lengthChange": false,
        "ajax": "/data/fpc-japan.json",
        "processing": true,
        "language": {
            processing: '<i class="fa fa-spinner fa-pulse fa-3x fa-fw loader-custom"></i><span class="sr-only"></span> '},
        //"serverSide": true,
        "columnDefs": [{
            "targets": [ 2 ],
            "visible": false
        }],
        "columns": [
            {
                data: null,
                className: "dt-center editor-edit",
                defaultContent: '<i class="fa fa-pencil"/>',
                orderable: false
            },
            {
                data: null,
                className: "dt-center editor-delete",
                defaultContent: '<i class="fa fa-trash"/>',
                orderable: false
            },
            { "data": "id" },
            {
                data: "rm_code",
                className: "dt-center editor-details",
                orderable: true
            },
            { "data": "rm_desc" },
            { "data": "qty" },
            { "data": "unit" },
            {"data": "price", render: $.fn.dataTable.render.number(',', '.', 2, '')},
            
        ]
    });
}
function refreshUK(){
    tableUK = $('#dtTblUK').DataTable({
        // "scrollY": "370px",
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;
 
            // converting to interger to find total
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
 
	        var col7 = api
                .column( 7 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
				
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 7 ).footer() ).html(numberWithCommas(col7));
        },
        "scrollCollapse": true,
        "paging": true, 
        "lengthChange": false,
        "ajax": "/data/fpc-uk.json",
        "processing": true,
        "language": {
            processing: '<i class="fa fa-spinner fa-pulse fa-3x fa-fw loader-custom"></i><span class="sr-only"></span> '},
        //"serverSide": true,
        "columnDefs": [{
            "targets": [ 2 ],
            "visible": false
        }],
        "columns": [
            {
                data: null,
                className: "dt-center editor-edit",
                defaultContent: '<i class="fa fa-pencil"/>',
                orderable: false
            },
            {
                data: null,
                className: "dt-center editor-delete",
                defaultContent: '<i class="fa fa-trash"/>',
                orderable: false
            },
            { "data": "id" },
            {
                data: "rm_code",
                className: "dt-center editor-details",
                orderable: true
            },
            { "data": "rm_desc" },
            { "data": "qty" },
            { "data": "unit" },
            {"data": "price", render: $.fn.dataTable.render.number(',', '.', 2, '')},
            
        ]
    });
}
function refreshAUS(){
    tableAUS = $('#dtTblAUS').DataTable({
        // "scrollY": "370px",
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;
 
            // converting to interger to find total
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
 
	        var col7 = api
                .column( 7 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
				
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 7 ).footer() ).html(numberWithCommas(col7));
        },
        "scrollCollapse": true,
        "paging": true, 
        "lengthChange": false,
        "ajax": "/data/fpc-aus.json",
        "processing": true,
        "language": {
            processing: '<i class="fa fa-spinner fa-pulse fa-3x fa-fw loader-custom"></i><span class="sr-only"></span> '},
        //"serverSide": true,
        "columnDefs": [{
            "targets": [ 2 ],
            "visible": false
        }],
        "columns": [
            {
                data: null,
                className: "dt-center editor-edit",
                defaultContent: '<i class="fa fa-pencil"/>',
                orderable: false
            },
            {
                data: null,
                className: "dt-center editor-delete",
                defaultContent: '<i class="fa fa-trash"/>',
                orderable: false
            },
            { "data": "id" },
            {
                data: "rm_code",
                className: "dt-center editor-details",
                orderable: true
            },
            { "data": "rm_desc" },
            { "data": "qty" },
            { "data": "unit" },
            {"data": "price", render: $.fn.dataTable.render.number(',', '.', 2, '')},
            
        ]
    });
}
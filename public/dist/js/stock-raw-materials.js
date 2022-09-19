//doc ready
var table;
$(document).ready(function() {
    var sdate_ = moment().subtract(29, 'days').format('YYYY-MM-DD');
    var edate_ = moment().format('YYYY-MM-DD');;
    // $('.selectpicker').selectpicker();
    // insert_element_rm();
    // load_data_dt('/apis/pull/stock/rm/'); //init
    //console.log(sdate_)
    //console.log(edate_)

    // {{!-- dom: 'Bfrtip',
    //     buttons: [
    //         'copyHtml5',
    //         'excelHtml5',
    //         'csvHtml5',
    //         'pdfHtml5'
    //     ], --}}
    table = $('#dtTbl').DataTable({
        "scrollX": "auto",
        "scrollY": "auto",
        "scrollCollapse": true,
        "paging": true, 
        "lengthChange": false,
        "ajax": "/apis/pull/stock/rm",
        "processing": true,
        "language": {
            processing: '<i class="fa fa-spinner fa-pulse fa-3x fa-fw loader-custom"></i><span class="sr-only"></span> '},
        //"serverSide": true,
        "columnDefs": [{
            "targets": [0,1,2,3],
            "visible": false
        }
        // ,{
        //     targets:[12], render:function(data){
        //         return moment(data).format('DD-MMM-YYYY');
        //     }
        // }
        ],
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
            { "data": "stock_guid" },
            { "data": "stock_type_guid" },
            // { "data": "stock_type" },
            {
                data: "prod_desc",
                className: "dt-center editor-details",
                orderable: true
            },
            { "data": "stock_qty" },
            // { "data": "rm_cost", render: $.fn.dataTable.render.number(',', '.', 0, '')},
            { "data": "stock_upd_by" },
            { "data": "stock_upd_date" }
        ],
        order: [[1, 'asc']],
    });

    // nested
    $('#dtTbl tbody').on('click', 'td.dt-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);
 
        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            row.child(nested(row.data())).show();
            tr.addClass('shown');
        }
    });

    // New record
    $('a.editor-create').on('click', function (e) {
        e.preventDefault();
        const id = table.row( this ).data().stock_type_guid;
        const prod_desc_ = table.row( this ).data().prod_desc;
        load_data_dt('/apis/pull/stock/rm/'+id); //init
        $("#prod_desc").text(prod_desc_)
        $("#pop-modal-form").modal('show')
        
    } );

    // Edit record
    // $('#dtTbl').on('click', 'td.editor-edit', function (e) {
    //     e.preventDefault();
    //     const id = table.row( this ).data().stock_type_guid;
    //     const prod_desc_ = table.row( this ).data().prod_desc;
    //     $("label[name=prod_desc").text(prod_desc_);
    //     load_data_dt('/apis/pull/stock/rm/'+id); //init
    //     $("#pop-modal-form").modal('show')
    // } );
    
    // Details record
    $('#dtTbl').on('click', 'td.editor-details', function (e) {
        e.preventDefault();
        const id = table.row( this ).data().stock_type_guid;
        const prod_desc_ = table.row( this ).data().prod_desc;
        $("label[name=prod_desc").text(prod_desc_);
        load_data_dt('/apis/pull/stock/rm/'+id); //init
        $("#pop-modal-form").modal('show')
    } );
    // Delete a record
    // $('#dtTbl').on('click', 'td.editor-delete', function (e) {
    //     e.preventDefault();
    //     let _data = {};
    //     _data.id = table.row( this ).data().stock_guid;
    //     _data.prod_desc = table.row( this ).data().prod_desc;
    //     _data.upd_by = "Admin";
    //     // console.log(_data);
    //     // console.log( table.row( this ).data().id );

    //     Swal.fire({
    //         title: 'Are you sure?',
    //         text: "You won't be able to revert this! ("+_data.prod_desc+")",
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Yes, delete it!'
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             spinner_popup();
    //             $.ajax({
    //                 type:"POST",
    //                 url: "/apis/del/stock", 
    //                 contentType: "application/json; charset=utf-8",
    //                 dataType: "json",
    //                 data: JSON.stringify(_data),
    //                 success: function(data) {
    //                     $('.modal').modal('hide');
    //                     Swal.fire({
    //                         icon: "success",
    //                         title: "Data Deleted",
    //                         text: _data.prod_desc
    //                     }).then(function(){
    //                         // location.href='/raw-materials'
    //                         $("#btn_refresh").click();
    //                     });
                        
    //                 }, 
    //                 error: function(jqXHR, textStatus, errorThrown) {
    //                     //alert(jqXHR.status);
    //                     $('.modal').modal('hide');
    //                     Swal.fire({
    //                         title: "Error!",
    //                         text: textStatus,
    //                         icon: "error"
    //                     });
    //                 }
    //             });
    //         }
    //     })
    // } );

    $("#btn_refresh").on("click", function(){
        // spinner_popup();
        var sdate_ =  moment($("input[name='daterangepicker_start']").val()).format('YYYY-MM-DD');
        var edate_ =  moment($("input[name='daterangepicker_end']").val()).format('YYYY-MM-DD');
        if (moment(sdate_)._isValid == false){
            sdate_ = moment().subtract(29, 'days').format('YYYY-MM-DD');
            edate_ = moment().format('YYYY-MM-DD');;
        }
        // console.log(sdate_);
        // console.log(edate_);
        //var table = $('#registrationTable').DataTable();
        table.ajax.url("/apis/pull/stock/rm", null, false).load();
    })

//end doc ready
});

// function

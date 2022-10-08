//doc ready
var table;
$(document).ready(function() {
    var sdate_ = moment().subtract(29, 'days').format('YYYY-MM-DD');
    var edate_ = moment().format('YYYY-MM-DD');;
    // $('.selectpicker').selectpicker();
    // insert_element_rm();
    $("input[name=stock_type]").val('fp')
    load_data_dt('/apis/pull/stock/fp/x1'); //init
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
        "paging": false, 
        "lengthChange": false,
        "ajax": "apis/pull/rmfp/fp",
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
            // { "data": "stock_guid" },
            { "data": "stock_type_guid" },
            { "data": "prod_code"},
            {
                data: "prod_desc",
                className: "dt-center editor-details",
                orderable: true
            },
            { "data": "prod_family" },
            { "data": "stock_qty" }
            // { "data": "rm_cost", render: $.fn.dataTable.render.number(',', '.', 0, '')},
            // { "data": "stock_upd_by" },
            // { "data": "stock_upd_date" }
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
    
    // Details record
    $('#dtTbl').on('click', 'td.editor-details', function (e) {
        e.preventDefault();
        const id = table.row( this ).data().stock_type_guid;
        $("input[name=stock_type_guid]").val(id)
        const prod_desc_ = table.row( this ).data().prod_desc;
        $("input[name=prod_desc]").val(prod_desc_)
        table_stock.ajax.url("apis/pull/stock/fp/"+id, null, false).load(); // refresh pop
        $("#pop-modal-form").modal('show')
    } );
    
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
        table.ajax.url("apis/pull/rmfp/fp", null, false).load(); // refresh pop
    })

    
//end doc ready
});

// function
$(function(){
    $(".datepicker").datepicker({
        format: 'yyyy-mm-dd',
        setDate: new Date(),
        autoclose: true,
        todayHighlight: true,
    });
});
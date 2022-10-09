//doc ready
var tablePurchase;
$(document).ready(function() {
    var sdate_ = moment().subtract(29, 'days').format('YYYY-MM-DD');
    var edate_ = moment().format('YYYY-MM-DD');;
    //console.log(sdate_)
    //console.log(edate_)

    // {{!-- dom: 'Bfrtip',
    //     buttons: [
    //         'copyHtml5',
    //         'excelHtml5',
    //         'csvHtml5',
    //         'pdfHtml5'
    //     ], --}}
    tablePurchase = $('#dtTbl').DataTable({
        "scrollX": "auto",
        "scrollY": "auto",
        "scrollCollapse": true,
        "paging": true, 
        "pageLength": 50,
        "lengthChange": false,
        "ajax": "/apis/pull/po",
        "processing": true,
        "language": {
            processing: '<i class="fa fa-spinner fa-pulse fa-3x fa-fw loader-custom"></i><span class="sr-only"></span> '},
        //"serverSide": true,
        "columnDefs": [
            {
                "targets": [ 2 ],
                "visible": false
            },{
                targets:[4], render:function(data){
                return moment(data).format('DD-MMM-YYYY');
            }}
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
            { "data": "po_id" },
            { "data": "po_co_guid" },
            { "data": "po_date" },
            { "data": "po_supplier_guid" },
            { "data": "po_order_amt", render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { "data": "po_dp_amt", render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { "data": "po_topay_amt", render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { "data": "po_delivered_amt", render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { "data": "po_tobe_delivered_amt", render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { "data": "po_balance_amt", render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { "data": "po_status_desc" },
        ]
    });
    
    // New record
    $('a.editor-create').on('click', function (e) {
        e.preventDefault();
        resetForm();
        // location.href = "/purchase-details/null/YWRkbmV3";
    } );

    // Edit record
    $('#dtTbl').on('click', 'td.editor-edit', function (e) {
        e.preventDefault();
        //console.log( table.row( this ).data().id );
        const _id = table.row( this ).data().id;
        location.href = "/purchase-details/"+_id+"/ZWlk";
    } );
    
    // Details record
    $('#dtTbl').on('click', 'td.editor-details', function (e) {
        e.preventDefault();
        //console.log( table.row( this ).data().id );
        const _id = table.row( this ).data().id;
        location.href = "/purchase-details/"+_id+"/ZGlk/";
        
    } );
    // Delete a record
    $('#dtTbl').on('click', 'td.editor-delete', function (e) {
        e.preventDefault();
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
        // spinner_popup();
        // var sdate_ =  moment($("input[name='daterangepicker_start']").val()).format('YYYY-MM-DD');
        // var edate_ =  moment($("input[name='daterangepicker_end']").val()).format('YYYY-MM-DD');
        // if (moment(sdate_)._isValid == false){
        //     sdate_ = moment().subtract(29, 'days').format('YYYY-MM-DD');
        //     edate_ = moment().format('YYYY-MM-DD');;
        // }
        // console.log(sdate_);
        // console.log(edate_);
        //var table = $('#registrationTable').DataTable();
        table.ajax.url("/data/purchase.json?sdate="+sdate_+"?edate="+edate_, null, false).load();
    })

//end doc ready
});

//functions
resetForm = function(){
    $("#po_date").val(null);
    $("#po_co_guid").selectpicker('val',null);
    $("#po_supplier").selectpicker('val',null);
    $("#po_status").selectpicker('val',null);
    $("textarea[name=po_info]").val('');
    $("input[name=po_order_amt]").val(0);
    $("input[name=po_dp_amt]").val(0);
    $("input[name=po_topay_amt]").val(0);
    $("input[name=po_delivered_amt]").val(0);
    $("input[name=po_tobe_delivered_amt]").val(0);
    $("input[name=po_balance_amt]").val(0);

}
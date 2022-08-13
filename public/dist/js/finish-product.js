//doc ready
var table;
$(document).ready(function() {
    var sdate_ = moment().subtract(29, 'days').format('YYYY-MM-DD');
    var edate_ = moment().format('YYYY-MM-DD');;
    table = $('#dtTbl').DataTable({
        // "scrollY": "370px",
        "scrollX": "auto",
        "scrollY": "auto",
        "scrollCollapse": true,
        "paging": true, 
        "lengthChange": false,
        "ajax": "/apis/pull/fp",
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
            { "data": "fp_guid" },
            {
                data: "fp_desc",
                className: "dt-center editor-details",
                orderable: true
            },
            { "data": "fp_prod_family" },
            { "data": "fp_box_size_l" },
            { "data": "fp_box_size_w" },
            { "data": "fp_box_size_h" },
            { "data": "fp_origin" },
            { "data": "fp_validated" },
            { "data": "fp_active" },
            { "data": "fp_upd_date" },
            { "data": "fp_upd_by" }
        ]
    });
    
    // New record
    $('a.editor-create').on('click', function (e) {
        e.preventDefault();
        location.href = "/finish-product-details/null/YWRkbmV3";
    } );

    // Edit record
    $('#dtTbl').on('click', 'td.editor-edit', function (e) {
        e.preventDefault();
        //console.log( table.row( this ).data().id );
        const _id = table.row( this ).data().fp_guid;
        location.href = "/finish-product-details/"+_id+"/ZWlk";
    } );
    
    // Details record
    $('#dtTbl').on('click', 'td.editor-details', function (e) {
        e.preventDefault();
        //console.log( table.row( this ).data().id );
        const _id = table.row( this ).data().fp_guid;
        location.href = "/finish-product-details/"+_id+"/ZGlk";
        
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
        var sdate_ =  moment($("input[name='daterangepicker_start']").val()).format('YYYY-MM-DD');
        var edate_ =  moment($("input[name='daterangepicker_end']").val()).format('YYYY-MM-DD');
        if (moment(sdate_)._isValid == false){
            sdate_ = moment().subtract(29, 'days').format('YYYY-MM-DD');
            edate_ = moment().format('YYYY-MM-DD');;
        }
        // console.log(sdate_);
        // console.log(edate_);
        //var table = $('#registrationTable').DataTable();
        table.ajax.url("/data/finish-product.json?sdate="+sdate_+"?edate="+edate_, null, false).load();
    })

//end doc ready
});


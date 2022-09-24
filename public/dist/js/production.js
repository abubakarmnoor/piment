//doc ready
var table;
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
    // table = $('#dtTbl').DataTable({
    //     // "scrollY": "370px",
    //     "scrollCollapse": true,
    //     "paging": true, 
    //     "lengthChange": false,
    //     "ajax": "/apis/pull/production",
    //     "processing": true,
    //     "language": {
    //         processing: '<i class="fa fa-spinner fa-pulse fa-3x fa-fw loader-custom"></i><span class="sr-only"></span> '},
    //     //"serverSide": true,
    //     "columnDefs": [{
    //         "targets": [ 2 ],
    //         "visible": false
    //     }],
    //     "columns": [
    //         {
    //             data: null,
    //             className: "dt-center editor-edit",
    //             defaultContent: '<i class="fa fa-pencil"/>',
    //             orderable: false
    //         },
    //         {
    //             data: null,
    //             className: "dt-center editor-delete",
    //             defaultContent: '<i class="fa fa-trash"/>',
    //             orderable: false
    //         },
    //         { "data": "prod_guid" },
    //         {
    //             data: "order_code",
    //             className: "dt-center editor-details",
    //             orderable: true
    //         },
    //         { "data": "supplier_country" },
    //         { "data": "supplier_active",  "render": function ( data, type, row ) {
    //             switch (data) {
    //                 case 1:
    //                     return 'True';
    //                     break;
    //                 case 0:
    //                     return 'False';
    //                     break;
    //                 default:
    //                     return "other";
    //             }
    //         } },
    //     ]
    // });
    
    // New record
    $('a.editor-create').on('click', function (e) {
        e.preventDefault();
        
    } );

    // Edit record
    $('#dtTbl').on('click', 'td.editor-edit', function (e) {
        e.preventDefault();
        //console.log( table.row( this ).data().id );
        const _id = table.row( this ).data().production_guid;
        
    } );
    
    // Details record
    $('#dtTbl').on('click', 'td.editor-details', function (e) {
        e.preventDefault();
        //console.log( table.row( this ).data().id );
        const _id = table.row( this ).data().production_guid;
        
        
    } );
    // Delete a record
    $('#dtTbl').on('click', 'td.editor-delete', function (e) {
        e.preventDefault();
        let _data = {};
        _data.id = table.row( this ).data().production_guid;
        _data.client_name = table.row( this ).data().client_name
        _data.upd_by = "Admin";
        
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this! ("+_data.client_name+")",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                spinner_popup();
                // console.log(_data);
                $.ajax({
                    type:"POST",
                    url: "/apis/del/production", 
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(_data),
                    success: function(data) {
                        $('.modal').modal('hide');
                        if(data.success == true){
                            Swal.fire({
                                icon: "success",
                                title: "Data Deleted",
                                text: _data.supplier_name
                            }).then(function(){
                                // location.href='/raw-materials'
                                $("#btn_refresh").click();
                            });
                        }else{
                            Swal.fire({
                                icon: "error",
                                title: "",
                                text: data.err.sqlMessage
                            })
                        }
                        
                        
                    }, 
                    error: function(jqXHR, textStatus, errorThrown) {
                        //alert(jqXHR.status);
                        $('.modal').modal('hide');
                        Swal.fire({
                            title: "Error!",
                            text: textStatus,
                            icon: "error"
                        });
                    }
                });
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
        table.ajax.url("/apis/pull/production", null, false).load();
    })

//end doc ready
});

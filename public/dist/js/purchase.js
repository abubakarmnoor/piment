//doc ready
var tablePO;
$(document).ready(function() {
    // var sdate_ = moment().subtract(29, 'days').format('YYYY-MM-DD');
    // var edate_ = moment().format('YYYY-MM-DD');;
    //console.log(sdate_)
    //console.log(edate_)

    // {{!-- dom: 'Bfrtip',
    //     buttons: [
    //         'copyHtml5',
    //         'excelHtml5',
    //         'csvHtml5',
    //         'pdfHtml5'
    //     ], --}}
    tablePO = $('#dtTbl_PO').DataTable({
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
                "targets": [ 2,3 ],
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
            { "data": "po_guid" },
            { "data": "po_co_guid" },
            { "data": "po_date" },
            { "data": "po_id" },
            { "data": "supplier_name" },
            { "data": "po_order_amt", render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { "data": "po_dp_amt", render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { "data": "po_topay_amt", render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { "data": "po_delivered_amt", render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { "data": "po_tobe_delivered_amt", render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { "data": "po_balance_amt", render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { "data": "po_status_desc" },
        ]
    });
    //default / init
    $('.selectpicker').selectpicker();
    insert_element_po_status();
    load_data_dt('/apis/pop/po-status'); //init
    selectpicker_refresh('po_status','/apis/pop/po-status');
    selectpicker_refresh('po_supplier_guid','/apis/pull/supplier');
    selectpicker_refresh('po_co_guid','/apis/pull/co');

    // New record
    $('a.editor-create').on('click', function (e) {
        e.preventDefault();
        resetForm();
        // location.href = "/purchase-details/null/YWRkbmV3";
    } );

    // Edit record
    $('#dtTbl_PO').on('click', 'td.editor-edit', function (e) {
        e.preventDefault();
        const _id = tablePO.row( this ).data().po_guid;
        // location.href = "/purchase-details/"+_id+"/ZWlk";
    } );
    
    // Details record
    // $('#dtTbl').on('click', 'td.editor-details', function (e) {
    //     e.preventDefault();
    //     //console.log( table.row( this ).data().id );
    //     const _id = tablePO.row( this ).data().id;
        
    // } );

   // Delete a record
    $('#dtTbl_PO').on('click', 'td.editor-delete', function (e) {
        e.preventDefault();
        let _data = {};
        _data.id = tablePO.row( this ).data().po_guid;
        _data.supplier_name = tablePO.row( this ).data().supplier_name
        _data.upd_by = $("#logged_user_id").text();
        
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this! ("+_data.client_name+" - "+_data.supplier_name+")",
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
                    url: "/apis/del/po", 
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
        tablePO.ajax.url("/apis/pull/po", null, false).load();
    })

    //save
    $('#form_input').submit(function(e) {
        e.preventDefault();
        const form = $(e.target);
        const _data = convertFormToJSON(form);
        _data.po_order_amt = (_data.po_order_amt).replace(/\,/g,'')
        _data.po_dp_amt = (_data.po_dp_amt).replace(/\,/g,'')
        _data.po_topay_amt = (_data.po_topay_amt).replace(/\,/g,'')
        _data.po_delivered_amt = (_data.po_delivered_amt).replace(/\,/g,'')
        _data.po_tobe_delivered_amt = (_data.po_tobe_delivered_amt).replace(/\,/g,'')
        _data.po_balance_amt = (_data.po_balance_amt).replace(/\,/g,'')
        _data.prod_upd_by = $("#logged_user_id").text();
        _data.tblname = "po";
        console.log(_data);
        
        if (!_data.po_supplier_guid || !_data.po_status || !_data.po_co_guid)
        {
            Swal.fire({
                icon: 'warning',
                title: 'Work Order',
                text: (!_data.po_supplier_guid ? "Please select one Supplier" : (!_data.po_status ? "Please select one Status" : "Please select one Client Order"))
            })
            return;
        }
        Swal.fire({
            icon: 'info',
            title: 'Purchase Order',
            text: "Under maintenance"
        })
        return;
        // ajax - save/post data
        spinner_popup();
        $.ajax({
            type:"POST", // must be POST 
            url: "/apis/upd", 
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(_data),
            success: function(data) {
                $('#spinner-modal').modal('hide');
                if (data.success == true){
                    Swal.fire({
                        icon: 'success',
                        title: 'Work Order',
                        text: "Data Saved"
                    }).then(function(){
                        $('.modal').modal('hide');
                        $("#btn_refresh").click();
                    });
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: '',
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

    });

//end doc ready
});

//functions
resetForm = function(){
    $("#po_date").val(null);
    $("input[name=po_id]").val('');
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
//insert element
function insert_element_po_status(){
    $('<a href="#" type="button" class="pull-right" id="btn_pop_po_status" data-toggle="modal" data-target="#pop-modal-form" style="margin-right: 11px"><i class="glyphicon-plus"></i> Add New</a>').insertBefore('#form_input > div:nth-child(6) > div.col-md-5.mb-3 > div > div > div');
}
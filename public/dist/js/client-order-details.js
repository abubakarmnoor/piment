var tableOrder, tableInv;
var id;
$("#btn_save").hide();
spinner_popup();
$(document).ready(function() {  
    //
    //edit or add new
    if (location.href.includes('ZWlk')) {
        $('.page-header').text('CLIENT ORDER UPDATES')
        
        let url = location.href;
        //let id = getURLParameter(url, 'eid');
        // console.log(url.split('/'));
        let id = url.split('/')[4]
        // console.log(id);
        // $("#id").val(id);
        
        $("#btn_save").show();
        get_details(id,undefined);
        
    }else if (location.href.includes('ZGlk')) {
        $('.page-header').text('CLIENT ORDER DETAILS');
        $("#btn_save").hide();
        $("#form_ :input").prop('readonly', true);
        $("#form_ :checkbox").prop('disabled', "disabled");
        $('.selectpicker').prop('disabled', true);
        $('.selectpicker').selectpicker('refresh');

        // $("#ck_active").attr("disabled", true);
        //  $(".cancel").replaceWith("<a href='/client-order' type='button' class='btn btn-outline btn-primary'><i class='fa fa-long-arrow-left'></i> Back</a>");
        get_details(id,undefined);
        
    
    }else{
        $('.page-header').text('CLIENT ORDER LIST ADD NEW')
        $("#btn_save").show();
    }

    //default
    // spinner_popup();
    $('.modal').modal('hide');
    id = $("input[name=co_guid]").val()
    $("#co_client_guid").selectpicker('val',null)
    $("#co_status").selectpicker('val',null)
    $("#co_standard").selectpicker('val',null)
    $("#co_curr").selectpicker('val',null)
    $("#co_area").selectpicker('val',null)
    $('.selectpicker').selectpicker();
    insert_element_status();insert_element_curr();insert_element_area();insert_element_inv_code();
    load_data_dt('/apis/pop/co-status'); //init
    initOrderTable(); initInvTable();

    

     //btn
    //save
    $('#form_').submit(function(e) {
        //$('#messages').removeClass('hide').addClass('alert alert-success alert-dismissible').slideDown().show();
        //$('#messages_content').html('<h4>MESSAGE HERE</h4>');
        //$('#modal').modal('show');
        
        e.preventDefault();
        const form = $(e.target);
        const _data = convertFormToJSON(form);
        _data.co_upd_by = $("#logged_user_id").text();
        _data.co_vip = ($("#co_vip").prop("checked"))
        _data.tblname = "co";
        // console.log(_data);
        if (!_data.co_client_guid || !_data.co_status || !_data.co_standard || !_data.co_curr || !_data.co_area)
        {
            Swal.fire({
                icon: 'warning',
                title: 'Client Order',
                text: (!_data.co_client_guid ? "Please select one Client" : (!_data.co_standard ? "Please select one Standard" : (!_data.co_area ? "Please select one Area" : (!_data.co_curr ? "Please select one Curr" : "Please select one Status"))))
            })
            return;
        }
        
        // ajax - save/post data
        spinner_popup();
        $.ajax({
            type:"POST", // must be POST 
            url: "/apis/upd", 
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(_data),
            success: function(data) {
                // console.log(data.data);

                $('.modal').modal('hide');
                if (data.success == true){
                    Swal.fire({
                        icon: 'success',
                        title: 'Client Order',
                        text: "Data Saved"
                    }).then(function(){
                        // var encodedUrl = encodeURIComponent($("input[name=co_order_id]").val());
                        // if (!_data.co_guid == null){
                        //     get_details(_data.co_guid)
                        // }else{
                        //     get_details(undefined, encodedUrl)
                        // }
                        
                        get_details(data.data.co_guid)
                        if ($("input[name=co_guid]").val() !== "null") { 
                            $("#btn_tab_order").click()
                        }else{
                            Swal.fire({
                                title: 'Client Order',
                                text: "Go to input `Order` item(s)"
                            }) .then(function(){
                                $("#btn_tab_order").click()
                            })
                        }
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

    // //date datepicker
    // $("#co_order_date").datepicker({
    //     format: "dd/MM/yyyy",
    // });
    // $("#co_delivery_date").datepicker({
    //     format: "dd/MM/yyyy",
    // });
    
    $("#btn_add_order").on("click", function(e){
        e.preventDefault();
        $("input[name=input_for]").val("co_order");
        $(".modal-title").text('ORDER LIST');
        $("#form_input").show();
        $("#form_input_inv").hide();
        resetOrderForm();
    })
    $("#btn_add_inv").on("click", function(e){
        e.preventDefault();
        $("input[name=input_for]").val("co_inv");
        $(".modal-title").text('INVOICE LIST');
        $("#form_input").hide();

        $("#co_order_guid").val()
        $("#form_input_inv").show();
        
        const _inv_id = tableInv.row( 0 ).data();
        const _inv_id_1 = ((_inv_id) ? _inv_id.inv_id : "");
        resetInvForm(_inv_id_1);
        
    })

    //validation
    $("#btn_tab_order,#btn_tab_po,#btn_tab_invoice").on("click", function(e){
        e.preventDefault();
        const _id = $("input[name=co_guid]").val();
        // console.log(_id);
        if (_id === "null"){
            Swal.fire({
                icon: "warning",
                title: "Client Order",
                text: "Please input order details first"
                
            })
            .then(function(){
                $("#btn_tab_details").click();
            })

        }
    })
    // Order Delete a record
    $('#dtTbl_Order').on('click', 'td.editor-delete', function (e) {
        e.preventDefault();
        let _data = {};
        _data.id = tableOrder.row( this ).data().co_order_guid;
        _data.desc = tableOrder.row( this ).data().fp_desc;
        _data.upd_by = $("#logged_user_id").text();
        _data.co_order_id = tableOrder.row( this ).data().co_order_id; 
        // console.log(_data);
        // console.log( table.row( this ).data().id );

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this! ("+_data.co_order_id+")",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                spinner_popup();
                $.ajax({
                    type:"POST",
                    url: "/apis/del/co_order", 
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(_data),
                    success: function(data) {
                        $('.modal').modal('hide');
                        Swal.fire({
                            icon: "success",
                            title: "Data Deleted",
                            text: _data.co_order_id
                        }).then(function(){
                            refreshOrderTable();

                        });
                        
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
    // Order Edit record
    $('#dtTbl_Order').on('click', 'td.editor-edit', function (e) {
        e.preventDefault();
        $(".modal-title").text('ORDER LIST');
        $("#form_input").show();
        $("#form_input_inv").hide();

        $("input[name=input_for]").val("co_order")
        const _id = tableOrder.row( this ).data().co_order_guid;
        $("input[name=co_order_guid]").val(_id);
        const _fp_id = tableOrder.row( this ).data().co_order_fp_guid;
        $("#co_order_fp_guid").selectpicker('val',_fp_id)
        const _cost = tableOrder.row( this ).data().co_order_cost;
        $("input[name=co_order_cost]")
        .val(_cost)
        .focusout();
        const _price = tableOrder.row( this ).data().co_order_price;
        $("input[name=co_order_price]")
        .val(_price)
        .focusout();
        const _qty = tableOrder.row( this ).data().co_order_qty;
        $("input[name=co_order_qty]").val(_qty)
        const _info = tableOrder.row( this ).data().co_order_info;
        console.log(_info);
        $("textarea[name=co_order_info]").val(_info)

        $('#pop-modal-form-input').modal('show');

    } );
    // INV Delete a record
    $('#dtTbl_Inv').on('click', 'td.editor-delete', function (e) {
        e.preventDefault();
        let _data = {};
        _data.id = tableInv.row( this ).data().inv_guid;
        _data.desc = tableInv.row( this ).data().inv_id;
        _data.inv_code_desc = tableInv.row( this ).data().inv_code_desc;
        _data.upd_by = $("#logged_user_id").text();
        // console.log(_data);
        // console.log( table.row( this ).data().id );

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this! ("+_data.inv_code_desc+")",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                spinner_popup();
                $.ajax({
                    type:"POST",
                    url: "/apis/del/inv", 
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(_data),
                    success: function(data) {
                        $('.modal').modal('hide');
                        Swal.fire({
                            icon: "success",
                            title: "Data Deleted",
                            text: _data.inv_code_desc
                        }).then(function(){
                            refreshInvTable();
                        });
                        
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
    // INV edit
    $('#dtTbl_Inv').on('click', 'td.editor-edit', function (e) {
        e.preventDefault();

        $(".modal-title").text('INVOICE LIST');
        $("#form_input").hide();
        $("#form_input_inv").show();
        $("input[name=inv_id]").removeAttr("readonly");

        $("input[name=input_for]").val("co_inv")
        const _id = tableInv.row( this ).data().inv_guid;
        $("input[name=inv_guid]").val(_id);
        const _inv_id = tableInv.row( this ).data().inv_id;
        $("input[name=inv_id]").val(_inv_id);

        const _inv_code = tableInv.row( this ).data().inv_code;
        $("#inv_code").selectpicker('val',_inv_code)
        const _amount = tableInv.row( this ).data().inv_amount;
        $("input[name=inv_amount]")
        .val(_amount)
        .focusout();
        const _inv_amount_paid = tableInv.row( this ).data().inv_amount_paid;
        $("input[name=inv_amount_paid]")
        .val(_inv_amount_paid)
        .focusout();
        
        const _inv_paid_date = ((tableInv.row( this ).data().inv_paid_date) ? formatDate(tableInv.row( this ).data().inv_paid_date) : tableInv.row( this ).data().inv_paid_date);
        $("#inv_paid_date").val(_inv_paid_date)
        
        const _inv_info = tableInv.row( this ).data().inv_info;
        $("textarea[name=inv_info]").val(_inv_info);

        $('#pop-modal-form-input').modal('show');

    } );

    

//end  doc ready
});
//default-edit

//default-edit
function default_edit(data){
    //default
    // $('#co_standard').selectpicker('val', -1)
    // $('#co_status').selectpicker('val', -1)
    $("input[name=co_guid]").val(data[0].co_guid)
    $("input[name=co_order_id]").val(data[0].co_order_id)
    $('#co_client_guid').selectpicker('val',data[0].co_client_guid)
    const _odate = formatDate(data[0].co_order_date);
    $("#co_order_date").val(_odate)
    const _ddate = formatDate(data[0].co_delivery_date);
    $("#co_delivery_date").val(_ddate)
    $('#co_standard').selectpicker('val',data[0].co_standard)
    $('#co_status').selectpicker('val',data[0].co_status)
    $('#co_area').selectpicker('val',data[0].co_area)
    $("#co_curr").selectpicker('val',data[0].co_curr)
    $("#co_vip").prop("checked", (data[0].co_vip == 1));
    $("textarea[name=co_notes]").text(data[0].co_notes)
    
    // $("#btn_tab_order").click();
    
}

// btn cancel
// $("#btn_cancel").on("click", function(){
//     $("#btn_refresh").click();

// })
// btn cancel
$("#btn_printout").on("click", function(e){
    e.preventDefault()
    // alert('print out')
    window.open('/report-invoice/'+id)

})
//get details
function get_details(id,orid){
    //ajax - get details
    // const data_ = {
    //     id:id,
    //     orid:orid
    // }
    spinner_popup();
    var _url = "/apis/pull/co/"+id+"/"+orid
    console.log((_url));
    //ajax
    $.ajax({
        type:"GET", 
        url: _url, 
        dataType: "json",
        // data: data_,
        success: function(data) {
            // console.log(data);
            default_edit(data.data);
            $('.modal').modal('hide');
        }, 
        error: function(jqXHR, textStatus, errorThrown) {
            //alert(jqXHR.status);
            swal({
                title: "Error!",
                text: jqXHR.status,
                icon: "error"
            });
        }
    });
}

//insert element
function insert_element_status(){
    $('<a href="#" type="button" class="pull-right" id="btn_pop_co_status" data-toggle="modal" data-target="#pop-modal-form" style="margin-right: 11px"><i class="glyphicon-plus"></i> Add New</a>').insertBefore('#form_ > div:nth-child(5) > div:nth-child(3) > div > div > div');
}
function insert_element_curr(){
    $('<a href="#" type="button" class="pull-right" id="btn_pop_curr" data-toggle="modal" data-target="#pop-modal-form" style="margin-right: 11px"><i class="glyphicon-plus"></i> Add New</a>').insertBefore('#form_ > div:nth-child(7) > div:nth-child(1) > div > div > div');
}
function insert_element_area(){
    $('<a href="#" type="button" class="pull-right" id="btn_pop_area" data-toggle="modal" data-target="#pop-modal-form" style="margin-right: 11px"><i class="glyphicon-plus"></i> Add New</a>').insertBefore('#form_ > div:nth-child(7) > div:nth-child(3) > div > div > div');
    
}
function insert_element_inv_code(){
    $('<a href="#" type="button" class="pull-right" id="btn_pop_inv_code" data-toggle="modal" data-target="#pop-modal-form" style="margin-right: 11px"><i class="glyphicon-plus"></i> Add New</a>').insertBefore('#form_input_inv > div:nth-child(3) > div > div > div > div');
    
}

function refreshOrderTable(){
    
    id = $("input[name=co_guid]").val();
    tableOrder.ajax.url("/apis/pull/co_order/"+id, null, false).load();
    
}
function refreshInvTable(){
    tableInv.ajax.url("/apis/pull/inv/"+id, null, false).load();
}
function initOrderTable(){
    tableOrder = $('#dtTbl_Order').DataTable({
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
 
	        var col6 = api
                .column( 6 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 6 ).footer() ).html(numberWithCommas(col6));
            var col7 = api
                .column( 7 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 7 ).footer() ).html(numberWithCommas(col7));
            var col8 = api
                .column( 8 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 8 ).footer() ).html(numberWithCommas(col8));
            var col9 = api
                .column( 9 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 9 ).footer() ).html(numberWithCommas(col9));
            var col10 = api
                .column( 10 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 10 ).footer() ).html(numberWithCommas(col10));
        },
        "scrollCollapse": true,
        "paging": true, 
        "pageLength": 50,
        "lengthChange": false,
        "ajax": "/apis/pull/co_order/"+id,
        "processing": true,
        "language": {
            processing: '<i class="fa fa-spinner fa-pulse fa-3x fa-fw loader-custom"></i><span class="sr-only"></span> '},
        //"serverSide": true,
        "columnDefs": [{
            "targets": [ 2, 3 ],
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
            { "data": "co_order_guid" },
            { "data": "co_order_fp_guid" },
            { "data": "fp_desc" },
            { "data": "co_order_info" },
            { "data": "co_order_cost" , render: $.fn.dataTable.render.number(',', '.', 0, '')},
            { "data": "co_order_price" , render: $.fn.dataTable.render.number(',', '.', 0, '')},
            { "data": "co_order_qty" },
            { "data": "total_cost" , render: $.fn.dataTable.render.number(',', '.', 0, '')},
            { "data": "total_price" , render: $.fn.dataTable.render.number(',', '.', 0, '')},
            
        ]
    });
}
function initInvTable(){
    tableInv = $('#dtTbl_Inv').DataTable({
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
            var col6 = api
                .column( 6 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 6 ).footer() ).html(numberWithCommas(col6));

            var col7 = api
                .column( 7 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 7 ).footer() ).html(numberWithCommas(col7));

	        var col9 = api
                .column( 9 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 9 ).footer() ).html(numberWithCommas(col9));
        },
        "scrollCollapse": true,
        "paging": true, 
        "pageLength": 50,
        "lengthChange": false,
        "ajax": "/apis/pull/inv/"+id,
        "processing": true,
        "language": {
            processing: '<i class="fa fa-spinner fa-pulse fa-3x fa-fw loader-custom"></i><span class="sr-only"></span> '},
        //"serverSide": true,
        "columnDefs": [{
            "targets": [ 2,3 ],
            "visible": false
        },
            {
                targets:[8], render:function(data){
                return moment(data).format('DD-MMM-YYYY');
                }
            }
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
            { "data": "inv_guid" },
            { "data": "inv_code" },
            { "data": "inv_id" },
            { "data": "inv_code_desc" },
            { "data": "inv_amount" , render: $.fn.dataTable.render.number(',', '.', 2, '')},
            { "data": "inv_amount_paid" , render: $.fn.dataTable.render.number(',', '.', 2, '')},
            { "data": "inv_paid_date" },
            { "data": "inv_unpaid" , render: $.fn.dataTable.render.number(',', '.', 2, '')},
            { "data": "inv_info" },
        ]
    });
}

function autoClientOrderId(){
    $('.modal').modal('show');
    $.ajax({
        type:"POST", // must be POST 
        url: "/apis/auto-id", 
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data) {
            $('.modal').modal('hide');
            if (data.success == true){
                $("input[name=co_order_id]").val(data.last_auto_id)
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
}


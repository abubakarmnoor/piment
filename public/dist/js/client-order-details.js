var tableOrder;
$(document).ready(function() {
            
    //default
    const id = $("input[name=co_guid]").val()
    $("#co_client_guid").selectpicker('val',null)
    $("#co_status").selectpicker('val',null)
    $('.selectpicker').selectpicker();
    insert_element_status();
    load_data_dt('/apis/pop/co-status'); //init
    initOrderTable();

    //edit or add new
    if (location.href.includes('ZWlk')) {
        $('.page-header').text('CLIENT ORDER UPDATES')
        
        // let url = location.href;
        // let id = getURLParameter(url, 'eid');
        // $("#id").val(id);
        get_details(id,undefined);
        
    }else if (location.href.includes('ZGlk')) {
        $('.page-header').text('CLIENT ORDER DETAILS');
        $("#btn_save").hide();
        $("#form_ :input").prop('readonly', true);
        
        $('.selectpicker').prop('disabled', true);
        $('.selectpicker').selectpicker('refresh');

        $("#ck_active").attr("disabled", true);
        $(".cancel").replaceWith("<a href='/client-order' type='button' class='btn btn-outline btn-primary'><i class='fa fa-long-arrow-left'></i> Back</a>");
        get_details(id,undefined);
        
    
    }else{
        $('.page-header').text('CLIENT ORDER LIST ADD NEW')
        
    }

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
        _data.tblname = "co";
        // console.log(_data);
        if (!_data.co_client_guid || !_data.co_status)
        {
            Swal.fire({
                icon: 'warning',
                title: 'Client Order',
                text: (!_data.co_client_guid ? "Please select one Client" : "Please select one Status")
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
                $('.modal').modal('hide');
                if (data.success == true){
                    Swal.fire({
                        icon: 'success',
                        title: 'Client Order',
                        text: "Data Saved"
                    }).then(function(){
                        var encodedUrl = encodeURIComponent($("input[name=co_order_id]").val());
                        get_details(undefined, encodedUrl)
                        $("#btn_tab_order").click();
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
    })
    $("#btn_tab_order,#btn_tab_po,#btn_tab_invoice").on("click", function(e){
        e.preventDefault();
        const _id = $("input[name=co_guid").val();
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
    
     // Delete a record
    $('#dtTbl_Order').on('click', 'td.editor-delete', function (e) {
        e.preventDefault();
        let _data = {};
        _data.id = tableOrder.row( this ).data().co_order_guid;
        _data.desc = tableOrder.row( this ).data().fp_desc;
        _data.upd_by = $("#logged_user_id").text();
        // console.log(_data);
        // console.log( table.row( this ).data().id );

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this! ("+_data.desc+")",
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
                            text: _data.rm_desc
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

//end  doc ready
});
//default-edit

//default-edit
function default_edit(data){
    $("input[name=co_guid]").val(data[0].co_guid)
    $("input[name=co_order_id]").val(data[0].co_order_id)
    $('#co_client_guid').selectpicker('val',data[0].co_client_guid)
    const _odate = formatDate(data[0].co_order_date);
    $("#co_order_date").val(_odate)
    const _ddate = formatDate(data[0].co_delivery_date);
    $("#co_delivery_date").val(_ddate)
    $('#co_status').selectpicker('val',data[0].co_status)
    $("textarea[name=co_notes]").text(data[0].co_notes)

}

//get details
function get_details(id,orid){
    //ajax - get details
    spinner_popup();
    //ajax
    $.ajax({
        type:"GET", 
        url: "/apis/pull/co/"+id+"/"+orid, 
        dataType: "json",
        success: function(data) {
            // console.log(data.data);
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
    $('<a href="#" type="button" class="pull-right" id="btn_pop_co_status" data-toggle="modal" data-target="#pop-modal-form" style="margin-right: 11px"><i class="glyphicon-plus"></i> Add New</a>').insertBefore('#form_ > div:nth-child(5) > div:nth-child(2) > div > div > div');
}
function refreshOrderTable(){
    tableOrder.ajax.url("/apis/pull/co_order", null, false).load();
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
 
	        var col4 = api
                .column( 5 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 4 ).footer() ).html(numberWithCommas(col4));
            var col5 = api
                .column( 5 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 5 ).footer() ).html(numberWithCommas(col5));
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
        },
        "scrollCollapse": true,
        "paging": true, 
        "lengthChange": false,
        "ajax": "/apis/pull/co_order",
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
            { "data": "co_order_guid" },
            { "data": "fp_desc" },
            { "data": "co_order_cost" , render: $.fn.dataTable.render.number(',', '.', 2, '')},
            { "data": "co_order_price" , render: $.fn.dataTable.render.number(',', '.', 2, '')},
            { "data": "co_order_qty" },
            { "data": "total_cost" , render: $.fn.dataTable.render.number(',', '.', 2, '')},
            { "data": "total_price" , render: $.fn.dataTable.render.number(',', '.', 2, '')},

            
        ]
    });
}
//doc ready
var tableProd;
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
    tableProd = $('#dtTbl').DataTable({
        // "scrollY": "370px",
        "scrollCollapse": true,
        "paging": true, 
        "lengthChange": false,
        "ajax": "/apis/pull/prod",
        "processing": true,
        "language": {
            processing: '<i class="fa fa-spinner fa-pulse fa-3x fa-fw loader-custom"></i><span class="sr-only"></span> '},
        //"serverSide": true,
        "columnDefs": [{
            "targets": [ 2,3 ],
            "visible": false
        },{
            targets:[10,11], render:function(data){
            return moment(data).format('DD-MMM-YYYY');
        }}],
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
            { "data": "prod_guid" },
            { "data": "prod_co_guid" },
            { "data": "prod_id" },
            { "data": "prod_pic" },
            { "data": "prod_info" },
            { "data": "prod_status_desc" },
            { "data": "client_name" },
            { "data": "co_order_id" },
            { "data": "co_order_date" },
            { "data": "co_delivery_date" },
        ]
    });
    
    //default / init
    $('.selectpicker').selectpicker();
    insert_element_prod_status();
    load_data_dt('/apis/pop/prod-status'); //init
    selectpicker_refresh('prod_status','/apis/pop/prod-status');
    selectpicker_refresh('prod_co_guid','/apis/pull/co');
    
    $('#btn_pop_prod_status').on('click', function(){
        // e.preventDefault();
        $('#th_pop_desc').text('Prod Status')
        $('#lbl_pf_desc').text('Prod Status')
        $("label[name=pop_type").text("prod-status")
        $("input[name=pop_desc").val("")
        $('input[type=search]').val("");
        TablePop.ajax.url("/apis/pop/prod-status", null, false).load(); // 
        TablePop.search('');
    })
    
    // New record
    $('a.editor-create').on('click', function (e) {
        e.preventDefault();
        resetForm();
    } );

    // Edit record
    $('#dtTbl').on('click', 'td.editor-edit', function (e) {
        e.preventDefault();
        //console.log( table.row( this ).data().id );
        const _id = tableProd.row( this ).data().prod_guid;
        
    } );
    
    // Details record
    $('#dtTbl').on('click', 'td.editor-details', function (e) {
        e.preventDefault();
        //console.log( table.row( this ).data().id );
        const _id = tableProd.row( this ).data().prod_guid;
        
    } );
    // Delete a record
    $('#dtTbl').on('click', 'td.editor-delete', function (e) {
        e.preventDefault();
        let _data = {};
        _data.id = tableProd.row( this ).data().prod_guid;
        _data.client_name = tableProd.row( this ).data().client_name
        _data.upd_by = $("#logged_user_id").text();
        
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
                    url: "/apis/del/prod", 
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(_data),
                    success: function(data) {
                        $('.modal').modal('hide');
                        if(data.success == true){
                            Swal.fire({
                                icon: "success",
                                title: "Data Deleted",
                                text: _data.client_name
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
        // var sdate_ =  moment($("input[name='daterangepicker_start']").val()).format('YYYY-MM-DD');
        // var edate_ =  moment($("input[name='daterangepicker_end']").val()).format('YYYY-MM-DD');
        // if (moment(sdate_)._isValid == false){
        //     sdate_ = moment().subtract(29, 'days').format('YYYY-MM-DD');
        //     edate_ = moment().format('YYYY-MM-DD');;
        // }
        // console.log(sdate_);
        // console.log(edate_);
        //var table = $('#registrationTable').DataTable();
        tableProd.ajax.url("/apis/pull/prod", null, false).load();
    })

    //save
    $('#form_input').submit(function(e) {
        //$('#messages').removeClass('hide').addClass('alert alert-success alert-dismissible').slideDown().show();
        //$('#messages_content').html('<h4>MESSAGE HERE</h4>');
        //$('#modal').modal('show');
        
        e.preventDefault();
        const form = $(e.target);
        const _data = convertFormToJSON(form);
        _data.prod_upd_by = $("#logged_user_id").text();
        _data.tblname = "prod";
        console.log(_data);
        

        if (!_data.prod_co_guid || !_data.prod_status)
        {
            Swal.fire({
                icon: 'warning',
                title: 'Work Order',
                text: (!_data.prod_co_guid ? "Please select one Client Order" : "Please select one Status")
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


// function
//insert element
function insert_element_prod_status(){
    $('<a href="#" type="button" class="pull-right" id="btn_pop_prod_status" data-toggle="modal" data-target="#pop-modal-form" style="margin-right: 11px"><i class="glyphicon-plus"></i> Add New</a>').insertBefore('#form_input > div:nth-child(3) > div.col-md-8.mb-3 > div > div > div');
}
resetForm = function(){
    $("input[name=prod_id]").val('');
    $("#prod_co_guid").selectpicker('val',null);
    $("input[name=prod_pic]").val('');
    $("#prod_status").selectpicker('val',null);
    $("textarea[name=prod_info]").val('');
    
}
function default_edit(data){
    $("input[name=prod_id]").val(data[0].prod_id);
    $("#prod_co_guid").selectpicker('val',data[0].prod_co_guid);
    $("input[name=prod_pic]").val(data[0].prod_pic);
    $("#prod_status").selectpicker('val',data[0].prod_status);
    $("textarea[name=prod_info]").val(data[0].prod_info);    
}

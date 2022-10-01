$(document).ready(function() {
            
    //default
    const id = $("input[name=co_guid]").val()
    $("#co_client_guid").selectpicker('val',null)
    $("#co_status").selectpicker('val',null)
    $('.selectpicker').selectpicker();
    insert_element_status();
    load_data_dt('/apis/pop/co-status'); //init
    
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
        
    })
    $("#btn_tab_order,#btn_tab_po,#btn_tab_invoice").on("click", function(e){
        e.preventDefault();
        const _id = $("input[name=co_guid").val();
        console.log(_id);
        if (!_id){
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
// $(function(){
//     $(".datepicker").datepicker({
//         format: 'yyyy-mm-dd',
//         setDate: new Date(),
//         autoclose: true,
//         todayHighlight: true,
//     });
// });

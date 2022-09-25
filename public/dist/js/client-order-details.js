$(document).ready(function() {
            
    //default
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
        // get_details();
        
    }else if (location.href.includes('ZGlk')) {
        $('.page-header').text('CLIENT ORDER DETAILS');
        $("#btn_save").hide();
        $("#form_ :input").prop('readonly', true);
        
        $('.selectpicker').prop('disabled', true);
        $('.selectpicker').selectpicker('refresh');

        $("#ck_active").attr("disabled", true);
        $(".cancel").replaceWith("<a href='/client-order' type='button' class='btn btn-outline btn-primary'><i class='fa fa-long-arrow-left'></i> Back</a>");
        get_details();
        
    
    }else{
        $('.page-header').text('CLIENT ORDER LIST ADD NEW')
        let username = 'Admin';
        
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
        console.log(_data);
        if (!_data.co_client_guid || !_data.co_status)
        {
            Swal.fire({
                icon: 'warning',
                title: 'Client Order',
                text: (!_data.co_client_guid ? "Please select one Client" : "Please select one Status")
            })
            return;
        }
        return;

        // ajax - save/post data
        spinner_popup();
        $.ajax({
            type:"GET", // must be POST 
            url: "/data/client-order.json", 
            dataType: "json",
            data: _data,
            success: function(data) {
                setTimeout(function () {
                    $('.modal').modal('hide');
                    Swal.fire({
                        icon: 'success',
                        title: '',
                        text: "Data Saved"
                    }).then(function(){
                        location.href='/client-order'
                    });
                    
                }, 3000);
                
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

    //date datepicker
    $("#order_date").datepicker({
        format: "dd-M-yyyy",
    });
    $("#delivery_date").datepicker({
        format: "dd-M-yyyy",
    });
    
//end  doc ready
});
//default-edit
function default_edit(data){

    let _date = new Date(data[0].cost_last_updated)
    //_date.setDate(_date.getDate()+1)
    
    $("input[name=rm_code").val(data[0].rm_code)
    $("input[name=rm_desc").val(data[0].rm_desc)
    $('#sp_product_family').selectpicker('val',data[0].product_family)
    $("input[name=cost").val(numberWithCommas(data[0].cost))
    $('#sp_unit').selectpicker('val',data[0].unit)
    $("input[name=box_size_w").val(data[0].box_size_w)
    $("input[name=box_size_l").val(data[0].box_size_l)
    $("input[name=box_size_h").val(data[0].box_size_h)
    $('#sp_kayu').selectpicker('val',data[0].kayu)
    $("input[name=cost_last_updated").val(formatDate(_date,true))
    $('#sp_creator').selectpicker('val',data[0].creator)
    $("#ck_validated").prop('checked', data[0].validated)
    $("#ck_out").prop('checked', data[0].out)
    $("#ck_active").prop('checked', data[0].active)

    let user_login = 'Admin';
    
}

//insert element
function insert_element_status(){
    $('<a href="#" type="button" class="pull-right" id="btn_pop_co_status" data-toggle="modal" data-target="#pop-modal-form" style="margin-right: 11px"><i class="glyphicon-plus"></i> Add New</a>').insertBefore('#form_ > div:nth-child(5) > div:nth-child(2) > div > div > div');
}

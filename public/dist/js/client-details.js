$(document).ready(function() {
            
    //default
    let id=$("input[name=client_guid]").val()
    $('.selectpicker').selectpicker();
    insert_element_act();
    load_data_dt('/apis/pop/activity'); //init

    //edit or add new
    if (location.href.includes('ZWlk')) {
        $('.page-header').text('CLIENT UPDATES')
        get_details(id);
        
    }else if (location.href.includes('ZGlk')) {
        $('.page-header').text('CLIENT DETAILS');
        $("#btn_save").hide();
        $("#form_ :input").prop('readonly', true);
        
        $('.selectpicker').prop('disabled', true);
        $('.selectpicker').selectpicker('refresh');

        $("#ck_active").attr("disabled", true);
        $(".cancel").html("<a href='/clients'  type='button' class='btn btn-outline btn-primary'><i class='fa fa-long-arrow-left'></i> Back</a>");
        get_details(id);
        
    
    }else{
        $('.page-header').text('CLIENT ADD NEW')
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
        _data.client_active = $("#ck_active").prop('checked')
        _data.client_upd_by="Admin";
        _data.tblname = "client";
        return console.log(json);

        // ajax - save/post data
        spinner_popup();
        $.ajax({
            type:"POST", // must be POST 
            url: "/apis/upd", 
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: _data,
            success: function(data) {
                $('.modal').modal('hide');
                if (data.data.success == true){
                    Swal.fire({
                        icon: 'success',
                        title: '',
                        text: "Data Saved"
                    }).then(function(){
                        location.href='/clients'
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

//end  doc ready
});
//default-edit
function default_edit(data){
    $("input[name=client_name").val(data[0].client_name)
    $("textarea[name=client_address").val(data[0].client_address)
    $("input[name=client_state").val(data[0].client_state)
    $('#sp_country').selectpicker('val',data[0].client_country.toUpperCase())
    $("input[name=client_zipcode").val(data[0].client_zipcode)
    $("input[name=client_email").val(data[0].client_email)
    $("input[name=client_phone").val(data[0].client_phone)
    $("input[name=client_fax").val(data[0].client_fax)
    $("input[name=client_whatsapp").val(data[0].client_whatsapp)
    $('#sp_activity').selectpicker('val',data[0].client_activity)
    $("#ck_active").prop('checked', data[0].client_active)

}
//get details
function get_details(id){
    //ajax - get details
    spinner_popup();
    //ajax
    $.ajax({
        type:"GET", 
        url: "/apis/pull/client/"+id, 
        dataType: "json",
        success: function(data) {
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
function insert_element_act(){
    $('<a href="#"  type="button" class="pull-right" id="btn_pop_act" data-toggle="modal" data-target="#pop-modal-form" style="margin-right: 11px"><i class="glyphicon-plus"></i> Add New</a>').insertBefore('.bs-searchbox');
}

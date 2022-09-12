$(document).ready(function() {
            
    //default
    let id=$("input[name=supplier_guid]").val()
    insert_element_pos();
    load_data_dt('/apis/pop/product-family'); //init
    //edit or add new
    if (location.href.includes('eid')) {
        $('.page-header').text('USER UPDATES')
        
        let url = location.href;
        let id = getURLParameter(url, 'eid');
        $("#id").val(id);
        get_details();
        
        
    }else if (location.href.includes('did')) {
        $('.page-header').text('USER DETAILS');
        $("#btn_save").hide();
        $("#form_ :input").prop('readonly', true);
        $("#ck_active").attr("disabled", true);
        $(".cancel").html("<a href='/Users'  type='button' class='btn btn-outline btn-primary'><i class='fa fa-long-arrow-left'></i> Back</a>");
        get_details();
    
    }else{
        $('.page-header').text('USER ADD NEW')
        let username = 'Admin';
        
    }

    //pasword
    $("#txt_password_ a").on('click', function(event) {
        event.preventDefault();
        if($('#txt_password_ input').attr("type") == "text"){
            $('#txt_password_ input').attr('type', 'password');
            $('#txt_password_ i').addClass( "fa-eye-slash" );
            $('#txt_password_ i').removeClass( "fa-eye" );
        }else if($('#txt_password_ input').attr("type") == "password"){
            $('#txt_password_ input').attr('type', 'text');
            $('#txt_password_ i').removeClass( "fa-eye-slash" );
            $('#txt_password_ i').addClass( "fa-eye" );
        }
    });

     //btn
    //save
    $('#form_').submit(function(e) {
        //$('#messages').removeClass('hide').addClass('alert alert-success alert-dismissible').slideDown().show();
        //$('#messages_content').html('<h4>MESSAGE HERE</h4>');
        //$('#modal').modal('show');
        
        e.preventDefault();
        const form = $(e.target);
        const json = convertFormToJSON(form);
        // json.userpass_active = $("#ck_active").prop('checked')
        //console.log(json);

        // ajax
        spinner_popup();
        $.ajax({
            type:"POST", 
            url: "/apis/upd", 
            dataType: "json",
            success: function(data) {
                setTimeout(function () {
                    $('.modal').modal('hide');
                    Swal.fire({
                        icon: 'success',
                        title: '',
                        text: "Data Saved"
                    }).then(function(){
                        location.href='/users'
                    });
                    
                }, 3000);
                
            }, 
            error: function(jqXHR, textStatus, errorThrown) {
                //alert(jqXHR.status);
                $('.modal').modal('hide');
                swal({
                    title: "Error!",
                    text: jqXHR.status,
                    icon: "error"
                });
            }
        });

    });
//end  doc ready
});
//default-edit
function default_edit(data){
    $("input[name=passuser_username]").val(data[0].userpass_username)
    $("input[name=passuser_password]").val(data[0].userpass_password)
    $("input[name=passuser_fname]").val(data[0].userpass_fname)
    $("input[name=passuser_lname]").val(data[0].userpass_lname)
    $("input[name=passuser_position]").val(data[0].userpass_position)
    $("input[name=passuser_email]").val(data[0].userpass_email)
    $("input[name=passuser_phone]").val(data[0].userpass_phone)
    $("#ck_active").prop('checked', data[0].userpass_active)    
    
}
//get details
function get_details(){
    //ajax - get details
    spinner_popup();
    //ajax
    $.ajax({
        type:"GET", 
        url: "/apis/pull/userpass", 
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
function insert_element_pos(){
    $('<a href="#" type="button" class="pull-right" id="btn_pop_pos" data-toggle="modal" data-target="#pop-modal-form" style="margin-right: 11px"><i class="glyphicon-plus"></i> Add New</a>').insertBefore('#form_ > div:nth-child(8) > div > div > div > div');
}

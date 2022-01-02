$(document).ready(function() {
            
    //default
    get_date_default()

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
        let username = 'test';
        get_date_default(username,null, username, null)
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
        json.txt_created_date = new Date(json.txt_created_date);
        json.txt_created_date = formatDate(json.txt_created_date)
        json.txt_updated_date = new Date(json.txt_updated_date);
        json.txt_updated_date = formatDate(json.txt_updated_date)
        json.active = $("#ck_active").prop('checked')
        //console.log(json);

        // ajax
        spinner_popup();
        $.ajax({
            type:"GET", 
            url: "/data/users.json", 
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
    $("#txt_username").val(data[0].username)
    $("#txt_password").val(data[0].password)
    $("#txt_first_name").val(data[0].first_name)
    $("#txt_last_name").val(data[0].last_name)
    $("#txt_position").val(data[0].position)
    $("#txt_email").val(data[0].email)
    $("#txt_phone").val(data[0].phone)
    $("#ck_active").prop('checked', data[0].active)
    let user_login = 'test';
    get_date_default(data[0].created_by,data[0].created_date, user_login, null)
}
//get details
function get_details(){
    //ajax - get details
    spinner_popup();
    //ajax
    $.ajax({
        type:"GET", 
        url: "/data/users.json", 
        dataType: "json",
        success: function(data) {
            setTimeout(function () {
                default_edit(data.data);
                $('.modal').modal('hide');
            }, 3000);
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
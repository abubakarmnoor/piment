$(document).ready(function() {
            
    //default
    $('.selectpicker').selectpicker();
    insert_element();
    load_data_dt('/apis/pop/product-family'); //init

    //edit or add new
    if (location.href.includes('eid')) {
        $('.page-header').text('SUPPLIER UPDATES')
        
        let url = location.href;
        let id = getURLParameter(url, 'eid');
        $("#id").val(id);
        get_details();
        
    }else if (location.href.includes('did')) {
        $('.page-header').text('SUPPLIER DETAILS');
        $("#btn_save").hide();
        $("#form_ :input").prop('readonly', true);
        
        $('.selectpicker').prop('disabled', true);
        $('.selectpicker').selectpicker('refresh');

        $("#ck_active").attr("disabled", true);
        $(".cancel").html("<a href='/suppliers'  type='button' class='btn btn-outline btn-primary'><i class='fa fa-long-arrow-left'></i> Back</a>");
        get_details();
        
    
    }else{
        $('.page-header').text('SUPPLIER ADD NEW')
        let username = 'Admin';
        get_date_default(username,null, username, null)
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
        _data.txt_created_date = new Date(_data.txt_created_date);
        _data.txt_created_date = formatDate(_data.txt_created_date)
        _data.txt_updated_date = new Date(_data.txt_updated_date);
        _data.txt_updated_date = formatDate(_data.txt_updated_date)
        _data.active = $("#ck_active").prop('checked')
        //console.log(json);

        // ajax - save/post data
        spinner_popup();
        $.ajax({
            type:"GET", // must be POST 
            url: "/apis/pull/supplier", 
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
                        location.href='/suppliers'
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
//end  doc ready
});
//default-edit
function default_edit(data){
    $("input[name=supplier_name").val(data[0].supplier_name)
    $("textarea[name=address").val(data[0].address)
    $("input[name=state").val(data[0].state)
    $('#sp_country').selectpicker('val',data[0].country.toUpperCase())
    $("input[name=zipcode").val(data[0].zipcode)
    $("input[name=pic").val(data[0].pic)
    $("input[name=email").val(data[0].email)
    $("input[name=phone").val(data[0].phone)
    $("input[name=fax").val(data[0].fax)
    $("input[name=whatsapp").val(data[0].whatsapp)
    $('#sp_product_family').selectpicker('val',data[0].product_family)
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
        url: "/apis/pull/supplier", 
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
function insert_element(){
    $('<a href="#"  type="button" class="pull-right" id="btn_pop_pf" data-toggle="modal" data-target="#pop-modal-form" style="margin-right: 11px"><i class="glyphicon-plus"></i> Add New</a>').insertBefore('.bs-searchbox');
}

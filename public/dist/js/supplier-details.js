$(document).ready(function() {
            
    //default
    let id=$("input[name=supplier_guid]").val()
    $('.selectpicker').selectpicker();
    insert_element_pf();
    load_data_dt('/apis/pop/product-family'); //init

    //edit or add new
    if (location.href.includes('ZWlk')) {
        $('.page-header').text('SUPPLIER UPDATES')
        get_details(id);
        
    }else if (location.href.includes('ZGlk')) {
        $('.page-header').text('SUPPLIER DETAILS');
        $("#btn_save").hide();
        $("#form_ :input").prop('readonly', true);
        
        $('.selectpicker').prop('disabled', true);
        $('.selectpicker').selectpicker('refresh');

        $("#ck_active").attr("disabled", true);
        $(".cancel").html("<a href='/suppliers'  type='button' class='btn btn-outline btn-primary'><i class='fa fa-long-arrow-left'></i> Back</a>");
        get_details(id);
        
    
    }else{
        $('.page-header').text('SUPPLIER ADD NEW')
        
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
        _data.supplier_active = $("#ck_active").prop('checked')
        _data.supplier_upd_by = $("#logged_user_id").text();
        _data.tblname = "supplier";
        //  console.log(_data);

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
                        title: '',
                        text: "Data Saved"
                    }).then(function(){
                        location.href='/suppliers'
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
    $("input[name=supplier_name").val(data[0].supplier_name)
    $("textarea[name=supplier_address").val(data[0].supplier_address)
    $("input[name=supplier_state").val(data[0].supplier_state)
    $('#sp_country').selectpicker('val',data[0].supplier_country.toUpperCase())
    $("input[name=supplier_zipcode").val(data[0].supplier_zipcode)
    $("input[name=supplier_pic").val(data[0].supplier_pic)
    $("input[name=supplier_email").val(data[0].supplier_email)
    $("input[name=supplier_phone").val(data[0].supplier_phone)
    $("input[name=supplier_fax").val(data[0].supplier_fax)
    $("input[name=supplier_whatsapp").val(data[0].supplier_whatsapp)
    $('#sp_product_family').selectpicker('val',data[0].supplier_prod_family)
    $("#ck_active").prop('checked', data[0].supplier_active)

}
//get details
function get_details(id){
    //ajax - get details
    spinner_popup();
    //ajax
    $.ajax({
        type:"GET", 
        url: "/apis/pull/supplier/"+id, 
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
function insert_element_pf(){
    $('<a href="#" type="button" class="pull-right" id="btn_pop_pf" data-toggle="modal" data-target="#pop-modal-form" style="margin-right: 11px"><i class="glyphicon-plus"></i> Add New</a>').insertBefore('#form_ > div:nth-child(8) > div > div > div > div');
}

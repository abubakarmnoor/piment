spinner_popup();
$(document).ready(function() {
            
    //default
    let id=$("#rm_guid").val()
    $('.selectpicker').selectpicker();
    insert_element_pf();insert_element_kayu();insert_element_unit();
    load_data_dt('/apis/pop/product-family'); //init

    //edit or add new
    if (location.href.includes('ZWlk')) {
        $('.page-header').text('RAW MATERIAL UPDATES')
        
        // let url = location.href;
        // let id = getURLParameter(url, 'eid');
        // $("#id").val(id);
        
        get_details(id);
        
    }else if (location.href.includes('ZGlk')) {
        $('.page-header').text('RAW MATERIAL DETAILS');
        $("#btn_save").hide();
        $("#form_ :input").prop('readonly', true);
        
        $('.selectpicker').prop('disabled', true);
        $('.selectpicker').selectpicker('refresh');

        $("#ck_active").attr("disabled", true);
        $(".cancel").html("<a href='/raw-materials'  type='button' class='btn btn-outline btn-primary'><i class='fa fa-long-arrow-left'></i> Back</a>");
        get_details(id);
        
    
    }else{
        $('.modal').modal('hide');
        $('.page-header').text('RAW MATERIAL ADD NEW')
        $("input[name=rm_desc]").val($(this).find("option:selected").attr("desc"))
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
        _data.rm_active = $("#ck_active").prop('checked')
        _data.rm_cost = (_data.rm_cost).replace(/\,/g,'');//.toFixed(2);
        // _data.cost = parseFloat(_data.cost).toFixed();
        _data.rm_code = $("input[name=rm_code]").val()
        _data.rm_upd_by='Admin'
        _data.tblname = 'rm';
        // console.log(_data);
        // ajax - save/post data
        spinner_popup();
        $.ajax({
            type:"POST",
            url: "/apis/upd/", 
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(_data),
            success: function(data) {
                $('.modal').modal('hide');
                if (data.success == true){
                    Swal.fire({
                        icon: 'success',
                        title: 'RM',
                        text: "Data Saved"
                    }).then(function(){
                        location.href='/raw-materials'
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

    //dropdown
     $('#sp_rm_code').on('change', function(e) {
         e.preventDefault();
         $("input[name=rm_desc]").val($(this).find("option:selected").attr("desc"))
     });
   
    
//end  doc ready
});
//default-edit
function default_edit(data){

    //$("input[name=rm_code]").attr('disabled','disabled')
    $("input[name=rm_code]").val(data[0].rm_code)
    $("input[name=rm_desc]").val(data[0].rm_desc)
    $('#sp_product_family').selectpicker('val',data[0].rm_prod_family)
    $("input[name=rm_cost").val(numberWithCommas(data[0].rm_cost).replace('.00','')).focusout()
    $('#sp_unit').selectpicker('val',data[0].rm_unit)
    $("input[name=rm_box_size_l").val(data[0].rm_box_size_l)
    $("input[name=rm_box_size_w").val(data[0].rm_box_size_w)
    $("input[name=rm_box_size_h").val(data[0].rm_box_size_h)
    $('#sp_kayu').selectpicker('val',data[0].rm_kayu)
    // $("input[name=cost_last_updated").val(formatDate(_date,true))
    // $('#sp_creator').selectpicker('val',data[0].creator)
    // $("#ck_validated").prop('checked', data[0].validated)
    // $("#ck_out").prop('checked', data[0].out)
    $("#ck_active").prop('checked', data[0].rm_active)

    let user_login = data[0].rm_upd_by;
    get_date_default(data[0].rm_created_by,data[0].rm_created_date, user_login, null)
}
//get details
function get_details(id){
    // console.log(id);
    //ajax - get details
    spinner_popup();
    //ajax
    $.ajax({
        type:"GET", 
        url: "/apis/pull/rm/"+id, 
        dataType: "json",
        success: function(data) {
            // console.log(data);
            default_edit(data.data);
            $('.modal').modal('hide');
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
}

//insert element
function insert_element_pf(){
    $('<a href="#" type="button" class="pull-right" id="btn_pop_pf" data-toggle="modal" data-target="#pop-modal-form" style="margin-right: 11px"><i class="glyphicon-plus"></i> Add New</a>').insertBefore('#form_ > div:nth-child(5) > div:nth-child(1) > div > div > div');
}
function insert_element_kayu(){
    $('<a href="#" type="button" class="pull-right" id="btn_pop_kayu" data-toggle="modal" data-target="#pop-modal-form" style="margin-right: 11px"><i class="glyphicon-plus"></i> Add New</a>').insertBefore('#form_ > div:nth-child(6) > div:nth-child(2) > div > div > div');
}
function insert_element_unit(){
    $('<a href="#" type="button" class="pull-right" id="btn_pop_unit" data-toggle="modal" data-target="#pop-modal-form" style="margin-right: 11px"><i class="glyphicon-plus"></i> Add New</a>').insertBefore('#form_ > div:nth-child(5) > div:nth-child(3) > div > div > div');
}
function insert_element_creator(){
    $('<a href="#" type="button" class="pull-right" id="btn_pop_creator" data-toggle="modal" data-target="#pop-modal-form" style="margin-right: 11px"><i class="glyphicon-plus"></i> Add New</a>').insertBefore('#form_ > div:nth-child(6) > div:nth-child(3) > div > div > div');
    
}

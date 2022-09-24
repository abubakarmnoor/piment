$(document).ready(function() {
            
    //default
    $('.selectpicker').selectpicker();
    insert_element_status();
    
    $("#co_client_guid").selectpicker('val',null)
    $("#co_status").selectpicker('val',null)
    //edit or add new
    if (location.href.includes('ZWlk')) {
        $('.page-header').text('CLIENT ORDER UPDATES')
        
        // let url = location.href;
        // let id = getURLParameter(url, 'eid');
        // $("#id").val(id);
        get_details();
        
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
        $('.page-header').text('ORDER LIST ADD NEW')
        let username = 'test';
        
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
                title: 'Submit',
                text: (!_data.co_client_guid ? "Please select one client" : "Please select one status")
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

    //save
    $('#form__').submit(function(e) {
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
        console.log(_data);

        // ajax - save/post data
        spinner_popup();
        $.ajax({
            type:"GET", // must be POST 
            url: "/data/pop-product-family.json", 
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
                        //location.href='/clients'
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

    // Edit record
    $('#dtTbl_pop').on('click', 'td.editor-edit', function (e) {
        e.preventDefault();
        //console.log( table.row( this ).data().id );
        const _id = table.row( this ).data().id;
        const _pop_desc = table.row( this ).data().pop_desc;
        const _active = table.row( this ).data().active;
        
        $("#pop_id").val(_id);
        $("input[name=activity_desc]").val(_pop_desc);
        $("#ck_active_pop").prop('checked', _active);

    } );
    
    // Details record
    $('#dtTbl_pop').on('click', 'td.editor-details', function (e) {
        e.preventDefault();
        //console.log( table.row( this ).data().id );
        const _id = table.row( this ).data().id;

        
    } );
    // Delete a record
    $('#dtTbl_pop').on('click', 'td.editor-delete', function (e) {
        e.preventDefault();
        //console.log( table.row( this ).data().id );

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
                )
            }
        })
    } );

    //number
    $("#cost").on('keyup', function(){
        
        let _amt = $(this).val().replace(/,/g,"");
        $(this).val(numberWithCommas(_amt));
        
    })

    
    //btn add new pop
    $('#btn_pop_pf').on('click', function(){
        // e.preventDefault();
        
        $('#txt_pop_type').val('Product Family')
        $('#th_pop_desc').text('Product Family Desc')
        $('#lbl_pf_desc').text('Product Family Desc')
        $("input[name=pop_desc").val("")
        table.ajax.url("/data/pop-product-family.json", null, false).load(); // pop pf
    });
    $('#btn_pop_kayu').on('click', function(){
        // e.preventDefault();
        
        $('#txt_pop_type').val('Kayu')
        $('#th_pop_desc').text('Kayu Desc')
        $('#lbl_pf_desc').text('Kayu Desc')
        $("input[name=pop_desc").val("")
        table.ajax.url("/data/pop-kayu.json", null, false).load(); // pop kayu
        
    })
    $('#btn_pop_unit').on('click', function(){
        // e.preventDefault();
        
        $('#txt_pop_type').val('Unit')
        $('#th_pop_desc').text('Unit Desc')
        $('#lbl_pf_desc').text('Unit Desc')
        $("input[name=pop_desc").val("")
        table.ajax.url("/data/pop-unit.json", null, false).load(); // pop unit
        
    })
    $('#btn_pop_creator').on('click', function(){
        // e.preventDefault();
        
        $('#txt_pop_type').val('Creator')
        $('#th_pop_desc').text('Creator Desc')
        $('#lbl_pf_desc').text('Creator Desc')
        $("input[name=pop_desc").val("")
        table.ajax.url("/data/pop-creator.json", null, false).load(); // pop creator
        
    })

    // Edit record
    $('#dtTbl_pop').on('click', 'td.editor-edit', function (e) {
        e.preventDefault();
        //console.log( table.row( this ).data().id );
        const _id = table.row( this ).data().id;
        const _pop_desc = table.row( this ).data().pop_desc;
        const _active = table.row( this ).data().active;
        
        $("#pop_id").val(_id);
        $("input[name=pop_desc]").val(_pop_desc);
        $("#ck_active_pop").prop('checked', _active);

    } );
    
    
    // Delete a record
    $('#dtTbl_pop').on('click', 'td.editor-delete', function (e) {
        e.preventDefault();
        //console.log( table.row( this ).data().id );

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
                )
            }
        })
    } );
    //number
    $("#rate").on('keyup', function(){
        let _amt = $(this).val().replace(/,/g,"");
        $(this).val(numberWithCommas(_amt));
    })
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
        url: "/data/raw-materials.json", 
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

//insert element
function insert_element_status(){
    $('<a href="#" type="button" class="pull-right" id="btn_pop_status" data-toggle="modal" data-target="#pop-modal-form" style="margin-right: 11px"><i class="glyphicon-plus"></i> Add New</a>').insertBefore('#form_ > div:nth-child(5) > div:nth-child(2) > div > div > div');
}

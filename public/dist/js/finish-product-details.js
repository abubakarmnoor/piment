$(document).ready(function() {
            
    //default
    $('.selectpicker').selectpicker();
    insert_element_pf(); insert_element_origin(); insert_element_creator();
    load_data_dt('/data/pop-product-family.json'); //init

    //edit or add new
    if (location.href.includes('ZWlk')) {
        $('.page-header').text('FINISH PRODUCT UPDATES')
        $("#btn_fpc").show();
        // let url = location.href;
        // let id = getURLParameter(url, 'ZWlk');
        // $("#id").val(id);
        get_details();
        
    }else if (location.href.includes('ZGlk')) {
        $('.page-header').text('FINISH PRODUCT DETAILS');
        $("#btn_save").hide();
        $("#btn_fpc").show();
        $("#form_ :input").prop('readonly', true);
        
        $('.selectpicker').prop('disabled', true);
        $('.selectpicker').selectpicker('refresh');

        $("#ck_active").attr("disabled", true);
        $(".cancel").html("<a href='/finish-product' type='button' class='btn btn-outline btn-primary'><i class='fa fa-long-arrow-left'></i> Back</a>");
        // let url = location.href;
        // let id = getURLParameter(url, 'did');
        // $("#id").val(id);
        get_details();
        
    
    }else{
        $('.page-header').text('FINISH PRODUCT ADD NEW')
        $("#btn_fpc").hide();
        let username = 'test';
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
            url: "/data/finish-product.json", 
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
                        location.href='/finish-product'
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
        // console.log(_data);

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
    //btn
    $("#btn_fpc").on("click", function(e){
        e.preventDefault();
        location.href = "/fpc/"+$("#fpid").val()+"/"+$("#act").val();
    })

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
    $(".numeric").on('keypress', function(e){
        
        isNumber(e)
        let _amt = $(this).val().replace(/,/g,"");
        // console.log(_amt);
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
    $('#btn_pop_origin').on('click', function(){
        // e.preventDefault();
        
        $('#txt_pop_type').val('Origin')
        $('#th_pop_desc').text('Origin Desc')
        $('#lbl_pf_desc').text('Origin Desc')
        $("input[name=pop_desc").val("")
        table.ajax.url("/data/pop-origin.json", null, false).load(); // pop creator
        
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
    
    //date datepicker
    $("#created_date").datepicker({
        format: "dd-M-yyyy",
    });
    $("#receipt_last_updated").datepicker({
        format: "dd-M-yyyy",
    });

    //number
    $("#cost, #b_sale, #b_profit, #b_markup, #r_sale, #r_profit, #r_markup").on('keyup', function(){
        let _amt = $(this).val().replace(/,/g,"");
        $(this).val(numberWithCommas(_amt));
    })

//end  doc ready
});
//default-edit
function default_edit(data){

    let _c_date = new Date(data[0].created_date)
    let _rlu_date = new Date(data[0].receipt_last_updated)
    //_date.setDate(_date.getDate()+1)
    
    $("input[name=fp_desc").val(data[0].fp_desc)
    $('#sp_product_family').selectpicker('val',data[0].product_family)
    $("input[name=h").val(data[0].h)
    $("input[name=created_date").val(formatDate(_c_date,true))
    $("input[name=receipt_last_updated").val(formatDate(_rlu_date,true))
    $('#sp_origin').selectpicker('val',data[0].origin)
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
        url: "/data/finish-product.json", 
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
function insert_element_pf(){
    $('<a href="#" type="button" class="pull-right" id="btn_pop_pf" data-toggle="modal" data-target="#pop-modal-form" style="margin-right: 11px"><i class="glyphicon-plus"></i> Add New</a>').insertBefore('#form_ > div:nth-child(9) > div:nth-child(1) > div > div > div');
}
function insert_element_creator(){
    $('<a href="#" type="button" class="pull-right" id="btn_pop_creator" data-toggle="modal" data-target="#pop-modal-form" style="margin-right: 11px"><i class="glyphicon-plus"></i> Add New</a>').insertBefore('#form_ > div:nth-child(11) > div:nth-child(2) > div > div > div');
    
}
function insert_element_origin(){
    $('<a href="#" type="button" class="pull-right" id="btn_pop_origin" data-toggle="modal" data-target="#pop-modal-form" style="margin-right: 11px"><i class="glyphicon-plus"></i> Add New</a>').insertBefore('#form_ > div:nth-child(11) > div:nth-child(1) > div > div > div');
    
}
//load data dt
function load_data_dt(_url){
    // ajax
    table = $('#dtTbl_pop').DataTable({
        // "scrollY": "370px",
        "scrollCollapse": true,
        "paging": true, 
        "lengthChange": false,
        "ajax": _url,
        "processing": true,
        "pageLength": 5,
        "language": {
            processing: '<i class="fa fa-spinner fa-pulse fa-3x fa-fw loader-custom"></i><span class="sr-only"></span> '},
        //"serverSide": true,
        "columnDefs": [
            {
                "targets": [ 2 ],
                "visible": false
            }
        ],  
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
            {
                data: "id",
                className: "dt-center editor-details",
                orderable: true
            },
            { "data": "pop_desc" },
            { "data": "active" },
        ]
    });
}

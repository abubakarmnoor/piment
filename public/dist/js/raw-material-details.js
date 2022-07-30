$(document).ready(function() {
            
    //default
    let id=$("#id").val()
    $('.selectpicker').selectpicker();
    insert_element_pf();insert_element_kayu();insert_element_unit();insert_element_creator();
    load_data_dt('/data/pop-product-family.json'); //init

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
        $('.page-header').text('RAW MATERIAL ADD NEW')
        $("input[name=rm_desc]").val($(this).find("option:selected").attr("desc"))
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
        
        // _data.txt_created_date = new Date(_data.txt_created_date);
        // _data.txt_created_date = formatDate(_data.txt_created_date)
        // _data.txt_updated_date = new Date(_data.txt_updated_date);
        // _data.txt_updated_date = formatDate(_data.txt_updated_date)
        _data.active = $("#ck_active").prop('checked')
        _data.tblname = 'rm'
        _data.cost = parseFloat(_data.cost).toFixed(2);
        console.log(_data);
        // ajax - save/post data
        spinner_popup();
        $.ajax({
            type:"POST",
            url: "/apis/upd/", 
            dataType: "json",
            data: _data,
            success: function(data) {
                // alert(data)
                // setTimeout(function () {
                    $('.modal').modal('hide');
                    Swal.fire({
                        icon: 'success',
                        title: 'RM',
                        text: "Data Saved"
                    }).then(function(){
                        location.href='/raw-materials'
                    });
                    
                // }, 3000) ;
                
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

    //dropdown
     $('#sp_rm_code').on('change', function(e) {
         e.preventDefault();
         $("input[name=rm_desc]").val($(this).find("option:selected").attr("desc"))
         //console.log($(this).find("option:selected").attr("desc"))
        // console.log(this.value,
        //    this.options[this.selectedIndex].value,
        //    $(this).find("option:selected").val(), );
     });
   
    
//end  doc ready
});
//default-edit
function default_edit(data){

    // let _date = new Date(data[0].cost_last_updated)
    //_date.setDate(_date.getDate()+1)
    
    // $('#sp_rm_code').selectpicker('val',data[0].rm_code)
    // $("input[name=rm_desc]").val($(this).find("option:selected").attr("desc"))
    $("input[name=rm_code]").attr('disabled','disabled')
    $("input[name=rm_code]").val(data[0].rm_code)
    $("input[name=rm_desc]").val(data[0].rm_desc)
    $('#sp_product_family').selectpicker('val',data[0].rm_prod_family)
    $("input[name=cost").val(numberWithCommas(data[0].rm_cost))
    $('#sp_unit').selectpicker('val',data[0].rm_unit)
    $("input[name=box_size_l").val(data[0].rm_box_size_l)
    $("input[name=box_size_w").val(data[0].rm_box_size_w)
    $("input[name=box_size_h").val(data[0].rm_box_size_h)
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
        // url: "/data/raw-materials.json", 
        url: "/apis/pull/rm/"+id, 
        dataType: "json",
        success: function(data) {
            // setTimeout(function () {
                default_edit(data.data);
                $('.modal').modal('hide');
            // }, 3000);
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
$(".numeric").on('keypress', function(e){
        
    isNumber(e)
    let _amt = $(this).val().replace(/,/g,"");
    // console.log(_amt);
    $(this).val(numberWithCommas(_amt));
    
})

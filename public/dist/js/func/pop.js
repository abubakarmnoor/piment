//load data dt
function load_data_dt(_url){
    
    $("#btn_pop_clear").on("click", function(){
        $('#form__')[0].reset();
    })
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
                data: "pop_guid",
                className: "dt-center editor-details",
                orderable: true
            },
            { "data": "pop_desc" },
            { "data": "pop_active",
            "render": function ( data, type, row ) {
                switch (data) {
                    case 1:
                        return 'True';
                        break;
                    case 0:
                        return 'False';
                        break;
                    default:
                        return "other";
                }
            }}
        ]
    });
    
    // Edit record
    $('#dtTbl_pop').on('click', 'td.editor-edit', function (e) {
        e.preventDefault();
        //console.log( table.row( this ).data().id );
        const _id = table.row( this ).data().pop_guid;
        const _pop_desc = table.row( this ).data().pop_desc;
        const _active = table.row( this ).data().pop_active;
        
        $("#pop_guid").val(_id);
        $("input[name=pop_desc]").val(_pop_desc);
        $("#ck_active_pop").prop('checked', _active);

    } );
    
    // Delete a record
    $('#dtTbl_pop').on('click', 'td.editor-delete', function (e) {
        e.preventDefault();
        let _data = {};
        _data.id = table.row( this ).data().pop_guid;
        _data.pop_desc = table.row( this ).data().pop_desc;
        _data.pop_type = $("label[name=pop_type").text();
        _data.upd_by = "Admin";
        // console.log(_data);

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this! ("+_data.pop_desc+")",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                spinner_popup();
                $.ajax({
                    type:"POST",
                    url: "/apis/del/pop", 
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(_data),
                    success: function(data) {
                        // $('.modal').modal('hide');
                        $("#spinner-modal").modal('hide')
                        Swal.fire({
                            icon: 'success',
                            title: "Data Deleted",
                            text: _data.pop_desc
                        }).then(function(){
                            //location.href='/clients'
                            $("#btn_pop_clear").click();
                            // console.log(_data.pop_type);
                            table.ajax.url("/apis/pop/"+_data.pop_type, null, false).load(); // refresh pop
                            selectpicker_reload(_data.pop_type);
                        });
                        
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
            }
        })
    } );

    //popup pop
    $('#btn_pop_pos').on('click', function(){
        // e.preventDefault();
        $('#th_pop_desc').text('Position')
        $('#lbl_pf_desc').text('Position Desc')
        $("label[name=pop_type").text("position")
        $("input[name=pop_desc").val("")
        $('input[type=search]').val("");
        table.ajax.url("/apis/pop/position", null, false).load(); // refresh
        table.search('');

    });
    $('#btn_pop_act').on('click', function(){
        // e.preventDefault();
        $('#th_pop_desc').text('Activity')
        $('#lbl_pf_desc').text('Activity Desc')
        $("label[name=pop_type").text("activity")
        $("input[name=pop_desc").val("")
        $('input[type=search]').val("");
        table.ajax.url("/apis/pop/activity", null, false).load(); // pop pf
        table.search('');

    });
    $('#btn_pop_pf').on('click', function(){
        // e.preventDefault();
        $('#th_pop_desc').text('Product Family')
        $('#lbl_pf_desc').text('Product Family Desc')
        $("label[name=pop_type").text("product-family")
        $("input[name=pop_desc").val("")
        $('input[type=search]').val("");
        table.ajax.url("/apis/pop/product-family", null, false).load(); // pop pf
        table.search('');

    });
    
    $('#btn_pop_origin').on('click', function(){
        // e.preventDefault();
        $('#th_pop_desc').text('Origin')
        $('#lbl_pf_desc').text('Origin Desc')
        $("label[name=pop_type").text("origin")
        $("input[name=pop_desc").val("")
        $('input[type=search]').val("");
        table.ajax.url("/apis/pop/origin", null, false).load(); // pop origin
        table.search('');
    });
    $('#btn_pop_kayu').on('click', function(){
        // e.preventDefault();
        
        $('#th_pop_desc').text('Kayu')
        $('#lbl_pf_desc').text('Kayu Desc')
        $("label[name=pop_type").text("kayu")
        $("input[name=pop_desc").val("")
        $('input[type=search]').val("");
        table.ajax.url("/apis/pop/kayu", null, false).load(); // pop kayu
        table.search('');
    })
    $('#btn_pop_unit').on('click', function(){
        // e.preventDefault();
        
        $('#th_pop_desc').text('Unit')
        $('#lbl_pf_desc').text('Unit Desc')
        $("label[name=pop_type").text("unit")
        $("input[name=pop_desc").val("")
        $('input[type=search]').val("");
        table.ajax.url("/apis/pop/unit", null, false).load(); // pop unit
        table.search('');
    })

    //save
    $('#form__').submit(function(e) {
        //$('#messages').removeClass('hide').addClass('alert alert-success alert-dismissible').slideDown().show();
        //$('#messages_content').html('<h4>MESSAGE HERE</h4>');
        //$('#modal').modal('show');
        
        e.preventDefault();
        const form = $(e.target);
        const _data = convertFormToJSON(form);
        _data.pop_updated_by = "Admin";
        _data.pop_type = $("label[name=pop_type").text();
        _data.pop_active = $("#ck_active_pop").prop('checked')
        _data.tblname = "pop";
        // console.log(_data);

        // ajax - save/post data
        spinner_popup();
        $.ajax({
            type:"POST", // must be POST 
            url: "/apis/upd", 
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(_data),
            success: function(data) {
                // $('.modal').modal('hide');
                $("#spinner-modal").modal('hide')
                Swal.fire({
                    icon: 'success',
                    title: '',
                    text: "Data Saved"
                }).then(function(){
                    //location.href='/clients'
                    $("#btn_pop_clear").click();
                    // console.log(_data.pop_type);
                    table.ajax.url("/apis/pop/"+_data.pop_type, null, false).load(); // refresh pop
                    selectpicker_reload(_data.pop_type);
                });
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
}

//reload select picker after add/upd/del
function selectpicker_reload(id_){
    let id__;
    if (id_ == 'origin'){
        id__ = 'sp_origin';
    }else if (id_ == 'product-family'){
        id__ = 'sp_product_family';//
    }else if (id_ == 'kayu'){
        id__ = 'sp_kayu';//
    }else if (id_ == 'unit'){
        id__ = 'sp_unit';//
    }else if (id_ == 'activity'){
        id__ = 'sp_activity';//
    }else if (id_ == 'position'){
        id__ = 'sp_position';//
    }
    // console.log(id__);

    spinner_popup();
    $.ajax({
        type:"GET", // must be POST 
        url: "/apis/pop/"+id_, 
        success: function(data) {
            // $('.modal').modal('hide');
            $("#spinner-modal").modal('hide')

            let option_ = new Option("-", "-")
            $('#'+id__)
            .empty()
            .append(option_)
            // .selectpicker('refresh');
            for (let index = 0; index < data.data.length; index++) {
                option_ = new Option(data.data[index].pop_desc, data.data[index].pop_guid)
                $('#'+id__).append(option_);
            }
            $('#'+id__).selectpicker('refresh');
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


    
}
//doc ready
// YWRkbmV3 => add new
// ZWlk => eid
// ZGlk => did
var tableLampshade;
var tableStand;
var tableEuro;
var tableUS;
var tableJapan;
var tableUK;
var tableAUS;
spinner_popup();
$(document).ready(function() {
    $("#fp_cp_unit").prop("disabled", true);
    $('.modal').modal('hide');
    // var sdate_ = moment().subtract(29, 'days').format('YYYY-MM-DD');
    // var edate_ = moment().format('YYYY-MM-DD');;
    refreshLampshade();
    refreshStand();
    refreshEuro();
    refreshUS();
    refreshJapan();
    refreshUK();
    refreshAUS();
    // New record
    $('a.editor-create').on('click', function (e) {
        //e.preventDefault();
        //alert('create')
        
    } );

    // Edit record
    $('#dtTbl').on('click', 'td.editor-edit', function (e) {
        e.preventDefault();
        //console.log( table.row( this ).data().id );
        const _id = table.row( this ).data().id;
        location.href = "/fpc-details/"+$("#fpid").val()+"/"+_id+"/ZWlk/";
    } );
    
    // Details record
    $('#dtTbl').on('click', 'td.editor-details', function (e) {
        e.preventDefault();
        //console.log( table.row( this ).data().id );
        const _id = table.row( this ).data().id;
        location.href = "/fpc-details/"+$("#fpid").val()+"/"+_id+"/ZGlk/";
        
    } );
    
    // refresh table
    $("#btn_refresh").on("click", function(){
        tableLampshade.ajax.url("/apis/pull/fp_cp/"+fp_guid+"/lampshade", null, false).load();
        tableStand.ajax.url("/apis/pull/fp_cp/"+fp_guid+"/stand", null, false).load();
        tableEuro.ajax.url("/apis/pull/fp_cp/"+fp_guid+"/euro", null, false).load();
        tableUS.ajax.url("/apis/pull/fp_cp/"+fp_guid+"/us", null, false).load();
        tableJapan.ajax.url("/apis/pull/fp_cp/"+fp_guid+"/japan", null, false).load();
        tableUK.ajax.url("/apis/pull/fp_cp/"+fp_guid+"/uk", null, false).load();
        tableAUS.ajax.url("/apis/pull/fp_cp/"+fp_guid+"/aus", null, false).load();
        
    })
    
    //back
    $("#btn_back").on("click", function(e){
        e.preventDefault;
        location.href = "/finish-product-details/"+$("#fp_guid").val()+"/"+$("#act").val();
    })
    
    //init
    $("#btn_add_lampshade, #btn_copy_lampshade").on("click", function(e){
        $("#title").text("LAMPSHADE");
        $("input[name=fp_cp_type]").val("lampshade");
        $("#fp_guid_copy").selectpicker('val','')
        
    })
    
    $("#btn_add_stand, #btn_copy_stand").on("click", function(e){
        $("#title").text("STAND");
        $("input[name=fp_cp_type]").val("stand");
    })
    $("#btn_add_euro, #btn_copy_euro").on("click", function(e){
        $("#title").text("EURO");
        $("input[name=fp_cp_type]").val("euro");
    })
    $("#btn_add_us, #btn_copy_us").on("click", function(e){
        $("#title").text("US");
        $("input[name=fp_cp_type]").val("us");
    })
    $("#btn_add_japan, #btn_copy_japan").on("click", function(e){
        $("#title").text("JAPAN");
        $("input[name=fp_cp_type]").val("japan");
    })
    $("#btn_add_uk, #btn_copy_uk").on("click", function(e){
        $("#title").text("UK");
        $("input[name=fp_cp_type]").val("uk");
    })
    $("#btn_add_aus, #btn_copy_aus").on("click", function(e){
        $("#title").text("AUS");
        $("input[name=fp_cp_type]").val("aus");
    })
   
    //number
    $(".numeric").on('keyup keypress focusout', function(e){
        
        isNumber(e)
        let _amt = $(this).val().replace(/,/g,"");
        // console.log(_amt);
        $(this).val(numberWithCommas(_amt));
        
    })
    $(".numeric").on('focus', function(e){
            
        isNumber(e)
        let _amt = $(this).val().replace(/,/g,"");
        // console.log(_amt);
        $(this).val(_amt);
        
    })


    //form submit
    $('#form_').submit(function(e) {
        e.preventDefault();
        const form = $(e.target);
        const _data = convertFormToJSON(form);
        _data.fp_cp_upd_by = $("#logged_user_id").text();
        _data.fp_cp_qty = (_data.fp_cp_qty).replace(/\,/g,'');
        _data.fp_cp_price = (_data.fp_cp_price).replace(/\,/g,'');
        _data.fp_cp_unit = $("#fp_cp_unit").val()
        _data.tblname = "fp_cp";
        // console.log(_data);//
        // return;

        //validation
        const rm_guid_ = $("#fp_cp_rm_guid").val()
        const unit_ = $("#fp_cp_unit").val()
        if (!rm_guid_ || !unit_){
            Swal.fire({
                icon: 'warning',
                title: _data.fp_cp_type.toUpperCase(),
                text: "Please select one options"
            }).then((res)=>{
                if (!rm_guid_){$("#fp_cp_rm_guid").focus()}
                else if (!unit_){$("#fp_cp_unit").focus()}
                
            })
            return;
        }
        // console.log(_data);
        // return;

        // ajax - save/post data
        spinner_popup();
        $.ajax({
            type:"POST", // must be POST 
            url: "/apis/upd", 
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(_data),
            success: function(data) {
                //refresh
                refreshTable(_data.fp_cp_type);
                        
                Swal.fire({
                    icon: 'success',
                    title: '',
                    text: "Data Saved"
                }).then(function(){
                    Swal.fire({
                        // title: 'Add more component ?',
                        text: "Add more component ?",
                        icon: 'question',
                        showDenyButton: true,
                        confirmButtonText: 'Yes',
                        denyButtonText: 'No'
                      }).then((result) => {
                        $("#spinner-modal").modal('hide')  
                        if (result.isConfirmed) {
                            
                            //reset form
                            resetForm();
                            
                        } else if (result.isDenied) {
                            $('.modal').modal('hide');
    
                        }
                      })
                    
                });
                    
            }, 
            error: function(jqXHR, textStatus, errorThrown) {
                //alert(jqXHR.status);
                Swal.fire({
                    title: "Error!",
                    text: textStatus,
                    icon: "error"
                }).then(function(){
                    $('.modal').modal('hide');    
                });
            }
        });

    });

    //copy fp cp
    $('#form_fp_cp_copy').submit(function(e) {
        e.preventDefault();
        const form = $(e.target);
        const _data = convertFormToJSON(form);
        _data.fp_cp_upd_by = $("#logged_user_id").text();
        _data.tblname = "fp_cp_copy";
        _data.ckaus = $("#ckaus").is(':checked');
        _data.ckuk = $("#ckuk").is(':checked');
        _data.ckjapan = $("#ckjapan").is(':checked');
        _data.ckus = $("#ckus").is(':checked');
        _data.ckeuro = $("#ckeuro").is(':checked');
        _data.ckstand = $("#ckstand").is(':checked');
        _data.cklampshade = $("#cklampshade").is(':checked');
        
        if (_data.fp_guid == _data.fp_guid_copy){
            _data.cklampshade = (_data.cklampshade == true ? !(_data.fp_cp_type == 'lampshade') : _data.cklampshade);
            _data.ckstand = (_data.ckstand == true ? !(_data.fp_cp_type == 'stand') : _data.ckstand);
            _data.ckeuro = (_data.ckeuro == true ? !(_data.fp_cp_type == 'euro') : _data.ckeuro);
            _data.ckus = (_data.ckus == true ? !(_data.fp_cp_type == 'us') : _data.ckus);
            _data.ckjapan = (_data.ckjapan == true ? !(_data.fp_cp_type == 'japan') : _data.ckjapan);
            _data.ckuk = (_data.ckuk == true ? !(_data.fp_cp_type == 'uk') : _data.ckuk);
            _data.ckaus = (_data.ckaus == true ? !(_data.fp_cp_type == 'aus') : _data.ckaus);
        }
        // console.log(_data);//
        // return;
        
        //validation
        if(!_data.fp_guid_copy){
            $("#fp_guid_copy").focus()
            Swal.fire({
                icon: 'warning',
                title: '',
                text: "Please select 1 Finish Product !"
            })
            $('select[name="fp_guid_copy"]').focus()
            return;
        }else if (!(_data.ckaus) && !(_data.ckuk) && !(_data.ckjapan) && !(_data.ckus) && !(_data.ckeuro) && !(_data.ckstand) && !(_data.cklampshade)){
            Swal.fire({
                icon: 'warning',
                title: '',
                text: "Please select 1 or more Component !"
            })
            return;
        }
        //

        //confirmation
        Swal.fire({
            // title: 'Add more component ?',
            text: "Do you want to copy component ?",
            icon: 'question',
            showDenyButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: 'No'
          }).then((result) => {
            $("#spinner-modal").modal('hide')  
            if (result.isConfirmed) {
                
                //reset form
                resetFormCopy();
                // return;
                 // ajax - save/post data
                //  console.log(JSON.stringify(_data));
                spinner_popup();
                $.ajax({
                    type:"POST", // must be POST 
                    url: "/apis/upd", 
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(_data),
                    success: function(data) {
                        $('.modal').modal('hide');  
                        if(data.success == false){
                            Swal.fire({
                                icon: 'error',
                                text: data.err.sqlMessage,
                              })
                            return;
                        }
                        
                        //refresh
                        refreshTable('all');
                                
                        Swal.fire({
                            icon: 'success',
                            title: '',
                            text: "Data Copied."
                        })
                    }, 
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(errorThrown);
                        //alert(jqXHR.status);
                        Swal.fire({
                            title: "Error!",
                            text: textStatus,
                            icon: "error"
                        }).then(function(){
                            $('.modal').modal('hide');    
                        });
                    }
                });

            } else if (result.isDenied) {
                $('.modal').modal('hide');

            }
        })
       
    });
    $(".btn_copy_comp ").on("click", function(e){
        resetFormCopy();
    })
    //btn popup
    $(".btn-popup").on("click", function(e){
        resetForm();
    })
    // Delete a record
    $('#dtTblLampshade').on('click', 'td.editor-delete', function (e) {
        e.preventDefault();
        let _data = {};
        _data.id = tableLampshade.row( this ).data().fp_cp_guid;
        _data.rm_desc = tableLampshade.row( this ).data().rm_desc;
        _data.upd_by = $("#logged_user_id").text();

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this! ("+_data.rm_desc+")",
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
                    url: "/apis/del/fp_cp", 
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(_data),
                    success: function(data) {
                        // setTimeout(function () {
                            $('.modal').modal('hide');
                            Swal.fire({
                                icon: 'success',
                                title: "Data Deleted",
                                text: _data.rm_desc
                            }).then(function(){
                                tableLampshade.ajax.url("/apis/pull/fp_cp/"+fp_guid+"/lampshade", null, false).load();
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
            }
        })
    } );
    $('#dtTblStand').on('click', 'td.editor-delete', function (e) {
        e.preventDefault();
        let _data = {};
        _data.id = tableStand.row( this ).data().fp_cp_guid;
        _data.rm_desc = tableStand.row( this ).data().rm_desc;
        _data.upd_by = $("#logged_user_id").text();

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this! ("+_data.rm_desc+")",
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
                    url: "/apis/del/fp_cp", 
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(_data),
                    success: function(data) {
                        $('.modal').modal('hide');
                        Swal.fire({
                            icon: 'success',
                            title: "Data Deleted",
                            text: _data.rm_desc
                        }).then(function(){
                            tableStand.ajax.url("/apis/pull/fp_cp/"+fp_guid+"/stand", null, false).load();
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
    $('#dtTblEuro').on('click', 'td.editor-delete', function (e) {
        e.preventDefault();
        let _data = {};
        _data.id = tableEuro.row( this ).data().fp_cp_guid;
        _data.rm_desc = tableEuro.row( this ).data().rm_desc;
        _data.upd_by = $("#logged_user_id").text();

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this! ("+_data.rm_desc+")",
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
                    url: "/apis/del/fp_cp", 
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(_data),
                    success: function(data) {
                        $('.modal').modal('hide');
                        Swal.fire({
                            icon: 'success',
                            title: "Data Deleted",
                            text: _data.rm_desc
                        }).then(function(){
                            tableEuro.ajax.url("/apis/pull/fp_cp/"+fp_guid+"/euro", null, false).load();
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
    $('#dtTblUS').on('click', 'td.editor-delete', function (e) {
        e.preventDefault();
        let _data = {};
        _data.id = tableUS.row( this ).data().fp_cp_guid;
        _data.rm_desc = tableUS.row( this ).data().rm_desc;
        _data.upd_by = $("#logged_user_id").text();

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this! ("+_data.rm_desc+")",
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
                    url: "/apis/del/fp_cp", 
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(_data),
                    success: function(data) {
                        $('.modal').modal('hide');
                        Swal.fire({
                            icon: 'success',
                            title: "Data Deleted",
                            text: _data.rm_desc
                        }).then(function(){
                            tableUS.ajax.url("/apis/pull/fp_cp/"+fp_guid+"/us", null, false).load();
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
    $('#dtTblJapan').on('click', 'td.editor-delete', function (e) {
        e.preventDefault();
        let _data = {};
        _data.id = tableJapan.row( this ).data().fp_cp_guid;
        _data.rm_desc = tableJapan.row( this ).data().rm_desc;
        _data.upd_by = $("#logged_user_id").text();

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this! ("+_data.rm_desc+")",
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
                    url: "/apis/del/fp_cp", 
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(_data),
                    success: function(data) {
                        $('.modal').modal('hide');
                        Swal.fire({
                            icon: 'success',
                            title: "Data Deleted",
                            text: _data.rm_desc
                        }).then(function(){
                            tableJapan.ajax.url("/apis/pull/fp_cp/"+fp_guid+"/japan", null, false).load();
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
    $('#dtTblUK').on('click', 'td.editor-delete', function (e) {
        e.preventDefault();
        let _data = {};
        _data.id = tableUK.row( this ).data().fp_cp_guid;
        _data.rm_desc = tableUK.row( this ).data().rm_desc;
        _data.upd_by = $("#logged_user_id").text();

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this! ("+_data.rm_desc+")",
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
                    url: "/apis/del/fp_cp", 
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(_data),
                    success: function(data) {
                        $('.modal').modal('hide');
                        Swal.fire({
                            icon: 'success',
                            title: "Data Deleted",
                            text: _data.rm_desc
                        }).then(function(){
                            tableUK.ajax.url("/apis/pull/fp_cp/"+fp_guid+"/uk", null, false).load();
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
    $('#dtTblAUS').on('click', 'td.editor-delete', function (e) {
        e.preventDefault();
        let _data = {};
        _data.id = tableAUS.row( this ).data().fp_cp_guid;
        _data.rm_desc = tableAUS.row( this ).data().rm_desc;
        _data.upd_by = $("#logged_user_id").text();

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this! ("+_data.rm_desc+")",
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
                    url: "/apis/del/fp_cp", 
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(_data),
                    success: function(data) {
                        $('.modal').modal('hide');
                        Swal.fire({
                            icon: 'success',
                            title: "Data Deleted",
                            text: _data.rm_desc
                        }).then(function(){
                            tableAUS.ajax.url("/apis/pull/fp_cp/"+fp_guid+"/aus", null, false).load();
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

    // Edit record
    $('#dtTblLampshade').on('click', 'td.editor-edit', function (e) {
        e.preventDefault();
        // console.log( tableLampshade.row( this ).data());
        // const _fp_cp_guid = tableLampshade.row( this ).data().fp_cp_guid;
        // console.log(_fp_cp_guid);
        $("#title").text("LAMPSHADE");
        $("#fp_cp_type").val("lampshade");
        $("#fp_guid").val(tableLampshade.row( this ).data().fp_guid);
        $("input[name=fp_cp_guid]").val(tableLampshade.row( this ).data().fp_cp_guid);
        $("#fp_cp_rm_guid").selectpicker('val',tableLampshade.row( this ).data().fp_cp_rm_guid);
        $("input[name=fp_cp_qty]").val(tableLampshade.row( this ).data().fp_cp_qty);
        $("#fp_cp_unit").selectpicker('val',tableLampshade.row( this ).data().fp_cp_unit);
        $("input[name=fp_cp_price]").val(tableLampshade.row( this ).data().fp_cp_price);
        $("#fp_cp_type").val(tableLampshade.row( this ).data().fp_cp_type);
        $("#act").val("ZWlk");
        
        $('#rm-modal-form').modal('show');
    } );
    $('#dtTblStand').on('click', 'td.editor-edit', function (e) {
        e.preventDefault();
        // console.log( tableLampshade.row( this ).data());
        // const _fp_cp_guid = tableLampshade.row( this ).data().fp_cp_guid;
        // console.log(_fp_cp_guid);
        $("#title").text("STAND");
        $("#fp_cp_type").val("stand");
        $("#fp_guid").val(tableStand.row( this ).data().fp_guid);
        $("input[name=fp_cp_guid]").val(tableStand.row( this ).data().fp_cp_guid);
        $("#fp_cp_rm_guid").selectpicker('val',tableStand.row( this ).data().fp_cp_rm_guid);
        $("input[name=fp_cp_qty]").val(tableStand.row( this ).data().fp_cp_qty);
        $("#fp_cp_unit").selectpicker('val',tableStand.row( this ).data().fp_cp_unit);
        $("input[name=fp_cp_price]").val(tableStand.row( this ).data().fp_cp_price);
        $("#fp_cp_type").val(tableStand.row( this ).data().fp_cp_type);
        $("#act").val("ZWlk");
        
        $('#rm-modal-form').modal('show');
    } );
    $('#dtTblEuro').on('click', 'td.editor-edit', function (e) {
        e.preventDefault();
        // console.log( tableLampshade.row( this ).data());
        // const _fp_cp_guid = tableLampshade.row( this ).data().fp_cp_guid;
        // console.log(_fp_cp_guid);
        $("#title").text("EURO");
        $("#fp_cp_type").val("euro");
        $("#fp_guid").val(tableEuro.row( this ).data().fp_guid);
        $("input[name=fp_cp_guid]").val(tableEuro.row( this ).data().fp_cp_guid);
        $("#fp_cp_rm_guid").selectpicker('val',tableEuro.row( this ).data().fp_cp_rm_guid);
        $("input[name=fp_cp_qty]").val(tableEuro.row( this ).data().fp_cp_qty);
        $("#fp_cp_unit").selectpicker('val',tableEuro.row( this ).data().fp_cp_unit);
        $("input[name=fp_cp_price]").val(tableEuro.row( this ).data().fp_cp_price);
        $("#fp_cp_type").val(tableEuro.row( this ).data().fp_cp_type);
        $("#act").val("ZWlk");
        
        $('#rm-modal-form').modal('show');
    } );
    $('#dtTblUS').on('click', 'td.editor-edit', function (e) {
        e.preventDefault();
        // console.log( tableLampshade.row( this ).data());
        // const _fp_cp_guid = tableLampshade.row( this ).data().fp_cp_guid;
        // console.log(_fp_cp_guid);
        $("#title").text("US");
        $("#fp_cp_type").val("us");
        $("#fp_guid").val(tableUS.row( this ).data().fp_guid);
        $("input[name=fp_cp_guid]").val(tableUS.row( this ).data().fp_cp_guid);
        $("#fp_cp_rm_guid").selectpicker('val',tableUS.row( this ).data().fp_cp_rm_guid);
        $("input[name=fp_cp_qty]").val(tableUS.row( this ).data().fp_cp_qty);
        $("#fp_cp_unit").selectpicker('val',tableUS.row( this ).data().fp_cp_unit);
        $("input[name=fp_cp_price]").val(tableUS.row( this ).data().fp_cp_price);
        $("#fp_cp_type").val(tableUS.row( this ).data().fp_cp_type);
        $("#act").val("ZWlk");
        
        $('#rm-modal-form').modal('show');
    } );
    $('#dtTblJapan').on('click', 'td.editor-edit', function (e) {
        e.preventDefault();
        // console.log( tableLampshade.row( this ).data());
        // const _fp_cp_guid = tableLampshade.row( this ).data().fp_cp_guid;
        // console.log(_fp_cp_guid);
        $("#title").text("JAPAN");
        $("#fp_cp_type").val("japan");
        $("#fp_guid").val(tableJapan.row( this ).data().fp_guid);
        $("input[name=fp_cp_guid]").val(tableJapan.row( this ).data().fp_cp_guid);
        $("#fp_cp_rm_guid").selectpicker('val',tableJapan.row( this ).data().fp_cp_rm_guid);
        $("input[name=fp_cp_qty]").val(tableJapan.row( this ).data().fp_cp_qty);
        $("#fp_cp_unit").selectpicker('val',tableJapan.row( this ).data().fp_cp_unit);
        $("input[name=fp_cp_price]").val(tableJapan.row( this ).data().fp_cp_price);
        $("#fp_cp_type").val(tableJapan.row( this ).data().fp_cp_type);
        $("#act").val("ZWlk");
        
        $('#rm-modal-form').modal('show');
    } );
    $('#dtTblUK').on('click', 'td.editor-edit', function (e) {
        e.preventDefault();
        // console.log( tableLampshade.row( this ).data());
        // const _fp_cp_guid = tableLampshade.row( this ).data().fp_cp_guid;
        // console.log(_fp_cp_guid);
        $("#title").text("UK");
        $("#fp_cp_type").val("uk");
        $("#fp_guid").val(tableUK.row( this ).data().fp_guid);
        $("input[name=fp_cp_guid]").val(tableUK.row( this ).data().fp_cp_guid);
        $("#fp_cp_rm_guid").selectpicker('val',tableUK.row( this ).data().fp_cp_rm_guid);
        $("input[name=fp_cp_qty]").val(tableUK.row( this ).data().fp_cp_qty);
        $("#fp_cp_unit").selectpicker('val',tableUK.row( this ).data().fp_cp_unit);
        $("input[name=fp_cp_price]").val(tableUK.row( this ).data().fp_cp_price);
        $("#fp_cp_type").val(tableUK.row( this ).data().fp_cp_type);
        $("#act").val("ZWlk");
        
        $('#rm-modal-form').modal('show');
    } );
    $('#dtTblAUS').on('click', 'td.editor-edit', function (e) {
        e.preventDefault();
        // console.log( tableLampshade.row( this ).data());
        // const _fp_cp_guid = tableLampshade.row( this ).data().fp_cp_guid;
        // console.log(_fp_cp_guid);
        $("#title").text("AUS");
        $("#fp_cp_type").val("aus");
        $("#fp_guid").val(tableAUS.row( this ).data().fp_guid);
        $("input[name=fp_cp_guid]").val(tableAUS.row( this ).data().fp_cp_guid);
        $("#fp_cp_rm_guid").selectpicker('val',tableAUS.row( this ).data().fp_cp_rm_guid);
        $("input[name=fp_cp_qty]").val(tableAUS.row( this ).data().fp_cp_qty);
        $("#fp_cp_unit").selectpicker('val',tableAUS.row( this ).data().fp_cp_unit);
        $("input[name=fp_cp_price]").val(tableAUS.row( this ).data().fp_cp_price);
        $("#fp_cp_type").val(tableAUS.row( this ).data().fp_cp_type);
        $("#act").val("ZWlk");
        
        $('#rm-modal-form').modal('show');
    } );
    
    //dropdown
    $("#fp_cp_rm_guid").on("change", function(e){
        // alert($("#fp_cp_rm_guid").attr('price'))
        e.preventDefault()
        var price_ = $('option:selected', this).attr("price");
        $("input[name=fp_cp_price]").val(price_).focusout();
        var unit_ = $('option:selected', this).attr("unit");
        $("#fp_cp_unit").selectpicker('val',unit_);
        // $("#fp_cp_unit").prop("disabled", true);
        
    })
//end doc ready
});

//init
var fp_guid = $("#fp_guid").val();

//functions
function resetForm(){
    $("input[name=fp_cp_guid]").val("");
    $("#fp_cp_rm_guid").selectpicker('val',"-");
    $("input[name=fp_cp_qty]").val(0);
    $("#fp_cp_unit").selectpicker('val',"-");
    $("input[name=fp_cp_price]").val(0);

}
function resetFormCopy(){
    $("#fp_guid_copy").selectpicker('val',"-");
    $("input[type=checkbox]").prop("checked",false  );
}
function refreshTable(type){
    if(type == "lampshade"){
        tableLampshade.ajax.url("/apis/pull/fp_cp/"+fp_guid+"/lampshade", null, false).load();
    }else if(type == "stand"){
        tableStand.ajax.url("/apis/pull/fp_cp/"+fp_guid+"/stand", null, false).load();
    }else if(type == "euro"){
        tableEuro.ajax.url("/apis/pull/fp_cp/"+fp_guid+"/euro", null, false).load();
    }else if(type == "us"){
        tableUS.ajax.url("/apis/pull/fp_cp/"+fp_guid+"/us", null, false).load();
    }else if(type == "japan"){
        tableJapan.ajax.url("/apis/pull/fp_cp/"+fp_guid+"/japan", null, false).load();
    }else if(type == "uk"){
        tableUK.ajax.url("/apis/pull/fp_cp/"+fp_guid+"/uk", null, false).load();
    }else if(type == "aus"){
        tableAUS.ajax.url("/apis/pull/fp_cp/"+fp_guid+"/aus", null, false).load();
    }else if(type == "all"){
        tableLampshade.ajax.url("/apis/pull/fp_cp/"+fp_guid+"/lampshade", null, false).load();
        tableStand.ajax.url("/apis/pull/fp_cp/"+fp_guid+"/stand", null, false).load();
        tableEuro.ajax.url("/apis/pull/fp_cp/"+fp_guid+"/euro", null, false).load();
        tableUS.ajax.url("/apis/pull/fp_cp/"+fp_guid+"/us", null, false).load();
        tableJapan.ajax.url("/apis/pull/fp_cp/"+fp_guid+"/japan", null, false).load();
        tableUK.ajax.url("/apis/pull/fp_cp/"+fp_guid+"/uk", null, false).load();
        tableAUS.ajax.url("/apis/pull/fp_cp/"+fp_guid+"/aus", null, false).load();
    }
}

function refreshLampshade(){
    tableLampshade = $('#dtTblLampshade').DataTable({
        // "scrollY": "370px",
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;
 
            // converting to interger to find total
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
 
	        var total_price = api
                .column( 6 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
				
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 6 ).footer() ).html(numberWithCommas(total_price));

            var total_qty = api
                .column( 7 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
				
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 7 ).footer() ).html(numberWithCommas(total_qty));
            
            var total_qty_price = api
                .column( 8 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
				
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 8 ).footer() ).html(numberWithCommas(total_qty_price));
        },
        "scrollCollapse": true,
        "paging": true, 
        "pageLength": 50,
        "lengthChange": false,
        "ajax": "/apis/pull/fp_cp/"+fp_guid+"/lampshade",
        "processing": true,
        "language": {
            processing: '<i class="fa fa-spinner fa-pulse fa-3x fa-fw loader-custom"></i><span class="sr-only"></span> '},
        //"serverSide": true,
        "columnDefs": [{
            "targets": [ 2 ],
            "visible": false
        }],
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
            { "data": "fp_cp_guid" },
            { "data": "rm_code" },
            { "data": "rm_desc" },
            { "data": "unit_desc" },
            { "data": "fp_cp_price", render: $.fn.dataTable.render.number(',', '.', 2, '')},
            { "data": "fp_cp_qty", render: $.fn.dataTable.render.number(',', '.', 2, '')},
            { "data": "total_price", render: $.fn.dataTable.render.number(',', '.', 2, '')},
            
        ]
    });
}
function refreshStand(){
    tableStand = $('#dtTblStand').DataTable({
        // "scrollY": "370px",
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;
 
            // converting to interger to find total
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
            var total_price = api
                .column( 6 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
				
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 6 ).footer() ).html(numberWithCommas(total_price));

	        var total = api
                .column( 7 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
				
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 7 ).footer() ).html(numberWithCommas(total));
            
            var total_qty_price = api
                .column( 8 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
				
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 8 ).footer() ).html(numberWithCommas(total_qty_price));

        },
        "scrollCollapse": true,
        "paging": true, 
        "pageLength": 50,
        "lengthChange": false,
        "ajax": "/apis/pull/fp_cp/"+fp_guid+"/stand",
        "processing": true,
        "language": {
            processing: '<i class="fa fa-spinner fa-pulse fa-3x fa-fw loader-custom"></i><span class="sr-only"></span> '},
        //"serverSide": true,
        "columnDefs": [{
            "targets": [ 2 ],
            "visible": false
        }],
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
            { "data": "fp_cp_guid" },
            { "data": "rm_code" },
            { "data": "rm_desc" },
            { "data": "unit_desc" },
            { "data": "fp_cp_price", render: $.fn.dataTable.render.number(',', '.', 2, '')},
            { "data": "fp_cp_qty" },
            { "data": "total_price", render: $.fn.dataTable.render.number(',', '.', 2, '')},
            
            
        ]
    });
}
function refreshEuro(){
    tableEuro = $('#dtTblEuro').DataTable({
        // "scrollY": "370px",
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;
 
            // converting to interger to find total
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
           
            var total_price = api
            .column( 6 )
            .data()
            .reduce( function (a, b) {
                return intVal(a) + intVal(b);
            }, 0 );
            
            // Update footer by showing the total with the reference of the column index 
            $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 6 ).footer() ).html(numberWithCommas(total_price));
            
	        var col7 = api
                .column( 7 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
				
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 7 ).footer() ).html(numberWithCommas(col7));

            var total_qty_price = api
                .column( 8 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
				
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 8 ).footer() ).html(numberWithCommas(total_qty_price));

        },
        "scrollCollapse": true,
        "paging": true, 
        "pageLength": 50,
        "lengthChange": false,
        "ajax": "/apis/pull/fp_cp/"+fp_guid+"/euro",
        "processing": true,
        "language": {
            processing: '<i class="fa fa-spinner fa-pulse fa-3x fa-fw loader-custom"></i><span class="sr-only"></span> '},
        //"serverSide": true,
        "columnDefs": [{
            "targets": [ 2 ],
            "visible": false
        }],
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
            { "data": "fp_cp_guid" },
            { "data": "rm_code" },
            { "data": "rm_desc" },
            { "data": "unit_desc" },
            { "data": "fp_cp_price", render: $.fn.dataTable.render.number(',', '.', 2, '')},
            { "data": "fp_cp_qty" },
            { "data": "total_price", render: $.fn.dataTable.render.number(',', '.', 2, '')},
            
        ]
    });
}
function refreshUS(){
    tableUS = $('#dtTblUS').DataTable({
        // "scrollY": "370px",
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;
 
            // converting to interger to find total
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
            var total_price = api
            .column( 6 )
            .data()
            .reduce( function (a, b) {
                return intVal(a) + intVal(b);
            }, 0 );
            
            // Update footer by showing the total with the reference of the column index 
            $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 6 ).footer() ).html(numberWithCommas(total_price));

	        var col7 = api
                .column( 7 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
				
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 7 ).footer() ).html(numberWithCommas(col7));

            var total_qty_price = api
                .column( 8 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
				
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 8 ).footer() ).html(numberWithCommas(total_qty_price));

        },
        "scrollCollapse": true,
        "paging": true, 
        "pageLength": 50,
        "lengthChange": false,
        "ajax": "/apis/pull/fp_cp/"+fp_guid+"/us",
        "processing": true,
        "language": {
            processing: '<i class="fa fa-spinner fa-pulse fa-3x fa-fw loader-custom"></i><span class="sr-only"></span> '},
        //"serverSide": true,
        "columnDefs": [{
            "targets": [ 2 ],
            "visible": false
        }],
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
            { "data": "fp_cp_guid" },
            { "data": "rm_code" },
            { "data": "rm_desc" },
            { "data": "unit_desc" },
            { "data": "fp_cp_price", render: $.fn.dataTable.render.number(',', '.', 2, '')},
            { "data": "fp_cp_qty" },
            { "data": "total_price", render: $.fn.dataTable.render.number(',', '.', 2, '')},
            
        ]
    });
}
function refreshJapan(){
    tableJapan = $('#dtTblJapan').DataTable({
        // "scrollY": "370px",
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;
 
            // converting to interger to find total
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
            
            var total_price = api
            .column( 6 )
            .data()
            .reduce( function (a, b) {
                return intVal(a) + intVal(b);
            }, 0 );
            
            // Update footer by showing the total with the reference of the column index 
            $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 6 ).footer() ).html(numberWithCommas(total_price));

	        var col7 = api
                .column( 7 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
				
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 7 ).footer() ).html(numberWithCommas(col7));

            var total_qty_price = api
                .column( 8 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
				
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 8 ).footer() ).html(numberWithCommas(total_qty_price));

        },
        "scrollCollapse": true,
        "paging": true, 
        "pageLength": 50,
        "lengthChange": false,
        "ajax": "/apis/pull/fp_cp/"+fp_guid+"/japan",
        "processing": true,
        "language": {
            processing: '<i class="fa fa-spinner fa-pulse fa-3x fa-fw loader-custom"></i><span class="sr-only"></span> '},
        //"serverSide": true,
        "columnDefs": [{
            "targets": [ 2 ],
            "visible": false
        }],
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
            { "data": "fp_cp_guid" },
            { "data": "rm_code" },
            { "data": "rm_desc" },
            { "data": "unit_desc" },
            { "data": "fp_cp_price", render: $.fn.dataTable.render.number(',', '.', 2, '')},
            { "data": "fp_cp_qty" },
            { "data": "total_price", render: $.fn.dataTable.render.number(',', '.', 2, '')},
            
        ]
    });
}
function refreshUK(){
    tableUK = $('#dtTblUK').DataTable({
        // "scrollY": "370px",
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;
 
            // converting to interger to find total
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
            
            var total_price = api
            .column( 6 )
            .data()
            .reduce( function (a, b) {
                return intVal(a) + intVal(b);
            }, 0 );
            
            // Update footer by showing the total with the reference of the column index 
            $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 6 ).footer() ).html(numberWithCommas(total_price));

	        var col7 = api
                .column( 7 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
				
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 7 ).footer() ).html(numberWithCommas(col7));

            var total_qty_price = api
                .column( 8 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
				
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 8 ).footer() ).html(numberWithCommas(total_qty_price));

        },
        "scrollCollapse": true,
        "paging": true, 
        "pageLength": 50,
        "lengthChange": false,
        "ajax": "/apis/pull/fp_cp/"+fp_guid+"/uk",
        "processing": true,
        "language": {
            processing: '<i class="fa fa-spinner fa-pulse fa-3x fa-fw loader-custom"></i><span class="sr-only"></span> '},
        //"serverSide": true,
        "columnDefs": [{
            "targets": [ 2 ],
            "visible": false
        }],
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
            { "data": "fp_cp_guid" },
            { "data": "rm_code" },
            { "data": "rm_desc" },
            { "data": "unit_desc" },
            { "data": "fp_cp_price", render: $.fn.dataTable.render.number(',', '.', 2, '')},
            { "data": "fp_cp_qty" },
            { "data": "total_price", render: $.fn.dataTable.render.number(',', '.', 2, '')},
            
        ]
    });
}
function refreshAUS(){
    tableAUS = $('#dtTblAUS').DataTable({
        // "scrollY": "370px",
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;
 
            // converting to interger to find total
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
            
            var total_price = api
            .column( 6 )
            .data()
            .reduce( function (a, b) {
                return intVal(a) + intVal(b);
            }, 0 );
            
            // Update footer by showing the total with the reference of the column index 
            $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 6 ).footer() ).html(numberWithCommas(total_price));
            
	        var col7 = api
                .column( 7 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
				
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 7 ).footer() ).html(numberWithCommas(col7));

            var total_qty_price = api
                .column( 8 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
				
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 8 ).footer() ).html(numberWithCommas(total_qty_price));
            
        },
        "scrollCollapse": true,
        "paging": true, 
        "pageLength": 50,
        "lengthChange": false,
        "ajax": "/apis/pull/fp_cp/"+fp_guid+"/aus",
        "processing": true,
        "language": {
            processing: '<i class="fa fa-spinner fa-pulse fa-3x fa-fw loader-custom"></i><span class="sr-only"></span> '},
        //"serverSide": true,
        "columnDefs": [{
            "targets": [ 2 ],
            "visible": false
        }],
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
            { "data": "fp_cp_guid" },
            { "data": "rm_code" },
            { "data": "rm_desc" },
            { "data": "unit_desc" },
            { "data": "fp_cp_price", render: $.fn.dataTable.render.number(',', '.', 2, '')},
            { "data": "fp_cp_qty" },
            { "data": "total_price", render: $.fn.dataTable.render.number(',', '.', 2, '')},
            
        ]
    });
};

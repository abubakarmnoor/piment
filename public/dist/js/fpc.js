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
// spinner_popup();
$(document).ready(function() {
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
    $("#btn_add_lampshade").on("click", function(e){
        $("#title").text("LAMPSHADE");
        $("#fp_cp_type").val("lampshade");
    })
    $("#btn_add_stand").on("click", function(e){
        $("#title").text("STAND");
        $("#fp_cp_type").val("stand");
    })
    $("#btn_add_euro").on("click", function(e){
        $("#title").text("EURO");
        $("#fp_cp_type").val("euro");
    })
    $("#btn_add_us").on("click", function(e){
        $("#title").text("US");
        $("#fp_cp_type").val("us");
    })
    $("#btn_add_japan").on("click", function(e){
        $("#title").text("JAPAN");
        $("#fp_cp_type").val("japan");
    })
    $("#btn_add_uk").on("click", function(e){
        $("#title").text("UK");
        $("#fp_cp_type").val("uk");
    })
    $("#btn_add_aus").on("click", function(e){
        $("#title").text("AUS");
        $("#fp_cp_type").val("aus");
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
        _data.fp_cp_upd_by="Admin";
        _data.fp_cp_qty = (_data.fp_cp_qty).replace(/\,/g,'');
        _data.fp_cp_price = (_data.fp_cp_price).replace(/\,/g,'');
        _data.tblname = "fp_cp";
        // console.log(_data);//

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
        _data.upd_by = "Admin";

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
        _data.upd_by = "Admin";

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
        _data.upd_by = "Admin";

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
        _data.upd_by = "Admin";

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
        _data.upd_by = "Admin";

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
        _data.upd_by = "Admin";

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
        _data.upd_by = "Admin";

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
        $("input[name=fp_cp_price]").val(price_);
        var unit_ = $('option:selected', this).attr("unit");
        $("#fp_cp_unit").selectpicker('val',unit_);
        
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
 
	        var col7 = api
                .column( 7 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
				
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 7 ).footer() ).html(numberWithCommas(col7));
        },
        "scrollCollapse": true,
        "paging": true, 
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
            { "data": "fp_cp_qty" },
            { "data": "unit_desc" },
            { "data": "fp_cp_price", render: $.fn.dataTable.render.number(',', '.', 2, '')},
            
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
 
	        var col7 = api
                .column( 7 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
				
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 7 ).footer() ).html(numberWithCommas(col7));
        },
        "scrollCollapse": true,
        "paging": true, 
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
            { "data": "fp_cp_qty" },
            { "data": "unit_desc" },
            { "data": "fp_cp_price", render: $.fn.dataTable.render.number(',', '.', 2, '')},
            
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
 
	        var col7 = api
                .column( 7 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
				
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 7 ).footer() ).html(numberWithCommas(col7));
        },
        "scrollCollapse": true,
        "paging": true, 
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
            { "data": "fp_cp_qty" },
            { "data": "unit_desc" },
            { "data": "fp_cp_price", render: $.fn.dataTable.render.number(',', '.', 2, '')},
            
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
 
	        var col7 = api
                .column( 7 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
				
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 7 ).footer() ).html(numberWithCommas(col7));
        },
        "scrollCollapse": true,
        "paging": true, 
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
            { "data": "fp_cp_qty" },
            { "data": "unit_desc" },
            { "data": "fp_cp_price", render: $.fn.dataTable.render.number(',', '.', 2, '')},
            
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
 
	        var col7 = api
                .column( 7 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
				
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 7 ).footer() ).html(numberWithCommas(col7));
        },
        "scrollCollapse": true,
        "paging": true, 
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
            { "data": "fp_cp_qty" },
            { "data": "unit_desc" },
            { "data": "fp_cp_price", render: $.fn.dataTable.render.number(',', '.', 2, '')},
            
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
 
	        var col7 = api
                .column( 7 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
				
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 7 ).footer() ).html(numberWithCommas(col7));
        },
        "scrollCollapse": true,
        "paging": true, 
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
            { "data": "fp_cp_qty" },
            { "data": "unit_desc" },
            { "data": "fp_cp_price", render: $.fn.dataTable.render.number(',', '.', 2, '')},
            
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
 
	        var col7 = api
                .column( 7 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
				
            // Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 7 ).footer() ).html(numberWithCommas(col7));
        },
        "scrollCollapse": true,
        "paging": true, 
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
            { "data": "fp_cp_qty" },
            { "data": "unit_desc" },
            { "data": "fp_cp_price", render: $.fn.dataTable.render.number(',', '.', 2, '')},
            
        ]
    });
};

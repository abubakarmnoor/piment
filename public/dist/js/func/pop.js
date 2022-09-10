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
        //console.log( table.row( this ).data().id );
        const _id = table.row( this ).data().pop_guid;

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
    });

    //popup pop
    $('#btn_pop_pf').on('click', function(){
        // e.preventDefault();
        $('#th_pop_desc').text('Product Family')
        $('#lbl_pf_desc').text('Product Family Desc')
        $("label[name=pop_type").text("product-family")
        $("input[name=pop_desc").val("")
        
        table.ajax.url("/apis/pop/product-family", null, false).load(); // pop pf
    });
    $('#btn_pop_origin').on('click', function(){
        // e.preventDefault();
        $('#th_pop_desc').text('Origin')
        $('#lbl_pf_desc').text('Origin Desc')
        $("label[name=pop_type").text("origin")
        $("input[name=pop_desc").val("")
        table.ajax.url("/apis/pop/origin", null, false).load(); // pop origin
    });

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
        
        console.log(_data);

        // ajax - save/post data
        spinner_popup();
        $.ajax({
            type:"POST", // must be POST 
            url: "/apis/upd", 
            dataType: "json",
            data: _data,
            success: function(data) {
                // $('.modal').modal('hide');
                // table.ajax.url("/apis/pop/"+_data.pop_type, null, false).load(); // refresh pop
                Swal.fire({
                    icon: 'success',
                    title: '',
                    text: "Data Saved"
                }).then(function(){
                    //location.href='/clients'
                    table.ajax.url("https://piment-admin.localpro100.com/apis/pop/"+_data.pop_type, null, false).load(); // refresh pop
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

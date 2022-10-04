function selectpicker_reload(code, id, url){
    
    // console.log(id_);
    // console.log(id__);

    spinner_popup();
    $.ajax({
        type:"GET",
        url: "/apis/pop/"+code, 
        success: function(data) {
            // $('.modal').modal('hide');
            $("#spinner-modal").modal('hide')

            let option_ = new Option("-", "-")
            $('#'+id)
            .empty()
            .append(option_)
            // .selectpicker('refresh');
            for (let index = 0; index < data.data.length; index++) {
                option_ = new Option(data.data[index].pop_desc, data.data[index].pop_guid)
                $('#'+id).append(option_);
            }
            $('#'+id).selectpicker('refresh');
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
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}
$(function(){
    $(".datepicker").datepicker({
        format: 'yyyy-mm-dd',
        setDate: new Date(),
        autoclose: true,
        todayHighlight: true,
    });
});
 
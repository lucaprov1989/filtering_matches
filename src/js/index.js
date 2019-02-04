$(()=> {
    $(".slider").each(function() {
        $(this).change(function() {
            $(this).closest('div').find("input[type=text]").val(this.value)
        })
    })
});



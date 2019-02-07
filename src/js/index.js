$(()=> {

    $(".sliders").each(function() {

        let name = $(this).attr("name");
        $(`#${name}_min`).val($(this).data('from'));
        $(`#${name}_max`).val($(this).data('to'));

        $(this).ionRangeSlider(
            {
                type: 'double',
                min: $(this).data('min'),
                max: $(this).data('max'),
                from: $(this).data('to'),
                to: $(this).data('from'),
                onFinish: (data) => {
                    if (data.from) $(`#${name}_min`).val(data.from);
                    if (data.to) $(`#${name}_max`).val(data.to);
                },

            }
        );
    })
});



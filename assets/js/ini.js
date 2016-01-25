/*
* Script principal para CyD
*/

$(document).ready(function () {
	Plugins();
    // Ajax Form Logic
    $("body").on('click', '.submit-button', function () {
        var form = $(this).closest("form");

        // Bloqueamos
        if (!form.validate()) return false;

        var block = $('<div class="block-loading" />');
        form.prepend(block);
    })
    $("body").on('click', '.submit-ajax-button', function () {
        var form = $(this).closest("form");
        var buttons = $("button", form);
        var button = $(this);
        var url = form.attr('action');

        var tipo = 1; // 1 Formulario , 2 Boton Eliminar

        if (button.data('confirm') != undefined)
        {
            if (button.data('confirm') == '') {
                if (!confirm('¿Esta seguro de realizar esta acción?')) return false;
            } else {
                if (!confirm(button.data('confirm'))) return false;
            }
        }

        if (button.hasClass('del')) {
            if (!confirm('Esta seguro de eliminar este item?', 'Confirmar acci�n')) {
                return false;
            } else {
                url = button.val();
                tipo = 2;
            }
        } else if (button.hasClass('confirm')) {
            if (!confirm('Esta seguro de realizar esta acci�n?', 'Confirmar acci�n')) {
                return false;
            } else {
                if (!form.validate()) {
                    return false;
                }
            }
        } else {
            if (!form.validate()) {
                return false;
            }
        }

        // Bloqueamos
        var block = $('<div class="block-loading" />');
        form.prepend(block);

        $(".alert", form).remove();

        form.ajaxSubmit({
            dataType: 'JSON',
            type: 'POST',
            url: url,
            success: function (r) {

                if(r.response == 'login')
                {
                    alert('Su sesión ha expirado, lo vamos a llevar a la auntentificación.')
                    window.location.href = base_url('');
                    return;
                }

                block.remove();
                if (r.response) {
                    if (!form.hasClass('upd') && !button.hasClass('del')) {
                        form.reset();
                    }
                }

                // Mostrar mensaje
                if (r.message != undefined) {
                    if (r.message.length > 0) {
                        var css = "";
                        if (r.response) css = "alert alert-success";
                        else css = "alert-danger";

                        var message = '<div class="alert ' + css + ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + r.message + '</div>';
                        form.prepend(message);
                        $('html,body').animate({scrollTop: form.find('.alert').offset().top - 60},'fast');
                    }
                }

                // Ejecutar funciones
                if (r.function != undefined) {
                    setTimeout(r.function, 0);
                }
                // Redireccionar
                if (r.href != undefined) {
                    if (r.href == 'self') window.location.reload(true);
                    else window.location.href = base_url(r.href);
                }
            }
        });

        return false;
    })
})

function Plugins() {
    // PLugins
    $(".datepicker").datepicker({
        format: FormatoFecha,
        autoclose: true,
        language: "es",
        todayHighlight: true
    });
    $(".datepicker-today").datepicker({
        format: FormatoFecha,
        autoclose: true,
        language: "es",
        todayHighlight: true,
        endDate: '0'
    });
    $(".datepicker,.datepicker-today").keypress(function(){ return false; });
}
function AutocompleteUbigeo(id) {
    var input = $("#" + id + " input:text");

    input.autocomplete({
        dataType: 'JSON',
        source: function (request, response) {
            jQuery.ajax({
                url: base_url('ubigeo/BuscarDistrito'),
                type: "post",
                dataType: "json",
                data: {
                    distrito: request.term
                },
                success: function (data) {
                    response($.map(data, function (item) {
                        return {
                            id: item.codigo,
                            value: item.descripcion
                        }
                    }))
                }
            })
        },
        select: function (e, ui) {
            $("#" + id + " input:hidden").val(ui.item.id);
        }
    })
}

function ToMoneyFormat(number)
{
    if (number > 0) {
        var amt = parseFloat(number);
        return 'S/. ' + amt.toFixed(2);
    }

    return '';
}

function Unique(list) {
    var result = [];
    $.each(list, function (i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
}

function jqGridStart(id, pager, url, colsnames, colsmodel, sortname, sortorder)
{
	if(sortname == '') sortname = 'id';
	if(sortorder == '') sortorder = 'desc';
	
	var grid = $("#" + id);
	grid.jqGrid(
			{ 
				url: base_url(url), 
				datatype: 'json', 
				colNames:colsnames, 
				colModel:colsmodel, 
		  		rowNum:20, 
		  		rowList:[20,30,100],
		  		pager: '#' + pager,
		  		sortname: sortname,
		  		viewrecords: true,
		  		sortorder: sortorder,
		  		autowidth:true,
		  		height: 'auto',
		  		filterToolbar: true
			}
		);
	return grid;
}
function jqGridStartConfig(id, pager, url, conf) {
    var grid = $("#" + id);

    var start = {
        url: base_url(url),
        datatype: 'json',
        mtype: 'POST',
        rowNum: 20,
        rowList: [20, 30, 100],
        pager: '#' + pager,
        sortname:  (conf.sortname == undefined ? 'id' : null),
        sortorder: (conf.sortorder == undefined ? 'desc' : null),
        viewrecords: true,
        autowidth: true,
        height: 'auto',
        filterToolbar: true
    };

    for (key in conf) {
        start[key] = conf[key];
    }
    
    grid.jqGrid(start);

    return grid;
}
function jqGridCreateLink(href, display)
{
	return '<a style="display:block;" href="' + base_url(href) + '">' + display + '</a>';;
}
function AjaxPopupModal(id, title, url, params)
{
	$("#" + id).remove();
    $("body").append('<div data-backdrop="static" id="' + id + '" class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">' + title + '</h4></div><div class="modal-body"></div></div></div></div>');
    $("#" + id).modal();

    // Cargando
    $("#" + id).find('.modal-body').html('<blink>Estamos cagando el formulario ..</blink>');
    $.post(base_url(url),params, function(r){
    	$("#" + id).find('.modal-body').html(r);
    });
}
function AjaxPopupModalDontClose(id, title, url, params)
{
    $("#" + id).remove();
    $("body").append('<div data-backdrop="static" id="' + id + '" class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">' + title + '</h4></div><div class="modal-body"></div></div></div></div>');
    $("#" + id).modal();

    // Cargando
    $("#" + id).find('.modal-body').html('<blink>Estamos cagando el formulario ..</blink>');
    $.post(base_url(url),params, function(r){
        $("#" + id).find('.modal-body').html(r);
    });
}

function ParseDate(fecha)
{
    var _FE = fecha.split('/'); 
    return _FE[2] + '/' + _FE[1] + '/' + _FE[0];
}

function HasModule(module)
{
    return Modulos.search(module) > -1 ? true : false;
}

function DateDiff(d1, d2)
{
    var date1 = new Date(ParseDate(d1));
    var date2 = new Date(ParseDate(d2));
    return (date2-date1)/(1000*60*60*24);
}
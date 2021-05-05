var seleccion;
var docSel;
var actRef;

var CommentButton = function() {
    var ui = $.summernote.ui;
    var button = ui.button({
        contents: '<div id="comentButton"></div> Sugerir cambio',
        //tooltip: 'Selecciona texto que desea cambiar.',
        click: function() {
            $('#summernote').summernote('backColor', TogetherJS.require('peers').Self.color);
            docSel = document.getSelection();
            seleccion = $('#summernote').summernote('createRange');
            actRef = Date.now();
            docSel.anchorNode.parentElement.className = `commentario ${actRef}`;
            docSel.extentNode.parentElement.className = `commentario ${actRef}`;
            docSel.extentNode.parentElement.setAttribute('onclick', `createListener(${actRef})`);
            asignarClase(actRef);
        }
    });

    return button.render();
};

$('#summernote').summernote({
        placeholder: 'Introduzca su texto aquí.',
        tabsize: 5,
        height: 500,
        lang: 'es-ES',
        toolbar: [
            // [groupName, [list of button]]
            ['edit', ['undo', 'redo']],
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['strikethrough', 'superscript', 'subscript']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
            ['tools', ['table', 'hr', 'picture', 'link', 'comentario']],
            ['debug', ['codeview']]
        ],
        buttons: {
            comentario: CommentButton
        }
      });
$(document).ready(function () {
    //$('#summernote').summernote('code', document.cookie.split('texto=')[1]);
    cargarDatos();
});

$(".note-btn").click(function () {
    let contenido = $('#summernote').summernote('code');
    TogetherJS.send({type: "actualizarTexto", texto: contenido});
    sender = true;
});

 $('#summernote').on('summernote.init', function() {
     updated = false;
     if(TogetherJS.require("peers").getAllPeers(true).length > 0){
         TogetherJS.send({type: "cargarDatos"});
         updated = true;
     }else{
         cargarDatos();
         updated = true;
     }
 });

$('#summernote').on('summernote.focus', function() {
    if ($('#summernote').summernote('isEmpty')) {
        TogetherJS.send({type: "cargarDatos"});
        return;
    }

    let contenido = $('#summernote').summernote('code');
    TogetherJS.send({type: "actualizarTexto", texto: contenido});
    sender = true;

});

$('#summernote').on('summernote.keyup', function(we, e) {
        let contenido = $('#summernote').summernote('code');
        TogetherJS.send({type: "actualizarTexto", texto: contenido});
        sender = true;

});

$('#summernote').on('summernote.paste', function(e) {
    let contenido = $('#summernote').summernote('code');
    TogetherJS.send({type: "actualizarTexto", texto: contenido});
    sender = true;
    console.log(TogetherJS.shareUrl());
});

$('#summernote').on('summernote.image.upload', function(we, files) {
    // upload image to server and create imgNode...
    $summernote.summernote('insertNode', imgNode);
    let contenido = $('#summernote').summernote('code');
    TogetherJS.send({type: "actualizarTexto", texto: contenido});
    sender = true;
});

let htmlCompartir = '<form action="/enviarInvitacion" method="post">'
    +'<div class="input-group-sm mb-3">'
    +'<input id="correo" name="correo" type="text" class="form-control" placeholder="alguien@correo.com" aria-label="Recipient\'s username" aria-describedby="basic-addon2">'
    +'<input id="url" name="urlDoc" type="hidden" >'
    +'<br>'
    +'<div class="input-group-append">'
    +'<div style="text-align: center;"><input class="btn-sm btn-dark" value ="Compartir" type="button" onclick="compartirDocumento()"></div>'
    +'</div>'
    +'</div>'
    +'</form>';
$(function () {
    $("#compartir").popover({
        title: 'Correo electronico:',
        content: htmlCompartir,
        trigger: 'click',
        placement: 'bottom',
        html: true
    })
});
$('#compartir').on('shown.bs.popover', function () {
    $("#url").val(TogetherJS.shareUrl());
    console.log(TogetherJS.shareUrl());
});

let htmlText = '<div class="input-group-sm mb-3">'
    +'<span>Indique fecha y hora limite:</span>'
    +'<input type="datetime-local" id="limite">'
    +'<br>'
    +'<div style="text-align: center;"><button  onclick="iniciarVotacion()" class="btn-sm btn-dark mt-3" type="button">Establecer</button></div>';

$('.datepicker').datepicker({
    format: 'mm/dd/yyyy',
    startDate: '-3d',
    language: 'es'
});

$(function () {
    $("#votacion").popover({
        title: 'Datos de la votación:',
        content: htmlText,
        trigger: 'click',
        placement: 'bottom',
        html: true
    })
});

let htmlGuardar =
    '<form  id="guardarPopover">'
    +'<div class="input-group-sm mb-3">'
    +'<input id="nombre" name="titulo" type="text" class="form-control" placeholder="Nombre del documento" aria-label="Recipient\'s username" aria-describedby="basic-addon2"> '
    +'<br>'
    +'<div class="input-group-append">'
    +'<div style="text-align: center;"><input class="btn btn-outline-dark btn-sm" type="button"  onclick="guardarDocumento()" value="Guardar"></div> '
    +'</div>'
    +'</div>'
    +'</form>';

$(function () {
    $("#guardar").popover({
        title: 'Guardar Documento',
        content: htmlGuardar,
        trigger:'click',
        placement: 'bottom',
        html: true
    })
});

let htmlComentario2 = `
    <textarea rows="5" cols="30" id="comText" placeholder="Comentario"></textarea>
    <div style="text-align: center;"><input type="button" onclick="crearComentario()" value="Agregar" class="btn btn-outline-dark"></div>
    `;

$(function () {
    $('#comentButton').parent().popover({
        title: 'Agregar comentario',
        content: htmlComentario2,
        trigger:'click',
        placement: 'bottom',
        html: true
    })
});

//----------------------------------------------------

function nuevoDocumento(){
    if(confirm('Desea guardar cambios?')){
        console.log('Guardado!')
    }
    else{
        $('#summernote').summernote('code', "");
    }
}

function guardarDocumento() {
    $('#titulo').text($('#nombre').val());
    $.ajax({
        url: '/documento/update',
        type: 'POST',
        data: {texto: $('#summernote').summernote('code'), titulo: $('#nombre').val()},
        success: function(response) {
            console.log(response);
        }
    });

}

function cerrarDocumento(){
    if(confirm('Desea guardar cambios?')){
        console.log('Guardado!')
    }

    window.location.href = "/documento";
}

function compartirDocumento() {
    $.ajax({
        url: '/enviarInvitacion',
        type: 'POST',
        data: {correo: $('#correo').val(), urlDoc: TogetherJS.shareUrl()},
        success: function(response) {
            console.log(('Correo enviado!'));
        }
    });
}

function crearComentario() {
    $('#summernote').summernote('backColor', TogetherJS.require('peers').Self.color);
    let spans = $(`.note-editable span[class=${actRef}]`);
    //spans[spans.length-1].parentElement.parentElement.append(document.createElement('br'));
    $.ajax({
        url: '/comentario/guardar',
        type: 'POST',
        data: {texto: $('#comText').val(), referencia: actRef},
        success: function(response) {
            console.log(response);
        }
    });
}

function obterTexto(actRef){
    console.log(actRef);
    $.ajax({
        url: '/comentario/obtenerTexto',
        data: {ref: actRef},
        type: 'POST',
        success: function (response) {
            console.log('response:'+ response);
            document.querySelector('#comTextToast').value = response.texto[0].Texto;
            var element = document.querySelector('#comTextToast');
            $(element).data('referencia', response.texto[0].Referencia);

            if(!$('.card-block').attr('contenteditable')){
                $('.toast-footer').hide();
            }else{
                $('.toast-footer').show();
            }
            $('.toast').toast('show');
        }
    });
}

$(document).ready(function () {
   $('#aceptar_sugerencia').click(function () {
       apruebaSugerencia($('#comTextToast').data('referencia'));
   });
    $('#cancelar_sugerencia').click(function () {
        cancelarSugerencia($('#comTextToast').data('referencia'));
    });
});

function apruebaSugerencia(referencia) {
    alert(referencia);
    $.ajax({
        url: '/comentario/emitirVoto',
        data: {valor: 1, id: referencia},
        type: 'POST',
        success: function (response) {
            console.log('Voto emitido');
        }
    })
}

function cancelarSugerencia(referencia) {
    alert(referencia);
    $.ajax({
        url: '/comentario/emitirVoto',
        data: {valor: -1, id: referencia},
        type: 'POST',
        success: function (response) {
            console.log('Voto emitido');
        }
    })
}

function cargarDatos() {
    $.ajax({
        url: '/documento/loadDoc/' + document.cookie.split('documentoID=')[1].split(';')[0],
        type: 'GET',
        //data: {correo: $('#correo').val(), urlDoc: TogetherJS.shareUrl()},
        success: function(response) {

            $('#titulo').text(response.titulo);
            $('#summernote').summernote('code', response.texto);
            console.log(('Texto cargado!!'));
            if(response.votacion === true){
                $('#summernote').next().find(".note-editable").attr("contenteditable", false);

            }
            //asignarForms(response.votacion);
        }
    });
}

function iniciarVotacion(){
    console.log();
    //2019-05-13T03:10
    $.ajax({
        url: '/documento/update',
        type: 'POST',
        data: {texto: $('#summernote').summernote('code'), titulo: $('#titulo').text()},
        success: function(response) {
            console.log(response);
        }
    });
    $.ajax({
        url: '/votacion/iniciar',
        type: 'POST',
        data: {fecha: $('#limite').val(), urlDoc: TogetherJS.shareUrl()},
        success: function(response) {
            if(response.mensaje){
                console.log(response.mensaje);
            }
        }
    });
}



function asignarClase(actRef){
    let sel = $('.note-editable span');
    let inside = false;
    for (let i = 0; i < sel.length; i++) {
        if(sel[i].className == actRef){
            inside = !inside;
            continue;
        }
        if(inside){
            sel[i].className = `commentario ${actRef}`;
            continue;
        }

    }
}



let createListener = (actRef) => {
        obterTexto(actRef);
};

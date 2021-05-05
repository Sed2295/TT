TogetherJS.hub.on("actualizarTexto", function (msg) {
    // if(role === "creador"){
    //     return;
    // }
    actualizarTexto(msg);
    sender = false;
});

TogetherJS.hub.on("enviarDatos", function (msg) {
    if(!updated){
        actualizarTexto(msg);
        updated = true;
    }
});

TogetherJS.hub.on("cargarDatos", function (msg) {
    if(updated){
        let contenido = $('#summernote').summernote('code');
        TogetherJS.send({type: "enviarDatos", texto: contenido});
    }

});
var updated;

function actualizarTexto(msg){
        $('#summernote').summernote('code', msg.texto);
        updated = true;
};

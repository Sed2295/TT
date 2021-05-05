$(document).ready(function(){
   fetchDocs();
    fetchSharedDocs()
});

function fetchDocs() {
    $.ajax({
        url: '/documento/loadAll',
        type: 'GET',
        success: function(response) {
            const docs = JSON.parse(response);
            let template = '';
            //<td>${doc.Version}</td>
            docs.forEach(doc => {
                let options = '';
                for (let i = 0; i <= doc.Version; i++) {
                    options += `<option value="${i}">${i}</option>`;
                    //$(`#version_${doc._id}`).html(option);
                }
                template += `
                  <tr docId="${doc._id}">
                      <td>
                        <a id="a_${doc._id}" href="/documento/load/${doc._id}" class="task-item">
                            ${doc.Titulo} 
                        </a>
                      </td>
                      <td><select id="version_${doc._id}" onchange="actualizarLink('${doc._id}', '${doc.Version}')">${options}</select></td>
                      <td>${Date(doc.Fecha).split(' ').slice(0, 4)}</td>
                  </tr>
                `;
                $('#misDocumentos').html(template);
            });


        }
    });


};

function fetchSharedDocs() {
    $.ajax({
        url: '/documento/loadAllShared',
        type: 'GET',
        success: function(response) {
            const docs = JSON.parse(response);
            let template = '';
            docs.forEach(doc => {
                let options = '';
                for (let i = 0; i <= doc.Version; i++) {
                    options += `<option value="${i}">${i}</option>`;
                    //$(`#version_${doc._id}`).html(option);
                }
                template += `
                  <tr docId="${doc._id}">
                      <td>
                        <a id="aS_${doc._id}" href="/documento/load/${doc._id}" class="task-item">
                            ${doc.Titulo} 
                        </a>
                      </td>
                      <td>${doc.Version}</td>
                      <td><select id="versionS_${doc._id}" onchange="actualizarSLink('${doc._id}', '${doc.Version}')">${options}</select></td>
 
                      <td>${Date(doc.Fecha).split(' ').slice(0, 4)}</td>
                  </tr>
                `
            });
            $('#misDocumentosCompartidos').html(template);
        }
    });
}

function logout() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace('/logout');
}

function actualizarLink(id, vers) {
    let link = document.querySelector(`#a_${id}`);
    let select = document.querySelector(`#version_${id}`);
    if(vers === select.value){
        link.setAttribute('href', '/documento/load/'+id);
    }
    else{
        link.setAttribute('href', `/documento/loadDocOld/${id}/${select.value}`);
    }
}

function actualizarSLink(id, vers) {
    let link = document.querySelector(`#aS_${id}`);
    let select = document.querySelector(`#version_${id}`);
    if(vers === select.value){
        link.setAttribute('href', '/documento/load/'+id);
    }
    else{
        link.setAttribute('href', `/documento/loadDocOld/${id}/${select.value}`);
    }
}
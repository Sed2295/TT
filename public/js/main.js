function validar() {
	$.ajax({
		url: '/login',
		type: 'POST',
		data: {email: $('#user').val(), pass: $('#passw').val()},
		success: function(response) {
			console.log(response);
			if(response.mensaje === 'Inactivo'){
				$('#InacUser').modal('show');
			}
			if(response.mensaje === 'Incorrecto'){
				$('#IncorrectPass').modal('show');
			}
			if(response.mensaje === 'Ok'){
				window.location = '/login';
			}
		}
	});
}

function getUser() {
	let user = document.cookie.split('=')[1];
	$('#user').val(user);
}

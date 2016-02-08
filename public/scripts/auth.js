// Authentication (AuthController)

app.controller('AuthController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {

	// Check authentication
	if (Cookies.get('auth-token')) {

			$rootScope.$broadcast('intake24.admin.LoggedIn');
	    hideModal();

	    $('body').addClass('authenticated');
	    $('#btn-authenticate p').html(Cookies.get('auth-username'));

	} else {

		showModal('modal-authenticate');

	}

	$('#modal-authenticate input').off().keypress(function(e) {

		if (e.keyCode == 13) { $('#button-login').trigger('click') }
	});

	// Attempt to logout user
	$('#button-logout').off().click(function() {

		Cookies.remove('auth-token');

	    $('body').removeClass('authenticated');
		$('#btn-authenticate p').html('Login');

		hideModal();
		showModal('modal-authenticate');

		// showMessage(gettext('You have logged out'), 'success');
	});

	// Attempt to login user
	$('#button-login').off().click(function() {

		var survey_id = ''; // TODO
		var username = $('#form-login-username').val();
		var password = $('#form-login-password').val();

	    $http({
		  method: 'POST',
		  url: api_base_url + 'signin',
		  data: { survey_id: survey_id, username: username, password: password }
		}).then(function successCallback(response) {

		    Cookies.set('auth-token', response.data.token);

		    Cookies.set('auth-username', username);

				$rootScope.$broadcast('intake24.admin.LoggedIn');

		    hideModal();

		    $('body').addClass('authenticated');
		    $('#btn-authenticate p').html(username);

		    // showMessage(gettext('You have logged in'), 'success');

		}, function errorCallback(response) { showMessage(gettext('Failed to log you in'), 'danger'); handleError(response); });

	});

	function handleError(response) {

		if (response.status === 401) { Cookies.remove('auth-token'); }
	}
}]);

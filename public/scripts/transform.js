// Transform (TransformController)

app.controller('TransformController', function($scope, $http, packCurrentItemService, unpackCurrentItemService, SharedData) {

	// Listen for boradcasts
	packCurrentItemService.listen(function(event, data) { packCurrentItem(); });
	unpackCurrentItemService.listen(function(event, data) { unpackCurrentItem(); });
	
	// Load shared data
	$scope.SharedData = SharedData;

	// Pack current item for server
	function packCurrentItem()
	{
		$scope.SharedData.currentItem.code = $scope.SharedData.currentItem.temp.code;

		$scope.SharedData.currentItem.temp.update_code = true;

		// Ready meal option
		if ($scope.SharedData.currentItem.temp.overrideReadyMealOption) {
			$scope.SharedData.currentItem.attributes.readyMealOption = Array($scope.SharedData.currentItem.temp.booleanReadyMealOption);
		} else {
			$scope.SharedData.currentItem.attributes.readyMealOption = Array();
		}

		// Same as before option
		if ($scope.SharedData.currentItem.temp.overrideSameAsBeforeOption) {
			$scope.SharedData.currentItem.attributes.sameAsBeforeOption = Array($scope.SharedData.currentItem.temp.booleanSameAsBeforeOption);
		} else {
			$scope.SharedData.currentItem.attributes.sameAsBeforeOption = Array();
		}

		// Reasonable amount
		if ($scope.SharedData.currentItem.temp.overrideReasonableAmount) {
			$scope.SharedData.currentItem.attributes.reasonableAmount = Array($scope.SharedData.currentItem.temp.reasonableAmount);
		} else {
			$scope.SharedData.currentItem.attributes.reasonableAmount = Array();
		}
		
		packPortionSizes();
	}

	// Unpack current item for angular
	function unpackCurrentItem()
	{	
		console.log($scope.SharedData.currentItem);

		$scope.SharedData.currentItem.temp = Object();
		$scope.SharedData.currentItem.temp.code = $scope.SharedData.currentItem.code;
		
		// Ready meal option
		if ($scope.SharedData.currentItem.attributes.readyMealOption.length) {
			$scope.SharedData.currentItem.temp.overrideReadyMealOption = true;
			$scope.SharedData.currentItem.temp.booleanReadyMealOption = $scope.SharedData.currentItem.attributes.readyMealOption[0];
		} else {
			$scope.SharedData.currentItem.temp.overrideReadyMealOption = false;
			$scope.SharedData.currentItem.temp.booleanReadyMealOption = false;
		}

		// Same as before option
		if ($scope.SharedData.currentItem.attributes.sameAsBeforeOption.length) {
			$scope.SharedData.currentItem.temp.overrideSameAsBeforeOption = true;
			$scope.SharedData.currentItem.temp.booleanSameAsBeforeOption = $scope.SharedData.currentItem.attributes.sameAsBeforeOption[0];
		} else {
			$scope.SharedData.currentItem.temp.overrideSameAsBeforeOption = false;
			$scope.SharedData.currentItem.temp.booleanSameAsBeforeOption = false;
		}

		// Reasonable amount
		if ($scope.SharedData.currentItem.attributes.reasonableAmount.length) {
			$scope.SharedData.currentItem.temp.overrideReasonableAmount = true;
			$scope.SharedData.currentItem.temp.reasonableAmount = $scope.SharedData.currentItem.attributes.reasonableAmount[0];
		} else {
			$scope.SharedData.currentItem.temp.overrideReasonableAmount = false;
			$scope.SharedData.currentItem.temp.reasonableAmount = 0;
		}

		// Portion sizes
		$.each($scope.SharedData.currentItem.localData.portionSize, function(index, portionSize) {

			console.log(portionSize);
			
			portionSize.temp = new Object();
			
			switch (portionSize.method) {

				case "standard-portion":
					
					portionSize.temp.parameters = [];

					$.each(portionSize.parameters, function(index, parameter) {
						
						var name = parameter.name;
						var indexArray = name.match(/\d+/);
						var index = 0;

						if (indexArray) {
							index = indexArray[0];

							if (!portionSize.temp.parameters[index]) { portionSize.temp.parameters[index] = new Object(); }

							if (parameter.name.indexOf("name") > -1) {
								portionSize.temp.parameters[index].name = parameter.value; // name
							} else if (parameter.name.indexOf("weight") > -1) {
								portionSize.temp.parameters[index].value = parameter.value; // value
							} else if (parameter.name.indexOf("omit-food-description") > -1) {
								portionSize.temp.parameters[index].omitFoodDescription = (parameter.value == "true") ? true : false; // omit food description
							}
						};
					})
					break;

				case "guide-image":

					$.each(portionSize.parameters, function(index, value) {

						if (value.name == 'guide-image-id') {
							$scope.setGuideImageSet(value.value, portionSize);
						}

					});

					break;

				case "as-served":

					$.each(portionSize.parameters, function(index, value) {

						if (value.name == 'serving-image-set') {
							$scope.setAsServedImageSet(value.value, 'serving', portionSize);
						}

						if (value.name == 'leftovers-image-set') {
							$scope.setAsServedImageSet(value.value, 'leftovers', portionSize);
						}

					});

					break;

				case "drink-scale":

					portionSize.temp.parameters = new Object();

					$.each(portionSize.parameters, function(index, value) {

						console.log(value);

						if (value.name == 'drinkware-id') {
							$scope.setDrinkwareSet(value.value, portionSize);
						}

						if (value.name == 'initial-fill-level') {
							portionSize.temp.parameters.initial_fill_level = value.value;
						}

						if (value.name == 'skip-fill-level') {
							portionSize.temp.parameters.skip_fill_level = (value.value == "true") ? true : false;
						}
						
					});

					break;

				case "cereal":

					portionSize.temp.parameters = new Object();

					$.each(portionSize.parameters, function(index, value) {

						if (value.name == 'type') {
							portionSize.temp.parameters.cereal_type = value.value;
						}
						
					});

					break;

				case "milk-on-cereal":
					break;

				default:
					console.log("Other portion size method: " + portionSize.method);
					break;
			}
		})
	}

	function packPortionSizes()
	{
		// Portion sizes
		$.each($scope.SharedData.currentItem.localData.portionSize, function(index, portionSize) {
			
			switch (portionSize.method) {

				case "standard-portion":

					portionSize.parameters = [];

					portionSize.parameters.push({
						name: 'units-count',
						value: portionSize.temp.parameters.length.toString()
					});

					// Update local data
					$.each(portionSize.temp.parameters, function(index, parameter) {
						
						var name;

						name = 'unit#-name';
						portionSize.parameters.push({
							name: name.replace('#', index),
							value: parameter.name.toString()
						});

						name = 'unit#-weight';
						portionSize.parameters.push({
							name: name.replace('#', index),
							value: parameter.value.toString()
						});

						name = 'unit#-omit-food-description';
						portionSize.parameters.push({
							name: name.replace('#', index),
							value: parameter.omitFoodDescription.toString()
						});

					})

					break;

				case "guide-image":
					break;

				case "as-served":
					break;

				case "drink-scale":

					portionSize.parameters = [];

					// Update local data
					$.each(portionSize.temp.parameters, function(key, value) {

						if (key == 'drinkware_id') {
							portionSize.parameters.push({
								name: 'drinkware-id',
								value: value.toString()
							});	
						}

						if (key == 'initial_fill_level') {
							portionSize.parameters.push({
								name: 'initial-fill-level',
								value: value.toString()
							});	
						}

						if (key == 'skip_fill_level') {
							portionSize.parameters.push({
								name: 'skip-fill-level',
								value: value.toString()
							});	
						}
						
					})

					break;

				case "cereal":

					portionSize.parameters = [];

					// Update local data
					$.each(portionSize.temp.parameters, function(key, value) {

						if (key == 'cereal_type') {
							portionSize.parameters.push({
								name: 'type',
								value: value
							});	
						}
						
					})

					break;

				case "milk-on-cereal":
					break;

				default:
					break;
			}
		
		});
		
		// Remove temp parameters
		delete portionSize.temp;
		delete portionSize.$$hashKey;
	}

	$scope.setAsServedImageSet = function(id, type, portionSize) {

		$http({
			method: 'GET',
			url: api_base_url + 'portion-size/as-served/' + id,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			switch (type) {

				case 'serving':
					portionSize.selected_serving_image_set = response.data;

					var found = false;

					$.each(portionSize.parameters, function(index, value) {

						if (value.name == 'serving-image-set') { value.value = response.data.id; found = true; }

					});

					if (!found) { portionSize.parameters.push({name: 'serving-image-set', value: response.data.id}); };
					
					break;

				case 'leftovers':
					portionSize.selected_leftovers_image_set = response.data;

					var found = false;

					$.each(portionSize.parameters, function(index, value) {

						if (value.name == 'leftovers-image-set') { value.value = response.data.id; found = true; }

					});

					if (!found) { portionSize.parameters.push({name: 'leftovers-image-set', value: response.data.id}); };
					
					break;
			}

			hideDrawer();
			
		}, function errorCallback(response) { handleError(response); });	
	}

	$scope.setGuideImageSet = function(id, portionSize) {

		$http({
			method: 'GET',
			url: api_base_url + 'portion-size/guide-image/' + id,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			portionSize.selected_guide_image_set = response.data;

			var found = false;

			$.each(portionSize.parameters, function(index, value) {

				if (value.name == 'guide-image-id') { value.value = response.data.id; found = true; }

			});

			if (!found) { portionSize.parameters.push({name: 'guide-image-id', value: response.data.id}); };

			hideDrawer();
			
		}, function errorCallback(response) { handleError(response); });	
	}

	$scope.setDrinkwareSet = function(id, portionSize) {

		$http({
			method: 'GET',
			url: api_base_url + 'portion-size/drinkware/' + id,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			portionSize.selected_drinkware_image_set = response.data;

			portionSize.temp.parameters.drinkware_id = response.data.id;

			hideDrawer();
			
		}, function errorCallback(response) { handleError(response); });	
	}

});
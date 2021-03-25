
	var todoListSimplebar;

	function initList() {
		chrome.storage.local.get('firstRun', function (result) {
			if (result['firstRun'] === undefined) {
				console.log('firstRun');
				chrome.storage.local.set({
					'firstRun': true
				}, function () {
					chrome.storage.local.set({
						'lastItem': -1
					}, function () {
						chrome.storage.local.set({
							'itemsIdsArr': [] //тут буду хранить булеан(указывающий на наличие элемента под данным id), id это будут числовые версии текстовых id
						}, function () {
							addNewItem();

						});
					});
				});
			}
			else{
				console.log('notFirstRun');
			}
		});

	}

	function addNewItem() {

		chrome.storage.local.get('lastItem', function (result) {

			chrome.storage.local.set({
				'lastItem': result['lastItem'] + 1
			}, function () {
				chrome.storage.local.get('itemsIdsArr', function (result2) {
					var tempArr = result2['itemsIdsArr'];
					tempArr[result['lastItem'] + 1] = true;

					chrome.storage.local.set({
						'itemsIdsArr': tempArr
					}, function () {});
				});
			});

			var newId = ((result['lastItem'] + 1).toString());
			console.log('created '+newId);
			chrome.storage.local.set({
				newId: [false, ''] //данные будем хранить в формате is_checked, content
			}, function () {});


			var str = '<div class="todo-list-item" style="order:'+newId+';" data-id="' + newId + '">\
			<label class="todo-list-item__chb-wrap">\
				<input class="todo-list-item__chb js-todo-list-item__chb" type="checkbox">\
				<div class="todo-list-item__chb-pseudo js-todo-list-item__chb"></div>\
			</label>\
			<div class="todo-list-item__content">\
				<textarea class="textarea-autosize"></textarea>\
			</div>\
			<div class="todo-list-item__remove js-todo-list-item__remove"></div>\
			</div>';
			$('#todo-list').prepend(str);
			autosize($('.textarea-autosize'));
			todoListSimplebar.recalculate();



		});
	}



	function changeItemStatus(id, status) {
		var idStr = id.toString();
		chrome.storage.local.get(idStr, function (result) {
			var arr=result[idStr];
			arr[0]=status;
			chrome.storage.local.set({
				idStr : arr //данные будем хранить в формате is_checked, content
			}, function () {});
		}
	}


	function changeItemText(id, text) {
		var idStr = id.toString();
		chrome.storage.local.get(idStr, function (result) {
			var arr=result[idStr];
			arr[1]=text;
			chrome.storage.local.set({
				idStr: arr //данные будем хранить в формате is_checked, content
			}, function () {});
		}
	}


	function removeItem(removeId) {
		chrome.storage.local.get('lastItem', function (result) {
			if(removeId===result['lastItem']){
				chrome.storage.local.set({
					'lastItem': removeId - 1
				}, function () {});
			}

			chrome.storage.local.get('itemsIdsArr', function (result2) {
				var tempArr = result2['itemsIdsArr'];
				tempArr[removeId] = false;

				chrome.storage.local.set({
					'itemsIdsArr': tempArr
				}, function () {});
			});

			var removeIdStr = removeId.toString();

			chrome.storage.local.set({
				removeIdStr: false
			}, function () {});

			$('.todo-list-item[data-id="'+removeIdStr+'"]').remove();

			todoListSimplebar.recalculate();
		});
	}

	function clearList() {

	}
	function getList() {

			chrome.storage.local.get('itemsIdsArr', function (result) {
				var tempArr = result['itemsIdsArr'];
				tempArr[result['lastItem'] + 1] = true;

				chrome.storage.local.set({
					'itemsIdsArr': tempArr
				}, function () {});
			});

			var newId = ((result['lastItem'] + 1).toString());
			console.log('created '+newId);
			chrome.storage.local.set({
				newId: [false, ''] //данные будем хранить в формате is_checked, content
			}, function () {});


			var str = '<div class="todo-list-item" style="order:'+newId+';" data-id="' + newId + '">\
			<label class="todo-list-item__chb-wrap">\
				<input class="todo-list-item__chb js-todo-list-item__chb" type="checkbox">\
				<div class="todo-list-item__chb-pseudo js-todo-list-item__chb"></div>\
			</label>\
			<div class="todo-list-item__content">\
				<textarea class="textarea-autosize"></textarea>\
			</div>\
			<div class="todo-list-item__remove js-todo-list-item__remove"></div>\
			</div>';
			$('#todo-list').prepend(str);
			autosize($('.textarea-autosize'));
			todoListSimplebar.recalculate();



		});
	}
/*
	function exportList() {

	}

	function importList() {

	}
*/



$(document).ready(function () {
	// $("input[name='phone']").mask(" +7 (999) 999-99-99");


	/*
		chrome.storage.local.set({
			'0': [12, 13, 14, 17]
		}, function () {
			console.log('write end');
		});

		chrome.storage.local.set({
			'3': "12312412"
		}, function () {
			console.log('write end 2');
		});

		chrome.storage.local.get('0', function (result) {
			console.log(result);
		});
		chrome.storage.local.get('3', function (result) {
			console.log(result);
		});
		chrome.storage.local.get(['0'], function (result) {
			console.log(result);
		});
		chrome.storage.local.get(['3'], function (result) {
			console.log(result);
		});
		chrome.storage.local.get(['0','3'], function (result) {
			console.log(result);
			console.log(result['0']);
			console.log(result['3']);
		});

		chrome.storage.local.set({
			'0': [12, 13, 14, 17]
		}, function () {
			console.log('write end');
		});


		chrome.storage.local.set({
			'firstRun': true
		}, function () {
			console.log('write end');
		});

		chrome.storage.local.get('firstRun', function (result) {
			console.log(result['firstRun']);
		});

		chrome.storage.local.remove('firstRun');

	*/
	initList();



	todoListSimplebar=new SimpleBar($('#todo-list-wrap')[0],{
		forceVisible: true,
		autoHide: false
	});

	autosize($('.textarea-autosize'));


	$('#todo-list').on('change', '.js-todo-list-item__chb', function () {
		if ($(this).is(':checked')) {
			$(this).closest(".todo-list-item").addClass('todo-list-item--completed');
		} else {
			$(this).closest(".todo-list-item").removeClass('todo-list-item--completed');
		}
	});


	$('#todo-list').on('change', '.textarea-autosize', function () {
		$(this).val();
	});


	$('.js-todo-add-new').click(function () {
		addNewItem();
	});



	class toDoList {

	}

});
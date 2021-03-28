
$(document).ready(function () {
	/*$('.sh-burger').click(function () {
		$(this).toggleClass('sh-burger--active');
		$('.sh-menu-wrap').toggleClass('sh-menu-wrap--open');
	});*/

});
var todoListSimplebar;
/**
 * Первичная нициализация списка
 */
function initList() {
	chrome.storage.local.get('firstRun', function (result) {
		//console.log('validate '+(result['firstRun'] !== true));
		if (result['firstRun'] !== true) {
			console.log('firstRun');
			chrome.storage.local.set({
				'firstRun': true
			}, function () {
				chrome.storage.local.set({
					'lastItem': -1
				}, function () {
					chrome.storage.local.set({
						'itemsIdsArr': []
						//тут буду хранить булеан(указывающий на наличие элемента под данным id), id это будут числовые версии текстовых id
						//UPD: передумал, теперь буду хранить просто id элементов
					}, function () {
						addNewItem();

					});
				});
			});
		} else {
			console.log('notFirstRun');
		}
	});

}
/**
 * РЕициализация списка(Сброс)
 */
function reset() {
	chrome.storage.local.set({
		'firstRun': false
	}, function () {
		initList();
	});
}
/**
 * Отладочная функция для просмотра содержимого некоторых переменных в  хранилище браузера
 */
function status() {

	chrome.storage.local.get(['firstRun', 'lastItem', 'itemsIdsArr', '0', '1','2','3','4','5'], function (result) {
		console.log((result['firstRun']));
		console.log((result['lastItem']));
		console.log((result['itemsIdsArr']));
		console.log((result['0']));
		console.log((result['1']));
		console.log((result['2']));
		console.log((result['3']));
		console.log((result['4']));
		console.log((result['5']));
	});
}

/**
 * Создание новой записи
 */
function addNewItem() {

	chrome.storage.local.get('lastItem', function (result) {

		var newId = ((result['lastItem'] + 1).toString());
		chrome.storage.local.set({
			'lastItem': result['lastItem'] + 1
		}, function () {
			chrome.storage.local.get('itemsIdsArr', function (result2) {
				var tempArr = result2['itemsIdsArr'];
				tempArr.push(newId);

				chrome.storage.local.set({
					'itemsIdsArr': tempArr
				}, function () {});
			});
		});

		//console.log('created ' + newId);
		chrome.storage.local.set({
			[newId]: [false, ''] //данные будем хранить в формате is_checked, content
		}, function () {});


		var str = '<div class="todo-list-item" style="order:' + newId + ';" data-id="' + newId + '">\
			<label class="todo-list-item__chb-wrap">\
				<input class="todo-list-item__chb js-todo-list-item__chb" type="checkbox">\
				<div class="todo-list-item__chb-pseudo js-todo-list-item__chb"></div>\
			</label>\
			<div class="todo-list-item__content">\
				<textarea class="textarea-autosize"></textarea>\
			</div>\
			<div class="todo-list-item__remove js-todo-list-item__remove"></div>\
			</div>';
		$('#todo-list').append(str);
		autosize($('.textarea-autosize'));
		todoListSimplebar.recalculate();



	});
}


/**
 * Функция изменяет состояние элемента(выполнен пункт, или нет)
 *
 * @param  {string} id Идентификатор элемента в хранилище
 * @param  {boolean} status Новое состояние
 */
function changeItemStatus(id, status) {
	chrome.storage.local.get(id, function (result) {
		var arr = result[id];
		arr[0] = status;
		chrome.storage.local.set({
			[id]: arr
		}, function () {});
	});
}

/**
 * @param  {string} id Идентификатор элемента в хранилище
 * @param  {string} text Новый текст элемента
 */
function changeItemText(id, text) {
	chrome.storage.local.get(id, function (result) {
		var arr = result[id];
		arr[1] = text;
		chrome.storage.local.set({
			[id]: arr
		}, function () {});
	});
}

/**
 * @param  {string} removeId Идентификатор удаляемого элемента
 */
function removeItem(removeId) {
	chrome.storage.local.get('lastItem', function (result) {
		if (removeId === result['lastItem']) {
			chrome.storage.local.set({
				'lastItem': result['lastItem'] - 1
			}, function () {});
		}

		chrome.storage.local.get('itemsIdsArr', function (result2) {
			var tempArr = result2['itemsIdsArr'];


			const index = tempArr.indexOf(removeId);
			if (index > -1) {
				tempArr.splice(index, 1);
			} else {
				console.log('чёт странное!');
			}

			chrome.storage.local.set({
				'itemsIdsArr': tempArr
			}, function () {});
		});

		var removeIdStr = removeId.toString();

		chrome.storage.local.set({
			[removeIdStr]: false
		}, function () {});

		$('.todo-list-item[data-id="' + removeIdStr + '"]').remove();

		todoListSimplebar.recalculate();
	});
}
/**
 * Функция Очистки списка
 */
function clearList() {
	var confirmation = confirm("Вы точно хотите удалить все ваши записи?");
	if(confirmation){
		$('.todo-list-item').remove();
		reset();
	}
}
/**
 * Загрузка списка
 */
function getList() {
	chrome.storage.local.get('itemsIdsArr', function (result) {
		//console.log('tempArr');
		var tempArr = result['itemsIdsArr'];
		//console.log(tempArr);
		chrome.storage.local.get(tempArr, function (result2) {
			//console.log(result2);
			var str = '';
			tempArr.forEach(function (current, id) {

				str += '<div class="todo-list-item' + (result2[current][0]===true ? ' todo-list-item--completed ' : '') + '" style="order:' + current + ';" data-id="' + current + '">\
						<label class="todo-list-item__chb-wrap">\
							<input class="todo-list-item__chb js-todo-list-item__chb" type="checkbox" ' + (result2[current][0]===true ? ' checked ' : '') + '>\
							<div class="todo-list-item__chb-pseudo js-todo-list-item__chb"></div>\
						</label>\
						<div class="todo-list-item__content">\
							<textarea class="textarea-autosize">' + result2[current][1] + '</textarea>\
						</div>\
						<div class="todo-list-item__remove js-todo-list-item__remove"></div>\
						</div>';
			});

			//console.log(str);
			$('#todo-list').append(str);
			autosize($('.textarea-autosize'));
			todoListSimplebar.recalculate();

		});
	});

}



$(document).ready(function () {
	initList();



	todoListSimplebar = new SimpleBar($('#todo-list-wrap')[0], {
		forceVisible: true,
		autoHide: false
	});

	autosize($('.textarea-autosize'));

	function textAreaChange() {
		changeItemText($(this).closest('.todo-list-item').attr('data-id'), $(this).val());
	}
	$('#todo-list').on('keyup', '.textarea-autosize', $.debounce(250, textAreaChange));

	$('#todo-list').on('change', '.js-todo-list-item__chb', function () {
		if ($(this).is(':checked')) {
			changeItemStatus($(this).closest('.todo-list-item').attr('data-id'), true)
			$(this).closest(".todo-list-item").addClass('todo-list-item--completed');
		} else {

			changeItemStatus($(this).closest('.todo-list-item').attr('data-id'), false)
			$(this).closest(".todo-list-item").removeClass('todo-list-item--completed');
		}
	});


	$('#todo-list').on('change', '.textarea-autosize', function () {
		$(this).val();
	});


	$('.js-todo-add-new').click(function () {
		addNewItem();
	});
	$('.js-clear-all').click(function () {
		clearList();
	});
	$('#todo-list').on('click','.js-todo-list-item__remove',function () {
		//console.log($(this).closest('.todo-list-item').attr('data-id'));
		removeItem($(this).closest('.todo-list-item').attr('data-id'));
	});


	getList();
});
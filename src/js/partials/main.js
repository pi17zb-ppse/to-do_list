/**
 * Глобальная переменная, хранящая объект скроллбара из внешней библиотеки
 */
var todoListSimplebar;
/**
 * Первичная нициализация списка
 */
function initList() {

    chrome.storage.local.get('firstRun',
        /**
         * Анонимная функция, вызыываемая после после получения параметра 'firstRun', и обрабатывающая его результат
         *
         * В зависимости от значения данного параметра, мы производим, либо не производим инициализацию основных параметров хранилища
         *
         * @param {boolean} result Значение в хранилище браузера параметра 'firstRun', обозначающего, производилась ли инициализация
         */
        function (result) {

            if (result['firstRun'] !== true) {

                chrome.storage.local.set({
                        'firstRun': true
                    },
                    /**
                     * Анонимная функция, в которой производится инициализация основных переменных в хранилище браузера с последующим вызовом функции добавления первой пустой записи
                     */
                    function () {
                        chrome.storage.local.set({
                                'lastItem': -1 //индекс последнего добавленного элемента
                            },
                            /**
                             * Анонимная функция, в которой производится инициализация массива с индексами элементов в хранилище браузера, а также вызов функции добавления первой пустой записи
                             */
                            function () {
                                chrome.storage.local.set({
                                        'itemsIdsArr': [] //тут хранятся id элементов
                                    },
                                    /**
                                     * После инициализации  основных переменных в хранилище браузера создадим пустую запись, вызвав функцию addNewItem
                                     */
                                    function () {
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
 * Реициализация списка(Сброс)
 */
function reset() {
    chrome.storage.local.set({
            'firstRun': false
        },
        /**
         * После установки флага firstRun - запустим функцию инициализации списка
         */
        function () {
            initList();
        });
}
/**
 * Отладочная функция для просмотра содержимого некоторых переменных в  хранилище браузера
 */
function status() {

    chrome.storage.local.get(['firstRun', 'lastItem', 'itemsIdsArr', '0', '1', '2', '3', '4', '5'],
        /**
         * Функция, выводящая отладочную информацию после получения оной из chrome.storage.local
         *
         * @param {object} result объект, содержащий в себе полученные пары ключ/значение
         */
        function (result) {
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

    chrome.storage.local.get('lastItem',
        /**
         * Продолжаем добавление элемента. Инкрементируем счётчик элементов, после чего вызываем следующую анаон функцию
         *
         * @param {object} result объект, содержащий в себе полученную пару ключ/значение,
         * где ключ это lastItem, а значение его - индекс последнего созданного элемента
         */
        function (result) {

            var newId = ((result['lastItem'] + 1).toString());
            chrome.storage.local.set({
                    'lastItem': result['lastItem'] + 1
                },
                /**
                 * Запрашиваем 'itemsIdsArr'
                 */
                function () {
                    chrome.storage.local.get('itemsIdsArr',
                        /**
                         * В массив 'itemsIdsArr' добавляем новый пустой элемент
                         * @param {object} result2 объект, содержащий 'itemsIdsArr'
                         */
                        function (result2) {
                            var tempArr = result2['itemsIdsArr'];
                            tempArr.push(newId);

                            chrome.storage.local.set({
                                'itemsIdsArr': tempArr
                            });
                        });
                });

            chrome.storage.local.set({
                [newId]: [false, ''] //данные будем хранить в формате isChecked, content
            });


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
 * Функция изменяет статус элемента(выполнено/не выполнено)
 *
 * @param {string} id Идентификатор элемента в хранилище
 * @param {boolean} status Новое состояние
 */
function changeItemStatus(id, status) {
    chrome.storage.local.get(id,
        /**
         * изменяем массив в с записью, а именно задаём новый статус(выполнено/не выполнено)
         *
         * @param {object} result объект, содержащий запись
         */
        function (result) {
            var arr = result[id];
            arr[0] = status;
            chrome.storage.local.set({
                [id]: arr
            });
        });
}

/**
 * Функция изменяет текст элемента
 *
 * @param {string} id Идентификатор элемента в хранилище
 * @param {string} text Новый текст элемента
 */
function changeItemText(id, text) {
    chrome.storage.local.get(id,
        /**
         * изменяем массив в с записью, а именно задаём новый текст
         *
         * @param {object} result объект, содержащий запись
         */
        function (result) {
            var arr = result[id];
            arr[1] = text;
            chrome.storage.local.set({
                [id]: arr
            });
        });
}

/**
 * Удаление записи по id
 *
 * @param {string} removeId Идентификатор удаляемого элемента
 */
function removeItem(removeId) {
    chrome.storage.local.get('lastItem',
        /**
         * Декрементируем индекс последнего элемента в случае его совпадения с индексом удаляемым, продолжаем удаление в следующей вызываемой анонимной функции
         *
         * @param {object} result объект, содержащий id последнего элемента
         */
        function (result) {
            if (removeId === result['lastItem']) {
                chrome.storage.local.set({
                    'lastItem': result['lastItem'] - 1
                });
            }

            chrome.storage.local.get('itemsIdsArr',
                /**
                 * Получаем массив с id всех существующих записей,  удаляем из него нужный элемент
                 *
                 * @param {object} result2 объект, содержащий массив itemsIdsArr
                 */
                function (result2) {
                    var tempArr = result2['itemsIdsArr'];

                    const index = tempArr.indexOf(removeId);
                    if (index > -1) {
                        tempArr.splice(index, 1);
                    } else {
                        console.log('чёт странное!');
                    }

                    chrome.storage.local.set({
                        'itemsIdsArr': tempArr
                    });
                });

            var removeIdStr = removeId.toString();

            chrome.storage.local.set({
                [removeIdStr]: false
            });

            $('.todo-list-item[data-id="' + removeIdStr + '"]').remove();

            todoListSimplebar.recalculate();
        });
}
/**
 * Функция Очистки списка
 */
function clearList() {
    var confirmation = confirm("Вы точно хотите удалить все ваши записи?");
    if (confirmation) {
        $('.todo-list-item').remove();
        reset();
    }
}
/**
 * Загрузка списка
 */
function getList() {
    chrome.storage.local.get('itemsIdsArr',
        /**
         * Получим массив с индексами записей в хранилище браузера, обработаем и выведем его
         *
         * @param {object} result объект, содержащий массив 'itemsIdsArr'
         */
        function (result) {
            var tempArr = result['itemsIdsArr'];
            chrome.storage.local.get(tempArr,
                /**
                 * Получив массив с индексами записей в хранилище браузера, обработаем и выведем его
                 *
                 * @param {object} result2 объект, содержащий все записи, id которых есть в массиве itemsIdsArr'
                 */
                function (result2) {
                    var str = '';
                    tempArr.forEach(

                        /**
                         * Добавляем записи в строку чтобы после добавить их все в дерево dom
                         *
                         * @param  {array} current элемент массива tempArr(он же копия itemsIdsArr)
                         * @param  {int} id индекс элемента массива
                         */
                        function (current, id) {

                            str += '<div class="todo-list-item' + (result2[current][0] === true ? ' todo-list-item--completed ' : '') + '" style="order:' + current + ';" data-id="' + current + '">\
                        <label class="todo-list-item__chb-wrap">\
                            <input class="todo-list-item__chb js-todo-list-item__chb" type="checkbox" ' + (result2[current][0] === true ? ' checked ' : '') + '>\
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
    /**
     * Обработка события изменения текста записи
     */
    function textAreaChange() {
        changeItemText($(this).closest('.todo-list-item').attr('data-id'), $(this).val());
    }
    $('#todo-list').on('keyup', '.textarea-autosize', $.debounce(250, textAreaChange));

    $('#todo-list').on('change', '.js-todo-list-item__chb',
        /**
         * Изменение статуса записи
         */
        function () {
            if ($(this).is(':checked')) {
                changeItemStatus($(this).closest('.todo-list-item').attr('data-id'), true);
                $(this).closest(".todo-list-item").addClass('todo-list-item--completed');
            } else {

                changeItemStatus($(this).closest('.todo-list-item').attr('data-id'), false);
                $(this).closest(".todo-list-item").removeClass('todo-list-item--completed');
            }
        });


    /*
    $('#todo-list').on('change', '.textarea-autosize', function () {
        $(this).val();
    });
    */


    $('.js-todo-add-new').click(function () {
        addNewItem();
    });
    $('.js-clear-all').click(function () {
        clearList();
    });
    $('#todo-list').on('click', '.js-todo-list-item__remove',
        /**
         * Обработка клика на кнопку удаления записи
         */
        function () {
            //console.log($(this).closest('.todo-list-item').attr('data-id'));
            removeItem($(this).closest('.todo-list-item').attr('data-id'));
        });


    getList();
});
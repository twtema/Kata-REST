const BASE_URL = 'http://localhost:8080/api'

const modalEditUser = document.getElementById('edit-user-modal')
const modalDeleteUser = document.getElementById('delete-user-modal')

const deleteUserForm = document.getElementById('delete-user-form');
const editUserForm = document.getElementById('edit-user-form');
const addNewUserForm = document.getElementById('add-new-user-form')

refreshTable()

function refreshTable() {
    fetch(BASE_URL + '/users')
        .then(response => response.json())
        .then(data => {
            fillTableWithData(data);
        })
        .catch(error => {
            console.error('Произошла ошибка:', error);
        });
}

function fillTableWithData(data) {
    const table = document.getElementById('userTable')
    const tbody = table.querySelector('tbody');

    // Очистка таблицы
    tbody.innerHTML = ''

    // Перебор каждого объекта пользователя в JSON
    data.forEach(user => {
        const row = tbody.insertRow();

        row.insertCell().textContent = user.id;
        row.insertCell().textContent = user.email;
        row.insertCell().textContent = user.firstName;
        row.insertCell().textContent = user.age;

        const roles = user.roles.map(role => role.name.split('_')[1])
        row.insertCell().textContent = roles.join(' ');

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('btn')
        editButton.classList.add('btn-info')
        editButton.addEventListener('click', event => {showEditForm(event);});
        row.insertCell().appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('btn')
        deleteButton.classList.add('btn-danger')
        deleteButton.addEventListener('click', event => {showDeleteForm(event);});
        row.insertCell().appendChild(deleteButton);
    });
}

function showDeleteForm (event) {
    let modal = new bootstrap.Modal(modalDeleteUser);
    const button = event.currentTarget
    const tableRow = button.parentNode.parentNode;

    const userId = document.getElementById('delete-user-id')
    const userEmail = document.getElementById('delete-user-email')
    const userName = document.getElementById('delete-user-name')
    const userAge = document.getElementById('delete-user-age')

    userId.value = tableRow.querySelector('td:nth-child(1)').textContent;
    userEmail.value = tableRow.querySelector('td:nth-child(2)').textContent;
    userName.value = tableRow.querySelector('td:nth-child(3)').textContent;
    userAge.value = tableRow.querySelector('td:nth-child(4)').textContent;
    console.log('Данные модального окна удаления юзера заполнены')
    modal.show()
}

function showEditForm (event) {
    let modal = new bootstrap.Modal(modalEditUser);
    const button = event.currentTarget
    const tableRow = button.parentNode.parentNode;

    const userId = document.getElementById('edited-user-id')
    const userEmail = document.getElementById('edited-user-email')
    const userName = document.getElementById('edited-user-name')
    const userAge = document.getElementById('edited-user-age')

    userId.value = tableRow.querySelector('td:nth-child(1)').textContent;
    userEmail.value = tableRow.querySelector('td:nth-child(2)').textContent;
    userName.value = tableRow.querySelector('td:nth-child(3)').textContent;
    userAge.value = tableRow.querySelector('td:nth-child(4)').textContent;
    console.log('Данные модального окна редактирования юзера заполнены')
    modal.show()
}

deleteUserForm.addEventListener('submit', event => {
    console.log('Нажата кнопка delete формы удаления юзера');
    event.preventDefault();

    const userId = document.getElementById('delete-user-id').value

    const URL = BASE_URL + '/users/' + userId;
    console.log('DELETE запрос на URL ', URL)
    // Отправляем DELETE запрос
    fetch(URL, {method: 'DELETE', credentials: 'include'})
        .then(response => {
            if (response.ok) {
                console.log('Запрос на удаление успешно выполнен');
                refreshTable()
                showAlert(`User with ID ${userId} was successfully deleted`, 'alert-success', 'delete-user-alert')
            } else {
                
                console.log('Произошла ошибка при выполнении запроса удаления');
                showAlert(`Error while deleting user with ID ${userId}`, 'alert-danger', 'delete-user-error-alert')
            }
        })
        .catch(error => {
            console.log('Ошибка при удалении пользователя', error)
        })

    let modal = bootstrap.Modal.getInstance(modalDeleteUser);
    modal.hide()
});

editUserForm.addEventListener('submit', event => {
    console.log('Нажата кнопка submit формы редактирования юзера');
    event.preventDefault();

    const email = document.getElementById('edited-user-email').value;
    const userData = {
        id: document.getElementById('edited-user-id').value,
        email: email,
        password: document.getElementById('edited-user-password').value,
        firstName: document.getElementById('edited-user-name').value,
        age: document.getElementById('edited-user-age').value,
        roles: Array.from(document.getElementById('role-select-edit-user').selectedOptions)
            .map(option => ({
                id: option.value,
                name: 'ROLE_' + option.text
            }))
    }

    console.log(userData)

    const options = {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(userData)
    }

    const URL = BASE_URL + '/users';
    console.log('PATCH запрос на URL ', URL)

    fetch(URL, options)
        .then(response => {
            if (response.ok) {
                console.log('Запрос на редактирование юзера успешно отправлен')
                showAlert(`The user with email '${email}' was edited successfully`, 'alert-success', 'user-added-alert')
                refreshTable()
            } else {
                response.json().then(json => {

                    console.log('Произошла ошибка при редактировании юзера')
                    console.log('Полученный json', json)
                    showAlert('Error while edit user', 'alert-danger',  'user-added-error-alert')
                    json.errors.forEach(errorMsg => {
                        console.log('Выводим ошибку про ' + errorMsg)
                        showAlert(errorMsg, 'alert-warning',  'user-added-error-alert')
                    })

                })
            }
        })
        .catch(error => {
            console.log('Ошибка при создании нового пользователя', error)
        })

    let modal = bootstrap.Modal.getInstance(modalEditUser);
    modal.hide()
});

addNewUserForm.addEventListener('submit', event => {
    console.log('Нажата кнопка add формы добавления юзера');
    event.preventDefault();

    const email = document.getElementById('new-user-email').value;
    const userData = {
        email: email,
        password: document.getElementById('new-user-password').value,
        firstName: document.getElementById('new-user-firstName').value,
        age: document.getElementById('new-user-age').value,
        roles: Array.from(document.getElementById("role-select").selectedOptions)
            .map(option => ({
                id: option.value,
                name: 'ROLE_' + option.text
            }))
    }

    console.log(userData)

    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(userData)
    }

    const URL = BASE_URL + '/users';
    console.log('POST запрос на URL ', URL)

    fetch(URL, options)
        .then(response => {
            if (response.ok) {
                console.log('Запрос на добавление юзера успешно отправлен')
                showAlert(`The user with email '${email}' was added successfully`, 'alert-success', 'user-added-alert')
                refreshTable()
                const tabUserList = document.getElementById('tab-users-list')
                tabUserList.click()
            } else {
                response.json().then(json => {
                    console.log('Произошла ошибка при добавлении юзера')
                    console.log('Полученный json', json)
                    showAlert('Error while add new user', 'alert-danger',  'user-added-error-alert')
                    json.errors.forEach(errorMsg => {
                        console.log('Выводим ошибку про ' + errorMsg)
                        showAlert(errorMsg, 'alert-warning',  'user-added-error-alert')
                    })

                })
            }
        })
        .catch(error => {
            console.log('Ошибка при создании нового пользователя', error)
        })
});

function showAlert(message, cssStyle, alertId) {
    const alert = document.createElement('div')
    alert.setAttribute('id', alertId)
    alert.classList.add('alert', 'alert-dismissible', 'fade', 'show')
    alert.classList.add(cssStyle)
    alert.setAttribute('role', 'alert')

    const closeButton = document.createElement('button')
    closeButton.setAttribute('type', 'button')
    closeButton.classList.add('btn-close')
    closeButton.setAttribute('data-bs-dismiss', 'alert')
    closeButton.setAttribute('aria-label', 'Close')

    alert.appendChild(closeButton)

    const span = document.createElement('span');
    span.setAttribute('id', 'alert-delete-user-text')
    const text = document.createTextNode(message + '.');
    span.appendChild(text)

    alert.appendChild(span)
    alert.appendChild(closeButton)

    document.body.insertBefore(alert, document.getElementById('base-container'))

    setTimeout(() => document.getElementById(alertId).remove(), 10_000)
}
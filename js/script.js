// // ================= BASE ==============

const BASE_URL = 'https://nuranov29.pythonanywhere.com'
const USER_TOKEN = localStorage.getItem('userToken')
const USER_ID = localStorage.getItem('userId')

// // ================= IMPROTS ===========

const $inputs = document.querySelectorAll('.formBody input')
const $cardContainer = document.querySelector('.part2')
const $form = document.querySelector('.form')
const $submitBtn = document.querySelector('.addTodoBtn')
const $modalForm = document.querySelector('.modalForm')
const $editModal = document.querySelector('.editModal')
const $closeModal = document.querySelector('.modalHeader span')
const $modalInputs = document.querySelectorAll('.modalBody input')
const $submitModalBtn = document.querySelector('.submitChanging')
const $logoutBtn = document.querySelector('.logoutBtn')

// // ================= STATES ============

const request = {
	get: (route) => {
		return fetch(`${BASE_URL}/${route}`, {
			method: 'GET',
			headers: {
				'Content-type': 'application/json',
				Authorization: `Token ${USER_TOKEN}`,
			},
		}).then((res) => res.json())
	},
	post: (route, body) => {
		return fetch(`${BASE_URL}/${route}`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
				Authorization: `Token ${USER_TOKEN}`,
			},
			body: JSON.stringify(body),
		}).then((res) => res.json())
	},
	delete: (route) => {
		return fetch(`${BASE_URL}/${route}`, {
			method: 'DELETE',
			headers: {
				'Content-type': 'application/json',
				Authorization: `Token ${USER_TOKEN}`,
			},
		}).then((res) => res.json())
	},
	patch: (route, body) => {
		return fetch(`${BASE_URL}/${route}`, {
			method: 'PATCH',
			headers: {
				'Content-type': 'application/json',
				Authorization: `Token ${USER_TOKEN}`,
			},
			body: JSON.stringify(body),
		})
	},
}

// =====================================

window.addEventListener('load', () => {
	!USER_TOKEN && open('../auth.html', '_self')
})

window.addEventListener('load', () => {
	getTodo()
})

$form.addEventListener('submit', (e) => {
	e.preventDefault()
	if (validate([...$inputs])) {
		$submitBtn.disabled = true
		const body = getInputValues($inputs)
		request
			.post('api/todo/', body)
			.then(getTodo)
			.then(resetInput([...$inputs]))
			.finally(($submitBtn.disabled = false))
	}
})

$logoutBtn.addEventListener('click', (e) => {
	e.preventDefault()
	request
		.post('auth/token/logout/', '')
		.then(() => localStorage.removeItem('userToken'))
		.then(() => open('../auth.html', '_self'))
})

function getTodo() {
	request.get('api/todo/').then((todos) => cardTempate(todos))
}

function getInputValues(inputArr) {
	const body = [...inputArr].reduce((body, input) => {
		return {
			...body,
			[input.name]: input.value,
		}
	}, {})
	body.user = USER_ID
	return body
}

function validate(inputArr) {
	inputArr.forEach((input) => {
		!input.value
			? input.classList.add('redBorder')
			: input.classList.remove('redBorder')
	})
	return inputArr.every((input) => input.value)
}

function cardTempate(base) {
	console.log(base)
	const template = base
		.reverse()
		.map(({ date, description, id, title }) => {
			return `
					<div class="card">
						<div class="cardHeader">
							<h2>${title}</h2>
							<span>${date}</span>
						</div>
						<div class="cardBody">
							<p>${description}</p>
						</div>
						<div class="cardFooter">
							<img src="/img/complete.png" onclick="deleteTodo('${id}')" />
							<img src="/img/edit.png" onclick="editTodo('${id}')"/>
						</div>
					</div>
			`
		})
		.join('')
	$cardContainer.innerHTML = template
}

function deleteTodo(id) {
	request.delete(`api/todo/${id}`).finally(getTodo)
}

function editTodo(id) {
	$editModal.classList.add('active')
	$modalForm.addEventListener('submit', (e) => {
		e.preventDefault()
		if (validate([...$modalInputs])) {
			$submitModalBtn.disabled = true
			const body = getInputValues($modalInputs)
			request
				.patch(`api/todo/${id}/`, body)
				.then(() => $editModal.classList.remove('active'))
				.then(getTodo)
		}
	})
}

$closeModal.addEventListener('click', (e) => {
	e.preventDefault()
	$editModal.classList.remove('active')
})

function resetInput(inputArr) {
	inputArr.forEach((input) => (input.value = ''))
}

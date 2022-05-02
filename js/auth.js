const BASE_URL = 'https://nuranov29.pythonanywhere.com'

const $submit = document.querySelector('.submitBtn')
const $username = document.querySelector('.username')
const $password = document.querySelector('.password')
const $inputs = document.querySelectorAll('.form input')
const $errorContainer = document.querySelector('.errorResponse')
const $errorResponse = document.querySelector('.errorResponse span')

const request = {
	post: (url, body) => {
		return fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
			body: JSON.stringify(body),
		}).then((res) => (res.status >= 400 ? checkError() : res.json()))
	},
}

$submit.addEventListener('click', (e) => {
	e.preventDefault()
	if (validate()) {
		const body = getInputValues()
		console.log(body)
		request
			.post(`${BASE_URL}/auth/token/login/`, body)
			.then((res) => localStorage.setItem('userToken', res.auth_token))
			.then(
				() =>
					localStorage.getItem('userToken') && open('../index.html', '_self')
			)
			.finally(resetInput)
	}
})

window.addEventListener('load', () => {
	const USER_ID = localStorage.getItem('userId')
	!USER_ID && open('../register.html', '_self')
})

function getInputValues() {
	return [...$inputs].reduce((body, input) => {
		return { ...body, [input.name]: input.value.trim() }
	}, {})
}

function checkError() {
	$errorContainer.style.display = 'flex'
	$errorResponse.innerHTML = 'Unable to log in with provided credentials'
}

function validate() {
	$inputs.forEach((input) => {
		!input.value
			? input.classList.add('redBorder')
			: input.classList.remove('redBorder')
	})

	return [...$inputs].every((input) => input.value)
}

function resetInput() {
	$inputs.forEach((input) => (input.value = ''))
}

'use strict';
const root = document.querySelector('.root');
const placesList = root.querySelector('.places-list');
const addImagePopup = root.querySelector('#addImagePopup');
const userEditPopup = root.querySelector('#userEditPopup');
const showImagePopup = root.querySelector('#showImage');
const popupContent = addImagePopup.querySelector('.popup__content');
const addImageForm = popupContent.querySelector('#addImageForm');
const editUserForm = document.querySelector('#editUserForm');
/*REVIEW. (+) По правилам написания js кода требуется, чтобы во всём проекте поиск DOM-элементов происходил одним и те же способом, например только с помощью  querySelector*/
const inputName = addImageForm.querySelector('#name');
const inputLink = addImageForm.querySelector('#link');
const inputUserName = editUserForm.querySelector('#userName');
const inputUserJob = editUserForm.querySelector('#userAbout');
const userInfoName = document.querySelector('.user-info__name');
const userInfoJob = document.querySelector('.user-info__job');
const editUserButton = document.querySelector('.user-info__edit-button');
const popupCardImage = document.querySelector('.popup-card__image');
const openPopupButton = document.querySelector('.user-info__button');
const addCardButton = document.querySelector('#submit-addImageForm');
const saveProfileButton = document.querySelector('#submit-editUserForm');

// ПОПАП ДОБАВЛЕНИЯ КАРТОЧКИ -->

openPopupButton.addEventListener('click', function (){
  addImagePopup.classList.toggle('popup_is-opened');
	addCardButton.disabled = true;
	openPopupButton.disabled = true;
}); // Открываем форму по клику на '+'

addImageForm.addEventListener('submit', function (event){
  event.preventDefault();
  addImageForm.reset(); // Очищаем поля формы после закрытия
});

addCardButton.addEventListener('click', function (){
	addCard(inputName.value, inputLink.value)
  addImagePopup.classList.remove('popup_is-opened');
  addButtonDisabled();
	addImageForm.reset();
	openPopupButton.disabled = false;
}); // Создаем карточку, закрываем форму

function addButtonDisabled() {
  if (inputName.value !== '' && inputLink.value !== ''){
    addCardButton.disabled = false;
  } else {
    addCardButton.disabled = true;
  }
} // Отключаем кнопку '+'

// <-- ПОПАП ДОБАВЛЕНИЯ КАРТОЧКИ

// ПОПАП РЕДАКТИРОВАНИЯ ПРОФИЛЯ -->

userEditPopup.addEventListener('submit', function (event){
  event.preventDefault();
  editUserForm.reset();
});

editUserButton.addEventListener('click', function(){
	userEditPopup.classList.toggle('popup_is-opened');
	inputUserName.value = userInfoName.textContent;
	inputUserJob.value = userInfoJob.textContent;
	saveProfileButton.disabled = false;
	editUserButton.disabled = true;
}); // Открываем форму редактирования по щелчку на кнопке

const createProfile = function(name, job){
	const userInfoData = document.querySelector('.user-info__data');
	userInfoData.querySelector('.user-info__name').textContent = name;
	userInfoData.querySelector('.user-info__job').textContent = job;
} // Создаем в карточке данные пользователя

saveProfileButton.addEventListener('click', function (){
	createProfile(inputUserName.value, inputUserJob.value);
	userEditPopup.classList.remove('popup_is-opened');
	editUserButton.disabled = false;
}); // Редактируем профиль, закрываем форму

// <-- ПОПАП РЕДАКТИРОВАНИЯ ПРОФИЛЯ

// ШАБЛОН КАРТОЧКИ -->

const cardTemplate = document.querySelector('#card-template').content.querySelector('.place-card');

const createCard = function(name, link){
	const placeCard = cardTemplate.cloneNode(true);
	placeCard.querySelector('.place-card__image').style.backgroundImage = `url(${link})`;
  placeCard.querySelector('.place-card__name').textContent = name;
	return(placeCard);
}

/* REVIEW. (+) Можно лучше. Лучше добавление карточки к контейнеру всех карточек делать при рендере карточек и при добавлении новой карточки, введя дополнительную функцию добавления карточки в конец общего списка (то есть команду  placesList.appendChild(placeCard) убрать из функции createCard и поместить в другую), так как в соответствии с принципом единственной ответственности функции, createCard должна отвечать только за создание элемента карточки (со вложенными в него элементами) и возврат его в инструкции return. Она не должна использовать данные размётки на странице - константу placesList. Тогда createCard можно использовать и в других проектах, где бы также нужен был шаблон карточки. Это требование будет обязательным в 8-м задании.
*/

const addCard = function(name, link){ // Функция добавления карточки
	placesList.appendChild(createCard(name, link));
}
/*REVIEW. (+) Можно лучше. Лучше рендер карточек поместить в отдельную именованную функцию.
Лучше вместо цикла for использовать forEach - не надо создавать лишние переменные. */

const showCards = function(arr){
	arr.forEach(function(elem){
		addCard(elem.name, elem.link)
	});
}
showCards(initialCards);
// Выгружаем на страницу карточки с данными из массива initialCards

/* REVIEW. (+) Можно лучше. Лучше обработчик события открытия большого фото оформить как отдельную именованную функцию и добавлять её на
элемент вместо безымянной функции.*/

function imageShowPopup(e){
	if (e.target.classList.contains('place-card__image')){
		showImagePopup.classList.toggle('popup_is-opened');
		popupCardImage.src = e.target.style.backgroundImage.slice(5, -2);
	}
} // Выводим popup c картинкой

// <-- ШАБЛОН КАРТОЧКИ

// Ставим "like", удаляем карточку -->
/*REVIEW. (+) Лучше обработчики событий лайка и удаления карточки оформить как отдельные именованные функции, и, если Вы добавляете на элемент
обработчик события открытия большого фото, не используя делегирование, то так же без делегирования надо добавлять и обработчики лайка
и удаления карточки в функции createCard. */

function likeButtonOn (e){
	if (e.target.classList.contains('place-card__like-icon')){
		e.target.classList.toggle('place-card__like-icon_liked');
	}
} // <-- Ставим "like"

function deleteCard (e){
  if (e.target.classList.contains('place-card__delete-icon')){
    e.target.closest('.place-card').remove();
  }
} // <-- Удаляем карточку

// Закрываем форму по клику на крестике -->
function closeAnyPopup(e){
	if (e.target.classList.contains('popup__close')){
		const target = e.target.closest('.popup');
		target.classList.remove('popup_is-opened');
		addImageForm.reset();
		editUserForm.reset();
		resetUserFormAlerts();
		inputLink.removeAttribute('pattern');
		openPopupButton.disabled = false;
		editUserButton.disabled = false;
	}
} // <-- Закрываем форму по клику на крестике

// Закрываем форму при нажатии Esc -->
function escPopup(e){
  if (e.key === `Escape`){
    addImagePopup.classList.remove('popup_is-opened');
		userEditPopup.classList.remove('popup_is-opened');
		showImagePopup.classList.remove('popup_is-opened');
    addImageForm.reset();
		editUserForm.reset();
		resetUserFormAlerts();
		inputLink.removeAttribute('pattern');
		openPopupButton.disabled = false;
		editUserButton.disabled = false;
  }
} // <-- Закрываем форму при нажатии Esc

// Закрываем форму при клике вне формы -->
function mousedownPopup(e){
	if (e.target.classList.contains('popup')){
		const targets = e.target.closest('.popup');
		targets.classList.remove('popup_is-opened');
		addImageForm.reset();
		editUserForm.reset();
		resetUserFormAlerts();
		openPopupButton.disabled = false;
		editUserButton.disabled = false;
	}
} // <-- Закрываем форму при клике вне формы

const resetUserFormAlerts = function (){
	if (document.getElementById('error-userAbout').textContent != '' || document.getElementById('error-userName').textContent != ''){
		document.getElementById('error-userName').textContent = '';
		document.getElementById('error-userAbout').textContent = '';
	}
} //Обнуляем алерты в форме редактирования пользователя, чтобы передать в разные события

// ВАЛИДАЦИЯ -->

function checkInputValidity(element) {
  const errorElement = document.querySelector(`#error-${element.id}`);

	if (element.value.length === 0) {
		errorElement.textContent = 'Это обязательное поле';
		return false;
  } else if (element.value.length < 2 || element.value.length > 30){
		errorElement.textContent = 'Должно быть от 2 до 30 символов';
		return false;
	} else if (element.value === '  '){
		element.setAttribute('maxlength', '2');
		errorElement.textContent = 'Поле не должно содержать только пробелы';
		return false;
	} else {
		errorElement.textContent = '';
		element.removeAttribute('maxlength', '2')
		return true;
	}
}

const inputs = Array.from(editUserForm.elements);
console.log(inputs)
function setSubmitButtonState(event){
	event.preventDefault();
	
	let isValidForm = true;
	inputs.forEach(function(elem) {
		if (elem.type !== 'submit'){
			if (!checkInputValidity(elem)) isValidForm = false;
		}
		if (elem.type === 'submit'){
			if (isValidForm) {
				elem.disabled = false;
			} else {
				elem.disabled = true;
			}
		}
	});
}
// <-- ВАЛИДАЦИЯ

addImageForm.addEventListener('input', addButtonDisabled);
placesList.addEventListener('click', imageShowPopup);
placesList.addEventListener('click', likeButtonOn);
placesList.addEventListener('click', deleteCard);
addImagePopup.addEventListener('click', closeAnyPopup);
userEditPopup.addEventListener('click', closeAnyPopup);
showImagePopup.addEventListener('click', closeAnyPopup);
window.addEventListener('keydown', escPopup);
window.addEventListener('mousedown', mousedownPopup);
editUserForm.addEventListener('input', setSubmitButtonState);

/*
REVIEW. Резюме.
Хорошая работа.
Весь функционал, требуемый по заданию, работает.
Сделано дополнительное задание - закрытие всплывающих окон с помощью ESC.
Сделана проверка на пробельные значения полей формы профиля.
Используется синтаксис ES6.


Что можно улучшить.
1.  (+) По правилам написания js кода требуется, чтобы во всём проекте поиск DOM-элементов происходил одним и те же способом, например только
с помощью  querySelector (подробности в ревью в начале кода script.js).

2. (+) Лучше добавление карточки к контейнеру всех карточек делать при рендере карточек и при добавлении новой карточки
(подробности в ревью в коде createCard).

3. (+) Лучше обработчик события открытия большого фото оформить как отдельную именованную функцию (подробности в ревью в коде createCard).

4. (+) Лучше рендер карточек поместить в отдельную именованную функцию.

5. (+) Лучше обработчики событий лайка и удаления карточки оформить как отдельные именованные функции и не использовать
делегирование (подробности в ревью в коде script.js).

6. (+) Лучше обеим формам задать параметр novalidate, чтобы невалидные поля не обводились красной рамкой, потому что встроенная валидация
форм Вам не нужна, так как Вы делаете свою валидацию из js.

7. (+) По правилам написания кода js требуется, чтобы вызов функции, в каком бы стиле она ни создавалась, происходил в коде после её объявления.
Поэтому следует придерживаться следующего порядка написания инструкций в коде:
сначала объявляются константы DOM-элементов и другие константы - исходные данные проекта;
затем объявляются все функции;
затем делается вызов функций, или добавление их на элементы в качестве обработчиков.


Задание пинято.

Желаю успехов в дальнейшем обучении!

*/

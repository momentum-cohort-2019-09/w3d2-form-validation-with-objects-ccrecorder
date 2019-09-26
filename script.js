class Validation {
	constructor(test, errorMsg) {
		this.test = test;
		this.errorMsg = errorMsg;
	}

	validate(value) {
		return this.test(value);
	}
}

class Field {
	constructor(inputDiv, validations) {
		this.inputDiv = inputDiv;
		this.validations = validations || [];
	}

	clearErrorMsgs() {
		const fieldContainer = field.parentNode;
		for (let msg of this.inputDiv.querySelector('.error-message')) {
			msg.remove();
		}
	}

	markValid() {
		clearErrorMsgs(field);
		this.inputDiv.classList.remove('input-invalid');
		this.inputDiv.classList.add('input-valid');
	}

	markInvalid() {
		clearErrorMsgs(field);
		this.inputDiv.classList.remove('input-valid');
		this.inputDiv.classList.add('input-invalid');
	}

	addErrorMsgs(errorMsgs) {
		let fieldName = this.inputDiv.querySelector('label').innerText;
		for (let msg of errorMsgs) {
			const msgNode = document.createElement('p');
			msgNode.classList.add('input-hint', 'text-danger', 'error-msg');
			msgNode.innerText = `${fieldName} ${msg}`;
			this.inputDiv.appendChilc(msgNode);
		}
	}

	//what to put in querySelector?
	getValue() {
		const input = this.inputDiv.querySelector('');
		const value = input.value;
		return value;
	}

	validate() {
		const value = this.getValue();
		const errorMsgs = [];
		for (let validation of this.validations) {
			if (!validation.validate(value)) {
				errorMsgs.push(validation.errorMsg);
			}
		}
		if (errorMsgs.length === 0) {
			this.markValid();
		} else {
			this.markInvalid();
			this.addErrorMsgs(errorMsgs);
		}
		return errorMsgs.length === 0;
	}
}

class Form {
	constructor(domNode, fields) {
		this.domNode = domNode;
		this.fields = fields;
	}
	validate() {
		let valid = true;
		for (let field of this.fields) {
			const fieldIsValid = field.validate();
			if (!fieldIsValid) {
				valid = false;
			}
		}
		return valid;
	}
}

function luhnCheck(val) {
	var sum = 0;
	for (var i = 0; i < val.length; i++) {
		var intVal = parseInt(val.substr(i, 1));
		if (i % 2 == 0) {
			intVal *= 2;
			if (intVal > 9) {
				intVal = 1 + intVal % 10;
			}
		}
		sum += intVal;
	}
	return sum % 10 == 0;
}

const isANumber = new Validation(function() {
	let entry = true;
	if (value < 0 || isNaN(value)) {
		entry = false;
	}
}, 'must be a number');
const presenceValidation = new Validation((value) => !!value, 'must not be blank');
const nowOrFutureValidation = new Validation(function(dateStrToTest) {
	if (!dateStrToTest) {
		return true;
	}

	let dateToTest = new Date(dateStrToTest);
	let now = new Date();
	now.setUTCHours(0, 0, 0, 0);
	dateToTest.setUTCHours(0, 0, 0, 0);

	return dateToTest >= now;
}, 'must be today or in the future');
const validateCardNumber = new Validation(function(number) {
	var regex = new RegExp('^[0-9]{16}$');
	if (!regex.test(number)) return false;

	return luhnCheck(number);
}, 'must be a valid card number');

let nameField = new Field(document.querySelector('#name-field'), [ presenceValidation ]);
let carInfoField = new Field(document.querySelector('#car-info-field'), [ presenceValidation ]);
let startDateField = new Field(document.querySelector('#start-date-field'), [
	presenceValidation,
	nowOrFutureValidation
]);
let daysField = new Field(document.querySelector('#days-field'), [ presenceValidation, isNaN ]);
let cvvField = new Field(document.querySelector('#cvv-field'), [ presenceValidation, isNaN ]);
let expirationField = new Field(document.querySelector('#expiration-field'), [ presenceValidation, isNaN ]);
let form = new Form(document.querySelector('#parking-form'), [
	nameField,
	carInfoField,
	startDateField,
	daysField,
	cvvField,
	expirationField
]);

document.querySelector('#parking-form').addEventListener('submit', (event) => {
	event.preventDefault();
	if (form.validate()) {
	}
});

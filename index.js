const MyForm = (function () {

    let app = new Vue({
        el: '#app',
        data: {
            fields: {
                fio: '',
                email: '',
                phone: ''
            },
            errorFields: [],
            loading: false
        },
        methods: {
            validate() {
                this.errorFields = [];

                if (!this.isValidFio(this.fields.fio))
                    this.errorFields.push("fio");

                if (!this.isValidPhone(this.fields.phone))
                    this.errorFields.push("phone");

                if (!this.isValidEmail(this.fields.email))
                    this.errorFields.push("email");

                return { isValid: this.errorFields.length, errorFields: this.errorFields};
            },
            getData() {
                // will remove references of objects
                return Object.assign({}, this.fields);
            },
            setData(fields) {
                Object.assign(this.fields, fields);
            },
            submit() {
                this.validate();
                console.log(this.errorFields);
            },
            hasError(field) {
                return this.errorFields.includes(field);
            },

            isValidEmail(value) {
                return this.isValidString(value) &&
                    value.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((ya\.ru)|(yandex\.(ru|com|ua|by|kz)))$/)
            },
            isValidPhone(value) {
                return this.isValidString(value)
                    && value.trim().match(/\+7\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}/) // valid format
                    && value.replace(/\D/g, '').split('') // Get array of "numbers"
                        .reduce((prev, next) => Number(prev) + Number(next)) <= 30 // calculate sum of numbers in array
            },
            isValidFio(value) {
                return this.isValidString(value)
                    && value.trim().split(' ').length === 3
            },

            isValidString(value) { // valid and not empty string
                return typeof value === 'string' && value.trim().length > 0;
            }
        }
    });

    return {
        validate: app.validate,
        getData: app.getData,
        setData: app.setData,
        submit: app.submit,
    }
})();
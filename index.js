window.MyForm = (function () {

    let app = new Vue({
        el: '#app',
        data: {
            fields: {
                fio: '',
                email: '',
                phone: ''
            },
            errorFields: [],
            loading: false,
            isPending: false,
            endpoint: null,
            result: {
                className: '',
                text: ''
            }
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

                return { isValid: this.errorFields.length === 0, errorFields: Object.assign({}, this.errorFields)};
            },
            getData() {
                // will remove references of objects
                return Object.assign({}, this.fields);
            },
            setData(fields) {
                Object.keys(this.fields).forEach(key => { // let ignore unknown keys
                    if (typeof fields[key] !== 'undefined')
                        this.fields[key] = fields[key]
                });
            },
            submit() {
                if (this.isPending) {
                    console.warn('Request already in pending state');
                    return;
                }

                let result = this.validate();
                if (result.isValid) {
                    this.loading = true;
                    this.isPending = true;

                    axios.post(this.endpoint, this.getData()).then(response =>
                    {
                        let data = response.data;

                        this.isPending = false;

                        this.result.className = data.status;

                        switch (data.status)
                        {
                            case 'success' : {
                                this.result.text = 'Success';
                                this.loading = false;
                                break;
                            }
                            case 'error' : {
                                this.result.text = data.reason;
                                this.loading = false;
                                break;
                            }
                            case 'progress' : {
                                this.result.text = '';
                                this.delayRequest(data.timeout);
                                break;
                            }
                        }

                    }).catch(error => {
                        this.loading = false;
                        this.isPending = false;

                        console.error(error);
                    })
                }
            },
            delayRequest(timeout) {
                setTimeout(() =>
                {
                    if (this.isPending) // if request already in pending state, wait result...
                        this.delayRequest(100);
                    else
                        this.submit();
                }, timeout)
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
        },
        mounted() {
            this.endpoint = this.$refs.form.getAttribute('action')
        }
    });

    return {
        validate: app.validate,
        getData: app.getData,
        setData: app.setData,
        submit: app.submit,
    }
})();
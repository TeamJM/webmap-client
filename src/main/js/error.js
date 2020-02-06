export class JMError extends Error {
    constructor(errorText) {
        super();

        this.errorText = errorText;
    }
}

export class JMHttpError extends JMError {
    constructor(statusCode, errorText, responseObj) {
        super(errorText);

        this.responseObj = responseObj;
        this.statusCode = statusCode;
    }
}
const Joi = require('joi');
const schema = {
    searchBook: Joi.object().keys({
        search: Joi.string().regex(/^[\w-A-ZČ-Ža-ž\s]+$/),
        page: Joi.any(),
        sort: Joi.string().regex(/^[\w-A-ZČ-Ža-ž\s]+$/),
        filter: Joi.string().alphanum()
    }),
    login: Joi.object().keys({
        username: Joi.string().regex(/^[\w\-\s]+$/).required(),
        password: Joi.string().alphanum().min(6).max(36).required().strip(),
        _csrf: Joi.string(),
    }),
    forgotPW: Joi.object().keys({
        email: Joi.string().email().required(),
        _csrf: Joi.string(),
    }),
    signup: Joi.object().keys({
        username: Joi.string().regex(/^[\w\-\s]+$/).required(),
        email: Joi.string().email().required(),
        password: Joi.string().alphanum().min(6).max(36).required().strip(),
        _csrf: Joi.string(),
    }),
    settings: Joi.object().keys({
        email: Joi.string().email().required(),
        _csrf: Joi.string(),
    }),
    adminRegister: Joi.object().keys({
        code: Joi.string().alphanum().required(),
        _csrf: Joi.string(),
    }),
    addBook: Joi.object().keys({
        title: Joi.string().regex(/^[\w-A-ZČ-Ža-ž\s]+$/).required(),
        price: Joi.number().required(),
        category: Joi.string().regex(/^[\w-A-ZČ-Ža-ž\s]+$/).required(),
        autor: Joi.string().regex(/^[\w-A-ZČ-Ža-ž\s]+$/).required(),
        bookType: Joi.string().regex(/^[\w\-\s]+$/).required(),
        description: Joi.string().regex(/^[\w-A-ZČ-Ža-ž\s]+$/).required(),
        _csrf: Joi.string(),
    }).unknown(),
    editBook: Joi.object().keys({
        title: Joi.string().regex(/^[\w-A-ZČ-Ža-ž\s]+$/).required(),
        price: Joi.number().required(),
        category: Joi.string().regex(/^[\w-A-ZČ-Ža-ž\s]+$/).required(),
        autor: Joi.string().regex(/^[\w-A-ZČ-Ža-ž\s]+$/).required(),
        bookType: Joi.string().regex(/^[\w\-\s]+$/).required(),
        description: Joi.string().regex(/^[\w-A-ZČ-Ža-ž\s]+$/).required(),
        _csrf: Joi.string(),
    }).unknown(),
}

module.exports = schema;
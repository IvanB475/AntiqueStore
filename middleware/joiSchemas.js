const Joi = require('joi');
const schema = {
    searchBook: Joi.object().keys({
        search: Joi.string().alphanum()
    }),
    login: Joi.object().keys({
        username: Joi.string().alphanum().required(),
        password: Joi.string().alphanum().min(6).max(36).required().strip(),
        _csrf: Joi.string(),
    }),
    forgotPW: Joi.object().keys({
        email: Joi.string().email().required(),
        _csrf: Joi.string(),
    }),
    signup: Joi.object().keys({
        username: Joi.string().alphanum().required(),
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
        title: Joi.string().alphanum().required(),
        price: Joi.number().required(),
        category: Joi.string().alphanum().required(),
        autor: Joi.string().alphanum().required(),
        bookType: Joi.string().alphanum().required(),
        description: Joi.string().alphanum().required(),
        _csrf: Joi.string(),
    }).unknown(),
    editBook: Joi.object().keys({
        title: Joi.string().alphanum().required(),
        price: Joi.number().required(),
        category: Joi.string().alphanum().required(),
        autor: Joi.string().alphanum().required(),
        bookType: Joi.string().alphanum().required(),
        description: Joi.string().alphanum().required(),
        _csrf: Joi.string(),
    }).unknown()
}

module.exports = schema;
const Joi = require("joi");

const transformData = (request, h) => {
  if (request.payload) {
    const { key, value } = request.payload;
    return {
      key: key ? key.toString() : undefined,
      value: value ? value.toString() : undefined,
    };
  } else {
    return h.response({ success: false }).takeover();
  }
};

const keyValueValidation = Joi.object({
  key: Joi.required(),
  value: Joi.required(),
});

const keyValidation = Joi.object({
  key: Joi.required(),
});

module.exports = { transformData, keyValueValidation, keyValidation };

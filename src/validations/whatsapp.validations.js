import joi from "joi";

export const authenticateSchema = (data) => {
  const schema = joi.object().keys({
    client_id: joi.string().required(),
  });
  return schema.validate(data);
};

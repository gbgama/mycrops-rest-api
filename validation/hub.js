const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateHubInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.airTemperature = !isEmpty(data.airTemperature)
    ? data.airTemperature
    : "";
  data.airHumidity = !isEmpty(data.airHumidity) ? data.airHumidity : "";
  data.crops = !isEmpty(data.crops) ? data.crops : "";

  if (!Validator.isLength(data.name, { min: 2, max: 40 })) {
    errors.name = "Nome deve conter de 2 a 40 caracteres.";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Nome do hub obrigatório";
  }
  /*
  if (Validator.isEmpty(data.airTemperature)) {
    errors.airTemperature = "Air Temperature field is required";
  }

  if (Validator.isEmpty(data.airHumidity)) {
    errors.airHumidity = "Air Humidity field is required";
  }

  if (Validator.isEmpty(data.crops)) {
    errors.crops = "Crops field is required";
  }
*/
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

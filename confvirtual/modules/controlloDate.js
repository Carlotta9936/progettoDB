const { DateTime } = require('luxon');

exports.controlloDate = (dataPrima, dataDopo) => {
    return dataPrima<dataDopo;
}

exports.controlloOrario = (orarioPrima, OrarioDopo) => {
    return orarioPrima<OrarioDopo;
}

exports.aggiustaData = (data) => {
    return DateTime.fromJSDate(data).toLocaleString(DateTime.DATE_MED);
}
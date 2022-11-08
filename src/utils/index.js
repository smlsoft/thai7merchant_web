import Numeral from "numeral"

const newGuid = (head) => {
    return head + 'xxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 8 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const captcha = () => {
    return 'xxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 8 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const formatNumber = (val, digit = 0) => {
    if (val == 0) {
        return ""
    }

    if (digit > 0)
        return Numeral(val).format('0,0.00')

    return Numeral(val).format('0,0')
}

const uuidv4 = () => {
    return "xxxxxx"
        .replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        })
        .toUpperCase();
};

const getDocNoDate = (date) => {
    var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("");
}
const isEmpty = (value) => {
    return (value != undefined && value != null && value.toString().trim().length > 0) ? true : false
}

const formatCurrency = (value) => {

    var data = "";
    if (value == null || value == 0) {
        return 0;
    }
    data = (Numeral(value).format('(0,0.00)'));

    return data.toLocaleString();
}



export default {
    newGuid,
    isEmpty,
    formatNumber,
    captcha,
    uuidv4,
    getDocNoDate,
    formatCurrency
}
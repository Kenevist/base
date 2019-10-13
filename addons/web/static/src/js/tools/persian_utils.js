odoo.define('web.persian_utils', function () {


    const arabicDigits = "١٢٣٤٥٦٧٨٩٠",
        persianDigits = "۱۲۳۴۵۶۷۸۹۰",
        englishDigits = "1234567890",
        arabicChars = ["ي", "ك", "‍", "ى"],
        persianChars =["ی", "ک", "", "ی"];

    // Make maps
    // 1- Digits
    let toPerMap = {}, toEngMap = {};
    for (let i = 0; i < 10; i++) {
        toPerMap[englishDigits[i]] = persianDigits[i];
        toEngMap[persianDigits[i]] = englishDigits[i];
        toEngMap[arabicDigits[i]] = englishDigits[i];
    }
    Object.freeze(toEngMap);
    Object.freeze(toPerMap);
    // 2- Arabic chars
    let arabicToPersianMap = {};
    for (let i = 0; i < arabicChars.length; i++) {
        arabicToPersianMap[arabicChars[i]] = persianChars[i];
    }
    Object.freeze(arabicToPersianMap);


    function englishNum(perNum) {
        return perNum.toString().replace(new RegExp("["+arabicDigits + persianDigits+"]", "g"), function (perNum) {
            return toEngMap[perNum]
        }).replace(/،/g, ",");
    }

    function persianNum(latNum) {
        return latNum.toString().replace(/\d/g, function (latNum) {
            return toPerMap[latNum]
        }).replace(/,/g, "،");
    }

    function persianString(value) {
        return value.toString().replace(new RegExp("["+arabicChars.join("")+"]", "g"), function (arabicChar) {
            return arabicToPersianMap[arabicChar]
        });
    }

    function fixHalfSpace(value) {
        if (!value) return;
        let pattern;

        // Replace Zero-width non-joiner between persian MI.
        pattern = /((\s\u0645\u06CC)+( )+([\u0600-\u06EF]+)+)/g;
        value = value.replace(pattern, "$2\u200C$4");
        pattern = /((^\u0645\u06CC)+( )+([\u0600-\u06EF]+)+)/g;
        value = value.replace(pattern, "$2\u200C$4");


        // Replace Zero-width non-joiner between persian De-Yii.
        pattern = /(([\u0600-\u06EF]+)+( )+(ای|ایی|اند|ایم|اید|ام))/g;
        value = value.replace(pattern, "$2\u200C$4");

        return value;
    }

    function autoFix(value) {
        return fixHalfSpace(persianString(value));
    }
    /**
    * Changes Latin Digits to Persian Digits only if current user's language is Persian
    * @param {string} value
    *
     * @returns {string} replaced value
    * */
    function autoDigitFormat(value){
        return odoo.session_info.user_context.lang === 'fa_IR' ? persianNum(value) : value;
    }

    return {
        toEnglishNum: englishNum,
        toPersianNum: persianNum,
        arabicToPersian: persianString,
        fixPersianSpacing: fixHalfSpace,
        autoFixPersian: autoFix,
        autoPersianDigitFormat : autoDigitFormat,
    }
});
/**
 * Helpers de Validación para Controladores
 */

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(String(email || '').trim());
}

function validatePhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(String(phone || '').trim());
}

function validateRequired(obj, fields = []) {
    const missing = [];
    for (const f of fields) {
        if (obj[f] === undefined || obj[f] === null || String(obj[f]).trim() === '') {
            missing.push(f);
        }
    }
    return missing;
}

module.exports = {
    validateEmail,
    validatePhone,
    validateRequired
};

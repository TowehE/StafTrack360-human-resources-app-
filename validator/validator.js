const joi = require('@hapi/joi');

const validateUser = (data) => {
    try {
        const validateSchema = joi.object({
            businessEmail: joi.string().max(40).trim().email({ tlds: { allow: false } }).required().messages({
                'string.empty': "Email field can't be left empty",
                'any.required': "Please provide email address"
            }),
            firstName: joi.string().min(3).max(30).trim().regex(/^[a-zA-Z\s'-]+$/).required().messages({
                'string.empty': "First name field can't be left empty",
                'string.min': "Minimum of 3 characters for the first name field",
                'any.required': "Please provide your first name"
            }),
            lastName: joi.string().min(3).max(30).trim().regex(/^[a-zA-Z\s'-]+$/).required().messages({
                'string.empty': "Last name field can't be left empty",
                'string.min': "Minimum of 3 characters for the last name field",
                'any.required': "Please provide your last name"
            }),
            businessName: joi.string().min(3).max(30).trim().regex(/^[a-zA-Z0-9\s&'-]+$/).required().messages({
                'string.empty': "Business name field can't be left empty",
                'string.min': "Minimum of 3 characters for the business name field",
                'any.required': "Please provide a business name "
            }),
            phoneNumber: joi.string().min(11).max(11).trim().regex(/^0\d{10}$/).required().messages({
                'string.empty': "Phone number field can't be left empty",
                'string.min': "Phone number must be atleast 11 digit long e.g: 08123456789",
                'string.max': "Phone number must be atleast 11 digit long e.g: 08123456789",
                'string.pattern.base': "Phone number must start with '0' followed by 10 digits (e.g., 08123456789)",
                'any.required': "Please phone number is required",
                'string.pattern.invalid': "Invalid phone number format. Please provide a valid Nigerian phone number."
            }),

            password: joi.string()
                .pattern(new RegExp("^(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$"))
                .required()
                .messages({
                    "any.required": "Password is required.",
                    "string.pattern.base":
                    "Password must contain at least 8 characters, one capital letter, and one special character (!@#$%^&*).",
                }),
        });

        
    return validateSchema.validate(data);
} catch (error) {
    return res.status(500).json({
        Error: "Error while validating user: " + error.message,
    })
}
}


const validateUserLogin = (data) => {
    try {
        const validateSchema = joi.object({
            businessEmail: joi.string().max(40).trim().email({ tlds: { allow: false } }).required().messages({
                'string.empty': "Email field can't be left empty",
                'any.required': "Please Email is required"
            }),
            password: joi.string().min(8).max(20).regex(/^[a-zA-Z0-9@#\$%\^&\*()_+\[\]{}\|;:\',\.\/<>?\`~!-]*$/).trim().required().messages({
                'string.empty': "Password field can't be left empty",
                'string.pattern.base': 'Password must contain Lowercase, Uppercase, Numbers, and special characters',
                'string.min': "Password must be at least 8 characters long",
                'any.required': "Please input your password"
            }),
        })
        return validateSchema.validate(data);
    } catch (error) {
        return res.status(500).json({
            Error: "Error while validating user: " + error.message,
        })
    }
}


const validateStaffLogin = (data) => {
    try {
        const validateSchema = joi.object({
            email: joi.string().max(40).trim().email({ tlds: { allow: false } }).required().messages({
                'string.empty': "Email field can't be left empty",
                'any.required': "Please provide email address"
            }),
            password: joi.string().min(8).max(20).regex(/^[a-zA-Z0-9@#\$%\^&\*()_+\[\]{}\|;:\',\.\/<>?\`~!-]*$/).trim().required().messages({
                'string.empty': "Password field can't be left empty",
                'string.min': "Password must be at least 8 characters long",
                'string.pattern.base': 'Password must contain Lowercase, Uppercase, Numbers, and special characters',
                'any.required': "Please provide password"
            }),
        })
        return validateSchema.validate(data);
    } catch (error) {
        return res.status(500).json({
            Error: "Error while validating user: " + error.message,
        })
    }
}


// List of popular domain names
const businessEmailPattern = /^(?:gmail|yahoo|outlook|hotmail|aol|icloud|mail|protonmail|zoho|yandex)\.com$/;

const validateForgotPassword = (data) => {
    try {
        const validateSchema = joi.object({
            businessEmail: joi.string().email({ tlds: { allow: false } }).pattern(businessEmailPattern).required().messages({
                'string.email': 'Please provide a valid business email address',
                'string.pattern.base': 'Please provide your business email address',
                'any.required': 'Email is required'
            }),
        })


        return validateSchema.validate(data);

    } catch (error) {
        throw new Error("Error while validating user: " + error.message)
    }
};

const validateresetPassword = (data) => {
    try {
        const validateSchema = joi.object({
            password: joi.string().min(8).max(20).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*()_+[\]{}|;:',./<>?`~!-])[A-Za-z\d@#$%^&*()_+[\]{}|;:',./<>?`~!-]{8,20}$/).trim().required().messages({
                'string.empty': "Password field can't be left empty",
                'string.min': "Password must be at least 8 characters long",
                'string.max': "Password can't exceed 20 characters",
                'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
                'any.required': "Please provide a password"
            }),
        });

        return validateSchema.validate(data);

    } catch (error) {
        throw new Error("Error while validating user: " + error.message)
    }
};


const validateChangePassword = (data) => {
    try {
        const validateSchema = joi.object({
            newPassword: joi.string().min(8).max(20).trim().required().messages({
                'string.pattern.base': "Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be 8-20 characters long",
                'string.empty': "Password field can't be left empty",
                'string.min': "Password must be at least 8 characters long",
                'any.required': "Please password field is required"
            }),
            confirmPassword: joi.string().min(8).max(20).regex(/^[a-zA-Z0-9@#\$%\^&\*()_+\[\]{}\|;:\',\.\/<>?\`~!-]*$/).trim().required().messages({
                'string.pattern.base': "Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be 8-20 characters long",
                'string.empty': "Password field can't be left empty",
                'string.min': "Password must be at least 8 characters long",
                'any.required': "Please password field is required"
            }),
        })


        return validateSchema.validate(data);

    } catch (error) {
        return res.status(500).json({
            Error: "Error while validating user: " + error.message,
        })
    }
}


const validateUpdateStaff = (data) => {
    try {
        const validateSchema = joi.object({
            fullName: joi.string().min(3).max(40).trim().regex(/^[a-zA-Z]+ [a-zA-Z]+$/).messages({
                "string.empty": "Full name field can't be left empty",
                "string.min": "Full name must be at least 3 characters long",
                "string.max": "Full name cannot exceed 40 characters",
                "string.pattern.base": "Full name must contain both first name and last name separated by a space",
            }),
            email: joi.string().max(40).trim().email({ tlds: { allow: false } }).messages({
                'string.empty': "Email field can't be left empty",

            }),
            phoneNumber: joi.string().min(11).max(11).trim().regex(/^0\d{10}$/).messages({
                'string.empty': "Phone number field can't be left empty",
                'string.min': "Phone number must be atleast 11 digit long e.g: 08123456789",
                'string.max': "Phone number must be at least 11 digit long e.g: 08123456789",
                'string.pattern.base': "Phone number must start with '0' followed by 10 digits (e.g., 08123456789)",
                'string.pattern.invalid': "Invalid phone number format. Please provide a valid Nigerian phone number."
            }),

            password: joi.string().min(8).max(20).regex(/^[a-zA-Z0-9@#\$%\^&\*()_+\[\]{}\|;:\',\.\/<>?\`~!-]*$/).trim().messages({
                'string.empty': "Password field can't be left empty",
                'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
                'string.min': "Password must be at least 8 characters long",
                'string.max': "Password cannot exceed 20 characters",
            }),
        })
        return validateSchema.validate(data);
    } catch (error) {
        throw new Error("Error while validating user: " + error.message)
    }
}

const validateUpdateStaffAdmin = (data) => {
    try {
        const validateSchema = joi.object({
            department: joi.string().min(3).max(30).trim().messages({
                'string.empty': "Department field can't be left empty",
                'string.min': "Department name must be at least 3 characters long",
                'string.max': "Department name cannot exceed 30 characters",

            }),
            role: joi.string().min(3).max(30).valid("admin", "hod", "cto", "manager", "team-lead", "hr", "employee").trim().messages({
                'string.empty': "Role field can't be left empty",
                'string.max': "Role cannot exceed 30 characters",

            }),

        })
        return validateSchema.validate(data);
    } catch (error) {
        throw new Error("Error while validating user: " + error.message)
    }
}



const validateperformanceRating = (data) => {
    try {
        const validateSchema = joi.object({
            TC: joi.number().integer().min(0).max(10).greater(-1).required().messages({
                'number.base': 'TC must be a number',
                'number.integer': 'TC must be an integer',
                'number.min': 'TC must be at least 0',
                'number.max': 'TC cannot be greater than 10',
                'number.greater': 'TC cannot be negative',
                'any.required': 'TC is required'
            }),
            TM: joi.number().integer().min(0).max(10).greater(-1).required().messages({
                'number.base': 'TM must be a number',
                'number.integer': 'TM must be an integer',
                'number.min': 'TM must be at least 0',
                'number.max': 'TM cannot be greater than 10',
                'number.greater': 'TM cannot be negative',

                'any.required': 'TM is required'
            }),
            QR: joi.number().integer().min(0).max(10).greater(-1).required().messages({
                'number.base': 'QR must be a number',
                'number.integer': 'QR must be an integer',
                'number.min': 'QR must be at least 0',
                'number.max': 'QR cannot be greater than 10',
                'number.greater': 'QR cannot be negative',

                'any.required': 'QR is required',

            }),
            CF: joi.number().integer().min(0).max(10).greater(-1).required().messages({
                'number.base': 'CF must be a number',
                'number.integer': 'CF must be an integer',
                'number.min': 'CF must be at least 0',
                'number.max': 'CF cannot be greater than 10',
                'number.greater': 'CF cannot be negative',
                'any.required': 'CF is required'



            }),
            DA: joi.number().integer().min(0).max(10).greater(-1).required().messages({
                'number.base': 'DA must be a number',
                'number.integer': 'DA must be an integer',
                'number.min': 'DA must be at least 0',
                'number.max': 'DA cannot be greater than 10',
                'number.greater': 'DQ cannot be negative',
                'any.required': 'DA is required'
            }),
            WQ: joi.number().integer().min(0).max(10).greater(-1).required().messages({
                'number.base': 'WQ must be a number',
                'number.integer': 'WQ must be an integer',
                'number.min': 'WQ must be at least 0',
                'number.max': 'WQ cannot be greater than 10',
                'number.greater': 'WQ cannot be negative',
                'any.required': 'WQ is required'
            })
        }).messages({
            'object.unknown': 'All performance ratings are required and must be integers between 0 and 10'
        });

        return validateSchema.validate(data);
    } catch (error) {
        return res.status(500).json({
            Error: "Error while validating user: " + error.message,
        })
    }
}


const validateInputSchema = (data) => {
    try {
        const validateSchema = joi.object({
            TC: joi.number().integer().min(0).max(10).required().messages({
                'number.base': 'TC must be a number',
                'number.min': 'TC must be at least 0',
                'number.max': 'TC must be at most 10',
                'any.required': 'TC is required',
                'number.integer': 'TC cannot contain decimals',
            }),
            TM: joi.number().integer().min(0).max(10).required().messages({
                'number.base': 'TM must be a number',
                'number.min': 'TM must be at least 0',
                'number.max': 'TM must be at most 10',
                'any.required': 'TM is required',
                'number.integer': 'TM cannot contain decimals',
            }),
            QR: joi.number().integer().min(0).max(10).required().messages({
                'number.base': 'QR must be a number',
                'number.min': 'QR must be at least 0',
                'number.max': 'QR must be at most 10',
                'any.required': 'QR is required',
                'number.integer': 'QR cannot contain decimals',
            }),
            CF: joi.number().integer().min(0).max(10).required().messages({
                'number.base': 'CF must be a number',
                'number.min': 'CF must be at least 0',
                'number.max': 'CF must be at most 10',
                'any.required': 'CF is required',
                'number.integer': 'CF cannot contain decimals',
            }),
            DA: joi.number().integer().min(0).max(10).required().messages({
                'number.base': 'DA must be a number',
                'number.min': 'DA must be at least 0',
                'number.max': 'DA must be at most 10',
                'any.required': 'DA is required',
                'number.integer': 'DA cannot contain decimals',
            }),
            WQ: joi.number().integer().min(0).max(10).required().messages({
                'number.base': 'WQ must be a number',
                'number.min': 'WQ must be at least 0',
                'number.max': 'WQ must be at most 10',
                'number.integer': 'WQ cannot contain decimals',
                'any.required': 'WQ is required',
            })
        })
        return validateSchema.validate(data)

    } catch (error) {
        throw new Error("Error while validating user: " + error.message)
    }
};








module.exports = {
    validateUser,
    validateUserLogin,
    validateStaffLogin,
    validateChangePassword,
    validateUpdateStaff,
    validateInputSchema,
    validateperformanceRating,
    validateForgotPassword,
    validateresetPassword,
    validateUpdateStaffAdmin

}
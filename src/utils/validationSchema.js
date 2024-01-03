import * as Yup from 'yup';
const validationSchema = Yup.object({
    full_name: Yup.string()
        .required('Full Name is required')
        .matches(/^[^\s!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/, 'Full Name should not contain any symbols or space')
        .test('no-spaces-around', 'Full Name should not have spaces around', (value) => {
            if (value) {
                return !/^\s|\s$/.test(value);
            }
            return true;
        }),
    contact_number: Yup.string()
        .required('Contact Number is required')
        .matches(/^\+\d{1} \(\d{3}\) \d{3}-\d{4}$/, 'Invalid Canadian phone number format (e.g., +1 (555) 123-4567)'), // Canadian phone number format
    email: Yup.string().matches(/^[\w\.-]+@[a-zA-Z\d-]+\.[a-zA-Z]{2,}$/, 'Invalid Email Address').required('Email is required'),

    day: Yup.number().required('Day is required').min(1).max(31),
    month: Yup.number().required('Month is required').min(1).max(12),
    year: Yup.number().required('Year is required').min(new Date().getFullYear()).integer(),

    password: Yup.string()
        .required('Password is required')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number, with a minimum length of 8 characters'),
    confirm_password: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
});
export default validationSchema;
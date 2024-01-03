import { Alert, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, Snackbar, TextField } from "@mui/material";
import { useFormik } from 'formik';
import validationSchema from '../utils/ValidationSchema';
import { submitForm } from "../utils/api";
import { useRef, useState } from "react";
import { isValid, parse } from "date-fns";
import { initialValues } from "../utils/initialValues";

const SNACKBAR_DURATION = 3000; // 3s

const SignUpForm = () => {
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const formRef = useRef()

    const formik = useFormik({
        initialValues,
        validationSchema,
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: (values) => handleSubmit(values),
    });

    const validateDate = (day, month, year) => {
        if (!day || !month || !year) return false
        const parsedDate = parse(`${year}-${month}-${day}`, 'yyyy-MM-dd', new Date());
        const isValidDate = isValid(parsedDate);
        return isValidDate;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        formik.setFieldValue(name, value);
        formik.setFieldError(name, null);
    };

    const handleSubmit = async (values) => {
        try {
            const isDateValid = validateDate(values.day, values.month, values.year);
            if (!isDateValid) {
                // Display an error message for invalid date
                formik.setFieldError('day', 'Invalid date');
                return;
            }
            setFormSubmitted(true); // Form has been submitted
            const data = await submitForm(values);
            if (data.title === 'Success') {
                setSubmitSuccess(true);
                setSubmitError(false);
                setTimeout(() => {
                    setSubmitSuccess(false);
                    handleCancel()
                },SNACKBAR_DURATION);
            } else {
                setSubmitError(true);
                setSubmitSuccess(false);
                setTimeout(() => setSubmitError(false), SNACKBAR_DURATION);
            }
        } catch (error) {
            console.error('Error:', error.message);
            setSubmitError(true);
            setSubmitSuccess(false);
            setTimeout(() => setSubmitError(false), SNACKBAR_DURATION);
        }
    };

    const requiredAsterisk = (filedName) => {
        return (<>{filedName}<span className="required-field">*</span></>);
    }

    const renderDays = () => {
        const daysArray = Array.from({ length: 31 }, (_, index) => (index + 1).toString());
        return daysArray.map((day) => (
            <MenuItem key={day} value={day}>
                {day}
            </MenuItem>
        ));
    };
    const renderMonths = () => {
        const months = [
            { value: "01", label: "January" },
            { value: "02", label: "February" },
            { value: "03", label: "March" },
            { value: "04", label: "April" },
            { value: "05", label: "May" },
            { value: "06", label: "June" },
            { value: "07", label: "July" },
            { value: "08", label: "August" },
            { value: "09", label: "September" },
            { value: "10", label: "October" },
            { value: "11", label: "November" },
            { value: "12", label: "December" },
        ];
        return months.map((month) => (
            <MenuItem key={month.value} value={month.value}>
                {month.label}
            </MenuItem>
        ));
    };
    const renderYears = () => {
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 10 }, (_, index) => currentYear + index);
        return years.map((year) => (
            <MenuItem key={year} value={year}>
                {year}
            </MenuItem>
        ));
    };

    const handleCancel = () => {
        formik.resetForm();
        setSubmitSuccess(false);
        setSubmitError(false);
    };

    return (
        <div className="form-container">
            <h1>Create User Account</h1>
            <form action="" onSubmit={formik.handleSubmit} ref={formRef}>
                <div className="fields-wrapper">
                    <div className="input-filed-wrapper">
                        <InputLabel className="label" htmlFor="full_name">Full Name</InputLabel>
                        <TextField
                            id="full_name"
                            name="full_name"
                            label={requiredAsterisk("Full Name")}
                            size="small"
                            value={formik.values.full_name}
                            onChange={handleChange}
                            onBlur={formik.handleBlur}
                            error={(formik.touched.full_name || formSubmitted) && Boolean(formik.errors.full_name)}
                            helperText={(formik.touched.full_name || formSubmitted) && formik.errors.full_name}
                            fullWidth
                        />
                    </div>

                    <div className="input-filed-wrapper">
                        <InputLabel className="label" htmlFor="contact_number">Contact Number</InputLabel>
                        <TextField
                            id="contact_number"
                            name="contact_number"
                            size="small"
                            label={requiredAsterisk("Contact Number")}
                            value={formik.values.contact_number}
                            onChange={handleChange}
                            onBlur={formik.handleBlur}
                            error={(formik.touched.contact_number || formSubmitted) && Boolean(formik.errors.contact_number)}
                            helperText={(formik.touched.contact_number || formSubmitted) && formik.errors.contact_number}
                            fullWidth
                        />
                    </div>

                    <div className="input-filed-wrapper">
                        <InputLabel className="label" htmlFor="day">
                            Birthdate
                        </InputLabel>
                        <div className="date-fields-wrapper">
                            <FormControl fullWidth>
                                <InputLabel htmlFor="day" style={{
                                    backgroundColor: '#FFFFFF', padding: `0 4px`, color: `${(!!formik.errors.day) ? '#DA1E28' : ''}`
                                }}>{requiredAsterisk("Day")}</InputLabel>
                                <Select
                                    id="day"
                                    name="day"
                                    size="small"
                                    value={formik.values.day}
                                    onChange={handleChange}
                                    onBlur={formik.handleBlur}
                                    error={(formik.touched.day || formik.errors.day) && Boolean(formik.errors.day)}
                                >
                                    {renderDays()}
                                </Select>
                                <FormHelperText error={(formik.touched.day || formik.errors.day) && Boolean(formik.errors.day)}>
                                    {(formik.touched.day || formik.errors.day) && formik.errors.day}
                                </FormHelperText>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="month" style={{
                                    backgroundColor: '#FFFFFF', padding: `0 4px`, color: `${(!!formik.errors.month) ? '#DA1E28' : ''}`
                                }}>{requiredAsterisk("Month")}</InputLabel>
                                <Select
                                    id="month"
                                    name="month"
                                    size="small"
                                    value={formik.values.month}
                                    className="month-select"
                                    onChange={handleChange}
                                    onBlur={formik.handleBlur}
                                    error={(formik.touched.month || formik.errors.month) && Boolean(formik.errors.month)}
                                >
                                    {renderMonths()}
                                </Select>
                                <FormHelperText error={(formik.touched.month || formik.errors.month) && Boolean(formik.errors.month)}>
                                    {(formik.touched.month || formik.errors.month) && formik.errors.month}
                                </FormHelperText>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="year" style={{
                                    backgroundColor: '#FFFFFF', padding: `0 4px`, color: `${(!!formik.errors.year) ? '#DA1E28' : ''}`
                                }}>{requiredAsterisk("Year")}</InputLabel>
                                <Select
                                    id="year"
                                    name="year"
                                    size="small"
                                    value={formik.values.year}
                                    onChange={handleChange}
                                    onBlur={formik.handleBlur}
                                    error={(formik.touched.year || formik.errors.year) && Boolean(formik.errors.year)}
                                >
                                    {renderYears()}
                                </Select>
                                <FormHelperText error={(formik.touched.year || formik.errors.year) && Boolean(formik.errors.year)}>
                                    {(formik.touched.year || formik.errors.year) && formik.errors.year}
                                </FormHelperText>
                            </FormControl>
                        </div>
                    </div>

                    <div className="input-filed-wrapper">
                        <InputLabel className="label" htmlFor="email">Email Address</InputLabel>
                        <TextField
                            id="email"
                            name="email"
                            size="small"
                            label={requiredAsterisk("Email")}
                            value={formik.values.email}
                            onChange={handleChange}
                            onBlur={formik.handleBlur}
                            error={(formik.touched.email || formSubmitted) && Boolean(formik.errors.email)}
                            helperText={(formik.touched.email || formSubmitted) && formik.errors.email}
                            fullWidth
                        />
                    </div>

                    <div className="input-filed-wrapper">
                        <InputLabel className="label" htmlFor="password">Password</InputLabel>
                        <TextField
                            id="password"
                            name="password"
                            type="password"
                            size="small"
                            label={requiredAsterisk("Password")}
                            value={formik.values.password}
                            onChange={handleChange}
                            onBlur={formik.handleBlur}
                            error={(formik.touched.password || formSubmitted) && Boolean(formik.errors.password)}
                            helperText={(formik.touched.password || formSubmitted) && formik.errors.password}
                            fullWidth
                        />
                    </div>

                    <div className="input-filed-wrapper">
                        <InputLabel className="label" htmlFor="confirm_password">Confirm Password</InputLabel>
                        <TextField
                            id="confirm_password"
                            name="confirm_password"
                            type="password"
                            size="small"
                            label={requiredAsterisk("Confirm Password")}
                            value={formik.values.confirm_password}
                            onChange={handleChange}
                            onBlur={formik.handleBlur}
                            error={(formik.touched.confirm_password || formSubmitted) && Boolean(formik.errors.confirm_password)}
                            helperText={(formik.touched.confirm_password || formSubmitted) && formik.errors.confirm_password}
                            fullWidth
                        />
                    </div>

                    <div className="alert-message-wrapper">
                        <Snackbar open={submitSuccess} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                            <Alert severity="success" style={{ width: '100%', fontFamily: 'Lato', fontWeight: 700 }}>
                                User account successfully created
                            </Alert>
                        </Snackbar>
                        <Snackbar open={submitError} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                            <Alert severity="error" style={{ width: '100%', fontFamily: 'Lato', fontWeight: 700 }}>
                                There was an error creating the account.
                            </Alert>
                        </Snackbar>
                    </div>
                </div>
                <div className="buttons-wrapper">
                    <div className="button-container">
                        <Button type="reset" variant="outlined" size="large" className="btn outline" onClick={handleCancel} >
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" size="large" className="btn solid">
                            Submit
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
export default SignUpForm;
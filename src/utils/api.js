const URL = import.meta.env.VITE_SERVER_URL || "https://fullstack-test-navy.vercel.app";
export const submitForm = async (formValues) => {
    try {
        const response = await fetch(`${URL}/api/users/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                full_name: formValues.full_name,
                contact_number: formValues.contact_number,
                email: formValues.email,
                date_of_birth: `${formValues.year}-${formValues.month}-${formValues.day}`,
                password: formValues.password,
            }),
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            const errorData = await response.json();
            throw new Error(`Error: ${errorData.title} - ${errorData.description}`);
        }
    } catch (error) {
        console.error('API Error:', error.message);
        throw new Error('An error occurred while processing the request.');
    }
};

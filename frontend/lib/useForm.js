import {useState} from 'react';

export default function useForm(initial = {}) {
    const [inputs, setInputs] = useState(initial);


    function handleChange(event) {
        let {value, name, type} = event.target;

        if (type == 'number')
            value = parseInt(value);

        if (type == 'file')
            value[0] = event.target.files;

        setInputs({
            ...inputs,
            [name]: value
        });
    }

    function resetForm() {
        setInputs(initial);
    }

    function clearForm() {
        const blankState = Object.entries(inputs).map(([key, value]) => [key, ''])
        setInputs(Object.fromEntries(blankState));
    }

    return {
        inputs,
        handleChange,
        resetForm,
        clearForm
    }
}

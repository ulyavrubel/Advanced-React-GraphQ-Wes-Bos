import useForm from '../lib/useForm';

export default function CreateProduct() {
    const {inputs, handleChange, clearForm, resetForm} = useForm({
        name: 'nice shoes',
        price: 545,
        description: 'really nice'
    });

    return (
        <form>
            <label htmlFor='name'>
                Name
                <input
                    type='text'
                    value={inputs.name}
                    id='name'
                    name='name'
                    placeholder='name'
                    onChange={handleChange}
                />
            </label>
            <label htmlFor='price'>
                Price
                <input
                    type='number'
                    value={inputs.price}
                    id='price'
                    name='price'
                    placeholder='price'
                    onChange={handleChange}
                />
            </label>
            <label htmlFor='description'>
                Description
                <input
                    type='text'
                    value={inputs.description}
                    id='description'
                    name='description'
                    placeholder='description'
                    onChange={handleChange}
                />
            </label>
            <button type='button' onClick={clearForm}>
                Clear Form
            </button>
            <button type='button' onClick={resetForm}>
                Reset Form
            </button>
        </form>
    );
}

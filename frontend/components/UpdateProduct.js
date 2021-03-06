import {gql, useMutation, useQuery} from '@apollo/client';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
import Form from './styles/Form';

const SINGLE_PRODUCT_QUERY = gql`
    query SINGLE_PRODUCT_QUERY($id: ID!) {
        Product(where: {id: $id}) {
            id
            name
            description
            price
        }
    }
`;

const UPDATE_PRODUCT_MUTATION = gql`
    mutation UPDATE_PRODUCT_MUTATION(
        $id: ID!
        $name: String
        $description: String
        $price: Int
    ) {
        updateProduct(
            id: $id
            data: {
                name: $name,
                description: $description,
                price: $price
            }
        ) {
            id
            name
            description
            price
        }
    }
`;

export default function UpdateProduct({id}) {
    const {data, loading, error} = useQuery(SINGLE_PRODUCT_QUERY, {
        variables: {id}
    });

    const [updateProduct, {
        data: updateData,
        error: updateError,
        loading: updateLoading
    }] = useMutation(UPDATE_PRODUCT_MUTATION);

    const {inputs, handleChange, clearForm, resetForm} = useForm(data?.Product);

    async function handleSubmit(event) {
        event.preventDefault();

        const response = await updateProduct({
            variables: {
                id,
                name: inputs.name,
                description: inputs.description,
                price: inputs.price
            }
        });
    }

    if (loading)
        return <p>...Loading</p>;
    if (error)
        return <DisplayError error={errror}/>;

    return (
        <Form onSubmit={handleSubmit}>
            <DisplayError error={error || updateError}/>
            <fieldset disabled={updateLoading} aria-busy={updateLoading}>
                <label htmlFor='name'>
                    Name
                    <input
                        type='text'
                        value={inputs?.name || ''}
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
                        value={inputs?.price || ''}
                        id='price'
                        name='price'
                        placeholder='price'
                        onChange={handleChange}
                    />
                </label>
                <label htmlFor='description'>
                    Description
                    <textarea
                        value={inputs?.description || ''}
                        id='description'
                        name='description'
                        placeholder='description'
                        onChange={handleChange}
                    />
                </label>
                <button type='submit'>
                    Update Product
                </button>
            </fieldset>
        </Form>
    );
}

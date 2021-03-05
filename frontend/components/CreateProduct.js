import useForm from '../lib/useForm';
import gql from 'graphql-tag'
import Form from './styles/Form';
import {useMutation} from '@apollo/client';
import DisplayError from './ErrorMessage';
import {ALL_PRODUCTS_QUERY} from './Products';
import Router from 'next/router';

const CREATE_PRODUCT_MUTATION = gql`
    mutation CREATE_PRODUCT_MUTATION(
        #which variables are getting passed in and what types are they
        $name: String!
        $description: String!
        $price: Int!
        $image: Upload
    ) {
        createProduct(data: {
            name:  $name,
            description: $description,
            price: $price,
            status: "AVAILABLE",
            photo: {
                create: {
                    image: $image,
                    altText: $name
                }
            }
        }) {
            id
            price
            description
            name
        }
    }
`;

export default function CreateProduct() {
    const {inputs, handleChange, clearForm, resetForm} = useForm({
        name: 'nice shoes',
        price: 545,
        description: 'really nice'
    });
    const [createProduct, {data, error, loading}] = useMutation(CREATE_PRODUCT_MUTATION)

    async function handleSubmit(event) {
        event.preventDefault();

        const response = await createProduct({
            variables: inputs,
            refetchQueries: [{query: ALL_PRODUCTS_QUERY}]
        })
        clearForm();

        //go to product's page
        Router.push({
            pathname: `/product/${response.data.createProduct.id}`
        })
    }

    return (
        <Form onSubmit={handleSubmit}>
            <DisplayError error={error}/>
            <fieldset disabled={loading} aria-busy={loading}>
                <label htmlFor='image'>
                    Image
                    <input
                        type='file'
                        id='image'
                        name='image'
                        onChange={handleChange}
                        required
                    />
                </label>
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
                    <textarea
                        value={inputs.description}
                        id='description'
                        name='description'
                        placeholder='description'
                        onChange={handleChange}
                    />
                </label>
                <button type='submit'>
                    +Add products
                </button>
            </fieldset>
        </Form>
    );
}

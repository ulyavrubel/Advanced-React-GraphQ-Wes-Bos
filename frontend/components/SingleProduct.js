import {gql, useQuery} from '@apollo/client'
import DisplayError from './ErrorMessage';
import Head from 'next/head';
import styled from 'styled-components';

const ProductStyles = styled.div`
    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    max-width: var(--maxWidth);
    align-items: top;
    gap: 2rem;
    img {
        width: 100%;
        object-fit: contain;
    }
`;

export const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!) {
        Product(where: {
            id: $id
        }) {
            name
            price
            description
            id
            photo {
                image {
                    publicUrlTransformed
                }
                altText
            }
        }
    }
`;

export default function SingleProduct({id}) {
    const {data, loading, error} = useQuery(SINGLE_ITEM_QUERY, {
        variables: {id}
    });

    if (loading)
        return <p>...Loading</p>;
    if (error)
        return <DisplayError error={errror}/>;

    const {Product: product} = data;

    return (
        <ProductStyles>
            <Head>
                <title>
                    Sick fits | {product.name}
                </title>
            </Head>
            <img
                src={product.photo.image.publicUrlTransformed}
                alt={product.photo.altText}
            />
            <div className='datails'>
                <h2>{product.name}</h2>
                <p>{product.description}</p>
            </div>
        </ProductStyles>
    );
}

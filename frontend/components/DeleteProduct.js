import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const DELETE_PRODUCT_MUTATION = gql`
    mutation DELETE_PRODUCT_MUTATION($id: ID!) {
        deleteProduct(id: $id) {
            id
            name
        }
    }
`;

function update(cache, payload) {
    //You can remove any normalized object from the cache using the evict method:
    // identify Returns the canonical ID for a specified cached object.
    cache.evict(cache.identify(payload.data.deleteProduct))
}

export default function DeleteProduct({id, children}) {
    const [deleteProduct, {loading, error}] = useMutation(DELETE_PRODUCT_MUTATION, {
        variables: {id},
        update
    });

    function handleDelete() {
        if (confirm('Are you sure you want to delete it?'))
            deleteProduct()
                .catch(error => alert(error.message))
    }

    return <button
        type='button'
        onClick={handleDelete}
        disabled={loading}
    >
        {children}
    </button>;
}

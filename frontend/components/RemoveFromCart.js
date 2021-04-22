import { gql, useMutation } from "@apollo/client";
import styled from "styled-components";
import { CURRENT_USER_QUERY } from "./User";

const REMOVE_FROM_CART_MUTATION = gql`
    mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
        deleteCartItem(id: $id) {
            id
        }
    }
`;

const BigButton = styled.button`
    font-size: 3rem;
    background: none;
    border: 0;
    &:hover {
        background: red;
    }
`;

export default function RemoveFromCart({id}) {
    const [deleteCartItem, {loading}] = useMutation(REMOVE_FROM_CART_MUTATION, {
        variables: {id}
    });

    return (
        <BigButton disabled={loading} onClick={deleteCartItem}>
            &times;
        </BigButton>
    )
}

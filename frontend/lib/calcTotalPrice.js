import { useReducer } from "react/cjs/react.production.min";

export default function calcTotalPrice(cart) {
    return cart.reduce((total, cartItem) => {
        if (!cartItem.product)
            return total;
        return total + cartItem.quantity * cartItem.product.price
    }, 0)
}

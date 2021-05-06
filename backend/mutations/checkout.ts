import {KeystoneContext} from "@keystone-next/types";
import {CartItemCreateInput, OrderCreateInput} from "../.keystone/schema-types";
import { stripeConfig } from "../lib/stripe";

interface Arguments {
    token: string
}

const graphql = String.raw;

export default async function checkout(
    root: any,
    {token}: Arguments,
    context: KeystoneContext
): Promise<OrderCreateInput> {
    // 1. make sure they are signed in
    const userId = context.session.itemId;

    if (!userId)
        throw new Error('Sorry, you must be signed to create an order!');

    // 1.5 query the current user
    const user = await context.lists.User.findOne({
        where: {id: userId},
        resolveFields: graphql`
            id
            name
            email
            cart {
                id
                quantity
                product {
                    name
                    price
                    description
                    id
                    photo {
                        id
                        image {
                            id
                            publicUrlTransformed
                        }
                    }
                }
            }
        `
    });

    // 2. calculate the total price of the cart
    const cartItems = user.cart.filter(cartItem => cartItem.product);
    const amount = cartItems.reduce(
        (tally: number, cartItem: CartItemCreateInput) => tally + cartItem.quantity * cartItem.product.price,
        0
    );

    // 3. create the charge with stripe lib
    const charge = await stripeConfig.paymentIntents.create({
        amount,
        currency: 'USD',
        confirm: true,
        payment_method: token
    })
        .catch(error => {
            console.log(error);
            throw new Error(error.message);
        })

    // 4. convert the CartItems to OrderItems
    // 5. Create the order and return it

    return null;
}

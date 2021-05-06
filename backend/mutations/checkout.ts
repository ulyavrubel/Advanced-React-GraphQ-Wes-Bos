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
    const orderItems = cartItems.map(cartItem => ({
        name: cartItem.product.name,
        description: cartItem.product.description,
        price: cartItem.product.price,
        quantity: cartItem.quantity,
        photo: {connect: {id: cartItem.product.photo.id}}
    }));

    // 5. Create the order and return it
    const order = await context.lists.Order.createOne({
        data: {
            total: charge.amount,
            charge: charge.id,
            items: {create: orderItems},
            user: {connect: {id: userId}}
        }
    });

    // 6. clean up any old cart items
    const cartItemIds = user.cart.map(({id}) => id);
    await context.lists.CartItem.deleteMany({ids: cartItemIds});

    console.log(order);

    return order;
}

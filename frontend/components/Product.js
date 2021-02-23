import {ItemStyles} from './styles/ItemStyles';

export default function Product({product}) {
    return (
        <ItemStyles>
            {product.name}
        </ItemStyles>
    );
}

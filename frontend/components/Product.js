import Link from 'next/link';
import {ItemStyles} from './styles/ItemStyles';
import Title from './styles/Title';
import PriceTag from './styles/PriceTag';
import formatMoney from '../lib/formatMoney';
import DeleteProduct from './DeleteProduct';

export default function Product({product}) {
    const {id, name, price, description} = product;
    return (
        <ItemStyles>
            <img src={product?.photo?.image?.publicUrlTransformed} alt={product.name}/>
            <Title>
                <Link href={`/product/${id}`}>{name}</Link>
            </Title>
            <PriceTag>
                {formatMoney(price)}
            </PriceTag>
            <p>
                {description}
            </p>
            <div className='buttonList'>
                <Link href={{
                    pathname: 'update',
                    query: {
                        id: product.id
                    }
                }}>
                    Edit
                </Link>
                <DeleteProduct id={id}>
                    Delete
                </DeleteProduct>
            </div>
        </ItemStyles>
    );
}

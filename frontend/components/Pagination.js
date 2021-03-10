import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';
import DisplayError from './ErrorMessage';
import PaginationStyles from './styles/PaginationStyles';
import {perPage} from '../config';

export const PAGINATION_QUERY = gql`
    query PAGINATION_QUERY {
        _allProductsMeta {
            count
        }
    }
`;

export default function Pagination({page}) {
    const {data, error, loading} = useQuery(PAGINATION_QUERY);

    if (loading)
        return <p>...Loading</p>;

    if (error)
        return <DisplayError error={errror}/>;

    const {count} = data._allProductsMeta;
    const pageCount = Math.ceil(count / perPage);

    return <PaginationStyles>
        <Head>
            <title>Sick Fits - Page {page} of __</title>
        </Head>
            <Link href={`/products/${page - 1}`}>
                <a aria-disabled={page <= 1}>
                    &#8592; Prev
                </a>
            </Link>
            <p>
                Page {page} of {pageCount}
            </p>
            <p>
                {count} Items Total
            </p>
        <Link href={`/products/${page + 1}`}>
            <a aria-disabled={page >= pageCount}>
                &#8594; Next
            </a>
        </Link>
    </PaginationStyles>;
}

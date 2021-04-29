import { gql, useLazyQuery } from '@apollo/client';
import { resetIdCounter, useCombobox } from 'downshift';
import { debounce } from 'lodash';
import {DropDown, DropDownItem, SearchStyles} from './styles/DropDown';

const SEARCH_PRODUCTS_QUERY = gql`
    query SEARCH_PRODUCTS_QUERY($searchTerm: String!) {
        searchTerms: allProducts(
            where: {
               OR: [
                    {name_contains_i: $searchTerm},
                    {description_contains_i: $searchTerm}
               ]
            }
        ) {
            id
            name
            photo {
                image {
                    publicUrlTransformed
                }
            }
        }
    }
`;

export default function Search() {
    const [findItems, {loading, data, error}] = useLazyQuery(
        SEARCH_PRODUCTS_QUERY,
        {fetchPolicy: 'no-cache'}
    );

    const items = data?.searchTerms || [];

    const findItemsButChill = debounce(findItems, 350);

    resetIdCounter();

    console.log(data);

    const {inputValue, getMenuProps, getInputProps, getComboboxProps} = useCombobox({
        items: [],
        onInputValueChange({inputValue}) {
            findItemsButChill({
                variables: {
                    searchTerm: inputValue
                }
            });
        },
        onSelectedItemChange() {
            console.log('item changed')
        }
    });

    return (
        <SearchStyles>
            <div {...getComboboxProps()}>
                <input
                    {...getInputProps({
                        type: 'search',
                        placeholder: 'Search for an Item',
                        id: 'search',
                        className: loading ? 'loading' : ''
                    })}
                />
            </div>
            <DropDown {...getMenuProps()}>
                {
                    items.map(item =>
                        <DropDownItem>
                            <img
                                src={item.photo.image.publicUrlTransformed}
                                alt={item.name}
                                width='50'
                            />
                            {item.name}
                        </DropDownItem>
                    )
                }
            </DropDown>
        </SearchStyles>
    )
}

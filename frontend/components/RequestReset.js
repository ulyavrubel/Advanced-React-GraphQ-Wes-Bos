import {gql, useMutation} from '@apollo/client';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import {CURRENT_USER_QUERY} from './User';
import DisplayError from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
    mutation REQUEST_RESET_MUTATION(
        $email: String!
    ) {
        sendUserPasswordResetLink(email: $email) {
            code
            message
        }
    }
`;

export default function RequestReset() {
    const {inputs, handleChange, resetForm} = useForm({
        email: ''
    });

    const [requestReset, {data, loading, error}] = useMutation(REQUEST_RESET_MUTATION, {
        variables: inputs
    })

    async function submit(event) {
        event.preventDefault();

        const res = await requestReset()
            .catch(console.error);

        resetForm();
    }

    if (!inputs || loading)
        return <p>...Loading</p>;

    return (
        <Form method='POST' onSubmit={submit}>
            <h2>Request a password reset</h2>
            <DisplayError error={error}/>
            <fieldset>
                {
                    data?.sendUserPasswordResetLink === null &&
                        <p>Success! chack ypur email for the link</p>
                }
                <label htmlFor='email'>
                    Email
                    <input
                        type='email'
                        name='email'
                        placeholder='Your Email Address'
                        autoComplete='email'
                        value={inputs.email}
                        onChange={handleChange}
                    />
                </label>
                <button type='submit'>
                    Request reset
                </button>
            </fieldset>
        </Form>
    );
}

import {gql, useMutation} from '@apollo/client';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import {CURRENT_USER_QUERY} from './User';
import DisplayError from './ErrorMessage';

const RESET_MUTATION = gql`
    mutation RESET_MUTATION(
        $email: String!
        $token: String!
        $password: String!
    ) {
        redeemUserPasswordResetToken(
            email: $email
            token: $token
            password: $password
        ) {
            code
            message
        }
    }
`;

export default function Reset({token}) {
    const {inputs, handleChange, resetForm} = useForm({
        email: '',
        password: ''
    });

    const [resetPassword, {data, loading, error}] = useMutation(RESET_MUTATION, {
        variables: {...inputs, token}
    })

    async function submit(event) {
        event.preventDefault();

        const res = await resetPassword(inputs)
            .catch(console.error);

        resetForm();
    }

    const errorMessage = data?.redeemUserPasswordResetToken?.code
        ? {message: data.redeemUserPasswordResetToken.code}
        : undefined;

    console.log(error);

    if (!inputs || loading)
        return <p>...Loading</p>;

    return (
        <Form method='POST' onSubmit={submit}>
            <h2>Reset your password</h2>
            <DisplayError error={error || errorMessage}/>
            <fieldset>
                {
                    data?.redeemUserPasswordResetToken === null &&
                        <p>You can now sign in</p>
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
                <label htmlFor='password'>
                    Password
                    <input
                        type='password'
                        name='password'
                        placeholder='Password'
                        autoComplete='password'
                        value={inputs.password}
                        onChange={handleChange}
                    />
                </label>
                <button type='submit'>
                    Update password
                </button>
            </fieldset>
        </Form>
    );
}

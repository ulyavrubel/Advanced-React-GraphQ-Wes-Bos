import {gql, useMutation} from '@apollo/client';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import {CURRENT_USER_QUERY} from './User';
import DisplayError from './ErrorMessage';

const SIGNUP_MUTATION = gql`
    mutation SIGNUP_MUTATION(
        $email: String!,
        $name: String!,
        $password: String!
    ) {
        createUser(data: {
            email: $email,
            name: $name,
            password: $password
        }) {
            id
            email
            name
        }
    }
`;

export default function SignUp() {
    const {inputs, handleChange, resetForm} = useForm({
        email: '',
        password: '',
        name: ''
    });

    const [signup, {data, loading, error}] = useMutation(SIGNUP_MUTATION, {
        variables: inputs
        // refetchQueries: [{
        //     query: CURRENT_USER_QUERY
        // }]
    })

    async function submit(event) {
        event.preventDefault();

        const res = await signup()
            .catch(console.error);

        resetForm();
    }

    if (!inputs || loading)
        return <p>...Loading</p>;

    return (
        <Form method='POST' onSubmit={submit}>
            <h2>Sign Up for an Account</h2>
            <DisplayError error={error}/>
            <fieldset>
                {
                    data?.createUser &&
                        <p>Signed up with {data.createUser.email} - Please go ahead and sign in</p>
                }
                <label htmlFor='email'>
                    Your name
                    <input
                        name='name'
                        placeholder='Your Name'
                        autoComplete='name'
                        value={inputs.name}
                        onChange={handleChange}
                    />
                </label>
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
                    Sign Up
                </button>
            </fieldset>
        </Form>
    );
}

import Page from '../components/Page';
import Router from 'next/router';
import NProgress from 'nprogress';
import '../components/styles/nprogress.css'
import {ApolloProvider} from '@apollo/client'
import withData from '../lib/withData';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps, apollo}) {
    return (
        <ApolloProvider client={apollo}>
            <Page>
                <Component {...pageProps}/>
            </Page>
        </ApolloProvider>
    );
}

//if component uses getInitialProps method, component should wait data fetching

MyApp.getInitialProps = async function({Component, ctx}) {
    let pageProps = {};
    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }

    pageProps.query = ctx.query;
    return {pageProps};
}

export default withData(MyApp);

import Document, {Html, Head, NextScript, Main} from 'next/document';
import {ServerStyleSheet} from 'styled-components';

export default class MyDocument extends Document {
    //load css before everything else
    static getInitialProps({renderPage}) {
        const sheet = new ServerStyleSheet();
        const page = renderPage(App => props => sheet.collectStyles(<App {...props}/>));
        const styleTags = sheet.getStyleElement();

        return { ...page, styleTags}
    }

    render() {
        return (
        <Html>
            <Head/>
            <body>
            <Main />
            <NextScript />
            </body>
        </Html>
        );
    }
}

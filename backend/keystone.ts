import 'dotenv/config';
import {config, createSchema} from '@keystone-next/keystone/schema';
import {createAuth} from '@keystone-next/auth';
import {User} from './schemas/User';
import {Product} from './schemas/Product';
import {ProductImage} from './schemas/ProductImage';
import {CartItem} from './schemas/CartItem';
import {OrderItem} from './schemas/OrderItem';
import {Order} from './schemas/Order';
import {Role} from './schemas/Role';
import {withItemData, statelessSessions} from '@keystone-next/keystone/session'
import {insertSeedData} from './seed-data';
import {sendPasswordResetEmail} from './lib/mail';
import {extendGraphqlSchema} from './mutations/index';
import { permissionsList } from './schemas/fields';

const databaseURL = process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits-tutorial';

const sessionConfig = {
    maxAge: 60 * 60 * 24 * 360, //how long they can be logged in
    secret: process.env.COOKIE_SECRET
}

const {withAuth} = createAuth({
    listKey: 'User',
    identityField: 'email',
    secretField: 'password',
    initFirstItem: {
        fields: ['name', 'email', 'password'],
        //TODO add in initial roles here
    },
    passwordResetLink: {
        async sendToken(args) {
            await sendPasswordResetEmail(args.token, args.identity)
        }
    }
})

export default withAuth(
    config({
        server: {
            cors: {
                origin: [process.env.FRONTEND_URL],
                credentials: true,
            }
        },
        db: {
            adapter: 'mongoose',
            url: databaseURL,

            async onConnect(keystone) {
                if (process.argv.includes('--seed-data'))
                    await insertSeedData(keystone);
            }
        },
        lists: createSchema({
            //chema items go in here
            User,
            Product,
            ProductImage,
            CartItem,
            OrderItem,
            Order,
            Role
        }),
        extendGraphqlSchema,
        ui: {
            //TODO show the UI only who pass this test
            isAccessAllowed: ({session}) => {
                return !!session?.data;
            }
        },
        session: withItemData(statelessSessions(sessionConfig), {
            //GrpahQL query
            User: `
                id
                name
                email
                role { ${permissionsList.join(' ')} }
            `
        })
    })
);

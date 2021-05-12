import { ListAccessArgs } from "./types";
import {permissionsList} from './schemas/fields';

export function isSignedIn({session}: ListAccessArgs) {
    return !!session;
}

const generatedPermissions = Object.fromEntries(
    permissionsList.map(permission => [
        permission,
        ({session}: ListAccessArgs) => !!session?.data.role?.[permission]
    ])
);

export const permissions = {
    ...generatedPermissions
};

export const rules = {
    canManageProducts({session}: ListAccessArgs) {
        // if (!isSignedIn(session)) {
        //     return false;
        // }
        //1. Do they have a permission of canManageProducts
        if (permissions.canManageProducts({session})) {
            return true;
        }

        //2. If not do they own this item?
        return {user: {id: session.itemId}};
    },
    canReadProducts({session}: ListAccessArgs) {
        // if (!isSignedIn(session)) {
        //     return false;
        // }

        if (permissions.canManageProducts({session})) {
            return true;
        }

        return {status: 'AVAILABLE'}
    },
    canOrder({session}: ListAccessArgs) {
        // if (!isSignedIn(session)) {
        //     return false;
        // }

        if (permissions.canManageCart({session})) {
            return true;
        }

        return {user: {id: session.itemId}};
    },
    canManageOrderItems({session}: ListAccessArgs) {
        // if (!isSignedIn(session)) {
        //     return false;
        // }

        if (permissions.canManageCart({session})) {
            return true;
        }

        return {order: {user: {id: session.itemId}}};
    },
    canManageUsers({session}: ListAccessArgs) {
        // if (!isSignedIn(session)) {
        //     return false;
        // }

        if (permissions.canManageUsers({session})) {
            return true;
        }
        //2. otherwise they can only udate themselves
        return {id: session.itemId};
    }
}

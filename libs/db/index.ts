import * as cartItem from "./cartItem"
import * as image from "./image"
import * as language from "./language"
import * as order from "./order"
import * as product from "./product"
import * as _custom from "./_custom"
import * as productGroup from "./productGroup"
import * as serviceKey from "./serviceKey"
import * as store from "./store"
import * as systemVerifyKey from "./systemVerifyKey"
import * as user from "./user"
import * as userVerifyKey from "./userVerifyKey"

export const AppDB = {
    _custom,
    cartItem,
    image,
    language,
    order,
    product,
    productGroup,
    serviceKey,
    store,
    systemVerifyKey,
    user,
    userVerifyKey
}

export type AppDB_Types = {
    cartItem: cartItem.models,
    image: image.models,
    language: language.models,
    order: order.models,
    product: product.models,
    productGroup: productGroup.models,
    serviceKey: serviceKey.models,
    store: store.models,
    systemVerifyKey: systemVerifyKey.models,
    user: user.models,
    userVerifyKey: userVerifyKey.models
}
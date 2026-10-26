import { API_Client_staff_Admin } from "./admin"
import * as order from "./order/client"
import * as userVerifyKey from "./userVerifyKey/client"

export const API_Client_Staff = {
    admin: API_Client_staff_Admin,
    order,
    userVerifyKey
}
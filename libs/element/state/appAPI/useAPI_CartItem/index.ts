import { API_Client } from "@/app/api/app/client";
import { AppDB_Types } from "@/libs/db";
import { useState } from "react";
import { useAPI } from "../../useAPI";

export function useAPI_CartItem() {
    const [cartItem, setCartItem] = useState<AppDB_Types["cartItem"]["model"][]>([]);
    const { waiting, request } = useAPI(async () => {
        const res = await API_Client.user.cartItem.get();
        // if (res?.body) setCartItem(res.body.data);
    })
    const add = useAPI(async (productId: string, count: number) => {
        const res = await API_Client.user.cartItem.add({
            productId,
            count
        });
        setCartItem((prev) => {
            if (!res?.body.success) return prev;
            const index = prev.findIndex((item) => item.id === productId);
            if (index !== -1) {
                const newCartItem = [...prev];
                newCartItem[index] = res.body.data;
                return newCartItem;
            } else {
                return [...prev, res.body.data];
            }
        });
    });
    const remove = useAPI(async (id: string) => {
        const res = await API_Client.user.cartItem.remove(id);
        setCartItem((prev) => {
            if (!res?.body.success) return prev;
            return prev.filter((item) => item.id !== id);
        });
    });
    const update = useAPI(async (id: string, count: number) => {
        const res = await API_Client.user.cartItem.update(id, { count });
        setCartItem((prev) => {
            if (!res?.body.success) return prev;
            return prev.filter((item) => item.id !== id);
        });
    });

    return {
        add,
        update,
        remove,
        
        cartItem,
        waiting,
        request
    }
}
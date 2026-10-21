import { api_client_req } from "@/app/api/app/client";
import { AppAPI_staff_admin_Image_Map } from "./route";

const imageEndpoint = "/api/app/staff/admin/image";

export function getAll() {
	return api_client_req<AppAPI_staff_admin_Image_Map, "GET">
		(imageEndpoint, "GET", undefined, undefined);
}

export function add(img: File) {
    const form = new FormData();
    form.set("file", img);

	return api_client_req<AppAPI_staff_admin_Image_Map, "POST">
		(imageEndpoint, "POST", undefined, form);
}

export * from "./[id]/client"
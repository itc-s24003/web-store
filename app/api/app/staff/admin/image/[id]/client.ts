import { api_client_req } from "@/app/api/app/client";
import { AppAPI_staff_admin_Image__id__Map } from "./route";

/** 管理者 API から画像を削除する。 */
export function deleteImage(id: string) {
	return api_client_req<AppAPI_staff_admin_Image__id__Map, "DELETE">(
		`/api/app/staff/admin/image/${id}`,
		"DELETE",
		undefined,
		undefined
	);
};

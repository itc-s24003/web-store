import { app_api_response_error } from "@/app/api/app/api";
import { NextResponse } from "next/server";

export const errorResponse = {
    BadRequest: NextResponse.json<app_api_response_error>({success: false, error: "リクエストに問題があります"}, {status: 400}),
    Unauthorized: NextResponse.json<app_api_response_error>({success: false, error: "認証されていません"}, {status: 401}),
    Forbidden: NextResponse.json<app_api_response_error>({success: false, error: "権限がありません"}, {status: 403}),
    NotFound: NextResponse.json<app_api_response_error>({success: false, error: "コンテンツが見つかりませんでした"}, {status: 404}),
    ServerError: NextResponse.json<app_api_response_error>({success: false, error: "サーバーでエラーが発生しました"}, {status: 500})
}
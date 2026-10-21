import { HTTP_METHOD } from "next/dist/server/web/http";

export type app_api_response<response> = {
    success: true;
    data: response

} | app_api_response_error;


export type app_api_response_error = {
    success: false;
    error: string;
}



type app_api_doc = {
    req: {
        params: Record<string,
            string | string[] |
            number | number[] |
            boolean | boolean[] |
            Date | Date[] |
            undefined | undefined[]
        > | undefined;
        body: unknown | undefined
    };
    res: app_api_response;
}


export type app_api_map = {
    [key in HTTP_METHOD]?: app_api_doc
}

export type app_api_map_gen<map extends app_api_map> = map;


export type app_api_response_get<api_map extends app_api_map, type extends keyof api_map> = api_map[type]["res"]

export type app_api_request_get<api_map extends app_api_map, type extends keyof api_map> = api_map[type]["req"]





export type api_url_param = Record<string, string>

export type api_url_param_gen<params extends api_url_param> = {
    params: Promise<params>
}


export type api_url_param_id = api_url_param_gen<{
    id: string
}>
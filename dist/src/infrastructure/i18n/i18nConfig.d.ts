export declare const configureI18n: () => Promise<import("express-serve-static-core").Handler>;
export declare const translateErrorMessage: (key: string, options: Record<string, any> | undefined, req: any) => any;
export declare const useTranslation: (lng?: string) => {
    t: (key: string, options?: Record<string, any>) => string | import("i18next/typescript/helpers").$SpecialObject | import("i18next").TFunctionDetailedResult<string | import("i18next/typescript/helpers").$SpecialObject, Record<string, any>>;
    i18n: import("i18next").i18n;
    changeLanguage: (newLng: string) => Promise<import("i18next").TFunction<"translation", undefined>>;
};
declare const _default: {
    configureI18n: () => Promise<import("express-serve-static-core").Handler>;
    translateErrorMessage: (key: string, options: Record<string, any> | undefined, req: any) => any;
    useTranslation: (lng?: string) => {
        t: (key: string, options?: Record<string, any>) => string | import("i18next/typescript/helpers").$SpecialObject | import("i18next").TFunctionDetailedResult<string | import("i18next/typescript/helpers").$SpecialObject, Record<string, any>>;
        i18n: import("i18next").i18n;
        changeLanguage: (newLng: string) => Promise<import("i18next").TFunction<"translation", undefined>>;
    };
};
export default _default;

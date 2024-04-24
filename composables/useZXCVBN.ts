import { Options, type ZxcvbnResult } from "@zxcvbn-ts/core";
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';
export interface SabihinResult extends ZxcvbnResult, Rating {

};

export interface Rating {
    /** Describes the score based on {@link ZxcvbnResult.score} */
    category:string,
    /** Uses the theme colors for the specific component. */
    color:string,
}

export const ratings: Rating[] = [
    {
        category: 'Weak',
        color: 'progress-base',
    },
    {
        category: 'Fair',
        color: 'progress-error',
    },
    {
        category: 'Good',
        color: 'progress-warning',
    },
    {
        category: 'Strong',
        color: 'progress-success',
    },
    {
        category: 'Excellent',
        color: 'progress-success',
    },
];

export const MAX_SCORE = 4;

const DEFAULT_OPTIONS = {
    translations: zxcvbnEnPackage.translations,
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
    dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
    },
}
export function useZXCVBN(password:Ref<string>, options?:Options) {
    zxcvbnOptions.setOptions({...DEFAULT_OPTIONS, ...options});

    return computed<SabihinResult>(() => {
        const result = zxcvbn(password.value);
        return {
            ...result, 
            ...ratings[result.score],
        };
    });
}

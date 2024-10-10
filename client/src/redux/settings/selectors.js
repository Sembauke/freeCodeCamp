import { ns } from './action-types';

export const usernameValidationSelector = state => state[ns].usernameValidation;
export const generateExamTokenSelector = state => state[ns].generateExamToken;

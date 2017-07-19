import {User} from '../../../../../shared/user';

export interface AuthResponse {
    success: boolean;
    message: string;
    user?: User;
}
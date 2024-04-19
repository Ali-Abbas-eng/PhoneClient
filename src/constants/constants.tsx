export enum ScreenNames {
    Home = 'Home',
    Login = 'Login',
    Signup = 'Signup',
    Profile = 'Profile',
    Session = 'Session',
    Setups = 'Setups',
    Main = 'Main',
}
export const HttpProtocol = 'http:';
export const WsProtocol = 'ws:';
export const ServerIP = '//10.0.2.2:8000';
export const ServerEndpoint = HttpProtocol + ServerIP;
export const LoginEndpoint = ServerEndpoint + '/api/v1/login/';
export const LoginAPITokenEndpoint = ServerEndpoint + '/api/v1/token/obtain/';
export const RefreshTokenEndpoint = ServerEndpoint + '/api/v1/token/refresh/';
export const RegisterEndpoint = ServerEndpoint + '/api/v1/register/';
export const GetSessionsListEndpoint = ServerEndpoint + '/chat_scenarios/';
export const SocketIP = WsProtocol + ServerIP + '/';
export enum Turns {
    ECHO = 0,
    USER = 1,
    HOLD = 2,
}

export enum Events {
    TURNS_CHANGE = 'turns change',
}

export enum Durations {
    MIN_RECORD = 6,
    MAX_RECORD = 10,
    CHUNK_RECORD = 3,
}

export const HomeScreenName = 'Home';
export const LoginScreenName = 'Login';
export const RegisterScreenName = 'Register';
export const ProfileScreenName = 'Profile';

export const SessionScreenName = 'Session';
export const HttpProtocol = 'http:';
export const WsProtocol = 'ws:';
export const ServerIP = '//10.0.2.2:8000';

export const ServerEndpoint = HttpProtocol + ServerIP;
export const ChatSocketURL =
  'ws://192.168.43.33:8000/ws/socket-server/?session_type=';
export const LoginEndpoint = ServerEndpoint + '/api/v1/login/';
export const RegisterEndpoint = ServerEndpoint + '/api/v1/register/';

export const GetSessionsListEndpoint = ServerEndpoint + '/chat_scenarios/';

const protocol = "http";
const host = process.env.REACT_APP_WEB_API_HOST;
const port = "3027";

const baseEndpoint = `${protocol}://${host}:${port}`;

export const usersEndpoint = `${baseEndpoint}/user`;
export const groupsEndpoint = `${baseEndpoint}/group`;

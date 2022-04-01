const protocol = "http";
const host = process.env.REACT_APP_WEB_API_HOST;
const port = "3027";

const baseEndpoint = `${protocol}://${host}:${port}`;

export const usersEndpoint = `${baseEndpoint}/user`;
export const groupsEndpoint = `${baseEndpoint}/group`;

export const removeUserFromGroupEndPoint = `${groupsEndpoint}/remove-user-from-group/:groupId`;
export const addUserToGroupEndPoint = `${groupsEndpoint}/add-user-to-group/:groupId`;

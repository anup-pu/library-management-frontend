import API from './api';

export const login = (identifier, password) =>
  API.post('/auth/login', { identifier, password });

export const signup = (data) =>
  API.post('/auth/signup', data);

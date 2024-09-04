import Axios from 'axios';

const axios = Axios.create({
  baseURL: 'http://temp.test.huizhizao.vip/v1/graphql',
  headers: {
    'Content-Type': 'application/json',
    'x-hasura-admin-secret': 'mqz4qLHFAD4i5Y3WZmTH',
  },
});

export default (query, variables) => {
  return axios.post('', { query, variables }).then(response => {
    return {
      data: response.data.data,
      code: 0,
      msg: '',
    };
  });
};

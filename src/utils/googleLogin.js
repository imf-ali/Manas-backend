const axios = require('axios');

exports.login = async (access_token) => {
  try {
    const options = {
      method: 'GET',
      url: `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`,
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json'
      }
    };
    const res = await axios(options);
    return res;
  } catch (e) {
    throw new Error(e);
  }
}
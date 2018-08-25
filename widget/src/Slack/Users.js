export default class Users {
  constructor(webApi) {
    this.webApi = webApi;
    this.users = {};
  }

  addUser(userId, userInfo) {
    this.users[userId] = userInfo;
  }

  hasUser(userId) {
    return this.users.hasOwnProperty(userId);
  }

  getUser(userId) {
    if (this.hasUser(userId) === true) {
      return Promise.resolve(this.users[userId]);
    }

    return this.webApi
      .getUserInfo(userId)
      .then(body => {
        console.log("Retrieved", body);
        this.addUser(userId, body.user);
        return body.user;
      })
      .catch(console.error);
  }
}

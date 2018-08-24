export default class Users {
  constructor(apiToken) {
    this.apiToken = apiToken;
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
    let initUrl =
      "https://slack.com/api/users.info?token=" +
      this.apiToken +
      "&user=" +
      userId;
    return fetch(initUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      credentials: "same-origin"
    })
      .then(function(response) {
        return response.json();
      })
      .then(body => {
        console.log("Retrieved", body);
        this.addUser(userId, body.user);
        return body.user;
      })
      .catch(console.error);
  }
}

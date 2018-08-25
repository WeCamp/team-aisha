import React from "react";
import qs from "qs";

const apiUrl = "https://slack.com/api/";

class WebApi {
  constructor(apiToken, channel) {
    this.apiToken = apiToken;
    this.channel = channel;
  }

  getUserInfo(userId) {
    console.log("get user id", userId);
    const params = { user: userId };
    return this.request("users.info", params, "GET").then(response => {
      return response.json();
    });
  }

  getConversationInfo(channel) {
    channel = channel || this.channel;
    return this.request("conversations.info", { channel: channel });
  }

  request(call, params, method) {
    params = params || {};
    params.token = this.apiToken;

    const url = apiUrl + call + "?" + qs.stringify(params);
    console.log("fetch", url, params);
    return fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      credentials: "same-origin"
    }).catch(error => {
      console.error(call, " failed: ", error);
    });
  }
}

export default WebApi;

import * as core from "@actions/core";
import * as github from "@actions/github";
import fetch, { Headers, Response } from "node-fetch";
import { URLSearchParams } from "url";

interface ApiResponse {
  status: "ok" | "error";
  data?: string | number | boolean;
  message?: string;
}

const handleApiResponse = (json: ApiResponse) => {
  if (json.status === "ok") {
    core.setOutput("success", true);
  } else {
    core.setFailed(json.message ?? "Unknown error");
  }
};

try {
  const key = core.getInput("key");
  const value = core.getInput("value");
  const json = core.getInput("json");

  const fetch_payload = {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
      "x-api-key": core.getInput("access_token"),
      "x-github-repo": `${github.context.repo.owner}/${github.context.repo.repo}`,
    }),
  };

  if (key && value) {
    const base_url = "https://persistent.aaim.io/api/values/set";
    const url_params = new URLSearchParams({ key: core.getInput("key") });
    const payload = JSON.stringify({ value: core.getInput("value") });

    fetch(`${base_url}?${url_params.toString()}`, {
      ...fetch_payload,
      body: payload,
    })
      .then((response: Response) => response.json())
      .then(handleApiResponse)
      .catch((error) => core.setFailed(error));
  } else if (json) {
    const input_json = JSON.parse(json);
    const base_url = "https://persistent.aaim.io/api/values/set_multiple";

    fetch(base_url, { ...fetch_payload, body: JSON.stringify(input_json) })
      .then((response: Response) => response.json())
      .then(handleApiResponse)
      .catch((error) => core.setFailed(error));
  }
} catch (error) {
  core.setFailed(error.message);
}

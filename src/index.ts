import * as core from "@actions/core";
import * as github from "@actions/github";
import axios, { AxiosResponse } from "axios";
import { URLSearchParams } from "url";

interface ApiResponse {
  status: "ok" | "error";
  data?: string | number | boolean;
  message?: string;
}

const handleApiResponse = (json: AxiosResponse<ApiResponse>) => {
  if (json.data.status === "ok") {
    core.setOutput("success", true);
  } else {
    core.setFailed(json.data.message ?? "Unknown error");
  }
};

try {
  const key = core.getInput("key");
  const value = core.getInput("value");
  const json = core.getInput("json");

  const headers = {
    "content-type": "application/json",
    "x-api-key": core.getInput("access_token"),
    "x-github-repo": `${github.context.repo.owner}/${github.context.repo.repo}`,
  };

  // Single value
  if (key && value) {
    const baseUrl = "https://persistent.aaim.io/api/values/set";
    const urlParams = new URLSearchParams({ key: core.getInput("key") });
    const targetUrl = `${baseUrl}?${urlParams.toString()}`;
    const payload = JSON.stringify({ value: core.getInput("value") });

    axios
      .post<ApiResponse>(targetUrl, payload, { headers })
      .then(handleApiResponse)
      .catch((error) => core.setFailed(error));
  }
  // Multiple values
  else if (json) {
    const inputJson = JSON.parse(json);
    const baseUrl = "https://persistent.aaim.io/api/values/set_multiple";

    axios
      .post<ApiResponse>(baseUrl, JSON.stringify(inputJson), { headers })
      .then(handleApiResponse)
      .catch((error) => core.setFailed(error));
  }
} catch (error) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  core.setFailed(error as any);
}

import { getInput, setOutput, setFailed } from "@actions/core";
import { context } from "@actions/github";
import axios, { AxiosResponse } from "axios";
import { URLSearchParams } from "url";

interface ApiResponse {
  status: "ok" | "error";
  data?: string | number | boolean;
  message?: string;
}

const handleApiResponse = (json: AxiosResponse<ApiResponse>) => {
  if (json.data.status === "ok") {
    setOutput("success", true);
  } else {
    setFailed(json.data.message ?? "Unknown error");
  }
};

try {
  const key = getInput("key");
  const value = getInput("value");
  const json = getInput("json");

  const headers = {
    "content-type": "application/json",
    "x-api-key": getInput("access_token"),
    "x-github-repo": `${context.repo.owner}/${context.repo.repo}`,
  };

  // Single value
  if (key && value) {
    const baseUrl = "https://persistent.aaim.io/api/values/set";
    const urlParams = new URLSearchParams({ key: getInput("key") });
    const targetUrl = `${baseUrl}?${urlParams.toString()}`;
    const payload = JSON.stringify({ value: getInput("value") });

    axios
      .post<ApiResponse>(targetUrl, payload, { headers })
      .then(handleApiResponse)
      .catch((error) => setFailed(error));
  }
  // Multiple values
  else if (json) {
    const inputJson = JSON.parse(json);
    const baseUrl = "https://persistent.aaim.io/api/values/set_multiple";

    axios
      .post<ApiResponse>(baseUrl, JSON.stringify(inputJson), { headers })
      .then(handleApiResponse)
      .catch((error) => setFailed(error));
  }
} catch (error) {
  console.error(error);
  setFailed(error as Error);
}

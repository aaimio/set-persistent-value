![uptime](https://img.shields.io/uptimerobot/ratio/m787894343-bf1ddacfde07d95ec87e488c?style=flat-square)

- Set a persistent value: [aaimio/set-persistent-value](https://github.com/aaimio/set-persistent-value)
- Get a persistent value: [aaimio/get-persistent-value](https://github.com/aaimio/get-persistent-value)

# Overview

**Set or get a value that persists through GitHub Actions jobs, steps, or workflows.**

Example use cases:

- Execute some logic if a file hash has changed
- Keep track of a URL required in other steps of your workflow (like a Vercel preview URL)
- Set a boolean value to make other steps in your workflow optional

## Getting an access token

Generate an access token by visiting the URL below:

- https://persistent.aaim.io/api/values/new_access_token?output=plain

## Set a persistent value

The [set-persistent-value](https://github.com/aaimio/set-persistent-value) action takes the inputs below:

| Input | Description |
| --- | --- |
| `key` | An identifier with which you can retrieve the stored value. |
| `value` | The value to store |
| `access_token` | Use `curl` to generate one (or simply [visit the URL](https://persistent.aaim.io/api/values/new_access_token?output=plain) directly), after generating, add the access token as a GitHub secret for your repo (e.g. `PERSISTENT_VALUE_ACCESS_TOKEN`). You can generate a token using `curl https://persistent.aaim.io/api/values/new_access_token?output=plain`. |

```yaml
steps:
- name: Set a persistent value
  id: set_persistent_value
  uses: aaimio/set-persistent-value@v1
  with:
    key: foo
    value: bar
    access_token: ${{ secrets.PERSISTENT_VALUE_ACCESS_TOKEN }}
```

## Get a persistent value

The [get-persistent-value](https://github.com/aaimio/get-persistent-value) action takes the inputs below:

| Input | Description |
| --- | --- |
| `key` | An identifier with which you can retrieve the stored value. |
| `access_token` | Use `curl` to generate one (or simply [visit the URL](https://persistent.aaim.io/api/values/new_access_token?output=plain) directly), after generating, add the access token as a GitHub secret for your repo (e.g. `PERSISTENT_VALUE_ACCESS_TOKEN`). You can generate a token using `curl https://persistent.aaim.io/api/values/new_access_token?output=plain`. |

```yaml
steps:
- name: Get a persistent value
  id: get_persistent_value
  uses: aaimio/get-persistent-value@v1
  with:
    key: foo
    access_token: ${{ secrets.PERSISTENT_VALUE_ACCESS_TOKEN }}
- name: Some other step
  run: |
    echo ${{ steps.get_persistent_value.outputs.value }}
```

## Using the API directly

In the background, the action is interfacing with a simple key-value store built specifically for this use case. 

To reduce the overhead of downloading the action(s) or introducing yet another step into your workflow, you're more than welcome to use the API directly:

### Set a persistent value

```bash
curl -X POST \
  -H 'x-api-key: ${{ secrets.PERSISTENT_VALUE_ACCESS_TOKEN }}' \
  -H 'x-github-repo: <GITHUB_OWNER/GITHUB_REPO>' \
  -H 'content-type: application/json' \
  -d '{ "value": "some_value" }' \
  'https://persistent.aaim.io/api/values/set?key=YOUR_KEY&output=plain'
```

### Get a persistent value

```bash
SOME_VALUE=$(curl -X GET \
  -H 'x-api-key: ${{ secrets.PERSISTENT_VALUE_ACCESS_TOKEN }}' \
  -H 'x-github-repo: <GITHUB_OWNER/GITHUB_REPO>' \
  'https://persistent.aaim.io/api/values/get?key=YOUR_KEY&output=plain')

echo $SOME_VALUE
```

- The `x-github-repo` header is completely optional, it will only keep track of which repositories are using the action or API.

## Things to note

- Items will persist until the `access_token` hasn't been used for 3 months.
- Any questions, comments, feedback? [Join the #gh-persistent-values channel on my Slack](https://join.slack.com/t/aarons-slack-group/shared_invite/zt-ufy5w5rl-_xPGk4Tew4HyHSiYhsD33w).

![uptime](https://badgen.net/uptime-robot/status/m787894343-bf1ddacfde07d95ec87e488c)
![uptime](https://badgen.net/uptime-robot/day/m787894343-bf1ddacfde07d95ec87e488c)
![uptime](https://badgen.net/uptime-robot/week/m787894343-bf1ddacfde07d95ec87e488c)
![uptime](https://badgen.net/uptime-robot/month/m787894343-bf1ddacfde07d95ec87e488c)

- [Set a persistent value](#set-a-persistent-value)
- [Get a persistent value](#get-a-persistent-value)
- [Using the API directly](#using-the-api-directly)
  - [Setting a value](#setting-a-value)
  - [Getting a value](#getting-a-value)
- [Things to note](#things-to-note)

# Overview


**Set or get a value that persists through GitHub Actions jobs, steps, or workflows.**

- Execute some logic if a file hash has changed
- Keep track of a URL required in other steps of your workflow (like a Vercel preview URL)
- Set a boolean value to make other steps in your workflow optional

Any questions, comments, feedback? [Join the #gh-persistent-values channel](https://join.slack.com/t/aaimio/shared_invite/zt-ufy5w5rl-_xPGk4Tew4HyHSiYhsD33w) or [open a new issue](https://github.com/aaimio/set-persistent-value/issues/new).


## Set a persistent value

**Set a single value**

For single values, the action takes the inputs below:

| Input          | Description                                                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `key`          | The key for the value you want to set                                                                                                                                                      |
| `value`        | The value to set                                                                                                                                                                           |
| `access_token` | [Visit this URL](https://persistent.aaim.io/api/values/new_access_token?output=plain), then add this access token as a GitHub secret to your repo (e.g. `PERSISTENT_VALUE_ACCESS_TOKEN`). |

```yaml
steps:
  - name: Set a persistent value
    id: set_persistent_value
    uses: aaimio/set-persistent-value@v1.1.0
    with:
      key: foo
      value: bar
      access_token: ${{ secrets.PERSISTENT_VALUE_ACCESS_TOKEN }}
```

**Set multiple values**

For multiple values, the action takes the inputs below:

| Input          | Description                                                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `json`         | A JSON string with the keys and values you want to set                                                                                                                                     |
| `access_token` | [Visit this URL](https://persistent.aaim.io/api/values/new_access_token?output=plain), then add this access token as a GitHub secret to your repo (e.g. `PERSISTENT_VALUE_ACCESS_TOKEN`). |

```yaml
steps:
  - name: Set a persistent value
    id: set_persistent_value
    uses: aaimio/set-persistent-value@v1.1.0
    with:
      json: '{ "some_key": 42, "foo": "bar", "boolean_value": true }'
      access_token: ${{ secrets.PERSISTENT_VALUE_ACCESS_TOKEN }}
```

## Get a persistent value

The [get-persistent-value](https://github.com/aaimio/get-persistent-value) action takes the inputs below:

| Input          | Description                                                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `key`          | The key for the value you want to retrieve                                                                                                                                                 |
| `access_token` | [Visit this URL](https://persistent.aaim.io/api/values/new_access_token?output=plain), then add this access token as a GitHub secret to your repo (e.g. `PERSISTENT_VALUE_ACCESS_TOKEN`). |

```yaml
steps:
  - name: Get a persistent value
    id: get_persistent_value
    uses: aaimio/get-persistent-value@v1.1.0
    with:
      key: foo
      access_token: ${{ secrets.PERSISTENT_VALUE_ACCESS_TOKEN }}
  - name: Some other step
    run: |
      echo ${{ steps.get_persistent_value.outputs.value }}
```

## Using the API directly

In the background, the action is talking to a simple key-value store.

To reduce the overhead of downloading the action or introducing yet another step into your workflow, you could also use the API directly:

### Setting a value

```bash
curl -X POST \
  -H 'x-api-key: ${{ secrets.PERSISTENT_VALUE_ACCESS_TOKEN }}' \
  -H 'x-github-repo: <GITHUB_OWNER/GITHUB_REPO>' \
  -H 'content-type: application/json' \
  -d '{ "value": "some_value" }' \
  'https://persistent.aaim.io/api/values/set?key=YOUR_KEY&output=plain'
```

### Getting a value

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

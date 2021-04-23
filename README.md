![uptime](https://img.shields.io/uptimerobot/ratio/m787894343-bf1ddacfde07d95ec87e488c?style=flat-square)

Also see [aaimio/get-persistent-value](https://github.com/aaimio/get-persistent-value)

# Set persistent value action

This action sets a value that persists through GitHub Actions jobs, steps, or workflows, for example:

- Set a hash that you can use for comparison, e.g. to execute some logic if a file hash has changed.
- Set a URL that's required in other steps, jobs, or workflows, e.g. saving a Vercel deployment URL to run a Lighthouse report on.
- Set a boolean value to keep track of whether something was executed or not, e.g. to make sure some logic only runs once.

## Configuration

This action takes the inputs below:

| Input | Description |
| --- | --- |
| `key` | An identifier with which you can retrieve the persistent value. |
| `value` | The persistent value to store (can be a string, number, or boolean). |
| `access_token` | Use `curl` to generate one (or simply [visit the URL](https://persistent.aaim.io/api/values/new_access_token?output=plain) directly), after generating, add the access token as a GitHub secret for your repo (e.g. `PERSISTENT_VALUE_ACCESS_TOKEN`). |

## Generate an access token

```bash
$ curl https://persistent.aaim.io/api/values/new_access_token?output=plain
```

## Set a persistent value

Values can be set using [aaimio/set-persistent-value](https://github.com/aaimio/set-persistent-value):

```yaml
steps:
- name: Set a persistent value
  id: set_persistent_value
  uses: aaimio/set-persistent-value@v1
  with:
    access_token: ${{ secrets.PERSISTENT_VALUE_ACCESS_TOKEN }}
    key: foo
    value: bar
```

## Get a persistent value

Values can be retrieved using [aaimio/get-persistent-value](https://github.com/aaimio/get-persistent-value):

```yaml
steps:
- name: Get a persistent value
  id: get_persistent_value
  uses: aaimio/get-persistent-value@v1
  with:
    access_token: ${{ secrets.PERSISTENT_VALUE_ACCESS_TOKEN }}
    key: foo
- name: Some other step
  run: |
    echo ${{ steps.get_persistent_value.outputs.value }}
```

# Using the API directly

In the background, the action is interfacing with a simple key-value store API built specifically for this use case. To reduce the overhead of downloading the action(s) or introducing another step into your workflow, you're more than welcome to use the API directly:

- **Note**: The `x-github-repo` header is optional, it will only keep track of which repositories are using the action or API.

## Set a persistent value

```bash
curl -X POST \
  -H 'x-api-key: ${{ secrets.PERSISTENT_VALUE_ACCESS_TOKEN }}' \
  -H 'x-github-repo: <GITHUB_OWNER/GITHUB_REPO>' \
  -H 'content-type: application/json' \
  -d '{ "value": "some_value" }' \
  'https://persistent.aaim.io/api/values/set?key=YOUR_KEY'
```

## Get a persistent value

```bash
SOME_VALUE=$(curl -X GET \
  -H 'x-api-key: ${{ secrets.PERSISTENT_VALUE_ACCESS_TOKEN }}' \
  -H 'x-github-repo: <GITHUB_OWNER/GITHUB_REPO>'
  'https://persistent.aaim.io/api/values/get?key=YOUR_KEY')

echo $SOME_VALUE
```

# Things to note

- Items are stored unencrypted, **it is recommended not to upload sensitive data (e.g. GitHub secrets)**. 
    - You could optionally implement an encryption step before passing the value to the action.
- Items will persist until the `access_token` hasn't been used for 3 months.
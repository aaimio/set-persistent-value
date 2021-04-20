![uptime](https://img.shields.io/uptimerobot/ratio/m787894343-bf1ddacfde07d95ec87e488c?style=flat-square)

Also see [aaimio/get-persistent-value](https://github.com/aaimio/get-persistent-value)

# Set persistent value

This action sets a value that persists through GitHub Actions jobs, steps, or workflows, for example:

- Set a hash that you can use for comparison, e.g. to execute some logic if a file hash has changed.
- Set a URL that's required in other steps, jobs, or workflows, e.g. saving a Vercel deployment URL to run a Lighthouse report on.
- Set a boolean value to keep track of whether something was executed or not, e.g. to make sure some logic only runs once.

# Configuration

This action takes the inputs below:

- `access_token`: Use `curl` to generate one (or simply [visit the URL](https://persistent.aaim.io/api/values/new_access_token?output=plain) directly):
  - After generating, add the access token as a GitHub secret for your repo (e.g. `PERSISTENT_VALUE_ACCESS_TOKEN`).

```bash
$ curl https://persistent.aaim.io/api/values/new_access_token?output=plain
```

- `key`: An identifier with which you can retrieve the persistent value.
- `value`: The persistent value to store.

# Set a persistent value

Values can be set using [aaimio/set-persistent-value](https://github.com/aaimio/set-persistent-value):

```yaml
steps:
- name: Set a persistent value
  id: set_persistent_value
  uses: aaimio/set-persistent-value@master
  with:
    access_token: ${{ secrets.PERSISTENT_VALUE_ACCESS_TOKEN }}
    key: foo
    value: bar
```

# Get a persistent value

Values can be retrieved using [aaimio/get-persistent-value](https://github.com/aaimio/get-persistent-value):

```yaml
steps:
- name: Get a persistent value
  id: get_persistent_value
  uses: aaimio/get-persistent-value@master
  with:
    access_token: ${{ secrets.PERSISTENT_VALUE_ACCESS_TOKEN }}
    key: foo
- name: Some other step
  run: |
    echo ${{ steps.get_persistent_value.outputs.value }}
```

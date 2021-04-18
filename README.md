Also see [aaimio/get-persistent-value](https://github.com/aaimio/get-persistent-value)

# Get persistent value

This action sets a value that persists through GitHub Actions jobs, steps, or workflows.

# Configuration

This action takes the below inputs:

- `unique_key`: Use `curl` to generate a one (or visit the URL directly):
  - After generating, add the unique key as a GitHub secret for your repo (e.g. `PERSISTENT_VALUE_UNIQUE_KEY`).

```bash
$ curl https://persistent.aaim.io/api/values/new_unique_key?output=plain
```

- `key`: An identifier with which you can retrieve the persistent value
- `value`: The persistent value to store

# Set a persistent value

Values can be set using [aaimio/set-persistent-value](https://github.com/aaimio/set-persistent-value):

```yaml
steps:
- name: Set a persistent value
  id: set_persistent_value
  uses: aaimio/set-persistent-value@master
  with:
    unique_key: ${{ secrets.PERSISTENT_VALUE_UNIQUE_KEY }}
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
    unique_key: ${{ secrets.PERSISTENT_VALUE_UNIQUE_KEY }}
    key: foo
- name: Some other step
  run: |
    echo ${{ steps.get_persistent_value.outputs.value }}
```

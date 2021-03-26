# CTZN Server plugin example

## What is it?

A server plugin example for [ctzn](https://github.com/pfrazee/ctzn)

## How to use it?

 1. You need [your own ctzn server](https://github.com/pfrazee/ctzn/blob/master/docs/setting-up-a-server.md)
    (You will need to clone it since you will need to modify package.json to
    add your plugin.)
 2. Clone this repo and edit the db, api, schema, app folders as needed.
 3. For deployment, publish to npm. For development, use npm/yarn link.
 4. Add this plugin package as a dependency to the package.json of your ctzn
    clone.
 5. Configure your instance to enable your plugin:
      1. Execute:
        ```
        $ node bin.js
        ```
      2. Press `C` to configure your server
      3. In the `server-plugins` field, enter your plugin package name
         (comma-delimited if more than one)
      4. Press `S` to start the server.

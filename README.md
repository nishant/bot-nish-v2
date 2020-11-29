# bot-nish-v2

Discord bot made in TypeScript


## Configuration

After cloning the repository run `npm install`.

Add your discord bot token to `src/config/config.ts`:

```ts
export let config = {
  token: "your-token-here", // Discord bot token.
  prefix: "!", // Command prefix, ex: !hello
};
```

Note that changes to this file should not be committed to the repository, `config.ts` is part of the .gitignore to prevent this.


## Key Commands

| Command          | Description                            |
| ---------------- | -------------------------------------- |
| `npm run start`  | Run the bot.                           |
| `npm run build`  | Build the typescript code.             |
| `npm run lint`   | Runs the linter on the code.           |
| `npm run format` | Fixes most lint errors using Prettier. |
| `npm run test`   | Run all tests.                         |


## To Do

* update play command to accept %p
* update queue command to accept %q
* add lodash - remove helper shuffle
* uptime command
* user server stats command
* anime airing cmd
* mal search
* weather cmd
* stock cmd
* password gen cmd


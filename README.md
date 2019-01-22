# ServerBackuper

Script for backuping files. Originaly made for minecraft servers. Uses tar archiving.

## Backup config (profiles.js)
```js
{
    name: "Default",
    type: "default",
    execute: "0 * * * *",
    disabled: true,
    folder: "/path/to/folder", 
    files: [],
    naming:  {
        type: "unique",
        prefix: "backup-",
    },
    out: "./",
    settings: {}
}
```
### Profile options

- `name` Name is used to identify profile in logs
- `type` What backuper should be used. See Backuper list for more info. Default: `default`
- `execute` Execution interval. Uses cron syntax. Use https://crontab.guru
- `disabled` Should be profile ignored?
- `folder` What folder should backuper work with
- `files` Array of files and folder. If array is empty backuper works with the whole `folder`
- `naming` Object with naming options
    - `type` What naming should be used. Options: 
        - `unique` - A unique ID is generated
        - `time` - Date and time is used
    - `prefix` Text that will be prepended to the name
- `out` Folder used for saving archived files
- `settings` All other optional settings for backupers

### Backuper list:
- `default` Default backuper archives folders and files and saves the tar file in defined `out` folder
- `minecraft` Archives folders and files and notifies server with a message about archiving. Sends a message to a screen with running minecraft server. Settings:
    - `screenName` The name of screen in which is minecraft server running

### To Do
- [x] Check for md5 sum of archive (no need to save same backup twice if nothing changed)
- [ ] Delete old archives
- [ ] Create more profiles for:
    - [x] Minecraft
    - [ ] Uploading archives to other FTPs

### Known bugs
Archived file has redundant folder inside
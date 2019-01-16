# ServerBackuper

Script for backuping files. Originaly made for minecraft servers. Uses tar.

## Backup config (profiles.js)
```json
{
    name: "Default",
    type: "default",
    disabled: true,
    folder: "/Nodejs/typescript_testings/", 
    files: [],
    naming:  {
        type: "unique",
        prefix: "backup-",
    },
    out: "./"
}
```
### Profile options

- `name` Name is used to identify profile in logs
- `type` What backuper should be used. See Backuper list for more info. Default: `default`
- `disabled` Should be profile ignored?
- `folder` What folder should backuper work with
- `files` Array of files and folder. If array is empty backuper works with the whole `folder`
- `naming` Object with naming options
    - `type` What naming should be used. Options: 
        - `unique` - A unique ID is generated
        - `time` - Date and time is used
    - `prefix` Text that will be prepended to the name
- `out` Folder used for saving archived files

### Backuper list:
* `default` Default backuper archives folders and files and saves the tar file in defined `out` folder

### To Do
- Check for md5 sum of archive (no need to save same backup twice if nothing changed)
- Create more profiles for:
    - Minecraft
    - Uploading archives to other FTPs

### Known bugs
Archived file has redundant folder inside
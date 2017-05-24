<a name="module_selectel"></a>

## selectel

* [selectel](#module_selectel)
    * _static_
        * [.auth(login, pass)](#module_selectel.auth) ⇒ <code>Promise</code>
        * [.info()](#module_selectel.info) ⇒ <code>Promise</code>
        * [.fetchContainers(format, limit, marker)](#module_selectel.fetchContainers) ⇒ <code>Promise</code>
        * [.createContainer(containerName, containerType)](#module_selectel.createContainer) ⇒ <code>Promise</code>
        * [.infoContainer(containerName)](#module_selectel.infoContainer) ⇒ <code>Promise</code>
        * [.editContainer(containerName, containerType)](#module_selectel.editContainer) ⇒ <code>Promise</code>
        * [.deleteContainer(containerName)](#module_selectel.deleteContainer) ⇒ <code>Promise</code>
        * [.fetchFiles(containerName, params)](#module_selectel.fetchFiles) ⇒ <code>Promise</code>
        * [.uploadFile(fullLocalPath, hostingPath, additionalHeaders)](#module_selectel.uploadFile) ⇒ <code>Promise</code>
        * [.extractArchive(readStream, hostingPath, arhFormat)](#module_selectel.extractArchive) ⇒ <code>Promise</code>
        * [.copyFile(hostingPath, newPath)](#module_selectel.copyFile) ⇒ <code>Promise</code>
        * [.deleteFile(filePath)](#module_selectel.deleteFile) ⇒ <code>Promise</code>
    * _inner_
        * [~request](#module_selectel..request)

<a name="module_selectel.auth"></a>

### selectel.auth(login, pass) ⇒ <code>Promise</code>
Gets the authentication token (key) for accessing storage and sets it internally.

**Kind**: static method of [<code>selectel</code>](#module_selectel)  

| Param | Type | Description |
| --- | --- | --- |
| login | <code>string</code> | account number |
| pass | <code>string</code> | storage password |

<a name="module_selectel.info"></a>

### selectel.info() ⇒ <code>Promise</code>
Returns general information about account: total number of containers, total number of objects,
total volume of data stored, total volume of data downloaded.

**Kind**: static method of [<code>selectel</code>](#module_selectel)  
<a name="module_selectel.fetchContainers"></a>

### selectel.fetchContainers(format, limit, marker) ⇒ <code>Promise</code>
Returns the list of available containers.

**Kind**: static method of [<code>selectel</code>](#module_selectel)  

| Param | Type | Description |
| --- | --- | --- |
| format | <code>string</code> | 'json' or 'xml' |
| limit | <code>string</code> | the maximum number of objects on a list (default - 10 000) |
| marker | <code>string</code> | the name of the final container from the previous request |

<a name="module_selectel.createContainer"></a>

### selectel.createContainer(containerName, containerType) ⇒ <code>Promise</code>
Creates a new container.

**Kind**: static method of [<code>selectel</code>](#module_selectel)  

| Param | Type | Description |
| --- | --- | --- |
| containerName | <code>string</code> | name of the container |
| containerType | <code>string</code> | container type: 'public', 'private' or 'gallery' |

<a name="module_selectel.infoContainer"></a>

### selectel.infoContainer(containerName) ⇒ <code>Promise</code>
Returns a container's information.

**Kind**: static method of [<code>selectel</code>](#module_selectel)  

| Param | Type | Description |
| --- | --- | --- |
| containerName | <code>string</code> | name of the container |

<a name="module_selectel.editContainer"></a>

### selectel.editContainer(containerName, containerType) ⇒ <code>Promise</code>
Changes a container’s metadata.

**Kind**: static method of [<code>selectel</code>](#module_selectel)  

| Param | Type | Description |
| --- | --- | --- |
| containerName | <code>string</code> | name of the container |
| containerType | <code>string</code> | container type: 'public', 'private' or 'gallery' |

<a name="module_selectel.deleteContainer"></a>

### selectel.deleteContainer(containerName) ⇒ <code>Promise</code>
Deletes the container.

**Kind**: static method of [<code>selectel</code>](#module_selectel)  

| Param | Type | Description |
| --- | --- | --- |
| containerName | <code>string</code> | name of the container |

<a name="module_selectel.fetchFiles"></a>

### selectel.fetchFiles(containerName, params) ⇒ <code>Promise</code>
Returns a list of files stored in the container.

**Kind**: static method of [<code>selectel</code>](#module_selectel)  

| Param | Type | Description |
| --- | --- | --- |
| containerName | <code>string</code> | name of the container |
| params | <code>Object</code> | parameters. |
| params.format | <code>string</code> | the format results are returned in (json or xml) |
| params.limit | <code>string</code> | the maximum number of objects on a list (default - 10 000) |
| params.marker | <code>string</code> | objects whose value exceeds the given marker (useful for page navigation and for large numbers of files) |
| params.prefix | <code>string</code> | prints objects whose names start with the given prefix in line format |
| params.path | <code>string</code> | returns objects in the given folder (virtual folder) |
| params.delimiter | <code>string</code> | returns objects up to the given delimiter in the filename |

<a name="module_selectel.uploadFile"></a>

### selectel.uploadFile(fullLocalPath, hostingPath, additionalHeaders) ⇒ <code>Promise</code>
Uploads a file to the container.

**Kind**: static method of [<code>selectel</code>](#module_selectel)  

| Param | Type | Description |
| --- | --- | --- |
| fullLocalPath | <code>string</code> | full local path to the file |
| hostingPath | <code>string</code> | /{container}/{file} |
| additionalHeaders | <code>Object</code> | { X-Delete-At: ..., X-Delete-After: ..., Etag: ..., X-Object-Meta: ... } |

<a name="module_selectel.extractArchive"></a>

### selectel.extractArchive(readStream, hostingPath, arhFormat) ⇒ <code>Promise</code>
Extracts the archive.

**Kind**: static method of [<code>selectel</code>](#module_selectel)  

| Param | Type | Description |
| --- | --- | --- |
| readStream | <code>pipe</code> | read stream |
| hostingPath | <code>string</code> | /{container}/{file} |
| arhFormat | <code>string</code> | The archive type: 'tar', 'tar.gz' or 'tar.bz2' |

<a name="module_selectel.copyFile"></a>

### selectel.copyFile(hostingPath, newPath) ⇒ <code>Promise</code>
Copies a file to the given folder.

**Kind**: static method of [<code>selectel</code>](#module_selectel)  

| Param | Type | Description |
| --- | --- | --- |
| hostingPath | <code>string</code> | /{container}/{file} |
| newPath | <code>string</code> | /{container}/{new-file} |

<a name="module_selectel.deleteFile"></a>

### selectel.deleteFile(filePath) ⇒ <code>Promise</code>
Deletes the given file.

**Kind**: static method of [<code>selectel</code>](#module_selectel)  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | /{container}/{file} |

<a name="module_selectel..request"></a>

### selectel~request
**Kind**: inner property of [<code>selectel</code>](#module_selectel)  
**See**: [https://support.selectel.ru/storage/api_info/](https://support.selectel.ru/storage/api_info/) Selectel's Documentation.  

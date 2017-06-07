## Modules

<dl>
<dt><a href="#module_Selectel">Selectel</a></dt>
<dd><p>Manage Selectel&#39;s storage
<a href="https://support.selectel.ru/storage/api_info/">Selectel&#39;s Documentation</a></p>
</dd>
</dl>

## Classes

<dl>
<dt><a href="#Selectel">Selectel</a></dt>
<dd></dd>
</dl>

<a name="module_Selectel"></a>

## Selectel
Manage Selectel's storage
[Selectel's Documentation](https://support.selectel.ru/storage/api_info/)

<a name="Selectel"></a>

## Selectel
**Kind**: global class  

* [Selectel](#Selectel)
    * [new Selectel(request, requestPromise)](#new_Selectel_new)
    * [.auth(login, pass)](#Selectel+auth) ⇒ <code>Promise</code>
    * [.info()](#Selectel+info) ⇒ <code>Promise</code>
    * [.fetchContainers(format, limit, marker)](#Selectel+fetchContainers) ⇒ <code>Promise</code>
    * [.createContainer(containerName, containerType)](#Selectel+createContainer) ⇒ <code>Promise</code>
    * [.infoContainer(containerName)](#Selectel+infoContainer) ⇒ <code>Promise</code>
    * [.editContainer(containerName, containerType)](#Selectel+editContainer) ⇒ <code>Promise</code>
    * [.deleteContainer(containerName)](#Selectel+deleteContainer) ⇒ <code>Promise</code>
    * [.fetchFiles(containerName, params)](#Selectel+fetchFiles) ⇒ <code>Promise</code>
    * [.uploadFile(fullLocalPath, hostingPath, additionalHeaders)](#Selectel+uploadFile) ⇒ <code>Promise</code>
    * [.extractArchive(readStream, hostingPath, arhFormat)](#Selectel+extractArchive) ⇒ <code>Promise</code>
    * [.copyFile(hostingPath, newPath)](#Selectel+copyFile) ⇒ <code>Promise</code>
    * [.deleteFile(filePath)](#Selectel+deleteFile) ⇒ <code>Promise</code>

<a name="new_Selectel_new"></a>

### new Selectel(request, requestPromise)
Constructor function.


| Param | Type |
| --- | --- |
| request | <code>Object</code> | 
| requestPromise | <code>Object</code> | 

<a name="Selectel+auth"></a>

### selectel.auth(login, pass) ⇒ <code>Promise</code>
Gets the authentication token (key) for accessing storage and sets it internally.

**Kind**: instance method of [<code>Selectel</code>](#Selectel)  

| Param | Type | Description |
| --- | --- | --- |
| login | <code>string</code> | account number |
| pass | <code>string</code> | storage password |

<a name="Selectel+info"></a>

### selectel.info() ⇒ <code>Promise</code>
Returns general information about account: total number of containers, total number of objects,
total volume of data stored, total volume of data downloaded.

**Kind**: instance method of [<code>Selectel</code>](#Selectel)  
<a name="Selectel+fetchContainers"></a>

### selectel.fetchContainers(format, limit, marker) ⇒ <code>Promise</code>
Returns the list of available containers.

**Kind**: instance method of [<code>Selectel</code>](#Selectel)  

| Param | Type | Description |
| --- | --- | --- |
| format | <code>string</code> | 'json' or 'xml', 'json' is the default value |
| limit | <code>string</code> | the maximum number of objects on a list (default - 10 000) |
| marker | <code>string</code> | the name of the final container from the previous request |

<a name="Selectel+createContainer"></a>

### selectel.createContainer(containerName, containerType) ⇒ <code>Promise</code>
Creates a new container.

**Kind**: instance method of [<code>Selectel</code>](#Selectel)  

| Param | Type | Description |
| --- | --- | --- |
| containerName | <code>string</code> | name of the container |
| containerType | <code>string</code> | container type: 'public', 'private' or 'gallery'. 'public' is the default value |

<a name="Selectel+infoContainer"></a>

### selectel.infoContainer(containerName) ⇒ <code>Promise</code>
Returns a container's information.

**Kind**: instance method of [<code>Selectel</code>](#Selectel)  

| Param | Type | Description |
| --- | --- | --- |
| containerName | <code>string</code> | name of the container |

<a name="Selectel+editContainer"></a>

### selectel.editContainer(containerName, containerType) ⇒ <code>Promise</code>
Changes a container's metadata.

**Kind**: instance method of [<code>Selectel</code>](#Selectel)  

| Param | Type | Description |
| --- | --- | --- |
| containerName | <code>string</code> | name of the container |
| containerType | <code>string</code> | container type: 'public', 'private' or 'gallery' |

<a name="Selectel+deleteContainer"></a>

### selectel.deleteContainer(containerName) ⇒ <code>Promise</code>
Deletes the container.

**Kind**: instance method of [<code>Selectel</code>](#Selectel)  

| Param | Type | Description |
| --- | --- | --- |
| containerName | <code>string</code> | name of the container |

<a name="Selectel+fetchFiles"></a>

### selectel.fetchFiles(containerName, params) ⇒ <code>Promise</code>
Returns a list of files stored in the container.

**Kind**: instance method of [<code>Selectel</code>](#Selectel)  

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

<a name="Selectel+uploadFile"></a>

### selectel.uploadFile(fullLocalPath, hostingPath, additionalHeaders) ⇒ <code>Promise</code>
Uploads a file to the container.

**Kind**: instance method of [<code>Selectel</code>](#Selectel)  

| Param | Type | Description |
| --- | --- | --- |
| fullLocalPath | <code>string</code> | full local path to the file |
| hostingPath | <code>string</code> | /{container}/{file} |
| additionalHeaders | <code>Object</code> | { X-Delete-At: ..., X-Delete-After: ..., Etag: ..., X-Object-Meta: ... } |

<a name="Selectel+extractArchive"></a>

### selectel.extractArchive(readStream, hostingPath, arhFormat) ⇒ <code>Promise</code>
Extracts the archive.

**Kind**: instance method of [<code>Selectel</code>](#Selectel)  

| Param | Type | Description |
| --- | --- | --- |
| readStream | <code>pipe</code> | read stream |
| hostingPath | <code>string</code> | /{container}/{file} |
| arhFormat | <code>string</code> | The archive type: 'tar', 'tar.gz' or 'tar.bz2' |

<a name="Selectel+copyFile"></a>

### selectel.copyFile(hostingPath, newPath) ⇒ <code>Promise</code>
Copies a file to the given folder.

**Kind**: instance method of [<code>Selectel</code>](#Selectel)  

| Param | Type | Description |
| --- | --- | --- |
| hostingPath | <code>string</code> | /{container}/{file} |
| newPath | <code>string</code> | /{container}/{new-file} |

<a name="Selectel+deleteFile"></a>

### selectel.deleteFile(filePath) ⇒ <code>Promise</code>
Deletes the given file.

**Kind**: instance method of [<code>Selectel</code>](#Selectel)  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | /{container}/{file} |


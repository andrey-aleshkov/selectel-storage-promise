## Functions

<dl>
<dt><a href="#auth">auth(login, pass)</a> ⇒ <code>Promise</code></dt>
<dd><p>Authentication. Set the authentication token (key) for accessing storage via API
which must to be included in all subsequent requests.</p>
</dd>
<dt><a href="#info">info()</a> ⇒ <code>Promise</code></dt>
<dd><p>Retrieving account information. Returns general information about account:
total number of containers, total number of objects, total volume of data stored, total volume of data downloaded.</p>
</dd>
<dt><a href="#fetchContainers">fetchContainers(format, limit, marker)</a> ⇒ <code>Promise</code></dt>
<dd><p>Retrieving containers list. Returns the list of available containers.</p>
</dd>
<dt><a href="#createContainer">createContainer(containerName, type)</a> ⇒ <code>Promise</code></dt>
<dd><p>Creating a new container.</p>
</dd>
<dt><a href="#infoContainer">infoContainer(containerName)</a> ⇒ <code>Promise</code></dt>
<dd><p>Retrieving container information.</p>
</dd>
<dt><a href="#editContainer">editContainer(containerName, type)</a> ⇒ <code>Promise</code></dt>
<dd><p>Changing container metadata.</p>
</dd>
<dt><a href="#deleteContainer">deleteContainer(containerName)</a> ⇒ <code>Promise</code></dt>
<dd><p>Deleting a container.</p>
</dd>
<dt><a href="#fetchFiles">fetchFiles(containerName, format, limit, marker, prefix, path, delimiter)</a> ⇒ <code>Promise</code></dt>
<dd><p>Retrieving a list of files saved in a container.</p>
</dd>
<dt><a href="#uploadFile">uploadFile(fullLocalPath, hostingPath, additionalHeaders)</a> ⇒ <code>Promise</code></dt>
<dd><p>Uploads a file to the container.</p>
</dd>
<dt><a href="#extractArchive">extractArchive(readStream, hostingPath, arhFormat)</a> ⇒ <code>Promise</code></dt>
<dd><p>Extracts the archive in the request. The archive type is given in the extract-archive parameter (tar, tar.gz or tar.bz2).</p>
</dd>
<dt><a href="#copyFile">copyFile(hostingPath, newPath)</a> ⇒ <code>Promise</code></dt>
<dd><p>Copies a file to the given folder.</p>
</dd>
<dt><a href="#deleteFile">deleteFile(filePath)</a> ⇒ <code>Promise</code></dt>
<dd><p>Deletes the given file.</p>
</dd>
</dl>

<a name="auth"></a>

## auth(login, pass) ⇒ <code>Promise</code>
Authentication. Set the authentication token (key) for accessing storage via API
which must to be included in all subsequent requests.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| login | <code>string</code> | account number |
| pass | <code>string</code> | storage password |

<a name="info"></a>

## info() ⇒ <code>Promise</code>
Retrieving account information. Returns general information about account:
total number of containers, total number of objects, total volume of data stored, total volume of data downloaded.

**Kind**: global function  
<a name="fetchContainers"></a>

## fetchContainers(format, limit, marker) ⇒ <code>Promise</code>
Retrieving containers list. Returns the list of available containers.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| format | <code>string</code> | 'json' or 'xml' |
| limit | <code>string</code> | the maximum number of objects on a list (default - 10 000) |
| marker | <code>string</code> | the name of the final container from the previous request |

<a name="createContainer"></a>

## createContainer(containerName, type) ⇒ <code>Promise</code>
Creating a new container.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| containerName | <code>string</code> | name of the container |
| type | <code>string</code> | container type: 'public', 'private' or 'gallery' |

<a name="infoContainer"></a>

## infoContainer(containerName) ⇒ <code>Promise</code>
Retrieving container information.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| containerName | <code>string</code> | name of the container |

<a name="editContainer"></a>

## editContainer(containerName, type) ⇒ <code>Promise</code>
Changing container metadata.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| containerName | <code>string</code> | name of the container |
| type | <code>string</code> | container type: 'public', 'private' or 'gallery' |

<a name="deleteContainer"></a>

## deleteContainer(containerName) ⇒ <code>Promise</code>
Deleting a container.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| containerName | <code>string</code> | name of the container |

<a name="fetchFiles"></a>

## fetchFiles(containerName, format, limit, marker, prefix, path, delimiter) ⇒ <code>Promise</code>
Retrieving a list of files saved in a container.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| containerName | <code>string</code> | name of the container |
| format | <code>string</code> | the format results are returned in (json or xml) |
| limit | <code>string</code> | the maximum number of objects on a list (default - 10 000) |
| marker | <code>string</code> | objects whose value exceeds the given marker (useful for page navigation and for large numbers of files) |
| prefix | <code>string</code> | prints objects whose names start with the given prefix in line format |
| path | <code>string</code> | returns objects in the given folder (virtual folder) |
| delimiter | <code>string</code> | returns objects up to the given delimiter in the filename |

<a name="uploadFile"></a>

## uploadFile(fullLocalPath, hostingPath, additionalHeaders) ⇒ <code>Promise</code>
Uploads a file to the container.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| fullLocalPath | <code>string</code> | full local path to the file |
| hostingPath | <code>string</code> | /{container}/{file} |
| additionalHeaders | <code>Object</code> | { X-Delete-At: ..., X-Delete-After: ..., Etag: ..., X-Object-Meta: ... } |

<a name="extractArchive"></a>

## extractArchive(readStream, hostingPath, arhFormat) ⇒ <code>Promise</code>
Extracts the archive in the request. The archive type is given in the extract-archive parameter (tar, tar.gz or tar.bz2).

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| readStream | <code>pipe</code> | read stream |
| hostingPath | <code>string</code> | /{container}/{file} |
| arhFormat | <code>string</code> | The archive type: 'tar', 'tar.gz' or 'tar.bz2' |

<a name="copyFile"></a>

## copyFile(hostingPath, newPath) ⇒ <code>Promise</code>
Copies a file to the given folder.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| hostingPath | <code>string</code> | /{container}/{file} |
| newPath | <code>string</code> | /{container}/{new-file} |

<a name="deleteFile"></a>

## deleteFile(filePath) ⇒ <code>Promise</code>
Deletes the given file.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | /{container}/{file} |


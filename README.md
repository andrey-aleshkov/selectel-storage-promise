## Functions

<dl>
<dt><a href="#auth">auth(login, pass)</a> ⇒ <code>Promise</code></dt>
<dd><p>Gets the authentication token (key) for accessing storage and sets it internally.</p>
</dd>
<dt><a href="#info">info()</a> ⇒ <code>Promise</code></dt>
<dd><p>Returns general information about account: total number of containers, total number of objects,
total volume of data stored, total volume of data downloaded.</p>
</dd>
<dt><a href="#fetchContainers">fetchContainers(format, limit, marker)</a> ⇒ <code>Promise</code></dt>
<dd><p>Returns the list of available containers.</p>
</dd>
<dt><a href="#createContainer">createContainer(containerName, containerType)</a> ⇒ <code>Promise</code></dt>
<dd><p>Creates a new container.</p>
</dd>
<dt><a href="#infoContainer">infoContainer(containerName)</a> ⇒ <code>Promise</code></dt>
<dd><p>Returns a container&#39;s information.</p>
</dd>
<dt><a href="#editContainer">editContainer(containerName, containerType)</a> ⇒ <code>Promise</code></dt>
<dd><p>Changes a container’s metadata.</p>
</dd>
<dt><a href="#deleteContainer">deleteContainer(containerName)</a> ⇒ <code>Promise</code></dt>
<dd><p>Deletes the container.</p>
</dd>
<dt><a href="#fetchFiles">fetchFiles(containerName, params)</a> ⇒ <code>Promise</code></dt>
<dd><p>Returns a list of files stored in the container.</p>
</dd>
<dt><a href="#uploadFile">uploadFile(fullLocalPath, hostingPath, additionalHeaders)</a> ⇒ <code>Promise</code></dt>
<dd><p>Uploads a file to the container.</p>
</dd>
<dt><a href="#extractArchive">extractArchive(readStream, hostingPath, arhFormat)</a> ⇒ <code>Promise</code></dt>
<dd><p>Extracts the archive.</p>
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
Gets the authentication token (key) for accessing storage and sets it internally.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| login | <code>string</code> | account number |
| pass | <code>string</code> | storage password |

<a name="info"></a>

## info() ⇒ <code>Promise</code>
Returns general information about account: total number of containers, total number of objects,
total volume of data stored, total volume of data downloaded.

**Kind**: global function  
<a name="fetchContainers"></a>

## fetchContainers(format, limit, marker) ⇒ <code>Promise</code>
Returns the list of available containers.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| format | <code>string</code> | 'json' or 'xml' |
| limit | <code>string</code> | the maximum number of objects on a list (default - 10 000) |
| marker | <code>string</code> | the name of the final container from the previous request |

<a name="createContainer"></a>

## createContainer(containerName, containerType) ⇒ <code>Promise</code>
Creates a new container.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| containerName | <code>string</code> | name of the container |
| containerType | <code>string</code> | container type: 'public', 'private' or 'gallery' |

<a name="infoContainer"></a>

## infoContainer(containerName) ⇒ <code>Promise</code>
Returns a container's information.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| containerName | <code>string</code> | name of the container |

<a name="editContainer"></a>

## editContainer(containerName, containerType) ⇒ <code>Promise</code>
Changes a container’s metadata.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| containerName | <code>string</code> | name of the container |
| containerType | <code>string</code> | container type: 'public', 'private' or 'gallery' |

<a name="deleteContainer"></a>

## deleteContainer(containerName) ⇒ <code>Promise</code>
Deletes the container.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| containerName | <code>string</code> | name of the container |

<a name="fetchFiles"></a>

## fetchFiles(containerName, params) ⇒ <code>Promise</code>
Returns a list of files stored in the container.

**Kind**: global function  

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
Extracts the archive.

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


# selectel-storage-promise
Manage Selectel's storage

## API
[Selectel's Documentation](https://support.selectel.ru/storage/api_info/)

## Installation

    npm install selectel-storage-promise --save

## Usage

    var selectel = require('selectel-storage-promise');
    
    async () => {
        await selectel.auth(SELECTEL_LOGIN, SELECTEL_PASS);
        
        await selectel.info();
        
        await selectel.fetchContainers('json');
        
        await selectel.createContainer('test', 'private');
        
        await selectel.infoContainer('test');
        
        await selectel.editContainer('test', 'public');
        
        await selectel.fetchFiles('mocha', {
              format: 'json'
            });
            
        await selectel.uploadFile(__dirname + '/files/file.jpg', '/test/file.jpg');
        
        await selectel.extractArchive(
            targz({}, { fromBase: true }).createReadStream(__dirname + '/files'), 
            '/test', 
            'tar.gz'
            );
            
        await selectel.copyFile('/test/file.jpg', '/test/file-copy.jpg');
        
        await selectel.deleteFile('/test/file.jpg');
      };

 

## License

Copyright (C) 2016 [Andrey Aleshkov](mailto: aleshkov.andrey@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

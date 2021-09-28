# docker-transfer
Transfer docker images with ssh

## CLI
```
npx docker-transfer me@host.tld image1:tag1,image2:tag2
```

## Node

#### install
```
npm install docker-transfer
```

#### Usage
```javascript
import { dockerTransfer } from 'docker-transfer'

const options = {
    host: 'me@host.tld',
    images: ['myimage1:tag1','myimage2:tag2']
    /** see typedef.js for all options */
}

dockerTransfer(options)
```

## CLI API
```
Usage: docker-transfer [options] <host> <images>

Copy local docker images to remote host

Arguments:
  host                       destination for images
  images                     comma separated list

Options:
  -t --temp-dir <dir>        path for storing temporary files locally (default: ${tempdir}/docker-transfer)
  -p --preserve-temp         don't delete or overwrite existing temporary files
  -r --preserve-remote-temp  don't delete temporary files on remote
  -h, --help                 display help for command
```


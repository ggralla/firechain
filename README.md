# firechain


## Install

`npm install https://github.com/ggralla/firechain `

## Reading and Writing

```
import { fireRead, fireWrite, fireCreate } from 'firechain';  

// Initialize database
fireCreate();

fireWrite('testKey', 'testValue');
fireRead('testKey').then((value) => console.log(value))
```

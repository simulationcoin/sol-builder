# Solidity Contract Builder

Simple module for building solidity contracts for the Ethereum platform using javascript. 

This is particularly useful when you have to build a contract using parameters specified by your end user. Using sol-builder you can add/remove attributes, change types, change function signatures, etc, without having to manipulate directly the string representing the contract.

After configuring your contract, you get the result code (beautified) using the function `getContract()`.

# Install

To install the module, just run
```
sudo npm install sol-builder -g
```

# Testing
To test this code, run:
```
npm test
```

# Creating a contract

To create a simple contract, all you have to do is set its name. Optionally, you can specify a parent contract like the example below. 

```javascript
var builder = require('sol-builder');

builder.setName('MyContract');
builder.is('ParentContract');

console.log(builder.getContract());
```

This code will print:

```javascript
contract MyContract is ParentContract {

}
```

# Adding attributes

You can add attributes to your contract by using the function `addAttribyte` specifying a single object as parameter. This object contains all properties of this attribute. Valid properties are:

* name: The name of this attributes.
* type: Type of the attributes.
* modifier (optional): A modifier for the attribute. Valid values are: `public`, `private` or `private`.
* value (optional): The initialization value of this attribute.
* comment (optional): Some comment for this attributes that will live just above its declaration.
* lineBreak (optional) Whether you want to break line after its declaration.

The code below illustrates the use of the `addAttribute` function.

```javascript
builder.addAttribute({
    name: 'attr1',
    type: 'uint',
    modifier: 'public',
    comment: 'Just a simple comment',
    value: '123'
});
```

Assuming the code below is inserted into the previous example shown, the result would be:

```javascript
contract MyContract is ParentContract {

    uint public attr1 = 123;
}
```

# Changing properties of attributes

You can change any property of an attribute by using the function `changeAttribute` and passing an object specifying which property(ies) you would like to change. The property `name` should always be specified since it's used to find the attribute. For instance:

```javascript
builder.changeAttribute({
    name: 'attr1',
    value: '999'
});
```

will result:

```javascript
contract MyContract is ParentContract {

    uint public attr1 = 999;
}
```

Another example, changing more than one property:

```javascript
builder.changeAttribute({
    name: 'attr1',
    value: '999',
    comment: 'Just a test comment',
    modifier: undefined
});
```

Result:

```javascript
contract MyContract is ParentContract {

    // Just a test comment
    uint attr1 = 999;
}
```

# Removing an attribute

You can easily remove an attribute by using `removeAttribute` and specifying the attribute name to be removed.

# Adding a struct

Structs can be added into your contract using the function `addStruct`. The object passed as parameter accepts the following properties:

* name: The name of the struct being built.
* attributes: List of attributes of the struct. The attribute type accepts all the properties of a contract attribute but the modifier.
* comment (optional): Any comment you want to add to the struct.


For instance, the code

```javascript
builder.addStruct({
    name: 'MyStruct',
    comment: 'Just a test…',
    attributes:[
        {
            name: 'attr1',
            type: 'address',
            comment: 'struct attr1'
            lineBreak: true
        },
        {
            name: 'attr2',
            type: 'uint',
            value: '123'
        }
    ];
});
```

will produce:

```javascript
contract MyContract is ParentContract {

    // Just a test...
    struct MyStruct {
        // struct attr1
        address attr1;

        uint attr2 = 123;
    }
}
```

# Removing and changing a struct

The same logic for contract attributes applies here: use the functions `removeStruct(name)` and `changeStruct(obj)`.

# Adding a mapping

Add a mapping into your contract by using the function `addMapping`. The object passed as parameter accepts the following properties:

* name: Mapping name.
* keyType: Type of the key.
* valueType: Type of the value.
* comment (optional): some comment that will show above the mapping declaration.
* modifier (optional): modifier of the mapping. Valid values are `private`, `public` and `internal`.
* lineBreak (optional): whether a line break should be inserted below the mapping declaration.

For example, the code

```javascript
builder.addMapping({
    name: 'records',
    keyType: 'bytes32',
    valueType: 'address',
    comment: 'Just a sample mapping'
});
```

will produce

```javascript
contract MyContract is ParentContract {

    // Just a sample mapping
    mapping(bytes32 => address) records;
}
```

# Removing and changing a mapping

The same logic for contract attributes applies here: use the functions `removeMapping(name)` and `changeMapping(obj)`.

# Adding a function

Insert a function into your contract by using the function `addFunction`. Valid properties for the object passed as parameter for this function are:

* name: Function's name.
* parameters (optional): List of function's parameters. Each object should contain `name` and `type`.
* returnType (optional): if this function returns a value, specify its type using this property.
* body: the actual body of the function. There is no need to indent code here since all the contract code is beautified at the end.
* lineBreak (optional): whether a line break should be inserted after this function.

Example:

```javascript
builder.addFunction({
    name: 'myFunc',
    comment: 'Sample function',
    parameters:[
        {
            name: 'param1',
            type: 'address'
        },
        {
            name: 'param2',
            type: 'bytes32'
        }
    ],
    returnType: 'bytes32',
    body: 'some code1; some code2; some code3'
});
```

Result:

```javascript
contract MyContract is ParentContract {

    // Sample function
    function (address param1, bytes32 param2) returns(bytes32) {
        some code1;
        some code2;
        some code3;
    }
}

```

# Changing and removing a function

The same logic for contract attributes applies here: use the functions `removeFunction(name)` and `changeFunction(obj)`.

# Placeholders

You can also add some placeholders in your code for later substitution. For instance, you may want to change just a tiny part of a function body instead of replace it all. Using the previous example code, you can set the property `body` to something like `some code1;UI_PLACEHOLDER_1;some code3;`. Then you can use:

```javascript
builder.addReplacement('UI_PLACEHOLDER_1', '');
```

which would yield the result:

```javascript
contract MyContract is ParentContract {

    // Sample function
    function (address param1, bytes32 param2) returns(bytes32) {
        some code1;
        some code3;
    }
}
```

or 

```javascript
builder.addReplacement('UI_PLACEHOLDER_1', 'some code 2.1; some code2.2;');
```

which would yield the result:
```javascript
contract MyContract is ParentContract {

    // Sample function
    function (address param1, bytes32 param2) returns(bytes32) {
        some code1;
        some code 2.1;
        some code 2.2;
        some code3;
    }
}
```



# A complete example

```javascript
var builder = require('sol-builder');

builder.setName('MyContract');
builder.is('ParentContract');

builder.addAttribute({
    name:     'someNumber',
    type:     'uint8',
    modifier: 'public',                   /* optional */
    value:    '16',                       /* optional */
    comment:  'Just a test attribute...', /* optional */
    lineBreak: true                       /* optional */
});

builder.addStruct({
    name: 'Record',
    comment: 'Test struct...', /* optional */
    lineBreak: true,           /* optional */
    attributes: [
        {
            name: 'myNumber',
            type: 'uint32',
            comment: 'Simple comment', /* optional */
            lineBreak: false           /* optional */
        },
        {
            name: 'myAddress',
            type: 'address',
            lineBreak: false /* optional */
        }
    ]
});

builder.addMapping({
    name: 'records',
    keyType: 'address',
    valueType: 'Record',
    modifier: 'public',     /* optional */
    comment: 'test',        /* optional */
    lineBreak: true         /* optional */
});

builder.addFunction({
    name: 'myFunc',
    comment: 'Simple function', /* optional */
    parameters: [
        {
            name: '_number',
            type: 'uint32'
        }
    ],
    body: 'someNumber++;someNumber += _number;'

});

console.log(builder.getContract());
```

The code above would produce the following output:

```javascript
contract MyContract is ParentContract {

    // Just a test attribute...
    uint8 public someNumber = 16;

    // Test struct...
    struct Record {
        // Simple comment
        uint32 myNumber;
        address myAddress;
    }

    // test
    mapping public(address => Record) records;

    // Simple function
    function myFunc(uint32 _number) {
        someNumber++;
        someNumber += _number;
    }
}

```


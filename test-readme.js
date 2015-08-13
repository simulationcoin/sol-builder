var builder = require('./sol-builder.js');

builder.addContract({name: 'Test', is: 'Parent'});

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
            comment: 'Simple comment aldkfajsfl kjf kdjsf lkjsf lkja dflkja lfkaj lfakjfd salkj lklkjf akdjsf akjlf adksjlf akdsjfl askdflja kdsfjakjfkdjfkdjfdj kls', /* optional */
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

builder.addContract({name: 'Other', is: 'Test'});

console.log(builder.getContract());

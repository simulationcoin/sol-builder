var builder = require('../sol-builder.js')

exports['tests'] = function(assert) {

    builder.setName('MyContract')
    assert.equal(builder.getContract(), 
        'contract MyContract {\n\n}', 'Test setName')

    
    builder.is('ParentContract')
    assert.equal(builder.getContract(), 
        'contract MyContract is ParentContract {\n\n}', 'Test is')


    builder.addAttribute({
        name: 'attr1',
        type: 'address'
    })
    assert.equal(builder.getContract(), 
        'contract MyContract is ParentContract {\n\n    address attr1;\n}', 'Test addAttribute (simple)')


    builder.removeAttribute('attr1')
    assert.equal(builder.getContract(), 
        'contract MyContract is ParentContract {\n\n}', 'Test removeAttribute')


    builder.addAttribute({
        name: 'attr1',
        type: 'address',
        lineBreak: true
    })
    assert.equal(builder.getContract(), 
        'contract MyContract is ParentContract {\n\n    address attr1;\n\n}', 'Test addAttribute (lineBreak)')


    builder.removeAttribute('attr1')
    builder.addAttribute({
        name: 'attr1',
        type: 'address',
        value: '"0x0"'
    })
    assert.equal(builder.getContract(), 
        'contract MyContract is ParentContract {\n\n    address attr1 = "0x0";\n}', 'Test addAttribute (value)')


    builder.removeAttribute('attr1')
    builder.addAttribute({
        name: 'attr1',
        type: 'address',
        modifier: 'public'
    })
    assert.equal(builder.getContract(), 
        'contract MyContract is ParentContract {\n\n    address public attr1;\n}', 'Test addAttribute (modifier)')


    builder.removeAttribute('attr1')
    builder.addAttribute({
        name: 'attr1',
        type: 'address',
        comment: 'Test comment'
    })
    assert.equal(builder.getContract(), 
        'contract MyContract is ParentContract {\n\n    // Test comment\n    address attr1;\n}', 'Test addAttribute (comment)')


    builder.removeAttribute('attr1')
    builder.addAttribute({
        name: 'attr1',
        type: 'address',
        modifier: 'public',
        value: '"0x0"',
        lineBreak: true,
        comment: 'Test comment'
    })
    assert.equal(builder.getContract(), 
        'contract MyContract is ParentContract {\n\n    // Test comment\n    address public attr1 = "0x0";\n\n}', 'Test addAttribute (all)')


    builder.removeAttribute('attr1')
    builder.addAttribute({
        name: 'attr1',
        type: 'address',
        value: '"0x0"'
    })
    builder.changeAttribute({
        name: 'attr1',
        type: 'bytes32',
        value: '"0x1"'
    });
    assert.equal(builder.getContract(), 
        'contract MyContract is ParentContract {\n\n    bytes32 attr1 = "0x1";\n}', 'Test changeAttribute')


    builder.changeAttribute({
        name: 'attr1',
        comment: 'Testing'
    });
    assert.equal(builder.getContract(), 
        'contract MyContract is ParentContract {\n\n    // Testing\n    bytes32 attr1 = "0x1";\n}', 'Test changeAttribute (comment)')


    builder.removeAttribute('attr1')
    builder.addMapping({
        name: 'map',
        keyType: 'address',
        valueType: 'bytes32'
    });
    assert.equal(builder.getContract(), 
        'contract MyContract is ParentContract {\n\n    mapping(address => bytes32) map;\n}', 'Test addMapping')


    builder.removeMapping('map');
    assert.equal(builder.getContract(), 
        'contract MyContract is ParentContract {\n\n}', 'Test removeMapping')


    builder.addMapping({
        name: 'map',
        keyType: 'address',
        valueType: 'bytes32',
        comment: 'Testing'
    });
    assert.equal(builder.getContract(), 
        'contract MyContract is ParentContract {\n\n    // Testing\n    mapping(address => bytes32) map;\n}', 'Test addMapping (comment)')


    builder.removeMapping('map');
    builder.addMapping({
        name: 'map',
        keyType: 'address',
        valueType: 'bytes32',
        lineBreak: true
    });
    assert.equal(builder.getContract(), 
        'contract MyContract is ParentContract {\n\n    mapping(address => bytes32) map;\n\n}', 'Test addMapping (lineBreak)')


    builder.changeMapping({
        name: 'map',
        keyType: 'bytes32'
    });
    assert.equal(builder.getContract(), 
        'contract MyContract is ParentContract {\n\n    mapping(bytes32 => bytes32) map;\n\n}', 'Test changeMapping (keyType)')


    builder.changeMapping({
        name: 'map',
        valueType: 'address'
    });
    assert.equal(builder.getContract(), 
        'contract MyContract is ParentContract {\n\n    mapping(bytes32 => address) map;\n\n}', 'Test changeMapping (valueType)')


    builder.removeMapping('map');
    builder.addStruct({
        name: 'MyStruct',
        attributes: [
            {name: 'attr1', type: 'address'},
            {name: 'attr2', type: 'bytes32', comment: 'Testing'}
        ]
    });
    assert.equal(builder.getContract(), 
        'contract MyContract is ParentContract {\n\n    struct MyStruct {\n        address attr1;\n        // Testing\n        bytes32 attr2;\n    }\n}', 'Test addStruct')


    builder.changeStruct({
        name: 'MyStruct',
        comment: 'Testing',
        attributes: [
            {name: 'attr1', type: 'address'},
            {name: 'attr2', type: 'bytes32'}
        ]
    });
    assert.equal(builder.getContract(), 
        'contract MyContract is ParentContract {\n\n    // Testing\n    struct MyStruct {\n        address attr1;\n        bytes32 attr2;\n    }\n}', 'Test changeStruct')


    builder.removeStruct('MyStruct');
    assert.equal(builder.getContract(), 
        'contract MyContract is ParentContract {\n\n}', 'Test removeStruct')


    builder.addFunction({
        name: 'myFunc',
        comment: 'Testing',
        parameters: [
            {name: 'param1', type: 'address'},
            {name: 'param2', type: 'bytes32'}
        ],
        returnType: 'bytes32',
        body: 'some code;'
    });
    assert.equal(builder.getContract(), 
        'contract MyContract is ParentContract {\n\n    // Testing\n    function myFunc(address param1, bytes32 param2) returns(bytes32) {\n        some code;\n    }\n}', 'Test addFunction')


    builder.changeFunction({
        name: 'myFunc',
        comment: undefined
    });
    assert.equal(builder.getContract(), 
        'contract MyContract is ParentContract {\n\n    function myFunc(address param1, bytes32 param2) returns(bytes32) {\n        some code;\n    }\n}', 'Test changeFunction')

}

if (module == require.main) require('test').run(exports)

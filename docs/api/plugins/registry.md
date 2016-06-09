<a name="module_plugins/registry"></a>

## plugins/registry
pluginRegistry module. Used to create pluginRegistry objects.



* [plugins/registry](#module_plugins/registry)
    * _exports_
        * [⏏ exports.createPluginRegistry([...initialPlugins])](#exp_module_plugins/registry.createPluginRegistry) ⇒ <code>[pluginRegistry](#module_plugins/registry..pluginRegistry)</code>
    * _inner_
        * [~pluginRegistry](#module_plugins/registry..pluginRegistry) : <code>Object</code>
            * [.registerPlugins(...plugins)](#module_plugins/registry..pluginRegistry.registerPlugins)


-----

<a name="exp_module_plugins/registry.createPluginRegistry"></a>

###  ⏏ exports.createPluginRegistry([...initialPlugins]) ⇒ <code>[pluginRegistry](#module_plugins/registry..pluginRegistry)</code>
Creates a plugin registry

**Kind**: exports method of <code>[plugins/registry](#module_plugins/registry)</code>  
**Returns**: <code>[pluginRegistry](#module_plugins/registry..pluginRegistry)</code> - pluginRegistry  

| Param | Type | Description |
| --- | --- | --- |
| [...initialPlugins] | <code>Object</code> | Plugins for initial registration. |


-----

<a name="module_plugins/registry..pluginRegistry"></a>

### plugins/registry~pluginRegistry : <code>Object</code>
pluginRegistry description

**Kind**: inner property of <code>[plugins/registry](#module_plugins/registry)</code>  


-----

<a name="module_plugins/registry..pluginRegistry.registerPlugins"></a>

#### pluginRegistry.registerPlugins(...plugins)
Register plugins

**Kind**: static method of <code>[pluginRegistry](#module_plugins/registry..pluginRegistry)</code>  


| Param | Type | Description |
| --- | --- | --- |
| ...plugins | <code>Object</code> | Plugins to register |


-----


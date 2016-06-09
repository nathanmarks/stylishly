<a name="module_styleManager"></a>

## styleManager
styleManager module. Used to create styleManager objects.



* [styleManager](#module_styleManager)
    * _exports_
        * [⏏ exports.createStyleManager([options])](#exp_module_styleManager.createStyleManager) ⇒ <code>[styleManager](#module_styleManager..styleManager)</code>
    * _inner_
        * [~styleManager](#module_styleManager..styleManager) : <code>Object</code>
            * [.render(styleSheet)](#module_styleManager..styleManager.render) ⇒ <code>Object</code>


-----

<a name="exp_module_styleManager.createStyleManager"></a>

###  ⏏ exports.createStyleManager([options]) ⇒ <code>[styleManager](#module_styleManager..styleManager)</code>
Creates a new styleManager

**Kind**: exports method of <code>[styleManager](#module_styleManager)</code>  
**Returns**: <code>[styleManager](#module_styleManager..styleManager)</code> - styleManager  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> |  |
| [options.renderer] | <code>Object</code> | <code>defaultRenderer</code> | Creates a virtual or DOM renderer. |
| [options.pluginRegistry] | <code>Object</code> | <code>pluginRegistry</code> | A plugin registry, all features enabled by default. |
| [options.theme] | <code>Object</code> | <code>{}</code> | Theme object |

**Example**  
```javascript
import { createStyleManager } from 'stylishly/styleManager';
const styleManager = createStyleManager();
```

-----

<a name="module_styleManager..styleManager"></a>

### styleManager~styleManager : <code>Object</code>
styleManager description

**Kind**: inner property of <code>[styleManager](#module_styleManager)</code>  


-----

<a name="module_styleManager..styleManager.render"></a>

#### styleManager.render(styleSheet) ⇒ <code>Object</code>
Some mundane desc

**Kind**: static method of <code>[styleManager](#module_styleManager..styleManager)</code>  
**Returns**: <code>Object</code> - classNames keyed by styleSheet property names  

| Param | Type | Description |
| --- | --- | --- |
| styleSheet | <code>Object</code> | styleSheet object created by createStyleSheet() |


-----


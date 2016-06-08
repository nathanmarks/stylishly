<a name="module_styleManager"></a>

## styleManager
styleManager module. Used to create styleSheet objects.



-----

<a name="exp_module_styleManager.createStyleManager"></a>

###  ⏏ exports.createStyleManager([options]) ⇒ <code>[StyleMSSS](#StyleMSSS)</code>
Creates a new styleManager

**Kind**: exports method of <code>[styleManager](#module_styleManager)</code>  
**Returns**: <code>[StyleMSSS](#StyleMSSS)</code> - styleManager  

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


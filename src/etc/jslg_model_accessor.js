var jslgEngine = jslgEngine||{};

jslgEngine.jslgModelAccessor = (function() {
    return {
        converter : new jslgEngine.model.logic.Converter(),
        initialize : function(converter) {},
        getKey : function(obj) {
            if(!obj.getKey) return null;
            
            return obj.getKey();
        },
        setKey : function(obj, key) {
            obj.setKey(key);
        },
        getThumbnail : function(obj) {
            if(!obj.getStatus) return '';
            
            var status = obj.getStatus('thumbnail');
            return status ? status.value : '';
        },
        setThumbnail : function(obj, value) {
            obj.setStatus('thumbnail', value);
        },
        getLocation : function(obj) {
            return obj.location;
        },
        getSize : function(obj) {
            return obj.size;
        },
        setSize : function(obj, size) {
            obj.size = size;
        },
        getParameters : function(obj) {
            return obj._parameters;
        },
        setParameters : function(obj, param) {
            obj._parameters = param;
        },
        getStatus : function(obj, key) {
            if(!obj.getStatus) return '';
            
            var status = obj.getStatus(key);
            return status ? status.value : '';
        },
        setStatus : function(obj, key, value) {
            obj.setStatus(key, value);
        },
        setExportOption : function(obj, is_available) {
            obj.isUnexportment = !is_available;
        },
        setStatusExportOption : function(obj, key, is_available) {
            var status = obj.getChild({
                key : key
            });
            status.isUnexportment = !is_available;
        },
        removeAllStatus : function(obj) {
            var children = obj.getChildren();
            for(var i = 0; i < children.length; i++) {
                var child = children[i];
                if(child.className.indexOf('Status') != -1) {
                    children.splice(i, 1);
                    i--;
                }
            }
        },
        removeAllActions : function(obj) {
            var children = obj.getChildren();
            for(var i = 0; i < children.length; i++) {
                var child = children[i];
                if(child.isCommandChild) {
                    children.splice(i, 1);
                    i--;
                }
            }
        },
        getChildren : function(obj) {
            return obj._children;
        },
        setChildren : function(obj, children) {
            obj._children = children;
        },
        addModel : function(obj, data) {
            data.createdElements = [];
            var model = this.converter.getModel(data);
            obj._children.push(model);
            return model;
        },
        getNewElement : function(data) {
            data.createdElements = [];
            return this.converter.getModel(data);
        }
    };
})();

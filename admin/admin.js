// @ts-nocheck

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
function log(message) {
    sendTo('system.adapter.xiaomi-remote.0', 'log', message);
}

function learn(id) {
    event.stopPropagation();

    const item = remoteData.buttons.find(b => b.id == id);
    $("#jsGrid").jsGrid("updateItem", item, {...item, checkData: {isLoading: true} });

    sendTo('system.adapter.xiaomi-remote.0', 'learn', { key: item.id }, (message) => {
        const code = message.code;
        const newItem = { ...item, code: code };
        newItem.checkData = { checked: true, isLoading: false };
        $("#jsGrid").jsGrid("updateItem", item, newItem);
    });
}

function play(id) {
    event.stopPropagation();
    const item = remoteData.buttons.find(b => b.id == id);
    sendTo('system.adapter.xiaomi-remote.0', 'play', { code: item.code });
}

var buttonField = function(config) {
    jsGrid.Field.call(this, config);
};
buttonField.prototype = new jsGrid.Field({
    align: "center",

    itemTemplate: function(value, item) {
        return `<button onclick="${this.onclick}('${item.id}')">${this.text}</button>`
    }
});
jsGrid.fields.button = buttonField;

var checkField = function(config) {
    jsGrid.Field.call(this, config);
};
checkField.prototype = new jsGrid.Field({
    align: 'center',

    itemTemplate: function(value) {
        this.css = value.isLoading ? 'loading' : '';
        if (value.isLoading) {
            return;
        }

        return  value.checked ? `<img src="check.png" width="16px" height="16px">` : ''
    }
});
jsGrid.fields.check = checkField;

let onDataChange;

function bindData() {
    $('#txtRemoteName').val(remoteData.name);

    $("#jsGrid").jsGrid({
        width: "600px",
        height: "400px",

        inserting: true,
        editing: true,

        data: remoteData.buttons,
        onItemInserted: (item) => {
            item.id = uuidv4();
            onDataChange();
        },
        onItemUpdated: (params) => {
            console.log(params)
            onDataChange();
        },
        onItemDeleted: (params) => {
            console.log(item)
            onDataChange();
        },

        fields: [
            { name: "name", type: "text", title: 'Button', width: 110,
                validate: { 
                    message: "Buttons should be specified and has unique value", 
                    validator: function(value) { 
                        if (value.trim().length == 0) {
                            return false;
                        }
                        if (remoteData.buttons && remoteData.buttons.some(b => b.Name === value)){
                            return false;
                        }
                        return true;
                    }
                }
            },
            { name: "checkData", type: "check", title:"Has Code", width: 60 },
            { type: "button", title: 'Learn', text: 'Learn', onclick: 'learn',  width: 50 },
            { type: "button", title: 'Play', text: 'Play', onclick: 'play', width: 50 },
            { type: "control" }
        ]
    });
}
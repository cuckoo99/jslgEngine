var toolItemInfo = [{
	className : 'ResourceElement',
	type : 'Frame',
    defaultThumbnail : './sample/images/map_03.gif',
	creation : 'ResourceElement',
	hasSize : false,
	hasLocation : false,
	accept : [],
	menuItems : [{
        name : 'Edit',
        value : 'edit'
    }, {
        name : 'Remove',
        value : 'remove'
    }],
	addingMenuItems : [{
        name : 'ResourceElement',
        value : 'add'
    }]
},{
	className : 'StageFrame',
	type : 'Frame',
    defaultThumbnail : './sample/images/map_03.gif',
	creation : 'Stage',
	hasSize : true,
	hasLocation : false,
	accept : ['GroundFrame', 'Command'],
	menuItems : [{
        name : 'Edit',
        value : 'edit'
    }, {
        name : 'Remove',
        value : 'remove'
    }],
	addingMenuItems : [{
        name : 'StageFrame',
        value : 'add'
    }]
},
{
	className : 'GroundFrame',
	type : 'Frame',
    defaultThumbnail : './sample/images/map_03.gif',
	creation : 'Ground',
	hasSize : false,
	hasLocation : false,
	accept : ['CastFrame', 'Command'],
	menuItems : [{
        name : 'Edit',
        value : 'edit'
    }, {
        name : 'Remove',
        value : 'remove'
    }],
	addingMenuItems : [{
        name : 'GroundFrame',
        value : 'add'
    }]
},
{
	className : 'CastFrame',
	type : 'Frame',
    defaultThumbnail : './sample/images/map_03.gif',
	hasSize : false,
	hasLocation : false,
	accept : ['ItemFrame', 'Command'],
	creation : 'Cast',
	menuItems : [{
        name : 'Edit',
        value : 'edit'
    }, {
        name : 'Remove',
        value : 'remove'
    }],
	addingMenuItems : [{
        name : 'CastFrame',
        value : 'add'
    }]
},
{
	className : 'ItemFrame',
	type : 'Frame',
    defaultThumbnail : './sample/images/map_03.gif',
	creation : 'Item',
	hasSize : false,
	hasLocation : false,
	accept : ['Command'],
	menuItems : [{
        name : 'Edit',
        value : 'edit'
    }, {
        name : 'Remove',
        value : 'remove'
    }],
	addingMenuItems : [{
        name : 'ItemFrame',
        value : 'add'
    }]
},
{
	className : 'MindFrame',
	type : 'Frame',
    defaultThumbnail : './sample/images/map_03.gif',
	hasSize : false,
	hasLocation : false,
	accept : [],
	menuItems : [{
        name : 'Edit',
        value : 'edit'
    }, {
        name : 'Remove',
        value : 'remove'
    }],
	addingMenuItems : [{
        name : 'MindFrame',
        value : 'add'
    }]
},
{
	className : 'Mind',
	type : 'Element',
    defaultThumbnail : './sample/images/map_03.gif',
	hasSize : false,
	hasLocation : false,
	accept : [],
	menuItems : [{
        name : 'Edit',
        value : 'edit'
    }, {
        name : 'Remove',
        value : 'remove'
    }],
	addingMenuItems : [{
        name : 'Mind',
        value : 'add'
    }]
},
{
	className : 'Command',
	type : 'Frame',
    defaultThumbnail : './sample/images/command_01.gif',
	creation : 'Command',
	hasSize : false,
	hasLocation : false,
	accept : [],
	menuItems : [{
        name : 'Edit',
        value : 'edit'
    }, {
        name : 'Remove',
        value : 'remove'
    }],
	addingMenuItems : [{
        name : 'Command',
        value : 'add'
    }]
},
{
	className : 'LocalRegion',
	type : 'Element',
    defaultThumbnail : './sample/images/map_03.gif',
	hasSize : true,
	hasLocation : true,
	accept : ['StageFrame', 'Command'],
	menuItems : [{
        name : 'Edit',
        value : 'edit'
    }, {
        name : 'Remove',
        value : 'remove'
    }],
	addingMenuItems : [{
        name : 'Command',
        value : 'add'
    }]
},
{
	className : 'Resource',
	type : 'Element',
    defaultThumbnail : './sample/images/map_03.gif',
	hasSize : false,
	hasLocation : false,
	accept : [],
	menuItems : [{
        name : 'Edit',
        value : 'edit'
    }, {
        name : 'Remove',
        value : 'remove'
    }],
	addingMenuItems : []
},
{
	className : 'Stage',
	type : 'Element',
    defaultThumbnail : './sample/images/map_03.gif',
	hasSize : true,
	hasLocation : true,
	accept : ['GroundFrame', 'Command'],
	menuItems : [{
        name : 'Edit',
        value : 'edit'
    }, {
        name : 'Remove',
        value : 'remove'
    }],
	addingMenuItems : [{
        name : 'Command',
        value : 'add'
    }]
},
{
	className : 'Ground',
	type : 'Element',
    defaultThumbnail : './sample/images/map_03.gif',
	hasSize : false,
	hasLocation : true,
	accept : ['CastFrame', 'Command'],
	menuItems : [{
        name : 'Edit',
        value : 'edit'
    }, {
        name : 'Remove',
        value : 'remove'
    }],
	addingMenuItems : [{
        name : 'Command',
        value : 'add'
    }]
},
{
	className : 'Cast',
	type : 'Element',
    defaultThumbnail : './sample/images/map_03.gif',
	hasSize : false,
	hasLocation : false,
	accept : ['ItemFrame', 'Command', 'MindFrame'],
	menuItems : [{
        name : 'Edit',
        value : 'edit'
    }, {
        name : 'Remove',
        value : 'remove'
    }],
	addingMenuItems : [{
        name : 'Command',
        value : 'add'
    }]
},
{
	className : 'Item',
	type : 'Element',
    defaultThumbnail : './sample/images/map_03.gif',
	hasSize : false,
	hasLocation : false,
	accept : ['Command'],
	menuItems : [{
        name : 'Edit',
        value : 'edit'
    }, {
        name : 'Remove',
        value : 'remove'
    }],
	addingMenuItems : [{
        name : 'Command',
        value : 'add'
    }]
}];

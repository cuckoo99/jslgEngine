var sample = {};
sample.elements = {
	'className' : 'LocalRegion',
	key : 'l1',
	'location' : {
		'x' : 0,
		'y' : 0,
		'z' : 0
	},
	'size' : {
		'width' : 10,
		'height' : 10,
		'depth' : 10
	},
	children : [{
		className : 'Resource',
		key : 'map1',
        children : [{
			className : 'Status',
			key : 'thumbnail',
			value : './sample/images/map_03.gif'
		},{
			className : 'Status',
			key : 'fileType',
		    value : 'Image',
		},{
			className : 'Status',
			key : 'url',
		    value : './sample/images/map_04.gif',
		}]
	},{
		className : 'Resource',
		fileType : 'Image',
		key : 'human1',
        children : [{
			className : 'Status',
			key : 'thumbnail',
			value : './sample/images/human_thumb.gif'
		},{
			className : 'Status',
			key : 'fileType',
		    value : 'Image',
		},{
			className : 'Status',
			key : 'url',
		    value : './sample/images/human_01.gif',
		}]
	},{
		className : 'Resource',
		fileType : 'Image',
		key : 'monster1',
        children : [{
			className : 'Status',
			key : 'thumbnail',
			value : './sample/images/monster_thumb.gif'
		},{
			className : 'Status',
			key : 'fileType',
		    value : 'Image',
		},{
			className : 'Status',
			key : 'url',
		    value : './sample/images/monster_01.gif',
		}]
	},{
		className : 'Resource',
		fileType : 'Image',
		key : 'grid1',
        children : [{
			className : 'Status',
			key : 'thumbnail',
			value : './sample/images/map_03.gif'
		},{
			className : 'Status',
			key : 'fileType',
		    value : 'Image',
		},{
			className : 'Status',
			key : 'url',
		    value : './sample/images/grid1.jpg',
		}]
	}, {
		className : 'MindFrame',
		key : 'pmind',
        children : [{
			className : 'Status',
			key : 'thumbnail',
			value : './sample/images/heart_01.gif'
		},{
			className : 'Status',
			key : 'memberKey',
			value : 'belongs'
		},{
			className : 'Status',
			key : 'decreasedKeys',
			value : ['life']
		},{
			className : 'Status',
			key : 'increasedKeys',
			value : []
		},{
			className : 'Status',
			key : 'familyMemberNames',
			value : ['player']
		},{
			className : 'Status',
			key : 'enemyMemberNames',
			value : ['enemy']
		},{
			className : 'Status',
			key : 'commandKey',
			value : ''
		},{
			className : 'Status',
			key : 'commandValue',
			value : ''
		}]
	}, {
		className : 'MindFrame',
		key : 'emind',
        children : [{
			className : 'Status',
			key : 'thumbnail',
			value : './sample/images/heart_02.gif'
		},{
			className : 'Status',
			key : 'memberKey',
			value : 'belongs'
		},{
			className : 'Status',
			key : 'decreasedKeys',
			value : ['life']
		},{
			className : 'Status',
			key : 'increasedKeys',
			value : []
		},{
			className : 'Status',
			key : 'familyMemberNames',
			value : ['enemy']
		},{
			className : 'Status',
			key : 'enemyMemberNames',
			value : ['player']
		},{
			className : 'Status',
			key : 'commandKey',
			value : ''
		},{
			className : 'Status',
			key : 'commandValue',
			value : ''
		}]
	}, {
		className : 'Command',
		key : 'onClick',
		children : [{
			className : 'Status',
			key : 'thumbnail',
			value : './sample/images/command_01.gif'
		}, {
			className : 'ActionJSlgMenu',
			parameters : ['$THIS.parent()']
		}]
	},{
		className : 'StageFrame',
		key : 'stgf1',
		'size' : {
			'width' : 10,
			'height' : 10,
			'depth' : 10
		},
		children : [{
			className : 'Status',
			key : 'thumbnail',
			value : './sample/images/stage_01.gif'
		}, {
			className : 'Status',
			key : 'className',
			value : 'grass'
		}, {
			className : 'Status',
			key : 'effect',
			value : '0'
		}]
	},{
		className : 'GroundFrame',
		key : 'gndf1',
		children : [{
			className : 'Status',
			key : 'thumbnail',
			value : './sample/images/map_03.gif'
		}, {
			className : 'Status',
			key : 'className',
			value : 'grass'
		}, {
			className : 'Status',
			key : 'effect',
			value : '0'
		}, {
			className : 'Status',
			key : '_graphics',
			value : [
				['map1','0','0','160','160'],
				[['default','0','0'],['area0','4','5'],['area1','8','8']]
			]
		}]
	},{
		className : 'CastFrame',
		key : 'cstf1',
		children : [{
			className : 'Status',
			key : 'thumbnail',
			value : './sample/images/human_thumb.gif'
		}, {
			className : 'Status',
			key : 'belongs',
			value : 'player'
		}, {
			className : 'Status',
			key : 'life',
			value : '8'
		}, {
			className : 'Status',
			key : '_graphics',
			value : [
				['human1','0','0','160','160'],
				[['default','0','0'],['area0','4','5'],['area1','8','8']]
			]
		}, {
            className : 'Command',
            key : 'onClick',
            children : [{
                className : 'Status',
                key : 'thumbnail',
                value : './sample/images/command_01.gif'
            }, {
                className : 'ActionJSlgMenu',
                parameters : ['$THIS.parent()']
            }]
        }]
	},{
		className : 'CastFrame',
		key : 'cstf2',
		children : [{
			className : 'Status',
			key : 'thumbnail',
			value : './sample/images/monster_thumb.gif'
		}, {
			className : 'Status',
			key : 'belongs',
			value : 'enemy'
		}, {
			className : 'Status',
			key : 'life',
			value : '10'
		}, {
			className : 'Status',
			key : '_graphics',
			value : [
				['monster1','0','0','160','160'],
				[['default','0','0'],['area0','4','5'],['area1','8','8']]
			]
		}]
	},{
		className : 'ItemFrame',
		key : 'itmf1',
		children : [{
			className : 'Status',
			key : 'thumbnail',
			value : './sample/images/item_01.gif'
		}, {
			className : 'Status',
			key : 'name',
			value : 'アイテム1'
		}, {
            className : 'Command',
            key : 'onClick',
            children : [{
                className : 'Status',
                key : 'thumbnail',
                value : './sample/images/command_01.gif'
            }, {
                className : 'ActionJSlgMenu',
                parameters : null
            }, {
                className : 'ActionLog',
                parameters : ['"use item1"']
            }, {
                className : 'ActionRequireArea',
                parameters : ['$THIS',['0','0','0'],[['1','4','2',[['0','3','0']],'0',['90','0']]]]
            }, {
                className : 'ActionPending',
                parameters : []
            }]
        }]
	},{
		className : 'Stage',
		key : 'stg1',
		'location' : {
			'x' : 0,
			'y' : 0,
			'z' : 0
		},
		'size' : {
			'width' : 10,
			'height' : 10,
			'depth' : 10
		},
		children : [{
			className : 'Status',
			key : 'thumbnail',
			value : './sample/images/stage_01.gif'
		}]
	}]
};

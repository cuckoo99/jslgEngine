(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};

o.sampleJson = {
	'type' : 'Element',
	'className' : 'LocalRegion',
	'key' : 'r1',
	'permission' : 'location',
	'location' : {
		'x' : '0',
		'y' : '0',
		'z' : '0'
	},
	'children' : [
	{
		'type' : 'Element',
		'className' : 'Icon',
		'permission' : 'location',
		'key' : 'ic1'
	},
	{
		'type' : 'Frame',
		'className' : 'StageFrame',
		'key' : 'rs1'
	},
	{
		'type' : 'Frame',
		'className' : 'GroundFrame',
		'permission' : 'location',
		'key' : 'rg1'
	},
	{
		'type' : 'Frame',
		'className' : 'CastFrame',
		'permission' : 'location',
		'key' : 'rc1'
	},
	{
		'type' : 'Frame',
		'className' : 'ItemFrame',
		'permission' : 'location',
		'key' : 'ri1'
	},
	{
		'type' : 'Element',
		'className' : 'Stage',
		'key' : 's1',
		'permission' : 'location',
		'location' : {
			'x' : '0',
			'y' : '0',
			'z' : '0'
		},
		'source' : 'r1-rs1',
		'children' : [
		{
			'type' : 'Element',
			'className' : 'Ground',
			'key' : 'g1',
			'permission' : 'location',
			'location' : {
				'x' : '0',
				'y' : '0',
				'z' : '0'
			},
			'source' : 'r1-rg1',
			'children' : [
			{
				'type' : 'Element',
				'className' : 'Cast',
				'key' : 'c1',
				'source' : 'r1-rc1',
				'children' : [
				{
					'type' : 'Element',
					'className' : 'Item',
					'key' : 'i1',
					'source' : 'r1-ri1',
					'children' : [
					{
						'type' : 'Element',
						'className' : 'Status',
						'key' : 'command',
						'value' : ''
					}
					]
				}
				]
			}
			]
		}
		]
	}
	]
};

})();
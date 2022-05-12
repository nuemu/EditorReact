import { v4 } from "uuid"

const Data = [
	{
		type: 'Text',
		name: 'Text',
		description: '',
		icon: require('../Assets/Text.svg').default,
		initial: {'text': ''}
	},
	{
		type: 'DB',
		name: 'DataBase',
		description: '',
		icon: require('../Assets/DB.svg').default,
		initial: {'text': ''}
	},
	{
		type : 'Page',
		name : 'New Page',
		description: '',
		icon: require('../Assets/Page.svg').default,
		initial: {'id': v4()}
	}
]

export default Data
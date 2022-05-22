import { v4 } from "uuid"

const Data = [
	{
		type: 'Text',
		name: 'Text',
		description: '',
		icon: require('../Assets/Text.svg').default,
		initial: () => {return {text: ''}}
	},
	{
		type: 'VText',
		name: 'VText',
		description: '',
		icon: require('../Assets/VText.svg').default,
		initial: () => {return {text: ''}}
	},
	{
		type: 'DB',
		name: 'DataBase',
		description: '',
		icon: require('../Assets/DB.svg').default,
		initial: () => {return {id: v4()}}
	},
	{
		type : 'Page',
		name : 'New Page',
		description: '',
		icon: require('../Assets/Page.svg').default,
		initial: () => {return {id: v4()}}
	}
]

export default Data
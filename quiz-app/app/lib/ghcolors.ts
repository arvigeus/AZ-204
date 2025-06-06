// TODO: cannot import react-syntax-highlighter/dist/esm/styles/prism/ghcolors
const ghcolors: { [key: string]: React.CSSProperties } = {
	'code[class*="language-"]': {
		color: '#393A34',
		fontFamily: 'monospace',
		direction: 'ltr',
		textAlign: 'left',
		whiteSpace: 'pre',
		wordSpacing: 'normal',
		wordBreak: 'normal',
		fontSize: '.9em',
		lineHeight: '1em',
		MozTabSize: '4',
		OTabSize: '4',
		tabSize: '4',
		WebkitHyphens: 'none',
		MozHyphens: 'none',
		msHyphens: 'none',
		hyphens: 'none',
	},
	'pre[class*="language-"]': {
		color: '#393A34',
		fontFamily: 'monospace',
		direction: 'ltr',
		textAlign: 'left',
		whiteSpace: 'pre',
		wordSpacing: 'normal',
		wordBreak: 'normal',
		fontSize: '.9em',
		lineHeight: '1em',
		MozTabSize: '4',
		OTabSize: '4',
		tabSize: '4',
		WebkitHyphens: 'none',
		MozHyphens: 'none',
		msHyphens: 'none',
		hyphens: 'none',
		padding: '1em',
		margin: '.5em 0',
		overflow: 'auto',
		border: '1px solid #dddddd',
		backgroundColor: 'white',
	},
	'pre > code[class*="language-"]': {
		fontSize: '1em',
	},
	'pre[class*="language-"]::-moz-selection': {
		background: '#b3d4fc',
	},
	'pre[class*="language-"] ::-moz-selection': {
		background: '#b3d4fc',
	},
	'code[class*="language-"]::-moz-selection': {
		background: '#b3d4fc',
	},
	'code[class*="language-"] ::-moz-selection': {
		background: '#b3d4fc',
	},
	'pre[class*="language-"]::selection': {
		background: '#b3d4fc',
	},
	'pre[class*="language-"] ::selection': {
		background: '#b3d4fc',
	},
	'code[class*="language-"]::selection': {
		background: '#b3d4fc',
	},
	'code[class*="language-"] ::selection': {
		background: '#b3d4fc',
	},
	':not(pre) > code[class*="language-"]': {
		padding: '.2em',
		paddingTop: '1px',
		paddingBottom: '1px',
		background: '#f8f8f8',
		border: '1px solid #dddddd',
	},
	comment: {
		color: '#6a737d',
	},
	prolog: {
		color: '#999988',
		fontStyle: 'italic',
	},
	doctype: {
		color: '#999988',
		fontStyle: 'italic',
	},
	cdata: {
		color: '#999988',
		fontStyle: 'italic',
	},
	namespace: {
		opacity: '.7',
	},
	string: {
		color: '#032f62',
	},
	'attr-value': {
		color: '#e3116c',
	},
	punctuation: {
		color: '#393A34',
	},
	operator: {
		color: '#393A34',
	},
	entity: {
		color: '#36acaa',
	},
	url: {
		color: '#36acaa',
	},
	symbol: {
		color: '#36acaa',
	},
	number: {
		color: '#36acaa',
	},
	boolean: {
		color: '#36acaa',
	},
	variable: {
		color: '#36acaa',
	},
	constant: {
		color: '#36acaa',
	},
	property: {
		color: '#36acaa',
	},
	regex: {
		color: '#36acaa',
	},
	inserted: {
		color: '#36acaa',
	},
	atrule: {
		color: '#d73a49',
	},
	keyword: {
		color: '#d73a49',
	},
	'class-name': {
		color: '#d73a49',
	},
	'attr-name': {
		color: '#d73a49',
	},
	'.language-autohotkey .token.selector': {
		color: '#d73a49',
	},
	function: {
		color: '#d73a49',
	},
	deleted: {
		color: '#9a050f',
	},
	'.language-autohotkey .token.tag': {
		color: '#9a050f',
	},
	tag: {
		color: '#00009f',
	},
	selector: {
		color: '#00009f',
	},
	'.language-autohotkey .token.keyword': {
		color: '#00009f',
	},
	important: {
		fontWeight: 'bold',
	},
	bold: {
		fontWeight: 'bold',
	},
	italic: {
		fontStyle: 'italic',
	},
};

export default ghcolors;

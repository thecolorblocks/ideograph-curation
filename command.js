// Function to check if a flag exists
function hasFlag(args, flag) {
	return args.includes(flag)
}

// Function to get parameter of a flag
function getParam(args, flag, required=false) {
	if ( !hasFlag(args, flag) ) {
		if (required) {
			throw Error(`${flag} parameter is required.`)
		}
		return null
	} else {
		return args[args.indexOf(flag)+1]
	}
}

export {
	hasFlag,
	getParam
}
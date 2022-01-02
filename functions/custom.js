async function getUsers(url) {
	try {
		let res = await axios(url);
		return res;
	} catch(err => {
		throw err;
	})
}
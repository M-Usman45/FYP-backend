
const mongoose = require("mongoose")

const config = {
	autoIndex: false,
	useNewUrlParser: true,
};
const uri = 'mongodb://localhost/project'
const connectDB = async () => {
	try {

		await mongoose.connect(uri, config)
			.then(() => {
				console.log('Connected to MongoDB...')
			})
			.catch(err => console.error('Could not connect to MongoDB...', err));
	} catch (err) {
		console.error(err.message);
		process.exit(1);
	}
};

module.exports = connectDB;

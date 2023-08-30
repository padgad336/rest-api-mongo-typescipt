import config from 'config'
import mongoose from 'mongoose'
import Promise from 'bluebird'

const { uri, mongooseOptions }: { uri: any; mongooseOptions: any } =
	config.get('db.mongodb')
// console.log('moo', mongooseOptions);

const options = {
	...mongooseOptions,
	promiseLibrary: Promise,
}
mongoose.Promise = Promise
console.log('env', config.get('env'));
if (config.get('env') === 'production') {
	mongoose.connect(uri, options)
} else {

	mongoose.connect(`${uri}`)
}

